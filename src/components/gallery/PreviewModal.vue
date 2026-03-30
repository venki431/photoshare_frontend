<template>
  <v-dialog v-model="model" fullscreen>
    <v-card class="bg-black text-white">
      <!-- Header -->
      <v-toolbar flat color="transparent">
        <v-btn icon="mdi-close" @click="close" />
        <v-toolbar-title>{{ image?.filename }}</v-toolbar-title>
        <v-spacer />
        <span v-if="images.length > 1" class="text-caption mr-4">
          {{ currentIndex + 1 }} / {{ images.length }}
        </span>
        <v-btn
          icon="mdi-delete"
          variant="text"
          @click="handleDelete"
        />
      </v-toolbar>

      <!-- Image -->
      <div class="preview-body" @keydown.left="prev" @keydown.right="next" tabindex="0">
        <v-btn
          v-if="images.length > 1"
          icon="mdi-chevron-left"
          class="nav prev"
          @click="prev"
        />

        <v-img
          v-if="image"
          :src="image.url"
          max-height="80vh"
          contain
        />

        <v-btn
          v-if="images.length > 1"
          icon="mdi-chevron-right"
          class="nav next"
          @click="next"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  images: {
    type: Array,
    default: () => []
  },
  current: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'update:current', 'delete'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const currentIndex = computed(() => {
  if (!props.current || !props.images.length) return -1
  return props.images.findIndex(i => i.id === props.current.id)
})

const image = computed(() => {
  const idx = currentIndex.value
  if (idx < 0 || idx >= props.images.length) return null
  return props.images[idx]
})

function close() {
  model.value = false
}

function navigateTo(index) {
  if (!props.images.length) return
  // Emit the new image to the parent — never mutate props
  emit('update:current', props.images[index])
}

function next() {
  if (props.images.length <= 1) return
  const nextIndex = (currentIndex.value + 1) % props.images.length
  navigateTo(nextIndex)
}

function prev() {
  if (props.images.length <= 1) return
  const prevIndex = (currentIndex.value - 1 + props.images.length) % props.images.length
  navigateTo(prevIndex)
}

function handleDelete() {
  if (!image.value) return
  const id = image.value.id
  const idx = currentIndex.value
  const len = props.images.length

  // Navigate to the next image before deleting (or close if last)
  if (len <= 1) {
    model.value = false
  } else {
    // Navigate to next (or prev if deleting the last item)
    const nextIdx = idx >= len - 1 ? idx - 1 : idx
    // After parent removes the image, the array shifts — so point to the item that will be at nextIdx
    const nextImage = props.images[nextIdx === idx ? idx + 1 : nextIdx]
    if (nextImage) emit('update:current', nextImage)
  }

  emit('delete', id)
}
</script>

<style scoped>
.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 60vh;
  outline: none;
}

.nav {
  position: absolute;
  z-index: 10;
}

.prev { left: 10px; }
.next { right: 10px; }
</style>
