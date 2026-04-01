<template>
  <div v-if="showProgress" class="upload-progress ps-animate-in">
    <div class="progress-card">
      <!-- Status icon -->
      <div class="progress-icon" :class="`progress-icon--${phase}`">
        <v-icon size="22" color="white">
          {{ phase === 'compressing' ? 'mdi-archive-arrow-down' : 'mdi-cloud-upload' }}
        </v-icon>
        <div v-if="phase !== 'done'" class="progress-icon__ring" />
      </div>

      <!-- Info -->
      <div class="progress-info">
        <div class="progress-label">
          <span class="progress-title">{{ title }}</span>
          <span class="progress-count">
            {{ currentCount }} / {{ totalFiles }}
          </span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div
              class="progress-bar__fill"
              :class="`progress-bar__fill--${phase}`"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <span class="progress-percent">{{ progress }}%</span>
        </div>
        <div v-if="failedCount > 0" class="progress-error">
          <v-icon size="14" color="error">mdi-alert-circle</v-icon>
          {{ failedCount }} file{{ failedCount > 1 ? 's' : '' }} failed
          <button class="retry-btn" @click="emit('retry')">
            <v-icon size="13">mdi-refresh</v-icon>
            Retry
          </button>
        </div>
      </div>

      <!-- Cancel button (available during compression AND upload) -->
      <button
        v-if="phase === 'compressing' || phase === 'uploading'"
        class="progress-cancel"
        @click="phase === 'uploading' ? emit('cancel') : emit('reset')"
        :title="phase === 'uploading' ? 'Cancel uploads' : 'Cancel compression'"
      >
        <v-icon size="18">mdi-close</v-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toValue, type Ref, type ComputedRef } from 'vue'
import type { UploadPhase } from '@/types'

interface UploadManagerExposed {
  phase: Ref<UploadPhase> | ComputedRef<UploadPhase>
  totalFiles: Ref<number>
  uploadedCount: Ref<number>
  compressedCount: Ref<number>
  failedCount: Ref<number>
  compressionProgress: ComputedRef<number>
  uploadProgress: ComputedRef<number>
}

const props = defineProps<{
  manager: UploadManagerExposed
}>()

const emit = defineEmits<{
  reset: []
  cancel: []
  retry: []
}>()

const phase = computed(() => toValue(props.manager.phase))
const totalFiles = computed(() => toValue(props.manager.totalFiles))
const uploadedCount = computed(() => toValue(props.manager.uploadedCount))
const compressedCount = computed(() => toValue(props.manager.compressedCount))
const failedCount = computed(() => toValue(props.manager.failedCount))
const compressionProgress = computed(() => toValue(props.manager.compressionProgress))
const uploadProgress = computed(() => toValue(props.manager.uploadProgress))

const showProgress = computed(() =>
  phase.value === 'compressing' || phase.value === 'uploading'
)

const progress = computed(() => {
  if (phase.value === 'compressing') return compressionProgress.value
  if (phase.value === 'uploading') return uploadProgress.value
  return 0
})

const currentCount = computed(() => {
  if (phase.value === 'uploading') return uploadedCount.value
  return compressedCount.value
})

const title = computed(() => {
  if (phase.value === 'compressing') return 'Compressing images...'
  if (phase.value === 'uploading') return 'Uploading to cloud...'
  return ''
})
</script>

<style scoped>
.upload-progress {
  padding: 0;
}

.progress-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--ps-radius-xl);
  background: white;
  border: 1px solid var(--ps-border);
  box-shadow: var(--ps-shadow-sm);
}

/* Icon */
.progress-icon {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.progress-icon--compressing {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.progress-icon--uploading {
  background: var(--ps-gradient-brand);
}

.progress-icon__ring {
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 2px solid currentColor;
  opacity: 0.2;
  animation: ps-pulse-ring 2s ease-in-out infinite;
}

.progress-icon--compressing .progress-icon__ring { color: #F59E0B; }
.progress-icon--uploading .progress-icon__ring { color: var(--ps-primary); }

/* Info */
.progress-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.progress-count {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
}

.progress-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s var(--ps-ease-smooth);
}

.progress-bar__fill--compressing {
  background: linear-gradient(90deg, #F59E0B, #FBBF24);
}

.progress-bar__fill--uploading {
  background: var(--ps-gradient-brand);
}

.progress-percent {
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  min-width: 36px;
  text-align: right;
}

.progress-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #EF4444;
  font-weight: 500;
}

/* Retry button */
.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ps-primary);
  background: rgba(79, 70, 229, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: var(--ps-radius-sm);
  cursor: pointer;
  transition: all var(--ps-duration-fast);
}

.retry-btn:hover {
  background: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.4);
}

/* Cancel */
.progress-cancel {
  width: 32px;
  height: 32px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: #F1F5F9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  flex-shrink: 0;
  transition: all var(--ps-duration-fast);
}

.progress-cancel:hover {
  background: #FEE2E2;
  color: #EF4444;
}
</style>
