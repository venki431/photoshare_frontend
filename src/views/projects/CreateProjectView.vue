<template>
  <div class="create-project-page ps-page">
    <!-- Back nav -->
    <v-btn variant="text" color="on-surface" prepend-icon="mdi-arrow-left" class="text-none" to="/projects">
      Back to Projects
    </v-btn>

    <div class="ps-page-intro">
      <h1 class="text-h4 font-weight-bold">Create New Project</h1>
      <p class="text-body-2 text-medium-emphasis">Set up a photo gallery for your client to browse and select from.</p>
    </div>

    <v-row class="create-project-grid">
      <v-col cols="12" md="7">
        <v-card class="form-card pa-6">
          <!-- Step Indicator -->
          <div class="d-flex align-center ga-2 mb-6">
            <template v-for="(s, i) in steps" :key="i">
              <div
                class="step-dot"
                :class="{
                  'step-active': step === i,
                  'step-done': step > i
                }"
              >
                <v-icon v-if="step > i" size="14" color="white">mdi-check</v-icon>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div v-if="i < steps.length - 1" class="step-line" :class="{ 'step-line-done': step > i }" />
            </template>
          </div>

          <!-- Step 1: Project Details -->
          <div v-show="step === 0">
            <h3 class="text-body-1 font-weight-bold mb-4">Project Details</h3>
            <v-text-field
              v-model="form.name"
              label="Project name"
              placeholder="e.g. Sarah & James Wedding"
              class="mb-4"
            />
            <v-select
              v-model="form.eventType"
              label="Event type"
              :items="eventTypes"
              class="mb-4"
            />
            <v-textarea
              v-model="form.notes"
              label="Notes for client (optional)"
              placeholder="Any special instructions..."
              rows="3"
              variant="outlined"
              rounded="lg"
              hide-details
            />
          </div>

          <!-- Step 2: Upload Photos -->
          <div v-show="step === 1">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="text-body-1 font-weight-bold">Upload Photos</h3>
              <v-chip v-if="uploadedFiles.length > 0 && !uploading" size="small" variant="tonal" color="primary">
                {{ uploadedFiles.length }} photo{{ uploadedFiles.length !== 1 ? 's' : '' }}
              </v-chip>
            </div>

            <!-- Drop Zone -->
            <div
              v-if="!uploading"
              class="upload-zone mb-4"
              :class="{
                'upload-zone-active': isDragging,
                'upload-zone-compact': uploadedFiles.length > 0
              }"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
              @click="triggerFileInput"
            >
              <input ref="fileInput" type="file" multiple accept="image/*" class="d-none" @change="onFileSelect" />
              <template v-if="uploadedFiles.length === 0">
                <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-cloud-upload-outline</v-icon>
                <div class="text-body-1 font-weight-medium mb-1">Drag & drop photos here</div>
                <div class="text-body-2 text-medium-emphasis mb-3">or click to browse files</div>
                <v-chip size="small" variant="tonal" color="grey">JPG, PNG, HEIC up to 25MB each</v-chip>
              </template>
              <template v-else>
                <v-icon size="24" color="primary" class="mr-2">mdi-plus-circle-outline</v-icon>
                <span class="text-body-2 font-weight-medium text-primary">Add more photos</span>
              </template>
            </div>

            <!-- Upload Processing Overlay -->
            <div v-if="uploading" class="processing-overlay mb-4">
              <div class="processing-card">
                <div class="processing-visual">
                  <div class="ring ring-outer" />
                  <div class="ring ring-middle" />
                  <div class="ring ring-inner" />
                  <div class="ring-center">
                    <v-icon size="28" color="white">mdi-image-multiple</v-icon>
                  </div>
                </div>
                <div class="processing-info">
                  <div class="processing-title">{{ processingPhase }}</div>
                  <div class="processing-counter">
                    <span class="counter-done">{{ uploadedCount }}</span>
                    <span class="counter-sep">/</span>
                    <span class="counter-total">{{ totalUpload }}</span>
                    <span class="counter-label">photos</span>
                  </div>
                  <div class="processing-dots">
                    <span class="dot-pulse" />
                    <span class="dot-pulse dot-2" />
                    <span class="dot-pulse dot-3" />
                  </div>
                </div>
                <div class="micro-progress">
                  <div
                    v-for="n in 20"
                    :key="n"
                    class="micro-segment"
                    :class="{ 'micro-filled': (uploadProgress / 5) >= n }"
                  />
                </div>
              </div>
            </div>

            <!-- Photo Grid with actions -->
            <div v-if="uploadedFiles.length > 0 && !uploading" class="photo-manager">
              <!-- Toolbar -->
              <div class="photo-toolbar">
                <v-btn
                  v-if="selectedPhotos.size > 0"
                  size="small"
                  variant="tonal"
                  color="error"
                  class="text-none"
                  prepend-icon="mdi-delete-outline"
                  @click="deleteSelected"
                >
                  Delete {{ selectedPhotos.size }} selected
                </v-btn>
                <v-btn
                  v-if="selectedPhotos.size > 0"
                  size="small"
                  variant="text"
                  class="text-none"
                  @click="selectedPhotos.clear()"
                >
                  Clear selection
                </v-btn>
                <v-spacer />
                <v-btn
                  v-if="uploadedFiles.length > 0"
                  size="small"
                  variant="text"
                  color="error"
                  class="text-none"
                  prepend-icon="mdi-delete-sweep-outline"
                  @click="clearAllPhotos"
                >
                  Clear all
                </v-btn>
              </div>

              <!-- Virtualized-style grid (shows pages) -->
              <div class="photo-grid">
                <div
                  v-for="(file, i) in visibleFiles"
                  :key="i"
                  class="photo-tile"
                  :class="{ 'photo-selected': selectedPhotos.has(i) }"
                >
                  <!-- Checkbox -->
                  <div class="tile-checkbox" @click.stop="toggleSelect(i)">
                    <v-icon size="18" :color="selectedPhotos.has(i) ? 'primary' : 'white'">
                      {{ selectedPhotos.has(i) ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline' }}
                    </v-icon>
                  </div>

                  <!-- Image -->
                  <v-img
                    :src="file.preview"
                    cover
                    aspect-ratio="1"
                    class="rounded-lg photo-img"
                    @click="openLightbox(i)"
                  >
                    <template #placeholder>
                      <v-sheet color="grey-lighten-3" class="fill-height d-flex align-center justify-center rounded-lg">
                        <v-progress-circular indeterminate size="20" width="2" color="grey" />
                      </v-sheet>
                    </template>
                  </v-img>

                  <!-- Hover overlay -->
                  <div class="tile-overlay" @click="openLightbox(i)">
                    <div class="tile-actions">
                      <v-btn
                        icon
                        size="x-small"
                        variant="text"
                        color="white"
                        @click.stop="openLightbox(i)"
                      >
                        <v-icon size="18">mdi-eye-outline</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="x-small"
                        variant="text"
                        color="white"
                        @click.stop="deleteSingle(i)"
                      >
                        <v-icon size="18">mdi-delete-outline</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load more / pagination for large sets -->
              <div v-if="uploadedFiles.length > visibleCount" class="text-center mt-3">
                <v-btn
                  size="small"
                  variant="tonal"
                  class="text-none"
                  @click="visibleCount += 60"
                >
                  Show more ({{ uploadedFiles.length - visibleCount }} remaining)
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Step 3: Share Settings -->
          <div v-show="step === 2">
            <h3 class="text-body-1 font-weight-bold mb-4">Share Settings</h3>
            <v-switch
              v-model="form.passwordProtect"
              label="Password protect gallery"
              color="primary"
              hide-details
              class="mb-4"
            />
            <v-text-field
              v-if="form.passwordProtect"
              v-model="form.password"
              label="Gallery password"
              type="password"
              prepend-inner-icon="mdi-lock-outline"
              class="mb-4"
            />
            <v-switch
              v-model="form.allowComments"
              label="Allow client comments on photos"
              color="primary"
              hide-details
              class="mb-4"
            />
            <v-text-field
              v-model="form.selectionLimit"
              label="Max selection count (optional)"
              type="number"
              prepend-inner-icon="mdi-counter"
              placeholder="Unlimited"
            />
          </div>

          <!-- Navigation -->
          <div class="d-flex justify-space-between mt-8">
            <v-btn v-if="step > 0" variant="text" @click="step--" class="text-none" prepend-icon="mdi-arrow-left">
              Back
            </v-btn>
            <v-spacer />
            <v-btn
              v-if="step < 2"
              color="primary"
              @click="step++"
              class="text-none"
              append-icon="mdi-arrow-right"
              :disabled="step === 0 && !form.name"
              elevation="0"
            >
              Continue
            </v-btn>
            <v-btn
              v-else
              color="primary"
              @click="handleCreate"
              class="text-none"
              prepend-icon="mdi-check"
              :loading="projectStore.loading"
              elevation="0"
            >
              Create Project
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Sidebar Preview -->
      <v-col cols="12" md="5" class="d-none d-md-block">
        <v-card class="preview-card pa-5 sticky-preview">
          <div class="text-body-2 font-weight-bold text-medium-emphasis mb-4">PREVIEW</div>
          <div class="preview-mock rounded-xl overflow-hidden border mb-4">
            <div class="preview-header pa-3 d-flex align-center ga-2">
              <div class="preview-dot" />
              <div class="preview-dot" />
              <div class="preview-dot" />
            </div>
            <div class="pa-4">
              <div class="text-body-1 font-weight-bold mb-1">{{ form.name || 'Project Name' }}</div>
              <div class="text-caption text-medium-emphasis mb-3">
                {{ form.eventType || 'Event type' }} &middot; {{ uploadedFiles.length || 0 }} photos
              </div>
              <div class="d-flex ga-1 flex-wrap">
                <template v-if="uploadedFiles.length > 0">
                  <v-img
                    v-for="(file, n) in uploadedFiles.slice(0, 6)"
                    :key="n"
                    :src="file.preview"
                    :width="64"
                    :height="64"
                    cover
                    rounded="lg"
                    class="flex-shrink-0"
                  />
                  <v-sheet
                    v-for="n in Math.max(0, 6 - uploadedFiles.length)"
                    :key="'empty-' + n"
                    color="grey-lighten-3"
                    :width="64"
                    :height="64"
                    rounded="lg"
                    class="d-flex align-center justify-center"
                  >
                    <v-icon size="20" color="grey-lighten-1">mdi-image</v-icon>
                  </v-sheet>
                </template>
                <template v-else>
                  <v-sheet
                    v-for="n in 6"
                    :key="n"
                    color="grey-lighten-3"
                    :width="64"
                    :height="64"
                    rounded="lg"
                    class="d-flex align-center justify-center"
                  >
                    <v-icon size="20" color="grey-lighten-1">mdi-image</v-icon>
                  </v-sheet>
                </template>
              </div>
            </div>
          </div>
          <div class="text-caption text-medium-emphasis">
            This is how your client will see the gallery after you share the link.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightbox.open" class="lightbox-backdrop" @click.self="lightbox.open = false">
        <!-- Close -->
        <v-btn
          icon
          variant="text"
          color="white"
          class="lightbox-close"
          @click="lightbox.open = false"
        >
          <v-icon size="28">mdi-close</v-icon>
        </v-btn>

        <!-- Nav: Prev -->
        <v-btn
          v-if="lightbox.index > 0"
          icon
          variant="text"
          color="white"
          class="lightbox-nav lightbox-prev"
          @click="lightbox.index--"
        >
          <v-icon size="32">mdi-chevron-left</v-icon>
        </v-btn>

        <!-- Image -->
        <img
          v-if="uploadedFiles[lightbox.index]"
          :key="lightbox.index"
          :src="uploadedFiles[lightbox.index].preview"
          class="lightbox-image"
          @click.stop
        />

        <!-- Nav: Next -->
        <v-btn
          v-if="lightbox.index < uploadedFiles.length - 1"
          icon
          variant="text"
          color="white"
          class="lightbox-nav lightbox-next"
          @click="lightbox.index++"
        >
          <v-icon size="32">mdi-chevron-right</v-icon>
        </v-btn>

        <!-- Bottom bar -->
        <div class="lightbox-footer" @click.stop>
          <span class="text-body-2" style="color: white;">
            {{ lightbox.index + 1 }} / {{ uploadedFiles.length }}
          </span>
          <v-btn
            size="small"
            variant="tonal"
            color="error"
            class="text-none ml-4"
            prepend-icon="mdi-delete-outline"
            @click="deleteSingle(lightbox.index)"
          >
            Delete
          </v-btn>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import imageCompression from 'browser-image-compression'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const router = useRouter()
const projectStore = useProjectStore()

const step = ref(0)
const steps = ['Details', 'Upload', 'Settings']
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadedCount = ref(0)
const totalUpload = ref(0)
const uploadedFiles = ref([])
const fileInput = ref(null)
const visibleCount = ref(60)
const selectedPhotos = ref(new Set())

const lightbox = reactive({
  open: false,
  index: 0,
})

const form = reactive({
  name: '',
  eventType: '',
  notes: '',
  passwordProtect: false,
  password: '',
  allowComments: true,
  selectionLimit: null,
})

const processingPhase = computed(() => {
  const pct = uploadProgress.value
  if (pct < 20) return 'Preparing images\u2026'
  if (pct < 50) return 'Compressing & optimizing\u2026'
  if (pct < 80) return 'Almost there\u2026'
  return 'Finishing up\u2026'
})

const visibleFiles = computed(() => {
  return uploadedFiles.value.slice(0, visibleCount.value)
})

const eventTypes = [
  'Wedding', 'Birthday', 'Engagement', 'Corporate Event',
  'Portrait Session', 'Product Shoot', 'Other',
]

// ── File input ──

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelect(e) {
  handleFiles(Array.from(e.target.files))
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  handleFiles(Array.from(e.dataTransfer.files))
}

// ── Upload & compress ──

async function handleFiles(files) {
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  if (!imageFiles.length) return

  uploading.value = true
  totalUpload.value = imageFiles.length
  uploadedCount.value = 0
  uploadProgress.value = 0

  const batchSize = 1
  const tempStorage = []

  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize)

    const processedBatch = await Promise.all(
      batch.map(async (file) => {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            initialQuality: 0.8,
          })
          return { file: compressed, preview: null, originalSize: file.size, compressedSize: compressed.size }
        } catch {
          return { file, preview: null, originalSize: file.size, compressedSize: file.size }
        }
      })
    )

    tempStorage.push(...processedBatch)

    if (i % (batchSize * 3) === 0) {
      uploadedFiles.value = [...uploadedFiles.value, ...tempStorage]
      tempStorage.length = 0
    }

    uploadedCount.value += batch.length
    uploadProgress.value = Math.round(
      (uploadedCount.value / totalUpload.value) * 100
    )

    await new Promise(requestAnimationFrame)
  }

  if (tempStorage.length) {
    uploadedFiles.value = [...uploadedFiles.value, ...tempStorage]
  }

  uploading.value = false
  generatePreviews()
}

function generatePreviews() {
  let index = 0
  const chunkSize = 20

  function processChunk() {
    for (let i = 0; i < chunkSize && index < uploadedFiles.value.length; i++) {
      const item = uploadedFiles.value[index]
      if (!item.preview) {
        item.preview = URL.createObjectURL(item.file)
      }
      index++
    }
    if (index < uploadedFiles.value.length) {
      requestAnimationFrame(processChunk)
    }
  }

  processChunk()
}

// ── Selection & deletion ──

function toggleSelect(index) {
  const s = new Set(selectedPhotos.value)
  if (s.has(index)) {
    s.delete(index)
  } else {
    s.add(index)
  }
  selectedPhotos.value = s
}

function deleteSingle(index) {
  const item = uploadedFiles.value[index]
  if (item?.preview) URL.revokeObjectURL(item.preview)

  uploadedFiles.value.splice(index, 1)
  uploadedFiles.value = [...uploadedFiles.value]

  // Fix selected indices after removal
  const updated = new Set()
  for (const idx of selectedPhotos.value) {
    if (idx < index) updated.add(idx)
    else if (idx > index) updated.add(idx - 1)
  }
  selectedPhotos.value = updated

  // Handle lightbox state
  if (lightbox.open) {
    if (uploadedFiles.value.length === 0) {
      lightbox.open = false
    } else if (lightbox.index >= uploadedFiles.value.length) {
      lightbox.index = uploadedFiles.value.length - 1
    }
  }
}

function deleteSelected() {
  const indices = Array.from(selectedPhotos.value).sort((a, b) => b - a)
  for (const idx of indices) {
    const item = uploadedFiles.value[idx]
    if (item?.preview) URL.revokeObjectURL(item.preview)
    uploadedFiles.value.splice(idx, 1)
  }
  uploadedFiles.value = [...uploadedFiles.value]
  selectedPhotos.value = new Set()
}

function clearAllPhotos() {
  for (const item of uploadedFiles.value) {
    if (item?.preview) URL.revokeObjectURL(item.preview)
  }
  uploadedFiles.value = []
  selectedPhotos.value = new Set()
  visibleCount.value = 60
}

// ── Lightbox ──

function openLightbox(index) {
  lightbox.index = index
  lightbox.open = true
}

// ── Keyboard nav for lightbox ──

function onKeydown(e) {
  if (!lightbox.open) return
  if (e.key === 'ArrowLeft' && lightbox.index > 0) lightbox.index--
  else if (e.key === 'ArrowRight' && lightbox.index < uploadedFiles.value.length - 1) lightbox.index++
  else if (e.key === 'Escape') lightbox.open = false
  else if (e.key === 'Delete' || e.key === 'Backspace') deleteSingle(lightbox.index)
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Helpers ──

// ── Create project ──

async function handleCreate() {
  try {
    const formData = new FormData()

    uploadedFiles.value.forEach((item) => {
      formData.append('images', item.file)
    })

    formData.append('name', form.name)
    formData.append('eventType', form.eventType)
    formData.append('imageCount', uploadedFiles.value.length || 24)
    formData.append('password', form.password)

    const project = await projectStore.createProject(formData)
    router.push(`/projects/${project.id}`)
  } catch {
    // handled by store error state
  }
}
</script>

<style scoped>
.create-project-page {
  min-width: 0;
}

.create-project-grid {
  align-items: flex-start;
}

.form-card,
.preview-card {
  width: 100%;
}

/* ── Step indicator ── */
.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: #E5E7EB;
  color: #6B7280;
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.step-active { background: #4F46E5; color: white; }
.step-done { background: #10B981; color: white; }

.step-line {
  flex: 1;
  height: 2px;
  background: #E5E7EB;
  transition: background 0.3s ease;
}
.step-line-done { background: #10B981; }

/* ── Upload zone ── */
.upload-zone {
  border: 2px dashed #D1D5DB;
  border-radius: 16px;
  padding: clamp(36px, 7vw, 48px) 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.upload-zone:hover,
.upload-zone-active {
  border-color: #4F46E5;
  background: #EEF2FF;
}
.upload-zone-compact {
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Photo manager ── */
.photo-manager {
  animation: fadeIn 0.3s ease;
}

.photo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 36px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 8px;
}

.photo-tile {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.photo-tile:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.photo-tile.photo-selected {
  outline: 3px solid #4F46E5;
  outline-offset: -3px;
  border-radius: 10px;
}

.photo-img {
  width: 100%;
  height: 100%;
}

/* Checkbox on tile */
.tile-checkbox {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 3;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.15s ease;
  cursor: pointer;
}
.photo-tile:hover .tile-checkbox,
.photo-selected .tile-checkbox {
  opacity: 1;
}

/* Hover overlay */
.tile-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%);
  opacity: 0;
  transition: opacity 0.15s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  z-index: 2;
}
.photo-tile:hover .tile-overlay {
  opacity: 1;
}

.tile-actions {
  display: flex;
  gap: 2px;
}

/* ── Processing overlay ── */
.processing-overlay {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.processing-card {
  background: linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #6366F1 100%);
  border-radius: 20px;
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.processing-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
  pointer-events: none;
}

.processing-visual {
  position: relative;
  width: 100px;
  height: 100px;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}
.ring-outer {
  inset: 0;
  border-top-color: rgba(255,255,255,0.6);
  border-right-color: rgba(255,255,255,0.15);
  animation: spin 2.5s linear infinite;
}
.ring-middle {
  inset: 10px;
  border-bottom-color: rgba(167,139,250,0.8);
  border-left-color: rgba(167,139,250,0.2);
  animation: spin 1.8s linear infinite reverse;
}
.ring-inner {
  inset: 20px;
  border-top-color: rgba(129,140,248,0.7);
  animation: spin 1.2s linear infinite;
}
.ring-center {
  position: absolute;
  inset: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-soft 2s ease-in-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse-soft {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.85; }
}

.processing-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.processing-title {
  color: rgba(255,255,255,0.9);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.processing-counter { display: flex; align-items: baseline; gap: 3px; }
.counter-done { color: white; font-size: 28px; font-weight: 800; font-variant-numeric: tabular-nums; }
.counter-sep { color: rgba(255,255,255,0.35); font-size: 20px; font-weight: 300; }
.counter-total { color: rgba(255,255,255,0.55); font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.counter-label { color: rgba(255,255,255,0.4); font-size: 13px; margin-left: 4px; }

.processing-dots { display: flex; gap: 5px; margin-top: 2px; }
.dot-pulse {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(255,255,255,0.6);
  animation: dot-bounce 1.4s ease-in-out infinite;
}
.dot-2 { animation-delay: 0.2s; }
.dot-3 { animation-delay: 0.4s; }
@keyframes dot-bounce {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.2); }
}

.micro-progress { display: flex; gap: 3px; width: 100%; }
.micro-segment {
  flex: 1; height: 4px; border-radius: 2px;
  background: rgba(255,255,255,0.12);
  transition: background 0.4s ease, box-shadow 0.4s ease;
}
.micro-filled {
  background: rgba(255,255,255,0.75);
  box-shadow: 0 0 6px rgba(255,255,255,0.3);
}

/* Lightbox styles are below in non-scoped block */

/* ── Sidebar ── */
.sticky-preview { position: sticky; top: 32px; }
.preview-mock { background: #FAFAFA; }
.preview-header { background: #F3F4F6; }
.preview-dot { width: 8px; height: 8px; border-radius: 50%; background: #D1D5DB; }

@media (max-width: 600px) {
  .form-card { padding: 20px !important; }
  .upload-zone { padding: 32px 20px; }
  .photo-grid { grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); }
}
</style>

<style>
/* ── Lightbox (non-scoped — teleported to body) ── */
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-backdrop .lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
}

.lightbox-backdrop .lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
.lightbox-backdrop .lightbox-prev { left: 16px; }
.lightbox-backdrop .lightbox-next { right: 16px; }

.lightbox-backdrop .lightbox-image {
  max-width: 85vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  user-select: none;
}

.lightbox-backdrop .lightbox-footer {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 24px;
  z-index: 10;
}
</style>
