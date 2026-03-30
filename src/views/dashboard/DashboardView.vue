<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="dashboard-header mb-10">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">
          Good {{ greeting }}, {{ authStore.userName?.split(' ')[0] || 'there' }} 👋
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Here's what's happening with your photography studio today.
        </p>
      </div>
      
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        size="large" 
        class="text-none"
        to="/projects"
        elevation="0"
        rounded="lg"
      >
        New Project
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-12" dense>
      <v-col 
        v-for="stat in stats" 
        :key="stat.title" 
        cols="6" 
        sm="6" 
        md="3"
      >
        <v-card 
          class="stat-card h-100" 
          flat
          hover
        >
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between mb-5">
              <div class="stat-icon-wrapper">
                <v-icon :color="stat.color" size="28">{{ stat.icon }}</v-icon>
              </div>
              <v-chip 
                v-if="stat.chip" 
                size="small" 
                :color="stat.chipColor" 
                variant="tonal"
                class="font-weight-medium"
              >
                {{ stat.chip }}
              </v-chip>
            </div>

            <div class="stat-value text-h4 font-weight-bold mb-1">{{ stat.value }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ stat.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Projects Section -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h6 font-weight-bold">Recent Projects</h2>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        class="text-none"
        append-icon="mdi-arrow-right"
        to="/projects"
      >
        View all projects
      </v-btn>
    </div>

    <template v-if="recentProjects.length > 0">
      <v-row>
        <v-col
          v-for="project in recentProjects"
          :key="project.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            class="project-card h-100"
            :to="`/projects/${project.id}`"
            hover
            rounded="xl"
          >
            <div class="project-cover">
              <v-img
                :src="project?.coverImage"
                height="200"
                cover
                class="rounded-t-xl"
              >
                <template #placeholder>
                  <v-sheet 
                    color="grey-lighten-3" 
                    height="200" 
                    class="d-flex align-center justify-center rounded-t-xl"
                  >
                    <v-icon size="52" color="grey-lighten-1">mdi-image-outline</v-icon>
                  </v-sheet>
                </template>
              </v-img>

              <v-chip
                :color="statusColor(project.status)"
                size="small"
                class="status-chip font-weight-medium"
                variant="elevated"
              >
                {{ statusLabel(project.status) }}
              </v-chip>
            </div>

            <v-card-text class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-3 text-truncate">
                {{ project.name }}
              </h3>

              <div class="project-meta d-flex align-center ga-5 text-caption text-medium-emphasis">
                <span class="d-flex align-center ga-1">
                  <v-icon size="16" color="grey">mdi-image-multiple-outline</v-icon>
                  {{ project.imageCount }} photos
                </span>
                <span class="d-flex align-center ga-1">
                  <v-icon size="16" color="grey">mdi-calendar-outline</v-icon>
                  {{ formatDate(project.createdAt) }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Empty State -->
    <v-card v-else class="ps-empty-card text-center pa-12">
      <v-icon size="82" color="grey-lighten-2" class="mb-6">mdi-camera-plus-outline</v-icon>
      
      <h3 class="text-h6 font-weight-medium mb-3">No projects yet</h3>
      <p class="text-body-2 text-medium-emphasis mb-8 max-w-400 mx-auto">
        Create your first project to start sharing beautiful galleries with your clients.
      </p>
      
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        size="large"
        to="/projects" 
        class="text-none" 
        elevation="0"
        rounded="lg"
      >
        Create Your First Project
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
  { 
    title: 'Total Projects', 
    value: projectStore.totalProjects, 
    icon: 'mdi-folder-image', 
    color: 'primary' 
  },
  { 
    title: 'Pending Review', 
    value: projectStore.pendingCount, 
    icon: 'mdi-clock-outline', 
    color: 'warning',
    chip: 'Action needed',
    chipColor: 'warning'
  },
  { 
    title: 'In Review', 
    value: projectStore.inReviewCount, 
    icon: 'mdi-eye-outline', 
    color: 'info' 
  },
  { 
    title: 'Completed', 
    value: projectStore.completedCount, 
    icon: 'mdi-check-circle-outline', 
    color: 'success' 
  },
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
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.dashboard-page {
  min-width: 0;
  padding-bottom: 40px;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

/* Stat Cards */
.stat-card {
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
  border-radius: 20px;
}

.stat-card:hover {
  border-color: #c4d0ff;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.08);
  transform: translateY(-2px);
}

.stat-icon-wrapper {
  background: rgba(79, 70, 229, 0.08);
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Project Cards */
.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #e0e7ff;
}

.project-cover {
  position: relative;
}

.status-chip {
  position: absolute;
  top: 16px;
  right: 16px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-card :deep(.v-card-text) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-meta {
  margin-top: auto;
  flex-wrap: wrap;
  row-gap: 8px;
}

/* Empty State */
.ps-empty-card {
  border: 2px dashed #e2e8f0;
  background: #fafcff;
}

.max-w-400 {
  max-width: 400px;
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stat-card {
    border-radius: 16px;
  }
  
  .project-card {
    border-radius: 16px;
  }
}
</style>