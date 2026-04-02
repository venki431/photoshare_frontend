<template>
  <div class="dashboard-page">
    <!-- Welcome Strip -->
    <div class="welcome-strip ps-animate-in">
      <div class="welcome-strip__left">
        <h1 class="welcome-title">
          {{ greeting }}, <span class="ps-text-gradient">{{ firstName }}</span>
        </h1>
        <p class="welcome-subtitle">
          Here's what's happening with your studio today.
        </p>
      </div>
    </div>

    <!-- Stat Strip -->
    <div class="stat-strip ps-animate-in ps-animate-in-delay-1">
      <div class="stat-strip__item" v-for="stat in stats" :key="stat.label">
        <span class="stat-strip__value">{{ stat.value }}</span>
        <span class="stat-strip__label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- Folders Section -->
    <div class="section ps-animate-in ps-animate-in-delay-2">
      <div class="section-header">
        <h2 class="section-title">Your Folders</h2>
        <v-btn
          v-if="folderStore.folders.length"
          variant="text"
          color="primary"
          size="small"
          class="text-none view-all-btn"
          append-icon="mdi-arrow-right"
          to="/folders"
        >
          View all
        </v-btn>
      </div>

      <!-- Loading -->
      <div v-if="folderStore.loading && !folderStore.folders.length" class="folders-grid">
        <div v-for="n in 4" :key="n" class="folder-skeleton">
          <div class="ps-shimmer" style="width: 52px; height: 52px; border-radius: 12px; flex-shrink: 0" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 6px">
            <div class="ps-shimmer" style="width: 60%; height: 14px; border-radius: 6px" />
            <div class="ps-shimmer" style="width: 30%; height: 12px; border-radius: 6px" />
          </div>
        </div>
      </div>

      <!-- Folder Cards -->
      <div v-else-if="folderStore.folders.length" class="folders-grid ps-stagger">
        <router-link
          v-for="folder in displayedFolders"
          :key="folder.id"
          :to="`/folders/${folder.id}`"
          class="folder-card"
        >
          <div class="folder-card__icon">
            <v-icon size="28" color="white">mdi-folder</v-icon>
          </div>
          <div class="folder-card__body">
            <h3 class="folder-card__name">{{ folder.name }}</h3>
            <span class="folder-card__meta">
              {{ folder.projectCount }} project{{ folder.projectCount !== 1 ? 's' : '' }}
            </span>
          </div>
          <v-icon size="16" class="folder-card__arrow">mdi-chevron-right</v-icon>
        </router-link>

        <!-- Create Folder Card -->
        <router-link to="/folders" class="folder-card folder-card--create">
          <div class="folder-card__icon folder-card__icon--create">
            <v-icon size="24">mdi-plus</v-icon>
          </div>
          <div class="folder-card__body">
            <h3 class="folder-card__name">New Folder</h3>
            <span class="folder-card__meta">Create a folder</span>
          </div>
        </router-link>
      </div>

      <!-- Empty -->
      <EmptyState
        v-else
        icon="mdi-folder-plus-outline"
        title="Create your first folder"
        description="Folders help you organize projects by client, event type, or season."
        compact
        :tips="[
          'Group related projects together',
          'Share an entire folder with clients',
          'Keep your workspace organized'
        ]"
      >
        <template #action>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            to="/folders"
            class="text-none ps-btn-glow"
            elevation="0"
            rounded="lg"
          >
            Create Folder
          </v-btn>
        </template>
      </EmptyState>
    </div>

    <!-- Recent Projects Section -->
    <div v-if="recentProjects.length" class="section ps-animate-in ps-animate-in-delay-3">
      <div class="section-header">
        <h2 class="section-title">Recent Projects</h2>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          class="text-none view-all-btn"
          append-icon="mdi-arrow-right"
          to="/projects"
        >
          View all
        </v-btn>
      </div>

      <div class="projects-grid ps-stagger">
        <ProjectCard
          v-for="project in recentProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="recentProjects.length" class="section ps-animate-in ps-animate-in-delay-4">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/folders" class="action-card">
          <div class="action-card__icon action-card__icon--purple">
            <v-icon size="20" color="white">mdi-folder-plus-outline</v-icon>
          </div>
          <div class="action-card__text">
            <div class="action-card__title">New Folder</div>
            <div class="action-card__desc">Organize your work</div>
          </div>
          <v-icon size="16" class="action-card__arrow">mdi-chevron-right</v-icon>
        </router-link>

        <router-link to="/projects" class="action-card">
          <div class="action-card__icon action-card__icon--blue">
            <v-icon size="20" color="white">mdi-folder-image</v-icon>
          </div>
          <div class="action-card__text">
            <div class="action-card__title">All Projects</div>
            <div class="action-card__desc">Manage galleries</div>
          </div>
          <v-icon size="16" class="action-card__arrow">mdi-chevron-right</v-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'
import { useFolderStore } from '@/stores/folders'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const folderStore = useFolderStore()

onMounted(() => {
  if (projectStore.projects.length === 0) {
    projectStore.fetchProjects().catch(() => {})
  }
  if (folderStore.folders.length === 0) {
    folderStore.fetchFolders().catch(() => {})
  }
})

const firstName = computed(() => authStore.userName?.split(' ')[0] ?? 'there')

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const displayedFolders = computed(() => folderStore.folders.slice(0, 5))
const recentProjects = computed(() => projectStore.projects.slice(0, 3))

const stats = computed(() => [
  { label: 'Folders', value: folderStore.totalFolders },
  { label: 'Projects', value: projectStore.totalProjects },
  { label: 'Photos', value: projectStore.totalImages },
  { label: 'Pending', value: projectStore.pendingCount },
])
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3.5vw, 32px);
  min-width: 0;
  padding-bottom: 40px;
}

/* ─── Welcome Strip ──────────────────────────────────────────────────── */

.welcome-strip {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.welcome-title {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: #64748B;
  margin: 6px 0 0;
}

/* ─── Stat Strip ─────────────────────────────────────────────────────── */

.stat-strip {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 14px 0;
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
}

.stat-strip__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 16px;
}

.stat-strip__item + .stat-strip__item {
  border-left: 1px solid var(--ps-border);
}

.stat-strip__value {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1;
}

.stat-strip__label {
  font-size: 12px;
  font-weight: 500;
  color: #94A3B8;
}

/* ─── Section ────────────────────────────────────────────────────────── */

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.view-all-btn {
  font-weight: 600;
}

/* ─── Folders Grid ───────────────────────────────────────────────────── */

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.folder-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
  text-decoration: none;
  color: inherit;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.folder-card:hover {
  border-color: var(--ps-border-hover);
  box-shadow: var(--ps-shadow-md);
  transform: translateY(-2px);
}

.folder-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--ps-radius-md);
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(79, 70, 229, 0.18);
  transition: transform var(--ps-duration-normal) var(--ps-ease-spring);
}

.folder-card:hover .folder-card__icon {
  transform: scale(1.06);
}

.folder-card__icon--create {
  background: white;
  border: 2px dashed rgba(79, 70, 229, 0.3);
  box-shadow: none;
  color: var(--ps-primary);
}

.folder-card--create {
  border-style: dashed;
  border-color: rgba(79, 70, 229, 0.15);
}

.folder-card--create:hover {
  border-color: rgba(79, 70, 229, 0.3);
  background: rgba(79, 70, 229, 0.02);
}

.folder-card__body {
  flex: 1;
  min-width: 0;
}

.folder-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-card__meta {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
}

.folder-card__arrow {
  color: #CBD5E1;
  flex-shrink: 0;
  transition: all var(--ps-duration-fast);
}

.folder-card:hover .folder-card__arrow {
  color: var(--ps-primary);
  transform: translateX(2px);
}

.folder-skeleton {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
}

/* ─── Projects Grid ──────────────────────────────────────────────────── */

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ─── Quick Actions ──────────────────────────────────────────────────── */

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
  text-decoration: none;
  color: inherit;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.action-card:hover {
  border-color: var(--ps-border-hover);
  box-shadow: var(--ps-shadow-md);
  transform: translateY(-2px);
}

.action-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-card__icon--purple { background: var(--ps-gradient-brand); }
.action-card__icon--blue { background: linear-gradient(135deg, #3B82F6, #60A5FA); }

.action-card__text {
  flex: 1;
  min-width: 0;
}

.action-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.action-card__desc {
  font-size: 12px;
  color: #94A3B8;
}

.action-card__arrow {
  color: #CBD5E1;
  transition: all var(--ps-duration-fast);
}

.action-card:hover .action-card__arrow {
  color: var(--ps-primary);
  transform: translateX(2px);
}

/* ─── Responsive ─────────────────────────────────────────────────────── */

@media (max-width: 960px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .welcome-strip {
    flex-direction: column;
    align-items: stretch;
  }

  .create-folder-btn {
    width: 100%;
  }

  .stat-strip {
    flex-wrap: wrap;
  }

  .stat-strip__item {
    flex: 0 0 50%;
    padding: 8px 0;
  }

  .stat-strip__item + .stat-strip__item {
    border-left: none;
  }

  .stat-strip__item:nth-child(odd) {
    border-right: 1px solid var(--ps-border);
  }

  .stat-strip__item:nth-child(n+3) {
    border-top: 1px solid var(--ps-border);
  }

  .projects-grid { grid-template-columns: 1fr; }
  .actions-grid { grid-template-columns: 1fr; }
  .folders-grid { grid-template-columns: 1fr; }
}
</style>
