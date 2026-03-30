<template>
  <div v-if="images.length" class="image-grid-section">
    <!-- Toolbar -->
    <div class="grid-toolbar">
      <div class="toolbar-left">
        <span class="image-count">
          <v-icon size="16" class="count-icon">mdi-image-multiple</v-icon>
          {{ images.length }} image{{ images.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <div class="toolbar-right">
        <!-- Select mode toggle -->
        <button
          class="toolbar-btn"
          :class="{ 'toolbar-btn--active': selectMode }"
          @click="toggleSelectMode"
        >
          <v-icon size="16">{{ selectMode ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
          {{ selectMode ? `${selectedIds.size} selected` : 'Select' }}
        </button>

        <!-- Select All -->
        <button v-if="selectMode" class="toolbar-btn" @click="toggleSelectAll">
          {{ selectedIds.size === images.length ? 'Deselect All' : 'Select All' }}
        </button>

        <!-- Bulk Delete -->
        <button
          v-if="selectMode && selectedIds.size > 0"
          class="toolbar-btn toolbar-btn--danger"
          @click="$emit('bulk-delete', [...selectedIds])"
        >
          <v-icon size="16">mdi-delete-outline</v-icon>
          Delete ({{ selectedIds.size }})
        </button>

        <!-- Primary Action -->
        <v-btn
          v-if="uploadPhase === 'ready'"
          color="primary"
          size="small"
          class="text-none ps-btn-glow"
          elevation="0"
          rounded="lg"
          prepend-icon="mdi-upload"
          @click="$emit('start-upload')"
        >
          Start Upload
        </v-btn>

        <v-btn
          v-else-if="uploadPhase === 'uploading'"
          color="primary"
          variant="tonal"
          size="small"
          class="text-none"
          rounded="lg"
          disabled
        >
          <v-icon start class="mdi-spin">mdi-loading</v-icon>
          Uploading...
        </v-btn>

        <v-btn
          v-else-if="uploadPhase === 'done' || (uploadPhase === 'idle' && images.length > 0)"
          color="primary"
          size="small"
          class="text-none ps-btn-glow"
          elevation="0"
          rounded="lg"
          prepend-icon="mdi-share-variant-outline"
          @click="$emit('share')"
        >
          Share Gallery
        </v-btn>
      </div>
    </div>

    <!-- Image Grid -->
    <div class="image-grid ps-stagger">
      <div
        v-for="img in images"
        :key="img.id"
        class="image-card"
        :class="{ 'image-card--selected': isSelected(img.id) }"
        @click="handleCardClick(img)"
      >
        <!-- Thumbnail -->
        <v-img :src="img.thumbUrl" aspect-ratio="1" cover class="image-card__img" />

        <!-- Selection checkbox -->
        <div v-if="selectMode" class="image-card__checkbox" @click.stop="toggleSelection(img.id)">
          <div class="checkbox-circle" :class="{ 'checkbox-circle--checked': isSelected(img.id) }">
            <v-icon v-if="isSelected(img.id)" size="14" color="white">mdi-check</v-icon>
          </div>
        </div>

        <!-- Hover overlay (only when NOT in select mode) -->
        <div v-if="!selectMode" class="image-card__overlay">
          <div class="overlay-top">
            <button class="overlay-btn" @click.stop="$emit('preview', img)">
              <v-icon size="18" color="white">mdi-eye-outline</v-icon>
            </button>
            <button class="overlay-btn overlay-btn--danger" @click.stop="$emit('delete', img.id)">
              <v-icon size="18" color="white">mdi-delete-outline</v-icon>
            </button>
          </div>
          <div class="overlay-bottom">
            <span class="overlay-filename">{{ img.filename }}</span>
          </div>
        </div>

        <!-- Selection glow -->
        <div v-if="isSelected(img.id)" class="image-card__glow" />
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <EmptyState
    v-else
    icon="mdi-image-multiple-outline"
    title="No images yet"
    description="Upload some photos to get started. Drag & drop or click the upload zone above."
    :tips="['Supports JPG, PNG, and WebP', 'Images are auto-compressed for optimal quality', 'Share your gallery with clients via a link']"
    compact
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  uploadPhase: { type: String, default: 'idle' }
})

const emit = defineEmits(['preview', 'delete', 'bulk-delete', 'start-upload', 'share'])

const selectMode = ref(false)
const selectedIds = ref(new Set())

function isSelected(id) { return selectedIds.value.has(id) }

function toggleSelection(id) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function toggleSelectAll() {
  if (selectedIds.value.size === props.images.length) selectedIds.value = new Set()
  else selectedIds.value = new Set(props.images.map(i => i.id))
}

function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) selectedIds.value = new Set()
}

function handleCardClick(img) {
  if (selectMode.value) toggleSelection(img.id)
  else emit('preview', img)
}

watch(() => props.images, (imgs) => {
  if (!selectedIds.value.size) return
  const validIds = new Set(imgs.map(i => i.id))
  const cleaned = new Set([...selectedIds.value].filter(id => validIds.has(id)))
  if (cleaned.size !== selectedIds.value.size) selectedIds.value = cleaned
  if (!imgs.length) selectMode.value = false
})
</script>

<style scoped>
.image-grid-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Toolbar ──────────────────────────────────────────────────────────── */

.grid-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.image-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.count-icon { opacity: 0.6; }

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--ps-radius-md);
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all var(--ps-duration-fast);
  font-family: inherit;
  white-space: nowrap;
}

.toolbar-btn:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.toolbar-btn--active {
  background: rgba(79, 70, 229, 0.06);
  border-color: rgba(79, 70, 229, 0.2);
  color: var(--ps-primary);
  font-weight: 600;
}

.toolbar-btn--danger {
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.toolbar-btn--danger:hover {
  background: #FEF2F2;
  border-color: rgba(239, 68, 68, 0.3);
}

/* ── Grid ─────────────────────────────────────────────────────────────── */

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.image-card {
  position: relative;
  border-radius: var(--ps-radius-lg);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  background: #F1F5F9;
  transition: transform var(--ps-duration-fast) var(--ps-ease-smooth),
              box-shadow var(--ps-duration-fast) var(--ps-ease-smooth);
}

.image-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.image-card__img {
  border-radius: var(--ps-radius-lg);
  transition: transform 0.4s var(--ps-ease-smooth);
}

.image-card:hover .image-card__img {
  transform: scale(1.04);
}

/* ── Checkbox ─────────────────────────────────────────────────────────── */

.image-card__checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 3;
}

.checkbox-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ps-duration-fast);
}

.checkbox-circle--checked {
  background: var(--ps-primary);
  border-color: var(--ps-primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
}

/* ── Hover overlay ────────────────────────────────────────────────────── */

.image-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.6) 100%);
  opacity: 0;
  transition: opacity var(--ps-duration-fast);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  z-index: 2;
}

.image-card:hover .image-card__overlay {
  opacity: 1;
  pointer-events: auto;
}

.overlay-top {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  gap: 4px;
}

.overlay-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--ps-duration-fast);
}

.overlay-btn:hover { background: rgba(0, 0, 0, 0.5); }
.overlay-btn--danger:hover { background: rgba(239, 68, 68, 0.7); }

.overlay-bottom {
  padding: 8px 12px;
}

.overlay-filename {
  font-size: 12px;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
}

/* ── Selected state ───────────────────────────────────────────────────── */

.image-card--selected {
  outline: 3px solid var(--ps-primary);
  outline-offset: -3px;
  border-radius: var(--ps-radius-lg);
}

.image-card__glow {
  position: absolute;
  inset: 0;
  background: rgba(79, 70, 229, 0.08);
  pointer-events: none;
  z-index: 1;
}

@media (max-width: 600px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }
}
</style>
