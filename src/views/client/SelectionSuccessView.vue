<template>
  <div class="success-page">
    <!-- Background orbs -->
    <div class="success-orbs">
      <div class="orb orb--1" />
      <div class="orb orb--2" />
      <div class="orb orb--3" />
    </div>

    <!-- Confetti particles -->
    <div class="confetti-container">
      <div v-for="n in 20" :key="n" class="confetti" :style="confettiStyle(n)" />
    </div>

    <div class="success-content ps-animate-in">
      <!-- Animated checkmark -->
      <div class="success-icon">
        <div class="icon-circle">
          <v-icon size="48" color="white">mdi-check</v-icon>
        </div>
        <div class="icon-ring icon-ring--1" />
        <div class="icon-ring icon-ring--2" />
        <div class="icon-ring icon-ring--3" />
      </div>

      <h1 class="success-title">Selection Submitted!</h1>
      <p class="success-desc">
        Your photographer has been notified and will begin
        preparing your selected photos.
      </p>

      <!-- Summary Card -->
      <div class="summary-card">
        <div class="summary-row">
          <span class="summary-label">
            <v-icon size="16" class="mr-1">mdi-heart</v-icon>
            Photos selected
          </span>
          <span class="summary-value ps-text-gradient">{{ selectedCount }}</span>
        </div>
        <div class="summary-divider" />
        <div class="summary-row">
          <span class="summary-label">
            <v-icon size="16" class="mr-1">mdi-folder-outline</v-icon>
            Project
          </span>
          <span class="summary-value">{{ project?.name || 'Gallery' }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="success-actions">
        <v-btn
          variant="outlined"
          color="primary"
          class="text-none"
          :to="`/gallery/${shareId}`"
          rounded="lg"
          size="large"
        >
          <v-icon start size="18">mdi-image-multiple</v-icon>
          View Gallery Again
        </v-btn>
      </div>

      <!-- Footer message -->
      <p class="success-footer">
        <v-icon size="14" color="grey-lighten-1">mdi-lock-outline</v-icon>
        Your selection is securely saved. The photographer will contact you soon.
      </p>
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
  if (!project.value) projectStore.fetchProjectByShareId(shareId.value).catch(() => {})
})

const selectedCount = computed(() => project.value?.images?.filter(i => i.selected)?.length ?? 0)

const colors = ['#4F46E5', '#0EA5E9', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6']

function confettiStyle(n) {
  const color = colors[n % colors.length]
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 2
  const size = 4 + Math.random() * 6
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ps-surface-dim);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* ─── Background ──────────────────────────────────────────────────────── */

.success-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb--1 {
  width: 400px;
  height: 400px;
  background: rgba(16, 185, 129, 0.08);
  top: -100px;
  right: -100px;
  animation: ps-float 12s ease-in-out infinite;
}

.orb--2 {
  width: 300px;
  height: 300px;
  background: rgba(79, 70, 229, 0.06);
  bottom: -80px;
  left: -80px;
  animation: ps-float 15s ease-in-out infinite 3s;
}

.orb--3 {
  width: 200px;
  height: 200px;
  background: rgba(236, 72, 153, 0.05);
  top: 40%;
  left: 60%;
  animation: ps-float 10s ease-in-out infinite 1s;
}

/* ─── Confetti ────────────────────────────────────────────────────────── */

.confetti-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -20px;
  opacity: 0;
  animation: confetti-fall linear forwards;
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

/* ─── Content ─────────────────────────────────────────────────────────── */

.success-content {
  position: relative;
  z-index: 1;
  max-width: 440px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* ─── Icon ────────────────────────────────────────────────────────────── */

.success-icon {
  position: relative;
  margin-bottom: 8px;
}

.icon-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--ps-gradient-success);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: success-scale 0.6s var(--ps-ease-spring);
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3);
}

@keyframes success-scale {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.icon-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.15);
}

.icon-ring--1 {
  inset: -10px;
  animation: ring-pulse 2.5s ease-in-out infinite;
}

.icon-ring--2 {
  inset: -22px;
  animation: ring-pulse 2.5s ease-in-out infinite 0.5s;
  border-color: rgba(16, 185, 129, 0.08);
}

.icon-ring--3 {
  inset: -36px;
  animation: ring-pulse 2.5s ease-in-out infinite 1s;
  border-color: rgba(16, 185, 129, 0.04);
}

@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.3; }
}

/* ─── Text ────────────────────────────────────────────────────────────── */

.success-title {
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.success-desc {
  font-size: 15px;
  color: #64748B;
  margin: 0;
  line-height: 1.6;
  max-width: 360px;
}

/* ─── Summary Card ────────────────────────────────────────────────────── */

.summary-card {
  width: 100%;
  max-width: 340px;
  padding: 20px 24px;
  background: white;
  border-radius: var(--ps-radius-xl);
  border: 1px solid var(--ps-border);
  box-shadow: var(--ps-shadow-sm);
  margin: 8px 0;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #64748B;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.summary-divider {
  height: 1px;
  background: #F1F5F9;
  margin: 12px 0;
}

/* ─── Actions ─────────────────────────────────────────────────────────── */

.success-actions {
  margin-top: 4px;
}

.success-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 12px;
}
</style>
