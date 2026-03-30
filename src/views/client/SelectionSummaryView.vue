<template>
  <div class="summary-page">
    <!-- Header -->
    <header class="summary-header">
      <div class="header-content">
        <v-btn icon="mdi-arrow-left" variant="text" size="small" :to="`/gallery/${shareId}`" />
        <span class="text-body-1 font-weight-bold">Review Selection</span>
        <div style="width: 40px" />
      </div>
    </header>

    <div class="summary-content ps-page" v-if="project">
      <!-- Project Info -->
      <div class="summary-intro text-center">
        <h1 class="text-h5 font-weight-bold">{{ project.name }}</h1>
        <p class="text-body-2 text-medium-emphasis">
          You've selected <strong>{{ selectedImages.length }}</strong> out of {{ project?.images?.length ?? 0 }} photos
        </p>
      </div>

      <!-- Selected Photos Grid -->
      <div class="selected-grid mx-auto" v-if="selectedImages.length > 0">
        <div v-for="(image, idx) in selectedImages" :key="image.id" class="selected-item">
          <v-img :src="image.thumbUrl" cover aspect-ratio="1" class="rounded-lg">
            <template #placeholder>
              <v-sheet color="grey-lighten-3" class="fill-height shimmer rounded-lg" />
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
      <div v-else class="ps-empty-card text-center">
        <v-icon size="56" color="grey-lighten-2" class="mb-4">mdi-heart-off-outline</v-icon>
        <h3 class="text-h6 mb-2">No photos selected</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">Go back and select your favorite photos first.</p>
        <v-btn variant="outlined" :to="`/gallery/${shareId}`" class="text-none">
          Back to Gallery
        </v-btn>
      </div>

      <!-- Confirm Section -->
      <div v-if="selectedImages.length > 0" class="confirm-section">
        <v-card class="pa-6 confirm-card mx-auto">
          <h3 class="text-body-1 font-weight-bold mb-2">Ready to submit?</h3>
          <p class="text-body-2 text-medium-emphasis mb-5">
            Once submitted, your photographer will receive your selection of {{ selectedImages.length }} photos.
            You won't be able to make changes after submission.
          </p>
          <v-btn
            block
            color="primary"
            size="x-large"
            class="text-none mb-3"
            :loading="projectStore.loading"
            @click="handleSubmit"
            elevation="0"
          >
            <v-icon start>mdi-check-circle-outline</v-icon>
            Confirm & Submit Selection
          </v-btn>
          <v-btn
            block
            variant="text"
            :to="`/gallery/${shareId}`"
            class="text-none"
            color="on-surface"
          >
            Go back and edit
          </v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const props = defineProps({ shareId: String })
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const shareId = computed(() => props.shareId || route.params.shareId)
const project = computed(() => projectStore.getProjectByShareId(shareId.value))

onMounted(() => {
  if (!project.value) {
    projectStore.fetchProjectByShareId(shareId.value).catch(() => {})
  }
})
const selectedImages = computed(() => project.value?.images?.filter(i => i.selected) ?? [])

function toggleSelect(imageId) {
  if (project.value) {
    projectStore.toggleImageSelection(project.value.shareId, imageId)
  }
}

async function handleSubmit() {
  await projectStore.submitSelections(shareId.value)
  router.push(`/gallery/${shareId.value}/success`)
}
</script>

<style scoped>
.summary-page {
  min-height: 100vh;
  background: #F9FAFB;
}

.summary-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #E5E7EB;
}
.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 8px var(--ps-gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px var(--ps-gutter) 40px;
}

.summary-intro {
  display: grid;
  gap: 8px;
  justify-items: center;
}

.summary-intro > * {
  margin: 0;
}

.selected-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 640px;
}
@media (min-width: 600px) {
  .selected-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; }
}

.selected-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.selected-item:hover .remove-btn {
  opacity: 1;
}

.item-number {
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
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

.confirm-section {
  padding-bottom: 24px;
}
.confirm-card {
  max-width: 520px;
  text-align: center;
}

.shimmer {
  background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
