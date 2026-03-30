<template>
  <div class="pa-4">

    <!-- Upload Zone (hide during compression only) -->
    <UploadZone v-if="canAcceptFiles" @files="handleFiles" />

    <!-- Compression / Upload Progress -->
    <UploadProgress
      :manager="uploadManager"
      @reset="handleReset"
    />

    <!-- Gallery: show uploaded + compressed previews -->
    <ImageGrid
      :images="galleryImages"
      :upload-phase="currentPhase"
      @preview="openPreview"
      @delete="deleteSingle"
      @bulk-delete="deleteMultiple"
      @start-upload="uploadManager.startUpload()"
      @share="shareOpen = true"
    />

    <!-- Preview Modal -->
    <PreviewModal
      v-model="previewOpen"
      v-model:current="previewImage"
      :images="galleryImages"
      @delete="handleDeleteFromPreview"
    />

    <!-- Share Dialog -->
    <ShareDialog
      v-model="shareOpen"
      :share-id="projectShareId"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500" location="bottom end">
      {{ snackbar.text }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, toValue, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import UploadZone from '@/components/upload/UploadZone.vue'
import UploadProgress from '@/components/upload/UploadProgress.vue'
import ImageGrid from '@/components/gallery/ImageGrid.vue'
import PreviewModal from '@/components/gallery/PreviewModal.vue'
import ShareDialog from '@/components/gallery/ShareDialog.vue'

import { useUploadManager } from '@/composables/useUploadManager'
import { usePhotoStore } from '@/stores/photo.store'
import { useProjectStore } from '@/stores/projects'

const route = useRoute()
const projectId = route?.params?.id ?? 'demo'
const photoStore = usePhotoStore()
const projectStore = useProjectStore()

// Project's shareId for the client gallery link
const projectShareId = ref('')

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
const uploadedImages = ref([])
const objectUrls = new Set()

// Duplicate tracker (fileKey → true)
const fileHashSet = new Set()

// ─────────────────────────────────────────
// Load existing photos from API on mount
// ─────────────────────────────────────────
onMounted(async () => {
  try {
    // Fetch project detail (for shareId) and photos in parallel
    const [project] = await Promise.all([
      projectStore.fetchProject(projectId).catch(() => null),
      photoStore.fetchPhotos(projectId)
    ])

    // Store the shareId for the share link
    if (project?.shareId) {
      projectShareId.value = project.shareId
    }

    // Pinia auto-unwraps computeds — getPhotos is already the function, no .value
    const existing = photoStore.getPhotos(projectId)
    uploadedImages.value = existing.map(photo => normalizePhoto(photo))
    // Mark existing photos in duplicate tracker
    uploadedImages.value.forEach(img => fileHashSet.add(img.fileKey))
  } catch {
    // First load may fail if no photos yet — that's fine
  }
})

/**
 * Normalize a server photo response into the shape our gallery expects.
 * Handles both mock fields (thumbUrl, originalFileName) and potential
 * real API fields (thumbnailUrl, originalName).
 */
function normalizePhoto(photo) {
  return {
    id: photo.id,
    url: photo.url,
    thumbUrl: photo.thumbUrl || photo.thumbnailUrl || photo.url,
    filename: photo.originalFileName || photo.originalName || photo.filename || 'Photo',
    fileKey: photo.fileKey || `server_${photo.id}`,
    serverId: photo.id
  }
}

// ─────────────────────────────────────────
// Upload Manager — real API via photoStore
// ─────────────────────────────────────────
const uploadManager = useUploadManager(async (blob, filename, fileMeta) => {
  // Convert blob to File (photoService.uploadPhoto expects a File for FormData)
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })

  // Upload via photo store → hits real API (or mock based on VITE_USE_MOCK)
  const serverPhoto = await photoStore.uploadPhoto(projectId, file)

  // Normalize and add to gallery with fileKey for duplicate tracking
  const normalized = normalizePhoto(serverPhoto)
  normalized.fileKey = fileMeta.fileKey
  uploadedImages.value = [...uploadedImages.value, normalized]
}, { uploadConcurrency: 3, maxRetries: 2 })

// ─────────────────────────────────────────
// Phase
// ─────────────────────────────────────────
const currentPhase = computed(() => toValue(uploadManager.phase))

// ─────────────────────────────────────────
// Gallery: merge uploaded images + compressed previews
// ─────────────────────────────────────────
const galleryImages = computed(() => {
  const previews = toValue(uploadManager.previewImages) || []

  return [
    ...uploadedImages.value,
    ...previews.map(p => ({
      ...p,
      isPreview: true
    }))
  ]
})

// ─────────────────────────────────────────
// Allow adding anytime except during compression
// ─────────────────────────────────────────
const canAcceptFiles = computed(() => {
  return currentPhase.value !== 'compressing'
})

// ─────────────────────────────────────────
// File Key Generator
// ─────────────────────────────────────────
function getFileKey(file) {
  return `${file.name}_${file.size}_${file.lastModified}`
}

// ─────────────────────────────────────────
// HANDLE FILES — duplicate check then compress
// ─────────────────────────────────────────
function handleFiles(files) {
  const validFiles = []
  const skipped = []

  files.forEach(file => {
    const key = getFileKey(file)

    if (fileHashSet.has(key)) {
      skipped.push(file.name)
      return
    }

    fileHashSet.add(key)
    validFiles.push({ file, fileKey: key })
  })

  // Show ONE snackbar summarizing all skipped files
  if (skipped.length && !validFiles.length) {
    showSnackbar(`${skipped.length} duplicate${skipped.length > 1 ? 's' : ''} skipped`, 'warning')
    return
  }
  if (skipped.length) {
    showSnackbar(`${skipped.length} duplicate${skipped.length > 1 ? 's' : ''} skipped, ${validFiles.length} new file${validFiles.length > 1 ? 's' : ''} added`, 'info')
  }

  if (!validFiles.length) return

  uploadManager.processFiles(validFiles)
}

// ─────────────────────────────────────────
// RESET
// ─────────────────────────────────────────
function handleReset() {
  uploadManager.reset()
  fileHashSet.clear()
}

// ─────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────
function revokeUrl(url) {
  if (objectUrls.has(url)) {
    URL.revokeObjectURL(url)
    objectUrls.delete(url)
  }
}

async function deleteSingle(id) {
  // 1. Try uploaded images (server-synced)
  const uploadedIndex = uploadedImages.value.findIndex(i => i.id === id)

  if (uploadedIndex !== -1) {
    const img = uploadedImages.value[uploadedIndex]

    // Optimistic UI update — remove immediately
    revokeUrl(img.url)
    fileHashSet.delete(img.fileKey)
    uploadedImages.value = uploadedImages.value.filter(i => i.id !== id)
    showSnackbar('Image deleted')

    // Delete from server (if it has a serverId, it exists on the backend)
    if (img.serverId) {
      try {
        await photoStore.deletePhoto(img.serverId, projectId)
      } catch {
        showSnackbar('Failed to delete from server', 'error')
      }
    }
    return
  }

  // 2. Try preview images (queued but not yet uploaded — local only)
  const previews = toValue(uploadManager.previewImages) || []
  const preview = previews.find(p => p.id === id)
  if (preview) {
    fileHashSet.delete(preview.fileKey)
  }
  uploadManager.removePreview(id)
  showSnackbar('Removed from queue')
}

async function deleteMultiple(ids) {
  const idSet = new Set(ids)

  // Separate uploaded (server) vs preview (local) items
  const serverIds = []
  uploadedImages.value = uploadedImages.value.filter(img => {
    if (idSet.has(img.id)) {
      revokeUrl(img.url)
      fileHashSet.delete(img.fileKey)
      if (img.serverId) serverIds.push(img.serverId)
      return false
    }
    return true
  })

  // Remove preview images (local only)
  const previews = toValue(uploadManager.previewImages) || []
  const previewIdsToRemove = []
  previews.forEach(p => {
    if (idSet.has(p.id)) {
      fileHashSet.delete(p.fileKey)
      previewIdsToRemove.push(p.id)
    }
  })
  if (previewIdsToRemove.length) {
    uploadManager.removeMultiplePreviews(previewIdsToRemove)
  }

  showSnackbar(`${ids.length} item${ids.length !== 1 ? 's' : ''} deleted`)

  // Bulk delete from server
  if (serverIds.length) {
    try {
      await photoStore.bulkDeletePhotos(serverIds, projectId)
    } catch {
      showSnackbar('Failed to delete some items from server', 'error')
    }
  }
}

function handleDeleteFromPreview(id) {
  deleteSingle(id)

  if (!galleryImages.value.length) {
    previewOpen.value = false
    previewImage.value = null
  }
}

// ─────────────────────────────────────────
// PREVIEW
// ─────────────────────────────────────────
const previewOpen = ref(false)
const previewImage = ref(null)

function openPreview(img) {
  previewImage.value = img
  previewOpen.value = true
}

// ─────────────────────────────────────────
// SHARE
// ─────────────────────────────────────────
const shareOpen = ref(false)

// ─────────────────────────────────────────
// SNACKBAR
// ─────────────────────────────────────────
const snackbar = reactive({ show: false, text: '', color: 'success' })

function showSnackbar(text, color = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

// ─────────────────────────────────────────
// DONE STATE
// ─────────────────────────────────────────
watch(currentPhase, (phase) => {
  if (phase === 'done') {
    showSnackbar('Upload complete!')
  }
})
</script>
