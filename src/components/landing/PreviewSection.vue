<template>
  <section id="preview" class="preview">
    <div class="preview__container">
      <div v-scroll-reveal class="preview__header">
        <span class="section-label section-label--primary">Live Preview</span>
        <h2 class="section-title">See it in action</h2>
        <p class="section-subtitle">
          This is what your clients will experience — a beautiful, intuitive photo gallery.
        </p>
      </div>

      <!-- Interactive mock -->
      <div v-scroll-reveal class="preview__browser">
        <div class="preview__browser-bar">
          <div class="preview__browser-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="preview__browser-url">
            <v-icon size="14" color="#94a3b8">mdi-lock</v-icon>
            photoshare.app/gallery/sarah-wedding
          </div>
        </div>

        <div class="preview__app">
          <!-- Top bar -->
          <div class="preview__topbar">
            <div class="preview__topbar-left">
              <h3 class="preview__project-name">Sarah & James Wedding</h3>
              <span class="preview__photo-count">248 Photos</span>
            </div>
            <div class="preview__topbar-right">
              <div class="preview__tab" :class="{ 'preview__tab--active': activeTab === 'all' }" @click="activeTab = 'all'">
                All
              </div>
              <div class="preview__tab" :class="{ 'preview__tab--active': activeTab === 'selected' }" @click="activeTab = 'selected'">
                <v-icon size="14">mdi-heart</v-icon>
                Selected ({{ selectedPhotos.size }})
              </div>
            </div>
          </div>

          <!-- Gallery grid -->
          <div class="preview__gallery">
            <div
              v-for="photo in visiblePhotos"
              :key="photo.id"
              class="preview__photo"
              :class="{ 'preview__photo--selected': selectedPhotos.has(photo.id) }"
              @click="toggleSelect(photo.id)"
            >
              <div class="preview__photo-img" :style="{ background: photo.gradient }"></div>
              <div class="preview__photo-overlay">
                <div class="preview__photo-check" :class="{ 'preview__photo-check--active': selectedPhotos.has(photo.id) }">
                  <v-icon size="14" color="white">mdi-heart</v-icon>
                </div>
              </div>
              <transition name="photo-select">
                <div v-if="selectedPhotos.has(photo.id)" class="preview__photo-badge">
                  <v-icon size="12" color="white">mdi-check</v-icon>
                </div>
              </transition>
            </div>
          </div>

          <!-- Bottom bar -->
          <div class="preview__bottombar">
            <span class="preview__selection-info">
              {{ selectedPhotos.size }} photos selected
            </span>
            <button class="preview__submit-btn" :disabled="selectedPhotos.size === 0">
              Submit Selection
              <v-icon size="16">mdi-arrow-right</v-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('all')
const selectedPhotos = ref(new Set([2, 5, 8]))

const photos = [
  { id: 1, gradient: 'linear-gradient(135deg, #c7d2fe, #e0e7ff)' },
  { id: 2, gradient: 'linear-gradient(135deg, #fbcfe8, #fce7f3)' },
  { id: 3, gradient: 'linear-gradient(135deg, #a7f3d0, #d1fae5)' },
  { id: 4, gradient: 'linear-gradient(135deg, #fde68a, #fef3c7)' },
  { id: 5, gradient: 'linear-gradient(135deg, #bae6fd, #e0f2fe)' },
  { id: 6, gradient: 'linear-gradient(135deg, #fecdd3, #ffe4e6)' },
  { id: 7, gradient: 'linear-gradient(135deg, #ddd6fe, #ede9fe)' },
  { id: 8, gradient: 'linear-gradient(135deg, #99f6e4, #ccfbf1)' },
  { id: 9, gradient: 'linear-gradient(135deg, #fed7aa, #ffedd5)' },
  { id: 10, gradient: 'linear-gradient(135deg, #c4b5fd, #e9d5ff)' },
  { id: 11, gradient: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)' },
  { id: 12, gradient: 'linear-gradient(135deg, #6ee7b7, #a7f3d0)' },
]

const visiblePhotos = computed(() => {
  if (activeTab.value === 'selected') {
    return photos.filter(p => selectedPhotos.value.has(p.id))
  }
  return photos
})

function toggleSelect(id) {
  const s = new Set(selectedPhotos.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selectedPhotos.value = s
}
</script>

<style scoped lang="scss">
.preview {
  padding: 100px 24px;
  background: white;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.preview__container {
  max-width: 1000px;
  margin: 0 auto;
}

.preview__header {
  text-align: center;
  margin-bottom: 48px;
}

.preview__browser {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  background: white;
}

.preview__browser-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.preview__browser-dots {
  display: flex;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &:first-child { background: #fca5a5; }
    &:nth-child(2) { background: #fde68a; }
    &:last-child { background: #86efac; }
  }
}

.preview__browser-url {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #94a3b8;
  border: 1px solid #f1f5f9;
}

.preview__app {
  display: flex;
  flex-direction: column;
}

.preview__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 12px;
}

.preview__topbar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.preview__project-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.preview__photo-count {
  font-size: 12px;
  color: #94a3b8;
}

.preview__topbar-right {
  display: flex;
  gap: 4px;
}

.preview__tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &--active {
    background: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    font-weight: 600;
  }

  &:hover:not(&--active) {
    background: #f8fafc;
  }
}

.preview__gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 12px;
  min-height: 200px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.preview__photo {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.03);
    z-index: 1;

    .preview__photo-overlay {
      opacity: 1;
    }
  }

  &--selected {
    box-shadow: 0 0 0 2px #7c3aed;
  }
}

.preview__photo-img {
  width: 100%;
  height: 100%;
}

.preview__photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview__photo-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: all 0.2s;

  &--active {
    background: #7c3aed;
    transform: scale(1.1);
  }
}

.preview__photo-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview__bottombar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
}

.preview__selection-info {
  font-size: 13px;
  color: #64748b;
}

.preview__submit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #6d28d9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.photo-select-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.photo-select-leave-active {
  transition: all 0.2s ease;
}

.photo-select-enter-from,
.photo-select-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
