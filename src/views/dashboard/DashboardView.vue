<template>
  <div class="dashboard-page">
    <!-- Hero Welcome Section -->
    <div class="welcome-section ps-animate-in">
      <div class="welcome-content">
        <div class="welcome-text">
          <div class="welcome-badge">
            <v-icon size="14">mdi-hand-wave</v-icon>
            <span>{{ greeting }} greeting</span>
          </div>
          <h1 class="welcome-title">
            Welcome back, <span class="ps-text-gradient">{{ firstName }}</span>
          </h1>
          <p class="welcome-subtitle">
            Here's what's happening with your photography studio today.
            Stay on top of your projects and client selections.
          </p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          class="text-none ps-btn-glow new-project-btn"
          to="/projects"
          elevation="0"
          rounded="lg"
        >
          New Project
        </v-btn>
      </div>

      <!-- Decorative elements -->
      <div class="welcome-orb welcome-orb--1" />
      <div class="welcome-orb welcome-orb--2" />
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid ps-stagger">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        v-bind="stat"
      />
    </div>

    <!-- Recent Projects Section -->
    <div class="recent-section ps-animate-in ps-animate-in-delay-3">
      <div class="section-header">
        <div class="section-header__left">
          <h2 class="section-title">Recent Projects</h2>
          <p class="section-subtitle" v-if="recentProjects.length">
            Your latest {{ recentProjects.length }} project{{ recentProjects.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <v-btn
          v-if="recentProjects.length"
          variant="text"
          color="primary"
          size="small"
          class="text-none view-all-btn"
          append-icon="mdi-arrow-right"
          to="/projects"
        >
          View all projects
        </v-btn>
      </div>

      <template v-if="recentProjects.length > 0">
        <div class="projects-grid ps-stagger">
          <ProjectCard
            v-for="project in recentProjects"
            :key="project.id"
            :project="project"
          />
        </div>
      </template>

      <!-- Premium Empty State -->
      <EmptyState
        v-else
        icon="mdi-camera-plus-outline"
        title="No projects yet"
        description="Create your first project to start sharing beautiful galleries with your clients. Upload photos, let them select favorites, and deliver stunning results."
        :tips="[
          'Drag & drop images for instant upload',
          'Share galleries via a simple link',
          'Clients can select their favorites easily'
        ]"
      >
        <template #action>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            to="/projects"
            class="text-none ps-btn-glow"
            elevation="0"
            rounded="lg"
          >
            Create Your First Project
          </v-btn>
        </template>
      </EmptyState>
    </div>

    <!-- Quick Actions (when projects exist) -->
    <div v-if="recentProjects.length" class="quick-actions ps-animate-in ps-animate-in-delay-4">
      <div class="section-header">
        <h2 class="section-title">Quick Actions</h2>
      </div>
      <div class="actions-grid">
        <router-link to="/projects" class="action-card">
          <div class="action-card__icon action-card__icon--purple">
            <v-icon size="22" color="white">mdi-plus-circle-outline</v-icon>
          </div>
          <div class="action-card__text">
            <div class="action-card__title">New Project</div>
            <div class="action-card__desc">Create a new gallery</div>
          </div>
          <v-icon size="18" class="action-card__arrow">mdi-arrow-right</v-icon>
        </router-link>

        <router-link to="/projects" class="action-card">
          <div class="action-card__icon action-card__icon--blue">
            <v-icon size="22" color="white">mdi-folder-multiple-outline</v-icon>
          </div>
          <div class="action-card__text">
            <div class="action-card__title">All Projects</div>
            <div class="action-card__desc">Manage your galleries</div>
          </div>
          <v-icon size="18" class="action-card__arrow">mdi-arrow-right</v-icon>
        </router-link>

        <div class="action-card action-card--coming-soon">
          <div class="action-card__icon action-card__icon--green">
            <v-icon size="22" color="white">mdi-chart-line</v-icon>
          </div>
          <div class="action-card__text">
            <div class="action-card__title">Analytics</div>
            <div class="action-card__desc">Coming soon</div>
          </div>
          <v-chip size="x-small" variant="tonal" color="grey" class="ml-auto">Soon</v-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'
import StatCard from '@/components/ui/StatCard.vue'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const authStore = useAuthStore()
const projectStore = useProjectStore()

onMounted(() => {
  if (projectStore.projects.length === 0) {
    projectStore.fetchProjects().catch(() => {})
  }
})

const firstName = computed(() => authStore.userName?.split(' ')[0] ?? 'there')

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const recentProjects = computed(() => projectStore.projects.slice(0, 3))

const stats = computed(() => [
  {
    title: 'Total Projects',
    value: projectStore.totalProjects,
    icon: 'mdi-folder-image',
    color: 'primary',
  },
  {
    title: 'Pending Review',
    value: projectStore.pendingCount,
    icon: 'mdi-clock-outline',
    color: 'warning',
    chip: projectStore.pendingCount > 0 ? 'Action needed' : undefined,
    chipColor: 'warning',
  },
  {
    title: 'In Review',
    value: projectStore.inReviewCount,
    icon: 'mdi-eye-outline',
    color: 'info',
  },
  {
    title: 'Completed',
    value: projectStore.completedCount,
    icon: 'mdi-check-circle-outline',
    color: 'success',
  },
])
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 4vw, 40px);
  min-width: 0;
  padding-bottom: 40px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   WELCOME SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

.welcome-section {
  position: relative;
  padding: clamp(28px, 4vw, 40px);
  border-radius: var(--ps-radius-2xl);
  background: white;
  border: 1px solid var(--ps-border);
  overflow: hidden;
}

.welcome-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 560px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: var(--ps-radius-full);
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
}

.welcome-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #0F172A;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0;
}

.welcome-subtitle {
  font-size: 15px;
  color: #64748B;
  line-height: 1.6;
  margin: 0;
}

.welcome-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.welcome-orb--1 {
  width: 300px;
  height: 300px;
  background: rgba(79, 70, 229, 0.06);
  top: -100px;
  right: -60px;
  animation: ps-float 12s ease-in-out infinite;
}

.welcome-orb--2 {
  width: 200px;
  height: 200px;
  background: rgba(14, 165, 233, 0.05);
  bottom: -80px;
  left: 20%;
  animation: ps-float 15s ease-in-out infinite 3s;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 960px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.section-header__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.section-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin: 0;
}

.view-all-btn {
  font-weight: 600;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROJECTS GRID
   ═══════════════════════════════════════════════════════════════════════════ */

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .projects-grid { grid-template-columns: 1fr; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .actions-grid { grid-template-columns: 1fr; }
}

.action-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: var(--ps-radius-lg);
  background: white;
  border: 1px solid var(--ps-border);
  text-decoration: none;
  color: inherit;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
  cursor: pointer;
}

.action-card:hover {
  border-color: var(--ps-border-hover);
  box-shadow: var(--ps-shadow-md);
  transform: translateY(-2px);
}

.action-card--coming-soon {
  opacity: 0.6;
  pointer-events: none;
}

.action-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-card__icon--purple { background: var(--ps-gradient-brand); }
.action-card__icon--blue { background: linear-gradient(135deg, #3B82F6, #60A5FA); }
.action-card__icon--green { background: var(--ps-gradient-success); }

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

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 600px) {
  .welcome-content {
    flex-direction: column;
  }

  .new-project-btn {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
