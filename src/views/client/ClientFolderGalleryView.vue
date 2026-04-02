<template>
  <div class="client-folder-gallery">
    <!-- Header -->
    <header class="gallery-header ps-glass">
      <div class="header-content">
        <div class="d-flex align-center ga-2">
          <div class="logo-mark-sm">P</div>
          <span class="brand-name">PhotoShare</span>
        </div>
        <span v-if="selectedTotal > 0" class="header-count">
          <v-icon size="14" color="pink">mdi-heart</v-icon>
          {{ selectedTotal }} selected
        </span>
      </div>
    </header>

    <!-- Hero -->
    <div class="gallery-hero" v-if="folder">
      <div class="hero-inner ps-animate-in">
        <div class="hero-badge">
          <v-icon size="14">mdi-folder-outline</v-icon>
          Shared Collection
        </div>
        <h1 class="hero-title">{{ folder.name }}</h1>
        <p class="hero-subtitle">
          {{ folder.projects?.length ?? 0 }} projects &middot; Browse and select your favorites
        </p>
      </div>
    </div>

    <!-- Project Tabs -->
    <div class="gallery-content" v-if="folder?.projects?.length">
      <div class="project-tabs">
        <button
          v-for="proj in folder.projects"
          :key="proj.id"
          class="project-tab"
          :class="{ 'project-tab--active': activeProjectId === proj.id }"
          @click="selectProject(proj)"
        >
          {{ proj.name }}
          <span class="tab-count">{{ proj.imageCount }}</span>
        </button>
      </div>

      <!-- Active Project Gallery -->
      <div v-if="activeProject" class="active-project">
        <div class="project-info">
          <h2 class="project-name">{{ activeProject.name }}</h2>
          <span class="project-meta">{{ activeProject.imageCount }} photos</span>
        </div>

        <!-- Grid -->
        <div v-if="images.length" class="masonry-grid">
          <div
            v-for="(image, idx) in images"
            :key="image.id"
            class="masonry-item"
            :class="{ 'masonry-tall': idx % 5 === 0, 'is-selected': image.selected }"
            @click="openModal(image, idx)"
          >
            <v-img
              :src="image.thumbUrl"
              cover
              class="masonry-img"
              :lazy-src="`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23F3F4F6' width='1' height='1'/%3E%3C/svg%3E`"
            >
              <template #placeholder>
                <div class="shimmer-placeholder" />
              </template>
            </v-img>

            <div class="item-overlay" :class="{ 'item-selected': image.selected }">
              <button
                class="select-heart"
                :class="{ 'heart-active': image.selected }"
                @click.stop="toggleSelect(image.id)"
              >
                <v-icon :color="image.selected ? 'pink' : 'white'" size="22">
                  {{ image.selected ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </button>
            </div>

            <div v-if="image.selected" class="selected-badge">
              <v-icon size="10" color="white">mdi-check</v-icon>
            </div>
          </div>
        </div>

        <!-- Infinite scroll sentinel -->
        <div ref="sentinelRef" class="infinite-sentinel">
          <div v-if="isLoading" class="loading-more">
            <v-progress-circular indeterminate size="28" width="3" color="primary" />
            <span class="loading-more__text">Loading more photos...</span>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="!images.length && !projectStore.loading" class="empty-project">
          <v-icon size="40" color="grey-lighten-1">mdi-image-off-outline</v-icon>
          <p>No photos in this project yet.</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="gallery-loading">
      <div class="loading-hero">
        <div class="ps-shimmer" style="width: 120px; height: 20px; margin: 0 auto 12px" />
        <div class="ps-shimmer" style="width: 280px; height: 32px; margin: 0 auto 8px" />
        <div class="ps-shimmer" style="width: 200px; height: 16px; margin: 0 auto" />
      </div>
    </div>

    <!-- Not Found -->
    <div v-if="!loading && !folder" class="gallery-not-found ps-animate-in">
      <v-icon size="56" color="grey-lighten-1">mdi-folder-off-outline</v-icon>
      <h2>Collection not found</h2>
      <p>This shared link may have expired or been removed.</p>
    </div>

    <!-- Floating Selection Bar -->
    <transition name="slide-up">
      <div v-if="selectedTotal > 0" class="selection-bar">
        <div class="selection-bar-inner ps-glass">
          <div class="selection-bar-content">
            <div class="selection-info">
              <v-icon size="18" color="pink">mdi-heart</v-icon>
              <span class="selection-text">
                <strong>{{ selectedTotal }}</strong> photos selected
              </span>
            </div>
            <v-btn
              v-if="activeProject?.shareId"
              color="primary"
              size="large"
              class="text-none ps-btn-glow review-btn"
              @click="summaryOpen = true"
              elevation="0"
              rounded="lg"
            >
              Review & Submit
              <v-icon end size="18">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </transition>

    <!-- Selection Summary Modal -->
    <v-dialog v-model="summaryOpen" max-width="480" persistent>
      <v-card rounded="xl" class="summary-dialog">
        <!-- ── Success State ── -->
        <template v-if="submitted">
          <!-- Confetti -->
          <div class="confetti-container">
            <div v-for="n in 30" :key="n" class="confetti" :style="confettiStyle(n)" />
          </div>

          <v-card-text class="pa-8 text-center position-relative">
            <div class="success-icon-wrap mb-5">
              <div class="success-ring success-ring--1" />
              <div class="success-ring success-ring--2" />
              <v-icon size="44" color="white">mdi-check</v-icon>
            </div>
            <h2 class="text-h5 font-weight-bold mb-2">Selection Submitted!</h2>
            <p class="text-body-2 text-medium-emphasis mb-1">
              Your photographer has been notified and will begin
              preparing your <strong class="text-high-emphasis">{{ submittedCount }}</strong> selected photos.
            </p>
            <p class="text-caption text-disabled mb-5">
              <v-icon size="12" class="mr-1">mdi-lock-outline</v-icon>
              Your selection is securely saved.
            </p>
            <v-btn
              color="primary"
              class="text-none"
              rounded="lg"
              size="large"
              elevation="0"
              block
              @click="closeSummary"
            >
              Done
            </v-btn>
          </v-card-text>
        </template>

        <!-- ── Review State ── -->
        <template v-else>
          <v-card-text class="pa-6 pb-0 text-center">
            <div class="summary-heart-icon mb-4">
              <v-icon size="32" color="white">mdi-heart</v-icon>
            </div>
            <h2 class="text-h6 font-weight-bold mb-1">Selection Summary</h2>
            <p class="text-body-2 text-medium-emphasis mb-5">
              Review your selection before submitting
            </p>

            <!-- Stats -->
            <div class="summary-stats mb-5">
              <div class="summary-stat">
                <span class="summary-stat__value">{{ images.length }}</span>
                <span class="summary-stat__label">Total Photos</span>
              </div>
              <div class="summary-stat-divider" />
              <div class="summary-stat">
                <span class="summary-stat__value summary-stat__value--pink">{{ selectedImages.length }}</span>
                <span class="summary-stat__label">Selected</span>
              </div>
            </div>

            <!-- Warning -->
            <v-alert
              type="warning"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="text-left mb-2"
            >
              <span class="text-body-2">
                Once submitted, you will <strong>not</strong> be able to change or re-submit your selection.
                Please make sure you're happy with your choices.
              </span>
            </v-alert>
          </v-card-text>

          <v-card-actions class="pa-5 pt-4 d-flex flex-column ga-2">
            <v-btn
              color="primary"
              class="text-none ps-btn-glow"
              :loading="submitting"
              @click="handleSubmit"
              elevation="0"
              rounded="lg"
              size="large"
              block
            >
              <v-icon start size="18">mdi-check-circle-outline</v-icon>
              Submit Selection
            </v-btn>
            <v-btn
              variant="text"
              color="grey-darken-1"
              class="text-none"
              size="large"
              block
              @click="summaryOpen = false"
            >
              Go Back & Edit
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>

    <!-- Preview Modal -->
    <PreviewModal
      v-model="modalOpen"
      v-model:current="modalImage"
      :images="previewImages"
      :show-delete="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, type CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import { folderService } from '@/api/services/folder.service'
import { useProjectStore } from '@/stores/projects'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import PreviewModal from '@/components/gallery/PreviewModal.vue'
import type { ProjectImage } from '@/types'

interface SharedProject {
  id: string
  name: string
  eventType: string
  status: string
  imageCount: number
  selectedCount: number
  shareId: string
  coverUrl: string | null
  createdAt: string
}

interface SharedFolder {
  id: string
  name: string
  shareId: string | null
  projects: SharedProject[]
}

interface PreviewImg {
  id: string
  url: string
  thumbUrl: string
  filename: string
}

const props = defineProps<{ shareId?: string }>()
const route = useRoute()
const projectStore = useProjectStore()

const shareId = computed(() => props.shareId || (route.params.shareId as string))
const folder = ref<SharedFolder | null>(null)
const loading = ref(true)
const activeProjectId = ref<string>('')
const modalOpen = ref(false)
const modalImage = ref<PreviewImg | null>(null)
const summaryOpen = ref(false)
const submitting = ref(false)
const submitted = ref(false)
const submittedCount = ref(0)

const activeProject = computed(() =>
  folder.value?.projects?.find(p => p.id === activeProjectId.value) ?? null
)

const images = computed<ProjectImage[]>(() =>
  projectStore.currentProject?.images ?? []
)

const selectedImages = computed(() =>
  images.value.filter(i => i.selected)
)

const selectedTotal = computed(() => selectedImages.value.length)

const previewImages = computed<PreviewImg[]>(() =>
  images.value.map(i => ({
    id: i.id,
    url: i.url ?? i.thumbUrl,
    thumbUrl: i.thumbUrl,
    filename: i.originalFileName ?? i.filename ?? 'Photo',
  }))
)

onMounted(async () => {
  loading.value = true
  try {
    const res = await folderService.getFolderByShareId(shareId.value)
    folder.value = res.data as unknown as SharedFolder
    if (folder.value?.projects?.length) {
      selectProject(folder.value.projects[0])
    }
  } catch {
    folder.value = null
  } finally {
    loading.value = false
  }
})

async function selectProject(proj: SharedProject): Promise<void> {
  activeProjectId.value = proj.id
  if (proj.shareId) {
    await projectStore.fetchProjectByShareId(proj.shareId).catch(() => {})
  }
}

function toggleSelect(imageId: string): void {
  const proj = activeProject.value
  if (proj?.shareId) projectStore.toggleImageSelection(proj.shareId, imageId)
}

async function handleSubmit(): Promise<void> {
  const sid = activeProject.value?.shareId
  if (!sid) return
  submitting.value = true
  try {
    submittedCount.value = selectedImages.value.length
    await projectStore.submitSelections(sid)
    submitted.value = true
  } finally {
    submitting.value = false
  }
}

function closeSummary(): void {
  summaryOpen.value = false
  submitted.value = false
}

const confettiColors = ['#4F46E5', '#0EA5E9', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6']

function confettiStyle(n: number): CSSProperties {
  const color = confettiColors[n % confettiColors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  const size = 4 + Math.random() * 6
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }
}

function openModal(image: ProjectImage, idx: number): void {
  modalImage.value = previewImages.value[idx] ?? null
  modalOpen.value = true
}

const { sentinelRef, isLoading } = useInfiniteScroll(async () => {
  if (projectStore.hasMorePhotos && activeProject.value?.shareId && activeProject.value.id) {
    await projectStore.fetchMorePhotosForGallery(activeProject.value.id, activeProject.value.shareId)
  }
})

watch(activeProjectId, () => {
  // Reset scroll when switching projects
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.client-folder-gallery {
  min-height: 100vh;
  background: var(--ps-surface-dim);
  padding-bottom: 120px;
}

/* ─── Header ─────────────────────────────────────────────────────────── */

.gallery-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px var(--ps-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-mark-sm {
  width: 28px;
  height: 28px;
  background: var(--ps-gradient-brand);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 13px;
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}

.header-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #EC4899;
}

/* ─── Hero ────────────────────────────────────────────────────────────── */

.gallery-hero {
  padding: clamp(32px, 6vw, 56px) var(--ps-gutter) clamp(20px, 3vw, 32px);
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--ps-radius-full);
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
  font-size: 13px;
  font-weight: 600;
}

.hero-title {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: 15px;
  color: #64748B;
  margin: 0;
}

/* ─── Content ─────────────────────────────────────────────────────────── */

.gallery-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--ps-gutter);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ─── Project Tabs ────────────────────────────────────────────────────── */

.project-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}

.project-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: var(--ps-radius-full);
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all var(--ps-duration-fast);
  white-space: nowrap;
  font-family: inherit;
}

.project-tab:hover {
  border-color: #CBD5E1;
}

.project-tab--active {
  background: var(--ps-primary);
  border-color: var(--ps-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.tab-count {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--ps-radius-full);
  background: rgba(0, 0, 0, 0.06);
}

.project-tab--active .tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* ─── Active Project ──────────────────────────────────────────────────── */

.active-project {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.project-name {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.project-meta {
  font-size: 13px;
  color: #94A3B8;
}

/* ─── Masonry Grid ────────────────────────────────────────────────────── */

.masonry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

@media (min-width: 600px) { .masonry-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
@media (min-width: 960px) { .masonry-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }

.masonry-item {
  position: relative;
  border-radius: var(--ps-radius-md);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  transition: transform var(--ps-duration-fast) var(--ps-ease-smooth);
}

.masonry-item:hover { transform: scale(1.02); }
.masonry-tall { grid-row: span 1; }
@media (min-width: 600px) { .masonry-tall { grid-row: span 2; aspect-ratio: auto; } }

.masonry-img { width: 100%; height: 100%; object-fit: cover; }

.shimmer-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: ps-shimmer 1.5s ease-in-out infinite;
}

/* ─── Overlay ─────────────────────────────────────────────────────────── */

.item-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%);
  opacity: 0; transition: opacity 0.2s ease;
}

.masonry-item:hover .item-overlay,
.masonry-item:active .item-overlay,
.item-selected { opacity: 1; }

.is-selected { box-shadow: inset 0 0 0 3px #EC4899; }

.select-heart {
  position: absolute; top: 10px; right: 10px;
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(0, 0, 0, 0.25); backdrop-filter: blur(4px);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}

.heart-active { background: rgba(236, 72, 153, 0.3); transform: scale(1.1); }
.select-heart:active { transform: scale(0.9); }

.selected-badge {
  position: absolute; top: 10px; left: 10px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #EC4899;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(236, 72, 153, 0.4);
}

/* ─── Infinite Scroll ─────────────────────────────────────────────────── */

.infinite-sentinel { min-height: 1px; padding: 8px 0; }

.loading-more {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding: 24px 0;
}

.loading-more__text { font-size: 14px; color: #94A3B8; font-weight: 500; }

/* ─── Empty / Loading / Not Found ─────────────────────────────────────── */

.empty-project {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 48px 24px; color: #94A3B8; text-align: center;
}

.gallery-loading {
  max-width: 1200px; margin: 0 auto; padding: 40px var(--ps-gutter);
}

.loading-hero { padding: 40px 0; }

.gallery-not-found {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 80px 24px; text-align: center;
}

.gallery-not-found h2 { font-size: 20px; font-weight: 700; color: #1E293B; margin: 0; }
.gallery-not-found p { font-size: 14px; color: #94A3B8; margin: 0; }

/* ─── Selection Bar ───────────────────────────────────────────────────── */

.selection-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  padding: 12px var(--ps-gutter);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.selection-bar-inner {
  max-width: 720px; margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-radius: var(--ps-radius-xl);
  padding: 12px 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.selection-bar-content {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}

.selection-info { display: flex; align-items: center; gap: 8px; }
.selection-text { font-size: 14px; color: #475569; }
.review-btn { border-radius: 14px !important; }

/* ─── Transitions ─────────────────────────────────────────────────────── */

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s var(--ps-ease-smooth); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }

@media (max-width: 600px) {
  .selection-bar-content { flex-wrap: wrap; }
  .review-btn { width: 100%; }
  .project-tabs { gap: 6px; }
}

/* ─── Summary Modal ──────────────────────────────────────────────────── */

.summary-dialog { overflow: hidden; position: relative; }

.summary-heart-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, #EC4899, #DB2777);
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
}

.summary-stats {
  display: flex; align-items: center; justify-content: center;
  gap: 0; background: #F8FAFC; border-radius: 16px; padding: 20px 0;
  border: 1px solid #F1F5F9;
}

.summary-stat {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
}

.summary-stat__value {
  font-size: 32px; font-weight: 800; color: #0F172A; letter-spacing: -0.02em;
}

.summary-stat__value--pink { color: #EC4899; }

.summary-stat__label {
  font-size: 12px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em;
}

.summary-stat-divider {
  width: 1px; height: 40px; background: #E2E8F0;
}

/* ─── Success State ──────────────────────────────────────────────────── */

.success-icon-wrap {
  width: 88px; height: 88px; border-radius: 50%;
  background: linear-gradient(135deg, #10B981, #059669);
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3);
  position: relative;
  animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-ring {
  position: absolute; border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.15);
}

.success-ring--1 {
  inset: -12px;
  animation: ring-pulse 2.5s ease-in-out infinite;
}

.success-ring--2 {
  inset: -26px;
  animation: ring-pulse 2.5s ease-in-out infinite 0.5s;
  border-color: rgba(16, 185, 129, 0.08);
}

@keyframes success-pop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.3; }
}

/* ─── Confetti ───────────────────────────────────────────────────────── */

.confetti-container {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1;
}

.confetti {
  position: absolute; top: -20px; opacity: 0;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
}

.position-relative { position: relative; z-index: 2; }
</style>
