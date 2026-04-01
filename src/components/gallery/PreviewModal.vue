<template>
  <v-dialog v-model="model" fullscreen transition="dialog-bottom-transition">
    <div class="preview-modal" @keydown.left="prev" @keydown.right="next" @keydown.escape="close" tabindex="0" ref="modalRef">
      <!-- Header -->
      <div class="preview-header">
        <button class="header-btn" @click="close">
          <v-icon size="20" color="white">mdi-close</v-icon>
        </button>

        <div class="header-center">
          <span class="header-filename">{{ image?.filename }}</span>
          <span v-if="images.length > 1" class="header-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </span>
        </div>

        <button class="header-btn header-btn--danger" @click="handleDelete">
          <v-icon size="20" color="white">mdi-delete-outline</v-icon>
        </button>
      </div>

      <!-- Image viewport -->
      <div class="preview-viewport">
        <button v-if="images.length > 1" class="nav-btn nav-btn--prev" @click="prev">
          <v-icon size="28" color="white">mdi-chevron-left</v-icon>
        </button>

        <div class="preview-image-wrapper">
          <img
            v-if="image"
            :src="image.url"
            class="preview-image"
            :alt="image.filename"
          />
        </div>

        <button v-if="images.length > 1" class="nav-btn nav-btn--next" @click="next">
          <v-icon size="28" color="white">mdi-chevron-right</v-icon>
        </button>
      </div>

      <!-- Thumbnail strip -->
      <div v-if="images.length > 1" class="thumbnail-strip">
        <button
          v-for="(img, idx) in images.slice(thumbStart, thumbEnd)"
          :key="img.id"
          class="thumb-item"
          :class="{ 'thumb-item--active': img.id === image?.id }"
          @click="navigateTo(thumbStart + idx)"
        >
          <v-img :src="img.thumbUrl" cover class="thumb-img" />
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

interface PreviewImage {
  id: string
  url: string
  thumbUrl: string
  filename: string
}

const props = withDefaults(defineProps<{
  modelValue?: boolean
  images?: PreviewImage[]
  current?: PreviewImage | null
}>(), {
  modelValue: false,
  images: () => [],
  current: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:current': [image: PreviewImage]
  delete: [id: string]
}>()

const modalRef = ref<HTMLDivElement | null>(null)

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

watch(model, (v) => {
  if (v) nextTick(() => modalRef.value?.focus())
})

const currentIndex = computed(() => {
  if (!props.current || !props.images.length) return -1
  return props.images.findIndex(i => i.id === props.current?.id)
})

const image = computed<PreviewImage | null>(() => {
  const idx = currentIndex.value
  if (idx < 0 || idx >= props.images.length) return null
  return props.images[idx]
})

const thumbStart = computed(() => Math.max(0, currentIndex.value - 4))
const thumbEnd = computed(() => Math.min(props.images.length, thumbStart.value + 9))

function close(): void { model.value = false }

function navigateTo(index: number): void {
  if (!props.images.length) return
  emit('update:current', props.images[index])
}

function next(): void {
  if (props.images.length <= 1) return
  navigateTo((currentIndex.value + 1) % props.images.length)
}

function prev(): void {
  if (props.images.length <= 1) return
  navigateTo((currentIndex.value - 1 + props.images.length) % props.images.length)
}

function handleDelete(): void {
  if (!image.value) return
  const id = image.value.id
  const idx = currentIndex.value
  const len = props.images.length

  if (len <= 1) {
    model.value = false
  } else {
    const nextIdx = idx >= len - 1 ? idx - 1 : idx
    const nextImage = props.images[nextIdx === idx ? idx + 1 : nextIdx]
    if (nextImage) emit('update:current', nextImage)
  }
  emit('delete', id)
}
</script>

<style scoped>
.preview-modal {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.96);
  display: flex;
  flex-direction: column;
  outline: none;
  animation: ps-fade-in 0.2s ease;
}

/* ── Header ───────────────────────────────────────────────────────────── */

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-shrink: 0;
}

.header-btn {
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

.header-btn:hover { background: rgba(255, 255, 255, 0.15); }
.header-btn--danger:hover { background: rgba(239, 68, 68, 0.4); }

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.header-filename {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.header-counter {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Viewport ─────────────────────────────────────────────────────────── */

.preview-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.preview-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 85vh;
  max-width: 90vw;
  overflow: hidden;
}

.preview-image {
  max-height: 85vh;
  max-width: 90vw;
  object-fit: contain;
  border-radius: var(--ps-radius-sm);
}

/* ── Nav buttons ──────────────────────────────────────────────────────── */

.nav-btn {
  position: absolute;
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ps-duration-fast);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.nav-btn--prev { left: 16px; }
.nav-btn--next { right: 16px; }

/* ── Thumbnail strip ──────────────────────────────────────────────────── */

.thumbnail-strip {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  flex-shrink: 0;
}

.thumb-item {
  width: 48px;
  height: 48px;
  border-radius: var(--ps-radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  opacity: 0.5;
  transition: all var(--ps-duration-fast);
  flex-shrink: 0;
}

.thumb-item:hover {
  opacity: 0.8;
}

.thumb-item--active {
  opacity: 1;
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
}

.thumb-img {
  width: 100%;
  height: 100%;
}

@media (max-width: 600px) {
  .nav-btn { display: none; }
  .thumbnail-strip { padding: 8px 12px; }
  .thumb-item { width: 40px; height: 40px; }
}
</style>
