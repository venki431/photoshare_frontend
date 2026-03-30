<template>
  <div class="success-page">
    <div class="success-content">
      <!-- Animated checkmark -->
      <div class="success-icon mb-6">
        <div class="success-circle">
          <v-icon size="48" color="white">mdi-check</v-icon>
        </div>
        <div class="success-ring" />
      </div>

      <h1 class="text-h4 font-weight-bold mb-3">Selection Submitted!</h1>
      <p class="success-message text-body-1 text-medium-emphasis mb-2">
        Your photographer has been notified and will begin preparing your selected photos.
      </p>

      <v-card class="summary-card pa-5 my-8 mx-auto" max-width="360">
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="text-body-2 text-medium-emphasis">Photos selected</span>
          <span class="text-body-1 font-weight-bold">{{ selectedCount }}</span>
        </div>
        <v-divider class="mb-3" />
        <div class="d-flex align-center justify-space-between">
          <span class="text-body-2 text-medium-emphasis">Project</span>
          <span class="text-body-2 font-weight-medium">{{ project?.name || 'Gallery' }}</span>
        </div>
      </v-card>

      <v-btn
        variant="outlined"
        color="primary"
        class="text-none"
        :to="`/gallery/${shareId}`"
      >
        View Gallery Again
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const props = defineProps({ shareId: String })
const route = useRoute()
const projectStore = useProjectStore()

const shareId = computed(() => props.shareId || route.params.shareId)
const project = computed(() => projectStore.getProjectByShareId(shareId.value))

onMounted(() => {
  if (!project.value) {
    projectStore.fetchProjectByShareId(shareId.value).catch(() => {})
  }
})
const selectedCount = computed(() => project.value?.images?.filter(i => i.selected)?.length ?? 0)
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F9FAFB;
  padding: 24px;
}

.success-content {
  max-width: 420px;
  text-align: center;
  animation: fadeInUp 0.6s ease;
}

.success-message {
  max-width: 400px;
  margin: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.success-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10B981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 3px solid rgba(16, 185, 129, 0.2);
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.3; }
}

.summary-card {
  width: 100%;
  border: 1px solid #E5E7EB !important;
}
</style>
