import { ref, shallowRef, readonly, computed } from 'vue'
import { useWorkerPool } from './useWorkerPool'
import type {
  UploadPhase,
  FileEntry,
  PreviewImage,
  FileInputItem,
  UploadFn,
  UploadManagerOptions,
} from '@/types'

export function useUploadManager(uploadFn: UploadFn, options: UploadManagerOptions = {}) {
  const { uploadConcurrency = 5, maxRetries = 2 } = options

  const workerPool = useWorkerPool()

  const phase = ref<UploadPhase>('idle')
  const files = shallowRef<FileEntry[]>([])
  const previewImages = shallowRef<PreviewImage[]>([])
  const totalFiles = ref(0)
  const compressedCount = ref(0)
  const uploadedCount = ref(0)
  const failedCount = ref(0)

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

  const fileProgress = ref<Record<number, number>>({})

  let cancelled = false
  const previewUrls = new Set<string>()
  const abortControllers = new Map<number, AbortController>()

  async function processFiles(fileList: (File | FileInputItem)[]): Promise<void> {
    if (!fileList.length) return

    cancelled = false
    phase.value = 'compressing'

    const newEntries: FileEntry[] = fileList.map((item) => {
      const isWrapped = typeof item === 'object' && 'file' in item && item.file instanceof File
      const rawFile = isWrapped ? (item as FileInputItem).file : (item as File)
      const fileKey = isWrapped
        ? (item as FileInputItem).fileKey
        : `${rawFile.name}_${rawFile.size}_${rawFile.lastModified}`

      return {
        id: nextId++,
        name: rawFile.name,
        original: rawFile,
        fileKey,
        compressed: null,
        status: 'compressing' as const,
        retries: 0,
      }
    })

    const allFiles = [...files.value, ...newEntries]
    files.value = allFiles
    totalFiles.value = allFiles.length

    compressedCount.value = allFiles.filter(f => f.status === 'ready').length

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

    const newReady = newEntries.filter(e => e.status === 'ready')
    const newPreviews: PreviewImage[] = newReady.map(entry => {
      const url = URL.createObjectURL(entry.compressed!)
      previewUrls.add(url)
      return {
        id: entry.id,
        url,
        thumbUrl: url,
        filename: entry.name,
        fileKey: entry.fileKey,
      }
    })

    previewImages.value = [...previewImages.value, ...newPreviews]
    phase.value = 'ready'
    files.value = [...files.value]
  }

  async function uploadEntry(entry: FileEntry): Promise<void> {
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
        await uploadFn(entry.compressed!, entry.name, { fileKey: entry.fileKey }, {
          signal: controller.signal,
          onProgress: (pct: number) => {
            fileProgress.value = { ...fileProgress.value, [entry.id]: pct }
          },
        })
        entry.status = 'done'
        entry.retries = attempt
        fileProgress.value = { ...fileProgress.value, [entry.id]: 100 }
        uploadedCount.value++
        break
      } catch (err: unknown) {
        const cancelled_ = (err as { cancelled?: boolean })?.cancelled || controller.signal.aborted
        if (cancelled_) {
          entry.status = 'cancelled'
          break
        }
        if (attempt === maxRetries) {
          entry.status = 'failed'
          entry.retries = attempt
          failedCount.value++
        } else {
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
        }
      }
    }

    abortControllers.delete(entry.id)

    if (uploadedCount.value % 5 === 0) {
      files.value = [...files.value]
    }
  }

  async function startUpload(): Promise<void> {
    if (phase.value !== 'ready') return

    cancelled = false
    phase.value = 'uploading'
    uploadedCount.value = 0
    failedCount.value = 0

    const readyEntries = files.value.filter(f => f.status === 'ready')
    let cursor = 0

    async function uploadNext(): Promise<void> {
      while (cursor < readyEntries.length) {
        if (cancelled) return
        const idx = cursor++
        await uploadEntry(readyEntries[idx])
      }
    }

    const workers = Array.from(
      { length: Math.min(uploadConcurrency, readyEntries.length) },
      () => uploadNext()
    )
    await Promise.all(workers)

    if (cancelled) return

    for (const url of previewUrls) {
      URL.revokeObjectURL(url)
    }
    previewUrls.clear()
    previewImages.value = []

    phase.value = 'done'
    files.value = [...files.value]
  }

  async function retryFailed(): Promise<void> {
    const failedEntries = files.value.filter(f => f.status === 'failed')
    if (!failedEntries.length) return

    cancelled = false
    phase.value = 'uploading'
    failedCount.value = 0

    let cursor = 0

    async function retryNext(): Promise<void> {
      while (cursor < failedEntries.length) {
        if (cancelled) return
        const idx = cursor++
        failedEntries[idx].retries = 0
        await uploadEntry(failedEntries[idx])
      }
    }

    const workers = Array.from(
      { length: Math.min(uploadConcurrency, failedEntries.length) },
      () => retryNext()
    )
    await Promise.all(workers)

    if (cancelled) return

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

  function removePreview(id: number): void {
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

  function removeMultiplePreviews(ids: number[]): void {
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

  function cancelFile(id: number): void {
    const controller = abortControllers.get(id)
    if (controller) controller.abort()
  }

  function cancel(): void {
    cancelled = true
    for (const [, controller] of abortControllers) {
      controller.abort()
    }
    abortControllers.clear()
    phase.value = 'idle'
  }

  function reset(): void {
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
    reset,
  }
}
