<template>
  <div class="projects-page ps-page">
    <!-- Header -->
    <div class="ps-page-header">
      <div class="ps-page-intro">
        <h1 class="text-h4 font-weight-bold">Projects</h1>
        <p class="text-body-2 text-medium-emphasis">{{ projectStore.totalProjects }} total projects</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" class="text-none" elevation="0" size="large" @click="createDialog = true">
        New Project
      </v-btn>
    </div>

    <!-- Create Project Dialog -->
    <v-dialog v-model="createDialog" max-width="520" persistent>
      <v-card class="pa-6">
        <div class="d-flex align-center justify-space-between mb-5">
          <h3 class="text-h6 font-weight-bold">New Project</h3>
          <v-btn icon="mdi-close" size="small" variant="text" @click="resetAndClose" />
        </div>
        <v-form ref="createFormRef" @submit.prevent="handleCreate">
          <v-text-field
            v-model="createForm.name"
            label="Project Name"
            placeholder="e.g. Sarah & James Wedding"
            :rules="[v => !!v?.trim() || 'Project name is required']"
            class="mb-1"
          />
          <v-select
            v-model="createForm.eventType"
            label="Event Type"
            :items="eventTypes"
            :rules="[v => !!v || 'Event type is required']"
            class="mb-1"
          />
          <v-text-field
            v-model="createForm.clientName"
            label="Customer Name"
            placeholder="Full name"
            class="mb-1"
          />
          <v-text-field
            v-model="createForm.clientEmail"
            label="Customer Email"
            placeholder="email@example.com"
            type="email"
            class="mb-1"
          />
          <v-text-field
            v-model="createForm.clientMobile"
            label="Customer Mobile"
            placeholder="+91 98765-43210"
            type="tel"
            class="mb-1"
          />
          <v-btn
            block
            color="primary"
            type="submit"
            class="text-none mt-2"
            elevation="0"
            size="large"
            :loading="creating"
          >
            Create Project
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Filters & View Toggle -->
    <div class="ps-page-toolbar">
      <div class="ps-page-toolbar-main">
      <v-text-field
        v-model="search"
        placeholder="Search projects..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        class="projects-search ps-toolbar-control"
      />
      <v-chip-group v-model="statusFilter" selected-class="text-primary" mandatory class="status-filter-group">
        <v-chip filter value="all" size="small">All</v-chip>
        <v-chip filter value="pending" size="small">Pending</v-chip>
        <v-chip filter value="in_review" size="small">In Review</v-chip>
        <v-chip filter value="completed" size="small">Completed</v-chip>
      </v-chip-group>
      </div>
      <v-btn-toggle v-model="viewMode" density="compact" mandatory variant="outlined" divided rounded="lg" class="ps-toolbar-toggle">
        <v-btn value="grid" icon="mdi-view-grid-outline" size="small" />
        <v-btn value="list" icon="mdi-view-list-outline" size="small" />
      </v-btn-toggle>
    </div>

    <!-- Grid View -->
    <v-row v-if="viewMode === 'grid' && filteredProjects.length > 0">
      <v-col
        v-for="project in filteredProjects"
        :key="project.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card class="project-card" :to="`/projects/${project.id}`" hover>
          <div class="project-cover">
            <v-img :src="project.coverUrl" height="200" cover class="rounded-t-xl">
              <template #placeholder>
                <v-sheet color="grey-lighten-3" height="200" class="d-flex align-center justify-center">
                  <v-progress-circular indeterminate color="grey-lighten-1" />
                </v-sheet>
              </template>
            </v-img>
            <v-chip :color="statusColor(project.status)" size="x-small" class="status-chip" variant="elevated">
              {{ statusLabel(project.status) }}
            </v-chip>
          </div>
          <v-card-text class="pa-4">
            <h3 class="text-body-1 font-weight-bold mb-2 text-truncate">{{ project.name }}</h3>
            <div class="d-flex align-center justify-space-between">
              <div class="project-meta d-flex align-center ga-4 text-caption text-medium-emphasis">
                <span class="d-flex align-center ga-1">
                  <v-icon size="14">mdi-image-multiple-outline</v-icon>
                  {{ project.imageCount }}
                </span>
                <span class="d-flex align-center ga-1">
                  <v-icon size="14">mdi-heart-outline</v-icon>
                  {{ project.selectedCount }}
                </span>
              </div>
              <v-chip size="x-small" variant="tonal" color="grey">
                {{ project.eventType }}
              </v-chip>
            </div>
            <!-- Selection progress -->
            <v-progress-linear
              v-if="project.selectedCount > 0"
              :model-value="(project.selectedCount / project.imageCount) * 100"
              color="primary"
              class="mt-3"
              rounded
              height="4"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- List View -->
    <v-card v-else-if="filteredProjects.length > 0" class="project-list-card">
      <v-list lines="two">
        <v-list-item
          v-for="project in filteredProjects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="project-list-item py-3"
        >
          <template #prepend>
            <v-avatar size="56" rounded="lg" class="mr-4">
              <v-img :src="project.coverUrl" cover />
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold mb-1">{{ project.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ project.imageCount }} photos &middot; {{ project.selectedCount }} selected &middot; {{ formatDate(project.createdAt) }}
          </v-list-item-subtitle>
          <template #append>
            <v-chip :color="statusColor(project.status)" size="small" variant="tonal">
              {{ statusLabel(project.status) }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Empty State -->
    <v-card v-else class="ps-empty-card text-center">
      <v-icon size="48" color="grey-lighten-2" class="mb-4">mdi-magnify</v-icon>
      <h3 class="text-body-1 font-weight-medium mb-1">No projects found</h3>
      <p class="text-body-2 text-medium-emphasis">Try adjusting your search or filters.</p>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'

const router = useRouter()
const projectStore = useProjectStore()

const search = ref('')
const statusFilter = ref('all')
const viewMode = ref('grid')

// ─── Create Project Dialog ────────────────────────────────────────────────────
const createDialog = ref(false)
const creating = ref(false)
const createFormRef = ref(null)
const createForm = reactive({
  name: '',
  eventType: '',
  clientName: '',
  clientEmail: '',
  clientMobile: '',
})

const eventTypes = ['wedding', 'birthday', 'corporate', 'engagement', 'portrait', 'other']

function resetAndClose() {
  createDialog.value = false
  Object.assign(createForm, { name: '', eventType: '', clientName: '', clientEmail: '', clientMobile: '' })
}

async function handleCreate() {
  const { valid } = await createFormRef.value.validate()
  if (!valid) return

  creating.value = true
  try {
    const project = await projectStore.createProject({ ...createForm })
    resetAndClose()
    router.push(`/projects/${project.id}`)
  } catch (err) {
    console.error('Create failed:', err?.message)
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  projectStore.fetchProjects().catch(() => {})
})

const filteredProjects = computed(() => {
  let list = projectStore.projects
  if (statusFilter.value !== 'all') {
    list = list.filter(p => p.status === statusFilter.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
})

function statusColor(status) {
  const map = { pending: 'warning', in_review: 'info', completed: 'success' }
  return map[status] || 'grey'
}
function statusLabel(status) {
  const map = { pending: 'Pending', in_review: 'In Review', completed: 'Completed' }
  return map[status] || status
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.projects-page {
  min-width: 0;
}

.status-filter-group {
  min-width: 0;
}

.status-filter-group :deep(.v-slide-group__content) {
  flex-wrap: wrap;
  gap: 8px;
}

.project-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
}

.project-card :deep(.v-card-text) {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.project-cover { position: relative; }

.project-meta {
  flex-wrap: wrap;
  row-gap: 8px;
}

.project-list-card {
  overflow: hidden;
}

.project-list-item :deep(.v-list-item__append) {
  margin-inline-start: 16px;
}

.status-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

@media (max-width: 600px) {
  .project-list-item :deep(.v-list-item__append) {
    margin-inline-start: 12px;
  }
}
</style>
