<template>
  <div v-if="images.length" class="mt-6">
    <!-- Toolbar -->
    <div class="d-flex align-center ga-2 mb-4">
      <span class="text-subtitle-1 font-weight-medium">
        {{ images.length }} image{{ images.length !== 1 ? 's' : '' }}
      </span>

      <v-spacer />

      <!-- Select mode toggle -->
      <v-btn
        :variant="selectMode ? 'flat' : 'outlined'"
        :color="selectMode ? 'primary' : undefined"
        size="small"
        :prepend-icon="selectMode ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
        @click="toggleSelectMode"
      >
        {{ selectMode ? `${selectedIds.size} selected` : 'Select' }}
      </v-btn>

      <!-- Select All (only in select mode) -->
      <v-btn
        v-if="selectMode"
        variant="text"
        size="small"
        @click="toggleSelectAll"
      >
        {{ selectedIds.size === images.length ? 'Deselect All' : 'Select All' }}
      </v-btn>

      <!-- Bulk Delete -->
      <v-btn
        v-if="selectMode && selectedIds.size > 0"
        color="error"
        variant="flat"
        size="small"
        prepend-icon="mdi-delete"
        @click="$emit('bulk-delete', [...selectedIds])"
      >
        Delete ({{ selectedIds.size }})
      </v-btn>

      <!--
        PRIMARY ACTION BUTTON:
        - "ready" phase   → "Start Upload" (user verifies previews, then clicks)
        - "uploading"     → disabled spinner
        - "done" / "idle" with images → "Share"
      -->
      <v-btn
        v-if="uploadPhase === 'ready'"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-upload"
        @click="$emit('start-upload')"
      >
        Start Upload
      </v-btn>

      <v-btn
        v-else-if="uploadPhase === 'uploading'"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-loading mdi-spin"
        disabled
      >
        Uploading...
      </v-btn>

      <v-btn
        v-else-if="uploadPhase === 'done' || (uploadPhase === 'idle' && images.length > 0)"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-share-variant"
        @click="$emit('share')"
      >
        Share
      </v-btn>
    </div>

    <!-- Grid -->
    <div class="image-grid">
      <div
        v-for="img in images"
        :key="img.id"
        class="image-card"
        :class="{ 'selected': isSelected(img.id) }"
        @click="handleCardClick(img)"
      >
        <!-- Thumbnail -->
        <v-img :src="img.thumbUrl" aspect-ratio="1" cover class="image-thumb" />

        <!-- Selection checkbox (always visible in select mode) -->
        <div v-if="selectMode" class="select-checkbox">
          <v-checkbox-btn
            :model-value="isSelected(img.id)"
            color="green"
            density="compact"
            @click.stop="toggleSelection(img.id)"
          />
        </div>

        <!-- Hover overlay (only when NOT in select mode) -->
        <div v-if="!selectMode" class="hover-overlay">
          <div class="overlay-actions">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('preview', img)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="white"
              @click.stop="$emit('delete', img.id)"
            />
          </div>

          <div class="overlay-filename">
            <span class="filename">{{ img.filename }}</span>
          </div>
        </div>

        <!-- Selection ring indicator -->
        <div v-if="isSelected(img.id)" class="selection-ring" />
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div v-else class="text-center pa-10 text-medium-emphasis">
    <v-icon size="64" class="mb-4">mdi-image-multiple-outline</v-icon>
    <p>No images yet. Upload some files to get started.</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  uploadPhase: {
    type: String,
    default: 'idle'
  }
})

const emit = defineEmits(['preview', 'delete', 'bulk-delete', 'start-upload', 'share'])

// ── Selection State ──────────────────────────────────
const selectMode = ref(false)
const selectedIds = ref(new Set())

function isSelected(id) {
  return selectedIds.value.has(id)
}

function toggleSelection(id) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

function toggleSelectAll() {
  if (selectedIds.value.size === props.images.length) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(props.images.map(i => i.id))
  }
}

function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) {
    selectedIds.value = new Set()
  }
}

function handleCardClick(img) {
  if (selectMode.value) {
    toggleSelection(img.id)
  } else {
    emit('preview', img)
  }
}

// Clean up stale selections when images change
watch(() => props.images, (imgs) => {
  if (!selectedIds.value.size) return
  const validIds = new Set(imgs.map(i => i.id))
  const cleaned = new Set([...selectedIds.value].filter(id => validIds.has(id)))
  if (cleaned.size !== selectedIds.value.size) {
    selectedIds.value = cleaned
  }
  if (!imgs.length) {
    selectMode.value = false
  }
})
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.image-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.image-thumb {
  border-radius: 12px;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.0) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.image-card:hover .hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.overlay-actions {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
}

.overlay-filename {
  padding: 6px 10px;
}

.filename {
  font-size: 12px;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.select-checkbox {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 2;
}

.image-card.selected {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: -3px;
}

.selection-ring {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.08);
  pointer-events: none;
}
</style>
