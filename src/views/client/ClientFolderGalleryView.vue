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
              :to="`/gallery/${activeProject.shareId}/summary`"
              elevation="0"
              rounded="lg"
            >
              Review Selection
              <v-icon end size="18">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </transition>

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
import { ref, computed, onMounted, watch } from 'vue'
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

const activeProject = computed(() =>
  folder.value?.projects?.find(p => p.id === activeProjectId.value) ?? null
)

const images = computed<ProjectImage[]>(() =>
  projectStore.currentProject?.images ?? []
)

const selectedTotal = computed(() =>
  images.value.filter(i => i.selected).length
)

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
</style>
