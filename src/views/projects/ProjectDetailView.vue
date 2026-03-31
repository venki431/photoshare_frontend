<template>
  <div class="project-detail ps-animate-in">
    <!-- Project Header -->
    <div class="project-header" v-if="projectStore.currentProject">
      <button class="back-btn" @click="$router.push('/projects')">
        <v-icon size="18">mdi-arrow-left</v-icon>
        <span>Projects</span>
      </button>
      <div class="project-header__info">
        <h1 class="project-title">{{ projectStore.currentProject.name }}</h1>
        <div class="project-meta-row">
          <StatusBadge :status="projectStore.currentProject.status" />
          <span class="meta-divider" />
          <span class="meta-text">
            <v-icon size="14">mdi-image-multiple-outline</v-icon>
            {{ galleryImages.length }} photos
          </span>
          <span v-if="projectStore.currentProject.eventType" class="meta-text">
            <v-icon size="14">mdi-tag-outline</v-icon>
            {{ projectStore.currentProject.eventType }}
          </span>
        </div>
      </div>
    </div>

    <!-- Upload Zone (hide during compression only) -->
    <UploadZone v-if="canAcceptFiles  && projectStore?.currentProject?.status !== 'completed'" @files="handleFiles" />

    <!-- Compression / Upload Progress -->
    <UploadProgress
      :manager="uploadManager"
      @reset="handleReset"
      @cancel="uploadManager.cancel()"
      @retry="uploadManager.retryFailed()"
    />

    <!-- Gallery: show uploaded + compressed previews -->
    <ImageGrid
      :images="galleryImages"
      :upload-phase="currentPhase"
      :projectCompleted="projectStore.currentProject?.status === 'completed' ? false : true"
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
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500" location="bottom end" rounded="lg">
      <div class="d-flex align-center ga-2">
        <v-icon size="18">{{ snackbar.color === 'success' ? 'mdi-check-circle' : snackbar.color === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}</v-icon>
        {{ snackbar.text }}
      </div>
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
import StatusBadge from '@/components/ui/StatusBadge.vue'

import { useUploadManager } from '@/composables/useUploadManager'
import { usePhotoStore } from '@/stores/photo.store'
import { useProjectStore } from '@/stores/projects'
import { photoService } from '@/api/services/photo.service'

const route = useRoute()
const projectId = route?.params?.id ?? 'demo'
const photoStore = usePhotoStore()
const projectStore = useProjectStore()

const projectShareId = ref('')
const uploadedImages = ref([])
const objectUrls = new Set()
const fileHashSet = new Set()

onMounted(async () => {
  try {
    const project = await projectStore.fetchProject(projectId).catch(() => null)
    if (project?.shareId) projectShareId.value = project.shareId
    const existing = project?.images || []
    uploadedImages.value = existing.map(photo => normalizePhoto(photo))
    uploadedImages.value.forEach(img => fileHashSet.add(img.fileKey))
  } catch { /* First load may fail */ }
})

function normalizePhoto(photo) {
  return {
    id: photo.id,
    url: photo.url,
    thumbUrl: photo.thumbUrl || photo.thumbnailUrl || photo.url,
    filename: photo.originalFileName || photo.originalName || photo.filename || 'Photo',
    fileKey: photo.fileKey || `server_${photo.id}`,
    serverId: photo.id,
    selectedByClient: photo.selected || photo.selectedByClient || false
  }
}

const uploadManager = useUploadManager(async (blob, filename, fileMeta, { signal, onProgress } = {}) => {
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
  const res = await photoService.uploadPhoto(projectId, file, {
    originalName: filename,
    originalSize: blob.size,
  }, { signal, onProgress })
  const normalized = normalizePhoto(res.data)
  normalized.fileKey = fileMeta.fileKey
  uploadedImages.value = [...uploadedImages.value, normalized]
}, { uploadConcurrency: 5, maxRetries: 2 })

const currentPhase = computed(() => toValue(uploadManager.phase))

const galleryImages = computed(() => {
  const previews = toValue(uploadManager.previewImages) || []
  return [
    ...uploadedImages.value,
    ...previews.map(p => ({ ...p, isPreview: true }))
  ]
})

const canAcceptFiles = computed(() => currentPhase.value !== 'compressing')

function getFileKey(file) {
  return `${file.name}_${file.size}_${file.lastModified}`
}

function handleFiles(files) {
  const validFiles = []
  const skipped = []
  files.forEach(file => {
    const key = getFileKey(file)
    if (fileHashSet.has(key)) { skipped.push(file.name); return }
    fileHashSet.add(key)
    validFiles.push({ file, fileKey: key })
  })
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

function handleReset() {
  uploadManager.reset()
  fileHashSet.clear()
}

function revokeUrl(url) {
  if (objectUrls.has(url)) { URL.revokeObjectURL(url); objectUrls.delete(url) }
}

async function deleteSingle(id) {
  const uploadedIndex = uploadedImages.value.findIndex(i => i.id === id)
  if (uploadedIndex !== -1) {
    const img = uploadedImages.value[uploadedIndex]
    revokeUrl(img.url)
    fileHashSet.delete(img.fileKey)
    uploadedImages.value = uploadedImages.value.filter(i => i.id !== id)
    showSnackbar('Image deleted')
    if (img.serverId) {
      try { await photoStore.deletePhoto(img.serverId, projectId) }
      catch { showSnackbar('Failed to delete from server', 'error') }
    }
    return
  }
  const previews = toValue(uploadManager.previewImages) || []
  const preview = previews.find(p => p.id === id)
  if (preview) fileHashSet.delete(preview.fileKey)
  uploadManager.removePreview(id)
  showSnackbar('Removed from queue')
}

async function deleteMultiple(ids) {
  const idSet = new Set(ids)
  const serverIds = []
  uploadedImages.value = uploadedImages.value.filter(img => {
    if (idSet.has(img.id)) {
      revokeUrl(img.url); fileHashSet.delete(img.fileKey)
      if (img.serverId) serverIds.push(img.serverId)
      return false
    }
    return true
  })
  const previews = toValue(uploadManager.previewImages) || []
  const previewIdsToRemove = []
  previews.forEach(p => {
    if (idSet.has(p.id)) { fileHashSet.delete(p.fileKey); previewIdsToRemove.push(p.id) }
  })
  if (previewIdsToRemove.length) uploadManager.removeMultiplePreviews(previewIdsToRemove)
  showSnackbar(`${ids.length} item${ids.length !== 1 ? 's' : ''} deleted`)
  if (serverIds.length) {
    try { await photoStore.bulkDeletePhotos(serverIds, projectId) }
    catch { showSnackbar('Failed to delete some items from server', 'error') }
  }
}

function handleDeleteFromPreview(id) {
  deleteSingle(id)
  if (!galleryImages.value.length) { previewOpen.value = false; previewImage.value = null }
}

const previewOpen = ref(false)
const previewImage = ref(null)
function openPreview(img) { previewImage.value = img; previewOpen.value = true }

const shareOpen = ref(false)
const snackbar = reactive({ show: false, text: '', color: 'success' })
function showSnackbar(text, color = 'success') {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}

watch(currentPhase, (phase) => { if (phase === 'done') showSnackbar('Upload complete!') })
</script>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color var(--ps-duration-fast);
  width: fit-content;
}

.back-btn:hover { color: var(--ps-primary); }

.project-title {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.project-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-divider {
  width: 1px;
  height: 16px;
  background: #E2E8F0;
}

.meta-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
}

.meta-text .v-icon { opacity: 0.7; }
</style>
