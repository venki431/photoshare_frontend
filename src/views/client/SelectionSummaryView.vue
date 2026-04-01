<template>
  <div class="summary-page">
    <!-- Header -->
    <header class="summary-header ps-glass">
      <div class="header-content">
        <button class="back-btn" @click="$router.push(`/gallery/${shareId}`)">
          <v-icon size="18">mdi-arrow-left</v-icon>
        </button>
        <span class="header-title">Review Selection</span>
        <div style="width: 36px" />
      </div>
    </header>

    <div class="summary-content" v-if="project">
      <!-- Intro -->
      <div class="summary-intro ps-animate-in">
        <div class="intro-badge">
          <v-icon size="14" color="pink">mdi-heart</v-icon>
          Review & Confirm
        </div>
        <h1 class="intro-title">{{ project.name }}</h1>
        <p class="intro-subtitle">
          You've selected <strong class="ps-text-gradient">{{ selectedImages.length }}</strong>
          out of {{ project?.images?.length ?? 0 }} photos
        </p>
      </div>

      <!-- Selected Photos Grid -->
      <div class="selected-grid ps-stagger" v-if="selectedImages.length > 0">
        <div v-for="(image, idx) in selectedImages" :key="image.id" class="selected-item">
          <v-img :src="image.thumbUrl" cover aspect-ratio="1" class="selected-img">
            <template #placeholder>
              <div class="shimmer-placeholder" />
            </template>
          </v-img>
          <!-- Remove button -->
          <button class="remove-btn" @click="toggleSelect(image.id)">
            <v-icon size="14" color="white">mdi-close</v-icon>
          </button>
          <div class="item-number">{{ idx + 1 }}</div>
          <!-- Comment indicator -->
          <div v-if="image.comment" class="comment-indicator">
            <v-icon size="12" color="white">mdi-comment-text</v-icon>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-selection ps-animate-in">
        <div class="empty-icon">
          <v-icon size="40" color="white">mdi-heart-off-outline</v-icon>
        </div>
        <h3 class="empty-title">No photos selected</h3>
        <p class="empty-desc">Go back and select your favorite photos first.</p>
        <v-btn variant="outlined" color="primary" :to="`/gallery/${shareId}`" class="text-none" rounded="lg">
          <v-icon start size="18">mdi-arrow-left</v-icon>
          Back to Gallery
        </v-btn>
      </div>

      <!-- Confirm Section -->
      <div v-if="selectedImages.length > 0" class="confirm-section ps-animate-in ps-animate-in-delay-3">
        <div class="confirm-card">
          <div class="confirm-card__icon">
            <v-icon size="28" color="white">mdi-check-circle-outline</v-icon>
          </div>
          <h3 class="confirm-title">Ready to submit?</h3>
          <p class="confirm-desc">
            Once submitted, your photographer will receive your selection of
            <strong>{{ selectedImages.length }} photos</strong>.
            You won't be able to make changes after submission.
          </p>
          <v-btn
            block
            color="primary"
            size="x-large"
            class="text-none ps-btn-glow confirm-btn"
            :loading="projectStore.loading"
            @click="handleSubmit"
            elevation="0"
            rounded="lg"
          >
            <v-icon start>mdi-check-circle-outline</v-icon>
            Confirm & Submit Selection
          </v-btn>
          <v-btn
            block
            variant="text"
            :to="`/gallery/${shareId}`"
            class="text-none"
            color="grey-darken-1"
            size="large"
          >
            <v-icon start size="18">mdi-arrow-left</v-icon>
            Go back and edit
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'
import type { ProjectImage, ProjectWithImages } from '@/types'

const props = defineProps<{ shareId?: string }>()
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const shareId = computed<string>(() => props.shareId || (route.params.shareId as string))
const project = computed(() => projectStore.getProjectByShareId(shareId.value) ?? undefined)

onMounted(() => {
  if (!project.value) projectStore.fetchProjectByShareId(shareId.value).catch(() => {})
})

const selectedImages = computed<ProjectImage[]>(() => project.value?.images?.filter((i: ProjectImage) => i.selected) ?? [])

function toggleSelect(imageId: string): void {
  if (project.value) projectStore.toggleImageSelection(project.value.shareId, imageId)
}

async function handleSubmit(): Promise<void> {
  await projectStore.submitSelections(shareId.value)
  router.push(`/gallery/${shareId.value}/success`)
}
</script>

<style scoped>
.summary-page {
  min-height: 100vh;
  background: var(--ps-surface-dim);
}

/* ─── Header ──────────────────────────────────────────────────────────── */

.summary-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px var(--ps-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--ps-radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  transition: all var(--ps-duration-fast);
}

.back-btn:hover { background: #F1F5F9; color: #1E293B; }

.header-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}

/* ─── Content ─────────────────────────────────────────────────────────── */

.summary-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px var(--ps-gutter) 48px;
  display: flex;
  flex-direction: column;
  gap: var(--ps-section-gap);
}

/* ─── Intro ───────────────────────────────────────────────────────────── */

.summary-intro {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--ps-radius-full);
  background: rgba(236, 72, 153, 0.06);
  color: #EC4899;
  font-size: 13px;
  font-weight: 600;
}

.intro-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.intro-subtitle {
  font-size: 15px;
  color: #64748B;
  margin: 0;
}

/* ─── Grid ────────────────────────────────────────────────────────────── */

.selected-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 640px;
  margin: 0 auto;
}

@media (min-width: 600px) { .selected-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }

.selected-item {
  position: relative;
  border-radius: var(--ps-radius-md);
  overflow: hidden;
  aspect-ratio: 1;
}

.selected-img {
  border-radius: var(--ps-radius-md);
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.selected-item:hover .remove-btn { opacity: 1; }

.item-number {
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(79, 70, 229, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Empty ───────────────────────────────────────────────────────────── */

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 12px;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #94A3B8, #64748B);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.empty-title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; }
.empty-desc { font-size: 14px; color: #94A3B8; margin: 0; }

/* ─── Confirm ─────────────────────────────────────────────────────────── */

.confirm-card {
  max-width: 480px;
  margin: 0 auto;
  padding: 32px;
  text-align: center;
  background: white;
  border-radius: var(--ps-radius-2xl);
  border: 1px solid var(--ps-border);
  box-shadow: var(--ps-shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.confirm-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.confirm-title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; }
.confirm-desc { font-size: 14px; color: #64748B; margin: 0; line-height: 1.6; max-width: 360px; }

.confirm-btn { margin-top: 8px; }

.shimmer-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: ps-shimmer 1.5s ease-in-out infinite;
}
</style>
