<template>
  <div v-if="showProgress" class="pa-4">
    <div class="d-flex justify-space-between mb-2">
      <span>{{ label }}</span>
      <span v-if="phase === 'uploading' || phase === 'done'">
        {{ uploadedCount }} / {{ totalFiles }}
      </span>
      <span v-else-if="phase === 'compressing'">
        {{ compressedCount }} / {{ totalFiles }}
      </span>
    </div>

    <v-progress-linear
      :model-value="progress"
      height="6"
      rounded
      :color="progressColor"
    />

    <div v-if="failedCount > 0" class="mt-1 text-caption text-error">
      {{ failedCount }} file(s) failed
    </div>

    <!-- Cancel button during compression -->
    <div v-if="phase === 'compressing'" class="mt-3">
      <v-btn variant="text" size="small" @click="emit('reset')">
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, toValue } from 'vue'

const props = defineProps({
  manager: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reset'])

// Unwrap refs safely
const phase = computed(() => toValue(props.manager.phase))
const totalFiles = computed(() => toValue(props.manager.totalFiles))
const uploadedCount = computed(() => toValue(props.manager.uploadedCount))
const compressedCount = computed(() => toValue(props.manager.compressedCount))
const failedCount = computed(() => toValue(props.manager.failedCount))
const compressionProgress = computed(() => toValue(props.manager.compressionProgress))
const uploadProgress = computed(() => toValue(props.manager.uploadProgress))

// Only show during active operations (compressing or uploading)
const showProgress = computed(() =>
  phase.value === 'compressing' || phase.value === 'uploading'
)

const progress = computed(() => {
  if (phase.value === 'compressing') return compressionProgress.value
  if (phase.value === 'uploading') return uploadProgress.value
  return 0
})

const label = computed(() => {
  const map = {
    compressing: `Compressing... ${compressionProgress.value}%`,
    uploading: `Uploading... ${uploadProgress.value}%`
  }
  return map[phase.value] ?? ''
})

const progressColor = computed(() => {
  if (phase.value === 'compressing') return 'warning'
  return 'primary'
})
</script>
