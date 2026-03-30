<template>
  <div class="dashboard-page ps-page">
    <!-- Header -->
    <div class="ps-page-intro">
      <h1 class="text-h4 font-weight-bold">Good {{ greeting }}, {{ authStore.userName.split(' ')[0] }}</h1>
      <p class="text-body-1 text-medium-emphasis">Here's what's happening with your projects.</p>
    </div>

    <!-- Stats Cards -->
    <v-row>
      <v-col v-for="stat in stats" :key="stat.title" cols="6" sm="3">
        <v-card class="stat-card pa-5">
          <div class="d-flex align-center justify-space-between mb-3">
            <v-icon :color="stat.color" size="20">{{ stat.icon }}</v-icon>
            <v-chip size="x-small" :color="stat.chipColor" variant="tonal" v-if="stat.chip">
              {{ stat.chip }}
            </v-chip>
          </div>
          <div class="text-h5 font-weight-bold mb-1">{{ stat.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ stat.title }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Projects -->
    <template v-if="recentProjects.length > 0">
      <div class="ps-section-header">
        <h2 class="text-h6 font-weight-bold">Recent Projects</h2>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          class="text-none"
          append-icon="mdi-arrow-right"
          to="/projects"
        >
          View all
        </v-btn>
      </div>

      <v-row>
        <v-col
          v-for="project in recentProjects"
          :key="project.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            class="project-card cursor-pointer"
            :to="`/projects/${project.id}`"
            hover
          >
            <div class="project-cover">
              <v-img
                :src="project?.coverUrl"
                height="180"
                cover
                class="rounded-t-xl"
              >
                <template #placeholder>
                  <v-sheet color="grey-lighten-3" height="180" class="d-flex align-center justify-center rounded-t-xl">
                    <v-icon size="48" color="grey-lighten-1">mdi-image-outline</v-icon>
                  </v-sheet>
                </template>
              </v-img>
              <v-chip
                :color="statusColor(project.status)"
                size="x-small"
                class="status-chip"
                variant="elevated"
              >
                {{ statusLabel(project.status) }}
              </v-chip>
            </div>
            <v-card-text class="pa-4">
              <h3 class="text-body-1 font-weight-bold text-truncate">{{ project.name }}</h3>
              <div class="project-meta d-flex align-center ga-4 text-caption text-medium-emphasis">
                <span class="d-flex align-center ga-1">
                  <v-icon size="14">mdi-image-multiple-outline</v-icon>
                  {{ project.imageCount }} photos
                </span>
                <span class="d-flex align-center ga-1">
                  <v-icon size="14">mdi-calendar-outline</v-icon>
                  {{ formatDate(project.createdAt) }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Empty State -->
    <v-card v-else class="ps-empty-card text-center">
      <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-camera-plus-outline</v-icon>
      <h3 class="text-h6 font-weight-medium mb-2">No projects yet</h3>
      <p class="text-body-2 text-medium-emphasis mb-6">Create your first project to start sharing photos with clients.</p>
      <v-btn color="primary" prepend-icon="mdi-plus" to="/projects" class="text-none" elevation="0">
        Go to Projects
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'

const authStore = useAuthStore()
const projectStore = useProjectStore()

onMounted(() => {
  if (projectStore.projects.length === 0) {
    projectStore.fetchProjects().catch(() => {})
  }
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
})

const recentProjects = computed(() => projectStore.projects.slice(0, 3))

const stats = computed(() => [
  { title: 'Total Projects', value: projectStore.totalProjects, icon: 'mdi-folder-image', color: 'primary', chip: null, chipColor: '' },
  { title: 'Pending', value: projectStore.pendingCount, icon: 'mdi-clock-outline', color: 'warning', chip: 'Action needed', chipColor: 'warning' },
  { title: 'In Review', value: projectStore.inReviewCount, icon: 'mdi-eye-outline', color: 'info', chip: null, chipColor: '' },
  { title: 'Completed', value: projectStore.completedCount, icon: 'mdi-check-circle-outline', color: 'success', chip: null, chipColor: '' },
])

function statusColor(status) {
  const map = { pending: 'warning', in_review: 'info', completed: 'success' }
  return map[status] || 'grey'
}

function statusLabel(status) {
  const map = { pending: 'Pending', in_review: 'In Review', completed: 'Completed' }
  return map[status] || status
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.dashboard-page {
  min-width: 0;
}

.stat-card {
  height: 100%;
  border: 1px solid #E5E7EB !important;
  transition: border-color 0.2s ease;
}

.stat-card:hover {
  border-color: #D1D5DB !important;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
}

.project-cover {
  position: relative;
}

.project-card :deep(.v-card-text) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
}

.project-meta {
  flex-wrap: wrap;
  row-gap: 8px;
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
