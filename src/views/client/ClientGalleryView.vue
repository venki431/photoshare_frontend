<template>
  <div class="client-gallery">
    <!-- Header -->
    <header class="gallery-header ps-glass">
      <div class="header-content">
        <div class="d-flex align-center ga-2">
          <div class="logo-mark-sm">P</div>
          <span class="brand-name">PhotoShare</span>
        </div>
        <v-chip v-if="project" size="small" variant="tonal" color="primary" class="event-chip">
          <v-icon start size="12">mdi-tag</v-icon>
          {{ project.eventType }}
        </v-chip>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="gallery-hero" v-if="project">
      <div class="hero-orbs">
        <div class="hero-orb hero-orb--1" />
        <div class="hero-orb hero-orb--2" />
      </div>
      <div class="hero-inner ps-animate-in">
        <div class="hero-badge">
          <v-icon size="14">mdi-camera-outline</v-icon>
          Photo Gallery
        </div>
        <h1 class="hero-title">{{ project.name }}</h1>
        <p class="hero-subtitle">
          {{ project.imageCount }} photos &middot; Select your favorites
        </p>
        <div class="hero-instructions">
          <div class="instruction">
            <div class="instruction-num">1</div>
            <span>Browse photos</span>
          </div>
          <v-icon size="16" color="grey-lighten-1">mdi-chevron-right</v-icon>
          <div class="instruction">
            <div class="instruction-num">2</div>
            <span>Tap hearts to select</span>
          </div>
          <v-icon size="16" color="grey-lighten-1">mdi-chevron-right</v-icon>
          <div class="instruction">
            <div class="instruction-num">3</div>
            <span>Review & submit</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Content -->
    <div class="gallery-content" v-if="project">
      <!-- Toolbar -->
      <div class="gallery-toolbar ps-animate-in ps-animate-in-delay-1">
        <div class="filter-pills">
          <button
            class="filter-pill"
            :class="{ 'filter-pill--active': filter === 'all' }"
            @click="filter = 'all'"
          >
            All Photos
            <span class="pill-count">{{ project.images?.length || 0 }}</span>
          </button>
          <button
            class="filter-pill"
            :class="{ 'filter-pill--active': filter === 'selected' }"
            @click="filter = 'selected'"
          >
            <v-icon size="14" color="pink">mdi-heart</v-icon>
            Favorites
            <span class="pill-count">{{ selectedCount }}</span>
          </button>
        </div>
      </div>

      <!-- Masonry Grid -->
      <div class="masonry-grid ps-stagger">
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
              <div class="shimmer-placeholder" />
            </template>
          </v-img>

          <!-- Selection Overlay -->
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

          <!-- Selected Badge -->
          <div v-if="image.selected" class="selected-badge">
            <v-icon size="10" color="white">mdi-check</v-icon>
          </div>
        </div>
      </div>

      <!-- Empty selected filter -->
      <div v-if="filter === 'selected' && selectedCount === 0" class="empty-favorites ps-animate-in">
        <div class="empty-fav-icon">
          <v-icon size="40" color="white">mdi-heart-outline</v-icon>
        </div>
        <h3 class="empty-fav-title">No favorites yet</h3>
        <p class="empty-fav-desc">Tap the heart icon on photos you love to add them here.</p>
        <v-btn variant="outlined" color="primary" size="small" class="text-none" @click="filter = 'all'">
          Browse All Photos
        </v-btn>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="gallery-loading">
      <div class="loading-hero">
        <div class="ps-shimmer" style="width: 120px; height: 20px; margin: 0 auto 12px" />
        <div class="ps-shimmer" style="width: 280px; height: 32px; margin: 0 auto 8px" />
        <div class="ps-shimmer" style="width: 200px; height: 16px; margin: 0 auto" />
      </div>
      <div class="masonry-grid" style="padding: 0 var(--ps-gutter)">
        <div v-for="n in 12" :key="n" class="ps-shimmer" :style="{ height: `${n % 3 === 0 ? 300 : 200}px`, borderRadius: '12px' }" />
      </div>
    </div>

    <!-- Floating Selection Bar -->
    <transition name="slide-up">
      <div v-if="selectedCount > 0" class="selection-bar">
        <div class="selection-bar-inner ps-glass">
          <div class="selection-bar-content">
            <div class="selection-info">
              <div class="selection-hearts">
                <v-icon size="18" color="pink">mdi-heart</v-icon>
              </div>
              <span class="selection-text">
                <strong>{{ selectedCount }}</strong>
                <span class="d-none d-sm-inline"> photos selected</span>
              </span>
            </div>
            <v-btn
              color="primary"
              size="large"
              class="text-none ps-btn-glow review-btn"
              :to="`/gallery/${shareId}/summary`"
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

    <!-- Fullscreen Image Modal -->
    <v-dialog v-model="modalOpen" fullscreen transition="dialog-bottom-transition">
      <div class="image-modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <button class="modal-btn" @click="modalOpen = false">
            <v-icon size="20" color="white">mdi-close</v-icon>
          </button>
          <span class="modal-counter">
            {{ modalIndex + 1 }} / {{ displayedImages.length }}
          </span>
          <button
            class="modal-btn"
            :class="{ 'modal-btn--active': modalImage?.selected }"
            @click="toggleSelect(modalImage?.id)"
          >
            <v-icon
              :color="modalImage?.selected ? 'pink' : 'white'"
              size="20"
            >
              {{ modalImage?.selected ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
          </button>
        </div>

        <!-- Image Display -->
        <div class="modal-body" @touchstart="onTouchStart" @touchend="onTouchEnd">
          <button class="modal-nav modal-nav-prev d-none d-sm-flex" @click="prevImage">
            <v-icon size="28" color="white">mdi-chevron-left</v-icon>
          </button>
          <v-img
            v-if="modalImage"
            :src="modalImage.url"
            contain
            max-height="80vh"
            max-width="95vw"
            class="mx-auto"
          />
          <button class="modal-nav modal-nav-next d-none d-sm-flex" @click="nextImage">
            <v-icon size="28" color="white">mdi-chevron-right</v-icon>
          </button>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="comment-wrapper">
            <v-text-field
              v-model="commentText"
              placeholder="Add a comment about this photo..."
              variant="solo-filled"
              bg-color="rgba(255,255,255,0.08)"
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
          </div>
          <v-btn
            :color="modalImage?.selected ? 'pink' : 'white'"
            :variant="modalImage?.selected ? 'flat' : 'outlined'"
            class="text-none modal-select-btn"
            rounded="lg"
            @click="toggleSelect(modalImage?.id)"
            :prepend-icon="modalImage?.selected ? 'mdi-heart' : 'mdi-heart-outline'"
          >
            {{ modalImage?.selected ? 'Selected' : 'Select' }}
          </v-btn>
        </div>
      </div>
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
  if (project.value) projectStore.toggleImageSelection(project.value.shareId, imageId)
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

function onTouchStart(e) { touchStartX = e.changedTouches[0].screenX }
function onTouchEnd(e) {
  const diff = e.changedTouches[0].screenX - touchStartX
  if (Math.abs(diff) > 60) diff > 0 ? prevImage() : nextImage()
}
</script>

<style scoped>
.client-gallery {
  min-height: 100vh;
  background: var(--ps-surface-dim);
  padding-bottom: 120px;
}

/* ─── Header ──────────────────────────────────────────────────────────── */

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

.event-chip {
  font-weight: 600;
  text-transform: capitalize;
}

/* ─── Hero ────────────────────────────────────────────────────────────── */

.gallery-hero {
  position: relative;
  padding: clamp(40px, 7vw, 64px) var(--ps-gutter) clamp(28px, 4vw, 40px);
  overflow: hidden;
}

.hero-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.hero-orb--1 {
  width: 300px;
  height: 300px;
  background: rgba(79, 70, 229, 0.06);
  top: -80px;
  right: 10%;
  animation: ps-float 15s ease-in-out infinite;
}

.hero-orb--2 {
  width: 200px;
  height: 200px;
  background: rgba(236, 72, 153, 0.05);
  bottom: -60px;
  left: 15%;
  animation: ps-float 12s ease-in-out infinite 3s;
}

.hero-inner {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.15;
}

.hero-subtitle {
  font-size: 16px;
  color: #64748B;
  margin: 0;
}

.hero-instructions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.instruction {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748B;
  font-weight: 500;
}

.instruction-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ps-gradient-brand);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
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

.gallery-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-pills {
  display: flex;
  gap: 8px;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--ps-radius-full);
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all var(--ps-duration-fast);
  font-family: inherit;
}

.filter-pill:hover { border-color: #CBD5E1; }

.filter-pill--active {
  background: var(--ps-primary);
  border-color: var(--ps-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.pill-count {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: var(--ps-radius-full);
  background: rgba(0, 0, 0, 0.06);
}

.filter-pill--active .pill-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.gallery-loading {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px var(--ps-gutter);
}

.loading-hero {
  padding: 40px 0;
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
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: ps-shimmer 1.5s ease-in-out infinite;
}

/* ─── Overlay ─────────────────────────────────────────────────────────── */

.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.masonry-item:hover .item-overlay,
.masonry-item:active .item-overlay,
.item-selected { opacity: 1; }

.is-selected { box-shadow: inset 0 0 0 3px #EC4899; }

.select-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.25);
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

.select-heart:active { transform: scale(0.9); }

.selected-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #EC4899;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(236, 72, 153, 0.4);
}

/* ─── Empty Favorites ─────────────────────────────────────────────────── */

.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 12px;
}

.empty-fav-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EC4899, #F472B6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.empty-fav-title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; }
.empty-fav-desc { font-size: 14px; color: #94A3B8; margin: 0; max-width: 300px; }

/* ─── Selection Bar ───────────────────────────────────────────────────── */

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
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-radius: var(--ps-radius-xl);
  padding: 12px 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.selection-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selection-text {
  font-size: 14px;
  color: #475569;
}

.review-btn {
  border-radius: 14px !important;
}

/* ─── Modal ───────────────────────────────────────────────────────────── */

.image-modal {
  background: rgba(0, 0, 0, 0.97);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-shrink: 0;
}

.modal-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--ps-radius-md);
  border: none;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--ps-duration-fast);
}

.modal-btn:hover { background: rgba(255, 255, 255, 0.15); }
.modal-btn--active { background: rgba(236, 72, 153, 0.2); }

.modal-counter {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.modal-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.modal-nav {
  position: absolute;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ps-duration-fast);
}

.modal-nav:hover { background: rgba(255, 255, 255, 0.15); }
.modal-nav-prev { left: 12px; }
.modal-nav-next { right: 12px; }

.modal-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px var(--ps-gutter);
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  flex-shrink: 0;
}

.comment-wrapper { flex: 1; }
.comment-input :deep(input) { color: white !important; }
.comment-input :deep(.v-field) { border-radius: 100px !important; }
.modal-select-btn { flex-shrink: 0; }

/* ─── Transitions ─────────────────────────────────────────────────────── */

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.35s var(--ps-ease-smooth);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (max-width: 600px) {
  .selection-bar-content { flex-wrap: wrap; }
  .review-btn, .modal-select-btn { width: 100%; }
  .hero-instructions { display: none; }
}
</style>
