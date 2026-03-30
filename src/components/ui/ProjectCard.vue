<template>
  <router-link :to="`/projects/${project.id}`" class="project-card-link">
    <div class="project-card">
      <!-- Cover Image -->
      <div class="project-card__cover">
        <v-img :src="project.coverImage" height="200" cover class="project-card__img">
          <template #placeholder>
            <div class="project-card__placeholder">
              <v-icon size="48" color="grey-lighten-1">mdi-image-outline</v-icon>
            </div>
          </template>
        </v-img>

        <!-- Gradient overlay -->
        <div class="project-card__overlay" />

        <!-- Status badge -->
        <StatusBadge :status="project.status" class="project-card__status" />

        <!-- Event type chip -->
        <span class="project-card__event-chip">
          {{ project.eventType }}
        </span>
      </div>

      <!-- Body -->
      <div class="project-card__body">
        <h3 class="project-card__title text-truncate">{{ project.name }}</h3>

        <div class="project-card__meta">
          <span class="meta-item">
            <v-icon size="15" class="meta-icon">mdi-image-multiple-outline</v-icon>
            {{ project.imageCount }} photos
          </span>
          <span v-if="project.selectedCount" class="meta-item meta-item--accent">
            <v-icon size="15" class="meta-icon" color="pink">mdi-heart</v-icon>
            {{ project.selectedCount }} selected
          </span>
          <span class="meta-item">
            <v-icon size="15" class="meta-icon">mdi-calendar-outline</v-icon>
            {{ formatDate(project.createdAt) }}
          </span>
        </div>

        <!-- Selection progress -->
        <div v-if="project.selectedCount > 0 && project.imageCount > 0" class="project-card__progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(project.selectedCount / project.imageCount) * 100}%` }"
            />
          </div>
          <span class="progress-label text-caption text-medium-emphasis">
            {{ Math.round((project.selectedCount / project.imageCount) * 100) }}% selected
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  project: { type: Object, required: true }
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.project-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: var(--ps-radius-xl);
  background: white;
  border: 1px solid var(--ps-border);
  overflow: hidden;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: transparent;
  box-shadow: var(--ps-shadow-card-hover);
}

.project-card__cover {
  position: relative;
  overflow: hidden;
}

.project-card__img {
  transition: transform 0.5s var(--ps-ease-smooth);
}

.project-card:hover .project-card__img {
  transform: scale(1.05);
}

.project-card__placeholder {
  height: 200px;
  background: linear-gradient(135deg, #F1F5F9, #E2E8F0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0;
  transition: opacity var(--ps-duration-normal) var(--ps-ease-smooth);
}

.project-card:hover .project-card__overlay {
  opacity: 1;
}

.project-card__status {
  position: absolute;
  top: 12px;
  right: 12px;
  box-shadow: var(--ps-shadow-md);
}

.project-card__event-chip {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: var(--ps-radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: #475569;
  opacity: 0;
  transform: translateY(6px);
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.project-card:hover .project-card__event-chip {
  opacity: 1;
  transform: translateY(0);
}

.project-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.project-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.project-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

.meta-item--accent {
  color: #EC4899;
}

.meta-icon {
  opacity: 0.7;
}

.project-card__progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #F1F5F9;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--ps-gradient-brand);
  border-radius: 2px;
  transition: width 0.6s var(--ps-ease-out);
}

.progress-label {
  flex-shrink: 0;
  font-weight: 500;
}

@media (max-width: 600px) {
  .project-card {
    border-radius: var(--ps-radius-lg);
  }

  .project-card__body {
    padding: 16px;
  }
}
</style>
