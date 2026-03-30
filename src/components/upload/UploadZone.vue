<template>
  <div
    class="upload-zone"
    :class="{ 'drag-over': drag }"
    @dragover.prevent="drag = true"
    @dragleave.prevent="drag = false"
    @drop.prevent="handleDrop"
    @click="fileInput.click()"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="d-none"
      @change="handleSelect"
    />

    <div class="text-center pa-6">
      <v-icon size="40">mdi-cloud-upload</v-icon>
      <p class="mt-2">Drag & Drop or Click to Upload</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['files'])

const fileInput = ref(null)
const drag = ref(false)

function handleDrop(e) {
  drag.value = false
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'))
  if (files.length) emit('files', files)
}

function handleSelect(e) {
  const files = [...e.target.files].filter(f => f.type.startsWith('image/'))
  if (files.length) emit('files', files)
  // Reset input so the same file set can be re-selected
  e.target.value = ''
}
</script>

<style scoped>
.upload-zone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.04);
}
</style>
