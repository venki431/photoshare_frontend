<template>
  <div class="client-gallery">
    <!-- Header -->
    <header class="gallery-header">
      <div class="header-content">
        <div class="d-flex align-center ga-2">
          <div class="logo-mark-sm">P</div>
          <span class="text-body-2 font-weight-bold text-on-surface">PhotoShare</span>
        </div>
        <v-chip v-if="project" size="small" variant="tonal" color="primary">
          {{ project.eventType }}
        </v-chip>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="gallery-hero" v-if="project">
      <div class="hero-inner text-center">
        <h1 class="text-h4 text-sm-h3 font-weight-bold mb-2">{{ project.name }}</h1>
        <p class="text-body-1 text-medium-emphasis mb-1">
          {{ project.imageCount }} photos &middot; Select your favorites
        </p>
        <p class="text-body-2 text-medium-emphasis">
          Tap the heart icon to mark photos you love, then review & submit your selection.
        </p>
      </div>
    </div>

    <!-- Gallery Content -->
    <div class="gallery-content ps-page" v-if="project">
      <!-- Toolbar -->
      <div class="gallery-toolbar">
        <v-chip-group v-model="filter" selected-class="text-primary" mandatory class="gallery-filter-group">
          <v-chip filter value="all" size="small" variant="outlined">
            All ({{ project.images?.length || 0 }})
          </v-chip>
          <v-chip filter value="selected" size="small" variant="outlined">
            <v-icon start size="14" color="pink">mdi-heart</v-icon>
            Favorites ({{ selectedCount }})
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Masonry Grid -->
      <div class="masonry-grid">
        <div
          v-for="(image, idx) in displayedImages"
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
              <v-sheet color="grey-lighten-3" class="fill-height shimmer" />
            </template>
          </v-img>
          <!-- Selection Overlay -->
          <div class="item-overlay" :class="{ 'item-selected': image.selected }">
            <button
              class="select-heart"
              :class="{ 'heart-active': image.selected }"
              @click.stop="toggleSelect(image.id)"
            >
              <v-icon :color="image.selected ? 'pink' : 'white'" size="24">
                {{ image.selected ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </button>
          </div>
          <!-- Selected Badge -->
          <div v-if="image.selected" class="selected-badge">
            <v-icon size="12" color="white">mdi-check</v-icon>
          </div>
        </div>
      </div>

      <!-- Empty selected filter -->
      <div v-if="filter === 'selected' && selectedCount === 0" class="text-center py-16">
        <v-icon size="56" color="grey-lighten-2" class="mb-4">mdi-heart-outline</v-icon>
        <h3 class="text-h6 font-weight-medium mb-2">No favorites yet</h3>
        <p class="text-body-2 text-medium-emphasis">Tap the heart icon on photos you love.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="gallery-loading-shell">
      <div class="loading-hero text-center py-12">
        <v-skeleton-loader type="heading" width="300" class="mx-auto mb-3" />
        <v-skeleton-loader type="text" width="200" class="mx-auto" />
      </div>
      <div class="masonry-grid px-4">
        <v-skeleton-loader v-for="n in 12" :key="n" type="image" class="rounded-xl" :height="n % 3 === 0 ? 300 : 200" />
      </div>
    </div>

    <!-- Floating Selection Bar -->
    <transition name="slide-up">
      <div v-if="selectedCount > 0" class="selection-bar">
        <div class="selection-bar-inner">
          <div class="selection-bar-row">
            <div class="selection-count">
              <v-icon size="18" color="pink">mdi-heart</v-icon>
              <span class="font-weight-bold">{{ selectedCount }}</span>
              <span class="text-medium-emphasis d-none d-sm-inline">photos selected</span>
            </div>
            <v-btn
              color="primary"
              size="large"
              class="text-none submit-btn"
              :to="`/gallery/${shareId}/summary`"
              elevation="0"
            >
              Review Selection
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </transition>

    <!-- Fullscreen Image Modal (view & select only — no delete, no upload) -->
    <v-dialog v-model="modalOpen" fullscreen transition="dialog-bottom-transition">
      <v-card color="black" class="image-modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <v-btn icon="mdi-close" color="white" size="small" variant="text" @click="modalOpen = false" />
          <span class="text-body-2 text-white mx-auto">
            {{ modalIndex + 1 }} / {{ displayedImages.length }}
          </span>
          <v-btn
            :icon="modalImage?.selected ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="modalImage?.selected ? 'pink' : 'white'"
            size="small"
            variant="text"
            @click="toggleSelect(modalImage?.id)"
          />
        </div>

        <!-- Image Display -->
        <div class="modal-body" @touchstart="onTouchStart" @touchend="onTouchEnd">
          <v-btn
            icon="mdi-chevron-left"
            color="white"
            variant="text"
            class="modal-nav modal-nav-prev d-none d-sm-flex"
            @click="prevImage"
          />
          <v-img
            v-if="modalImage"
            :src="modalImage.url"
            contain
            max-height="80vh"
            max-width="95vw"
            class="mx-auto"
          />
          <v-btn
            icon="mdi-chevron-right"
            color="white"
            variant="text"
            class="modal-nav modal-nav-next d-none d-sm-flex"
            @click="nextImage"
          />
        </div>

        <!-- Modal Footer (comment + select button only) -->
        <div class="modal-footer">
          <v-text-field
            v-model="commentText"
            placeholder="Add a comment about this photo..."
            variant="solo-filled"
            bg-color="rgba(255,255,255,0.1)"
            density="compact"
            hide-details
            rounded="pill"
            class="comment-input"
            @keydown.enter="saveComment"
          >
            <template #append-inner>
              <v-btn
                v-if="commentText"
                icon="mdi-send"
                size="x-small"
                variant="text"
                color="primary"
                @click="saveComment"
              />
            </template>
          </v-text-field>
          <v-btn
            :color="modalImage?.selected ? 'pink' : 'white'"
            :variant="modalImage?.selected ? 'flat' : 'outlined'"
            class="text-none modal-select-btn"
            @click="toggleSelect(modalImage?.id)"
            :prepend-icon="modalImage?.selected ? 'mdi-heart' : 'mdi-heart-outline'"
          >
            {{ modalImage?.selected ? 'Selected' : 'Select' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const props = defineProps({ shareId: String })
const route = useRoute()
const projectStore = useProjectStore()

const shareId = computed(() => props.shareId || route.params.shareId)
const project = computed(() => projectStore.getProjectByShareId(shareId.value))

onMounted(() => {
  projectStore.fetchProjectByShareId(shareId.value).catch(() => {})
})

const filter = ref('all')
const modalOpen = ref(false)
const modalImage = ref(null)
const modalIndex = ref(0)
const commentText = ref('')
let touchStartX = 0

const selectedCount = computed(() => project.value?.images?.filter(i => i.selected)?.length ?? 0)

const displayedImages = computed(() => {
  if (!project.value?.images) return []
  if (filter.value === 'selected') return project.value.images.filter(i => i.selected)
  return project.value.images
})

function toggleSelect(imageId) {
  if (project.value) {
    projectStore.toggleImageSelection(project.value.shareId, imageId)
  }
}

function openModal(image, idx) {
  modalImage.value = image
  modalIndex.value = idx
  commentText.value = image.comment || ''
  modalOpen.value = true
}

function prevImage() {
  modalIndex.value = (modalIndex.value - 1 + displayedImages.value.length) % displayedImages.value.length
  modalImage.value = displayedImages.value[modalIndex.value]
  commentText.value = modalImage.value.comment || ''
}

function nextImage() {
  modalIndex.value = (modalIndex.value + 1) % displayedImages.value.length
  modalImage.value = displayedImages.value[modalIndex.value]
  commentText.value = modalImage.value.comment || ''
}

function saveComment() {
  if (commentText.value && modalImage.value) {
    projectStore.setImageComment(project.value.shareId, modalImage.value.id, commentText.value)
    commentText.value = ''
  }
}

function onTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX
}

function onTouchEnd(e) {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 60) {
    diff > 0 ? prevImage() : nextImage()
  }
}
</script>

<style scoped>
.client-gallery {
  min-height: 100vh;
  background: #F9FAFB;
  padding-bottom: 112px;
}

/* ─── Header ──────────────────────────────────────────────────────────────── */
.gallery-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #E5E7EB;
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
  background: linear-gradient(135deg, #4F46E5, #0EA5E9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 13px;
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
.gallery-hero {
  padding: clamp(36px, 6vw, 56px) var(--ps-gutter) clamp(24px, 4vw, 36px);
}

.hero-inner {
  max-width: 600px;
  margin: 0 auto;
}

/* ─── Content ──────────────────────────────────────────────────────────────── */
.gallery-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--ps-gutter);
}

.gallery-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gallery-filter-group :deep(.v-slide-group__content) {
  flex-wrap: wrap;
  gap: 8px;
}

.gallery-loading-shell {
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── Masonry Grid ─────────────────────────────────────────────────────────── */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

@media (min-width: 600px) {
  .masonry-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
}
@media (min-width: 960px) {
  .masonry-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
}

.masonry-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  transition: transform 0.15s ease;
}

.masonry-tall {
  grid-row: span 1;
}

@media (min-width: 600px) {
  .masonry-tall { grid-row: span 2; aspect-ratio: auto; }
}

.masonry-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ─── Overlay ──────────────────────────────────────────────────────────────── */
.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.masonry-item:hover .item-overlay,
.masonry-item:active .item-overlay,
.item-selected {
  opacity: 1;
}

.is-selected {
  box-shadow: inset 0 0 0 3px #EC4899;
}

.select-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.heart-active {
  background: rgba(236, 72, 153, 0.3);
  transform: scale(1.1);
}

.select-heart:active {
  transform: scale(0.9);
}

.selected-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #EC4899;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Shimmer */
.shimmer {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Selection Bar ────────────────────────────────────────────────────────── */
.selection-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 12px var(--ps-gutter);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.selection-bar-inner {
  max-width: 720px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.selection-bar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.selection-count {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
}

.submit-btn {
  border-radius: 14px !important;
}

/* ─── Image Modal ──────────────────────────────────────────────────────────── */
.image-modal {
  background: rgba(0, 0, 0, 0.97) !important;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  flex-shrink: 0;
}

.modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.modal-nav { position: absolute; z-index: 10; }
.modal-nav-prev { left: 8px; }
.modal-nav-next { right: 8px; }

.modal-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px var(--ps-gutter);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  flex-shrink: 0;
}

.comment-input { flex: 1; }
.comment-input :deep(input) { color: white !important; }
.comment-input :deep(.v-field) { border-radius: 100px !important; }
.modal-select-btn { flex-shrink: 0; }

/* ─── Transitions ──────────────────────────────────────────────────────────── */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (max-width: 600px) {
  .selection-bar-row > * { width: 100%; }
  .submit-btn, .modal-select-btn { width: 100%; }
}
</style>
