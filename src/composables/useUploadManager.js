import { ref, shallowRef, readonly, computed } from 'vue'
import { useWorkerPool } from './useWorkerPool'

/**
 * Upload Manager — orchestrates compression + upload pipeline.
 *
 * Supports adding files in multiple batches before uploading.
 * Each call to processFiles() APPENDS to existing previews (does not wipe).
 *
 * Optimizations over original:
 * - AbortController per file (cancel individual / all)
 * - Per-file progress tracking via XHR
 * - Manual retry for failed files
 * - Configurable concurrency (default 5)
 * - Batch upload via cursor + Promise.all workers
 *
 * @param {Function} uploadFn - async (blob, filename, fileMeta, { signal, onProgress }) => void
 * @param {Object} options
 */
export function useUploadManager(uploadFn, options = {}) {
  const { uploadConcurrency = 5, maxRetries = 2 } = options

  const workerPool = useWorkerPool()

  // ── State ──────────────────────────────────────────
  const phase = ref('idle') // idle | compressing | ready | uploading | done
  const files = shallowRef([]) // all internal file entries (accumulated)
  const previewImages = shallowRef([]) // all gallery-ready previews (accumulated)
  const totalFiles = ref(0)
  const compressedCount = ref(0)
  const uploadedCount = ref(0)
  const failedCount = ref(0)

  // Global ID counter — never resets except on full reset()
  let nextId = 0

  const compressionProgress = computed(() =>
    totalFiles.value === 0 ? 0 : Math.round((compressedCount.value / totalFiles.value) * 100)
  )

  const uploadProgress = computed(() => {
    const readyCount = files.value.filter(f =>
      f.status === 'ready' || f.status === 'uploading' || f.status === 'done'
    ).length
    return readyCount === 0 ? 0 : Math.round((uploadedCount.value / readyCount) * 100)
  })

  // Per-file progress: Map<id, 0-100>
  const fileProgress = ref({})

  let cancelled = false
  const previewUrls = new Set()

  // AbortControllers for in-flight uploads: Map<id, AbortController>
  const abortControllers = new Map()

  // ── Compression (ACCUMULATES across batches) ───────
  async function processFiles(fileList) {
    if (!fileList.length) return

    cancelled = false
    phase.value = 'compressing'

    // Normalize input: accept raw Files or { file, fileKey } wrappers
    const newEntries = fileList.map((item) => {
      const isWrapped = item.file instanceof File
      const rawFile = isWrapped ? item.file : item
      const fileKey = isWrapped ? item.fileKey : `${rawFile.name}_${rawFile.size}_${rawFile.lastModified}`

      return {
        id: nextId++, // globally unique, never collides
        name: rawFile.name,
        original: rawFile,
        fileKey,
        compressed: null,
        status: 'compressing',
        retries: 0
      }
    })

    // APPEND to existing entries (keep previous batches)
    const allFiles = [...files.value, ...newEntries]
    files.value = allFiles
    totalFiles.value = allFiles.length

    // Reset batch-level progress (tracks this compression round)
    compressedCount.value = allFiles.filter(f => f.status === 'ready').length

    // Dispatch ONLY the new entries to the worker pool
    const promises = newEntries.map((entry) =>
      workerPool.runTask(entry.original, entry.id)
        .then(result => {
          if (cancelled) return
          entry.status = 'ready'
          entry.compressed = result.blob
          compressedCount.value++
          if (compressedCount.value % 10 === 0 || compressedCount.value === totalFiles.value) {
            files.value = [...files.value]
          }
        })
        .catch(() => {
          if (cancelled) return
          entry.status = 'failed'
          failedCount.value++
          compressedCount.value++
          if (compressedCount.value % 10 === 0 || compressedCount.value === totalFiles.value) {
            files.value = [...files.value]
          }
        })
    )

    await Promise.all(promises)

    if (cancelled) return

    // Build preview images for the NEW entries only, then append
    const newReady = newEntries.filter(e => e.status === 'ready')
    const newPreviews = newReady.map(entry => {
      const url = URL.createObjectURL(entry.compressed)
      previewUrls.add(url)
      return {
        id: entry.id,
        url,
        thumbUrl: url,
        filename: entry.name,
        fileKey: entry.fileKey
      }
    })

    // APPEND — keep existing previews from previous batches
    previewImages.value = [...previewImages.value, ...newPreviews]
    phase.value = 'ready'
    files.value = [...files.value]
  }

  // ── Upload single entry (used by both startUpload and retryFailed) ─────
  async function uploadEntry(entry) {
    entry.status = 'uploading'
    fileProgress.value = { ...fileProgress.value, [entry.id]: 0 }

    const controller = new AbortController()
    abortControllers.set(entry.id, controller)

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (cancelled || controller.signal.aborted) {
        entry.status = 'cancelled'
        break
      }

      try {
        await uploadFn(entry.compressed, entry.name, { fileKey: entry.fileKey }, {
          signal: controller.signal,
          onProgress: (pct) => {
            fileProgress.value = { ...fileProgress.value, [entry.id]: pct }
          }
        })
        entry.status = 'done'
        entry.retries = attempt
        fileProgress.value = { ...fileProgress.value, [entry.id]: 100 }
        uploadedCount.value++
        break
      } catch (err) {
        // Don't retry if intentionally cancelled
        if (err?.cancelled || controller.signal.aborted) {
          entry.status = 'cancelled'
          break
        }
        if (attempt === maxRetries) {
          entry.status = 'failed'
          entry.retries = attempt
          failedCount.value++
        } else {
          // Exponential backoff before retry
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
        }
      }
    }

    abortControllers.delete(entry.id)

    if (uploadedCount.value % 5 === 0) {
      files.value = [...files.value]
    }
  }

  // ── Upload with concurrency control ────────────────
  async function startUpload() {
    if (phase.value !== 'ready') return

    cancelled = false
    phase.value = 'uploading'
    uploadedCount.value = 0
    failedCount.value = 0

    const readyEntries = files.value.filter(f => f.status === 'ready')
    let cursor = 0

    async function uploadNext() {
      while (cursor < readyEntries.length) {
        if (cancelled) return
        const idx = cursor++
        const entry = readyEntries[idx]
        await uploadEntry(entry)
      }
    }

    const workers = Array.from(
      { length: Math.min(uploadConcurrency, readyEntries.length) },
      () => uploadNext()
    )
    await Promise.all(workers)

    if (cancelled) return

    // Revoke preview URLs — uploaded images now live in parent's uploadedImages
    for (const url of previewUrls) {
      URL.revokeObjectURL(url)
    }
    previewUrls.clear()
    previewImages.value = []

    phase.value = 'done'
    files.value = [...files.value]
  }

  // ── Retry all failed uploads ──────────────────────
  async function retryFailed() {
    const failedEntries = files.value.filter(f => f.status === 'failed')
    if (!failedEntries.length) return

    cancelled = false
    phase.value = 'uploading'
    failedCount.value = 0

    let cursor = 0

    async function retryNext() {
      while (cursor < failedEntries.length) {
        if (cancelled) return
        const idx = cursor++
        const entry = failedEntries[idx]
        entry.retries = 0
        await uploadEntry(entry)
      }
    }

    const workers = Array.from(
      { length: Math.min(uploadConcurrency, failedEntries.length) },
      () => retryNext()
    )
    await Promise.all(workers)

    if (cancelled) return

    // If all now done, clean up previews
    const stillFailed = files.value.some(f => f.status === 'failed')
    if (!stillFailed) {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url)
      }
      previewUrls.clear()
      previewImages.value = []
      phase.value = 'done'
    }

    files.value = [...files.value]
  }

  // ── Remove previews (before upload) ────────────────
  function removePreview(id) {
    const target = previewImages.value.find(p => p.id === id)
    if (target) {
      if (target.url && previewUrls.has(target.url)) {
        URL.revokeObjectURL(target.url)
        previewUrls.delete(target.url)
      }
      previewImages.value = previewImages.value.filter(p => p.id !== id)
    }

    files.value = files.value.filter(f => f.id !== id)
    totalFiles.value = files.value.length
  }

  function removeMultiplePreviews(ids) {
    const idSet = new Set(ids)

    previewImages.value.forEach(p => {
      if (idSet.has(p.id) && p.url && previewUrls.has(p.url)) {
        URL.revokeObjectURL(p.url)
        previewUrls.delete(p.url)
      }
    })

    previewImages.value = previewImages.value.filter(p => !idSet.has(p.id))
    files.value = files.value.filter(f => !idSet.has(f.id))
    totalFiles.value = files.value.length
  }

  // ── Cancel individual upload ──────────────────────
  function cancelFile(id) {
    const controller = abortControllers.get(id)
    if (controller) controller.abort()
  }

  // ── Cancel all uploads ────────────────────────────
  function cancel() {
    cancelled = true
    // Abort all in-flight uploads
    for (const [, controller] of abortControllers) {
      controller.abort()
    }
    abortControllers.clear()
    phase.value = 'idle'
  }

  function reset() {
    cancel()
    phase.value = 'idle'
    files.value = []
    totalFiles.value = 0
    compressedCount.value = 0
    uploadedCount.value = 0
    failedCount.value = 0
    fileProgress.value = {}
    nextId = 0
    for (const url of previewUrls) {
      URL.revokeObjectURL(url)
    }
    previewUrls.clear()
    previewImages.value = []
  }

  return {
    phase: readonly(phase),
    files: readonly(files),
    previewImages: readonly(previewImages),
    totalFiles: readonly(totalFiles),
    compressedCount: readonly(compressedCount),
    uploadedCount: readonly(uploadedCount),
    failedCount: readonly(failedCount),
    fileProgress: readonly(fileProgress),
    compressionProgress,
    uploadProgress,
    processFiles,
    startUpload,
    retryFailed,
    removePreview,
    removeMultiplePreviews,
    cancelFile,
    cancel,
    reset
  }
}
