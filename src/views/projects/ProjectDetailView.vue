<template>
  <div class="project-detail ps-animate-in">
    <!-- Breadcrumb -->
    <Breadcrumb
      v-if="projectStore.currentProject"
      :items="breadcrumbItems"
    />

    <!-- Project Header -->
    <div class="project-header" v-if="projectStore.currentProject">
      <div class="project-header__info">
        <div class="project-title-row">
          <h1 class="project-title">{{ projectStore.currentProject.name }}</h1>
          <v-btn
            icon="mdi-delete-outline"
            size="small"
            variant="text"
            color="error"
            @click="deleteProjectDialog = true"
          />
        </div>
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

    <!-- Delete Project Confirmation -->
    <v-dialog v-model="deleteProjectDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-title class="text-h6 pt-5 px-6">Delete Project?</v-card-title>
        <v-card-text class="px-6">
          This will permanently delete <strong>{{ projectStore.currentProject?.name }}</strong> and all its photos. This action cannot be undone.
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-spacer />
          <v-btn variant="text" class="text-none" @click="deleteProjectDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="deletingProject" @click="handleDeleteProject">
            Delete Project
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Download Selected Names -->
    <div v-if="projectStore.currentProject?.status === 'completed' && projectStore.currentProject?.selectedCount > 0" class="download-bar">
      <v-btn
        variant="tonal"
        color="primary"
        class="text-none"
        size="default"
        rounded="lg"
        prepend-icon="mdi-download"
        :loading="downloading"
        @click="downloadSelectedNames"
      >
        Download Selected ({{ projectStore.currentProject.selectedCount }})
      </v-btn>
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

    <!-- Load More Photos -->
    <div v-if="galleryImages.length > 0 && projectStore.hasMorePhotos" class="load-more-wrapper">
      <v-btn
        variant="outlined"
        color="primary"
        class="text-none load-more-btn"
        size="large"
        rounded="lg"
        :loading="projectStore.loadingMore"
        @click="loadMorePhotos"
      >
        <v-icon start>mdi-refresh</v-icon>
        Load More Photos
      </v-btn>
      <p class="load-more-meta">
        Showing {{ galleryImages.length }} of {{ projectStore.photoPagination.total }} photos
      </p>
    </div>

    <!-- Preview Modal -->
    <PreviewModal
      v-model="previewOpen"
      v-model:current="previewImage"
      :images="galleryImages"
      :show-delete="projectStore.currentProject?.status !== 'completed'"
      @delete="handleDeleteFromPreview"
    />

    <!-- Share Dialog -->
    <ShareDialog
      v-model="shareOpen"
      :share-id="projectShareId"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="2500" location="top" rounded="lg">
      <div class="d-flex align-center ga-2">
        <v-icon size="18">{{ snackbar.color === 'success' ? 'mdi-check-circle' : snackbar.color === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, toValue, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import UploadZone from '@/components/upload/UploadZone.vue'
import UploadProgress from '@/components/upload/UploadProgress.vue'
import ImageGrid from '@/components/gallery/ImageGrid.vue'
import PreviewModal from '@/components/gallery/PreviewModal.vue'
import ShareDialog from '@/components/gallery/ShareDialog.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'

import { useUploadManager } from '@/composables/useUploadManager'
import { useProjectStore } from '@/stores/projects'
import { useFolderStore } from '@/stores/folders'
import { photoService } from '@/api/services/photo.service'
import type { ProjectImage, UploadPhase, PreviewImage } from '@/types'

interface NormalizedImage {
  id: string
  url: string
  thumbUrl: string
  filename: string
  fileKey: string
  serverId: string
  selectedByClient: boolean
  isPreview?: boolean
}

const route = useRoute()
const router = useRouter()
const projectId = (route?.params?.id as string) ?? 'demo'
const projectStore = useProjectStore()
const folderStore = useFolderStore()

const breadcrumbItems = computed(() => {
  const items: { label: string; to?: string; icon?: string }[] = [
    { label: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard-outline' },
  ]
  const proj = projectStore.currentProject
  if (proj?.folderId) {
    const folder = folderStore.folders.find(f => f.id === proj.folderId)
    if (folder) {
      items.push({ label: 'Folders', to: '/folders', icon: 'mdi-folder-outline' })
      items.push({ label: folder.name, to: `/folders/${folder.id}` })
    }
  } else {
    items.push({ label: 'Projects', to: '/projects' })
  }
  items.push({ label: proj?.name ?? 'Loading...' })
  return items
})

const downloading = ref<boolean>(false)
const deleteProjectDialog = ref<boolean>(false)
const deletingProject = ref<boolean>(false)
const projectShareId = ref<string>('')
const uploadedImages = ref<NormalizedImage[]>([])
const objectUrls = new Set<string>()
const fileHashSet = new Set<string>()

onMounted(async () => {
  try {
    const project = await projectStore.fetchProject(projectId).catch(() => null)
    if (project?.shareId) projectShareId.value = project.shareId
    const existing = project?.images || []
    uploadedImages.value = existing.map((photo) => normalizePhoto(photo as unknown as Record<string, unknown>))
    uploadedImages.value.forEach((img) => fileHashSet.add(img.fileKey))
  } catch { /* First load may fail */ }
})

async function handleDeleteProject(): Promise<void> {
  deletingProject.value = true
  try {
    const { folderId } = await projectStore.deleteProject(projectId)
    if (folderId) folderStore.decrementFolderProjectCount(folderId)
    deleteProjectDialog.value = false
    router.push('/projects')
  } catch {
    showSnackbar('Failed to delete project', 'error')
  } finally {
    deletingProject.value = false
  }
}

async function downloadSelectedNames(): Promise<void> {
  downloading.value = true
  try {
    await photoService.downloadSelectedNames(projectId)
    showSnackbar('Download started')
  } catch {
    showSnackbar('Failed to download', 'error')
  } finally {
    downloading.value = false
  }
}

async function loadMorePhotos(): Promise<void> {
  try {
    await projectStore.fetchMorePhotos(projectId)
    const newImages = projectStore.currentProject?.images || []
    const existingKeys = new Set(uploadedImages.value.map(img => img.fileKey))
    const additions = newImages
      .filter(p => !existingKeys.has(`server_${p.id}`))
      .map(p => normalizePhoto(p as unknown as Record<string, unknown>))
    if (additions.length) {
      uploadedImages.value = [...uploadedImages.value, ...additions]
      additions.forEach(img => fileHashSet.add(img.fileKey))
    }
  } catch { /* handled by store */ }
}

function normalizePhoto(photo: Record<string, unknown>): NormalizedImage {
  return {
    id: String(photo.id ?? ''),
    url: String(photo.url ?? ''),
    thumbUrl: String(photo.thumbUrl ?? photo.thumbnailUrl ?? photo.url ?? ''),
    filename: String(photo.originalFileName ?? photo.originalName ?? photo.filename ?? 'Photo'),
    fileKey: String(photo.fileKey ?? `server_${photo.id}`),
    serverId: String(photo.id ?? ''),
    selectedByClient: Boolean(photo.selected ?? photo.selectedByClient ?? false),
  }
}

const uploadManager = useUploadManager(async (blob: Blob, filename: string, fileMeta: { fileKey: string }, { signal, onProgress }: { signal: AbortSignal; onProgress: (p: number) => void }) => {
  const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
  const res = await photoService.uploadPhoto(projectId, file, {
    originalName: filename,
    originalSize: blob.size,
  }, { signal, onProgress })
  const normalized = normalizePhoto(res.data as unknown as Record<string, unknown>)
  normalized.fileKey = fileMeta.fileKey
  uploadedImages.value = [...uploadedImages.value, normalized]
}, { uploadConcurrency: 5, maxRetries: 2 })

const currentPhase = computed<UploadPhase>(() => toValue(uploadManager.phase) as UploadPhase)

const galleryImages = computed<NormalizedImage[]>(() => {
  const previews = (toValue(uploadManager.previewImages) ?? []) as PreviewImage[]
  const uploadedKeys = new Set(uploadedImages.value.map(img => img.fileKey))
  const remainingPreviews = previews
    .filter(p => !uploadedKeys.has(p.fileKey))
    .map((p) => ({
      id: String(p.id),
      url: p.url,
      thumbUrl: p.thumbUrl,
      filename: p.filename,
      fileKey: p.fileKey,
      serverId: '',
      selectedByClient: false,
      isPreview: true,
    } satisfies NormalizedImage))
  return [
    ...uploadedImages.value,
    ...remainingPreviews,
  ]
})

const canAcceptFiles = computed<boolean>(() => currentPhase.value !== 'compressing')

function getFileKey(file: File): string {
  return `${file.name}_${file.size}_${file.lastModified}`
}

function handleFiles(files: File[]): void {
  const validFiles: Array<{ file: File; fileKey: string }> = []
  const skipped: string[] = []
  files.forEach((file: File) => {
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

function handleReset(): void {
  uploadManager.reset()
  fileHashSet.clear()
}

function revokeUrl(url: string): void {
  if (objectUrls.has(url)) { URL.revokeObjectURL(url); objectUrls.delete(url) }
}

async function deleteSingle(id: string): Promise<void> {
  const uploadedIndex = uploadedImages.value.findIndex((i: NormalizedImage) => i.id === id)
  if (uploadedIndex !== -1) {
    const img = uploadedImages.value[uploadedIndex]
    revokeUrl(img.url)
    fileHashSet.delete(img.fileKey)
    uploadedImages.value = uploadedImages.value.filter((i: NormalizedImage) => i.id !== id)
    showSnackbar('Image deleted')
    if (img.serverId) {
      try { await projectStore.deletePhoto(img.serverId, projectId) }
      catch { showSnackbar('Failed to delete from server', 'error') }
    }
    return
  }
  const previews = (toValue(uploadManager.previewImages) ?? []) as PreviewImage[]
  const preview = previews.find((p) => String(p.id) === id)
  if (preview) fileHashSet.delete(preview.fileKey)
  uploadManager.removePreview(Number(id))
  showSnackbar('Removed from queue')
}

async function deleteMultiple(ids: string[]): Promise<void> {
  const idSet = new Set<string>(ids)
  const serverIds: string[] = []
  uploadedImages.value = uploadedImages.value.filter((img: NormalizedImage) => {
    if (idSet.has(img.id)) {
      revokeUrl(img.url); fileHashSet.delete(img.fileKey)
      if (img.serverId) serverIds.push(img.serverId)
      return false
    }
    return true
  })
  const previews = (toValue(uploadManager.previewImages) ?? []) as PreviewImage[]
  const previewIdsToRemove: number[] = []
  previews.forEach((p) => {
    if (idSet.has(String(p.id))) { fileHashSet.delete(p.fileKey); previewIdsToRemove.push(p.id) }
  })
  if (previewIdsToRemove.length) uploadManager.removeMultiplePreviews(previewIdsToRemove)
  showSnackbar(`${ids.length} item${ids.length !== 1 ? 's' : ''} deleted`)
  if (serverIds.length) {
    try { await projectStore.bulkDeletePhotos(serverIds, projectId) }
    catch { showSnackbar('Failed to delete some items from server', 'error') }
  }
}

function handleDeleteFromPreview(id: string): void {
  deleteSingle(id)
  if (!galleryImages.value.length) { previewOpen.value = false; previewImage.value = null }
}

const previewOpen = ref<boolean>(false)
const previewImage = ref<NormalizedImage | null>(null)
function openPreview(img: unknown): void { previewImage.value = img as NormalizedImage; previewOpen.value = true }

const shareOpen = ref<boolean>(false)
const snackbar = reactive<{ show: boolean; text: string; color: string }>({ show: false, text: '', color: 'success' })
function showSnackbar(text: string, color: string = 'success'): void {
  snackbar.text = text; snackbar.color = color; snackbar.show = true
}

watch(currentPhase, (phase: string) => { if (phase === 'done') showSnackbar('Upload complete!') })
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

.project-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

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

.download-bar {
  display: flex;
  align-items: center;
}

.load-more-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.load-more-btn {
  min-width: 180px;
}

.load-more-meta {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}
</style>
