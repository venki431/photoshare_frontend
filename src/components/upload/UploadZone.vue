<template>
  <div
    class="upload-zone"
    :class="{ 'upload-zone--active': drag }"
    @dragover.prevent="drag = true"
    @dragleave.prevent="drag = false"
    @drop.prevent="handleDrop"
    @click="fileInput?.click()"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="d-none"
      @change="handleSelect"
    />

    <!-- Animated border -->
    <div class="upload-zone__border" />

    <!-- Background orb -->
    <div class="upload-zone__orb" />

    <div class="upload-zone__content">
      <!-- Icon -->
      <div class="upload-zone__icon" :class="{ 'upload-zone__icon--bounce': drag }">
        <v-icon size="36" color="white">mdi-cloud-upload-outline</v-icon>
      </div>

      <!-- Text -->
      <div class="upload-zone__text">
        <h3 class="upload-zone__title">
          {{ drag ? 'Drop your photos here' : 'Upload Your Event Photos' }}
        </h3>
        <p class="upload-zone__subtitle">
          Drag & drop images here, or <span class="upload-zone__link">browse files</span>
        </p>
      </div>

      <!-- Tips -->
      <div class="upload-zone__tips">
        <span class="tip">
          <v-icon size="14" color="primary">mdi-check-circle</v-icon>
          JPG, PNG, WebP
        </span>
        <span class="tip">
          <v-icon size="14" color="primary">mdi-check-circle</v-icon>
          Auto-compressed
        </span>
        <span class="tip">
          <v-icon size="14" color="primary">mdi-check-circle</v-icon>
          Up to 50MB each
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  files: [files: File[]]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const drag = ref(false)

function handleDrop(e: DragEvent): void {
  drag.value = false
  const files = [...(e.dataTransfer?.files ?? [])].filter(f => f.type.startsWith('image/'))
  if (files.length) emit('files', files)
}

function handleSelect(e: Event): void {
  const target = e.target as HTMLInputElement
  const files = [...(target.files ?? [])].filter(f => f.type.startsWith('image/'))
  if (files.length) emit('files', files)
  target.value = ''
}
</script>

<style scoped>
.upload-zone {
  position: relative;
  border-radius: var(--ps-radius-2xl);
  cursor: pointer;
  padding: clamp(32px, 5vw, 48px) 24px;
  overflow: hidden;
  background: white;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.upload-zone:hover {
  transform: translateY(-2px);
  box-shadow: var(--ps-shadow-lg);
}

/* Animated dashed border */
.upload-zone__border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px dashed rgba(79, 70, 229, 0.2);
  transition: border-color var(--ps-duration-normal);
  pointer-events: none;
}

.upload-zone:hover .upload-zone__border,
.upload-zone--active .upload-zone__border {
  border-color: rgba(79, 70, 229, 0.4);
  border-style: solid;
}

/* Background orb */
.upload-zone__orb {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.06) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: all var(--ps-duration-slow);
}

.upload-zone--active .upload-zone__orb {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
}

.upload-zone__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

/* Icon */
.upload-zone__icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.25);
  transition: transform var(--ps-duration-normal) var(--ps-ease-spring);
}

.upload-zone:hover .upload-zone__icon {
  transform: scale(1.05);
}

.upload-zone__icon--bounce {
  animation: upload-bounce 0.6s var(--ps-ease-spring);
}

@keyframes upload-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Text */
.upload-zone__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.upload-zone__title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.upload-zone__subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin: 0;
}

.upload-zone__link {
  color: var(--ps-primary);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: rgba(79, 70, 229, 0.3);
  text-underline-offset: 2px;
}

/* Tips */
.upload-zone__tips {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.tip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
}

@media (max-width: 600px) {
  .upload-zone__tips { flex-direction: column; gap: 8px; }
}
</style>
