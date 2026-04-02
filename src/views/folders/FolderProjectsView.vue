<template>
  <div class="folder-projects-page">
    <!-- Breadcrumb -->
    <Breadcrumb
      class="ps-animate-in"
      :items="[
        { label: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard-outline' },
        { label: 'Folders', to: '/folders', icon: 'mdi-folder-outline' },
        { label: folder?.name ?? 'Loading...' },
      ]"
    />

    <!-- Header -->
    <div class="page-header ps-animate-in">
      <div class="page-header__text">
        <h1 class="page-title">{{ folder?.name ?? '' }}</h1>
        <p class="page-subtitle">
          {{ folderStore.folderProjectsPagination.total }} project{{
            folderStore.folderProjectsPagination.total !== 1 ? 's' : ''
          }}
        </p>
      </div>

      <div class="page-header__actions">
        <v-btn
          v-if="folder?.shareId"
          variant="outlined"
          color="primary"
          class="text-none"
          size="large"
          rounded="lg"
          prepend-icon="mdi-link-variant"
          @click="copyShareLink"
        >
          Copy Link
        </v-btn>
        <v-btn
          v-else
          variant="outlined"
          color="primary"
          class="text-none"
          size="large"
          rounded="lg"
          prepend-icon="mdi-share-variant-outline"
          :loading="sharing"
          @click="handleShare"
        >
          Share Folder
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="text-none ps-btn-glow"
          elevation="0"
          size="large"
          rounded="lg"
          @click="createDialog = true"
        >
          New Project
        </v-btn>
      </div>
    </div>

    <!-- Share snackbar -->
    <v-snackbar v-model="shareSnackbar" :timeout="3000" :color="shareSnackbarColor" location="top" class="text-center">
      <div class="d-flex align-center ga-2 justify-center">
        <v-icon size="18">{{ shareSnackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ shareSnackbarText }}
      </div>
    </v-snackbar>

    <!-- Create Project Dialog -->
    <v-dialog v-model="createDialog" max-width="580" persistent>
      <v-card class="create-dialog">
        <div class="dialog-header">
          <div class="dialog-header__icon">
            <v-icon size="24" color="white">mdi-folder-plus-outline</v-icon>
          </div>
          <div>
            <h3 class="dialog-title">Create New Project</h3>
            <p class="dialog-subtitle">Add a project to {{ folder?.name }}</p>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" class="dialog-close" @click="resetAndClose" />
        </div>

        <v-form ref="createFormRef" @submit.prevent="handleCreate" v-model="formValid" class="dialog-body">
          <div class="avatar-upload">
            <div class="avatar-upload__preview" @click="triggerFileInput">
              <v-avatar v-if="createForm.clientImagePreview" size="100">
                <v-img :src="createForm.clientImagePreview" cover />
              </v-avatar>
              <div v-else class="avatar-upload__placeholder">
                <v-icon size="36" color="grey-lighten-1">mdi-account-circle-outline</v-icon>
              </div>
              <div class="avatar-upload__overlay">
                <v-icon size="20" color="white">mdi-camera</v-icon>
              </div>
            </div>
            <button type="button" class="avatar-upload__btn" @click="triggerFileInput">
              {{ createForm.clientImagePreview ? 'Change Photo' : 'Add Client Photo' }}
            </button>
            <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" hidden @change="handleImageUpload" />
          </div>

          <div class="form-grid">
            <div class="ps-field">
              <v-text-field v-model="createForm.name" placeholder="Project Name" :rules="nameRules" required variant="outlined" class="ps-input" />
            </div>
            <div class="ps-field">
              <v-select v-model="createForm.eventType" placeholder="Event Type" :items="eventTypes" item-title="text" item-value="value" :rules="eventTypeRules" required variant="outlined" class="ps-input" />
            </div>
            <div class="ps-field">
              <v-text-field v-model="createForm.clientName" placeholder="Customer Name" :rules="clientNameRules" required variant="outlined" class="ps-input" />
            </div>
            <div class="form-row">
              <div class="ps-field">
                <v-text-field v-model="createForm.clientEmail" placeholder="Customer Email" type="email" :rules="emailRules" hint="Optional" persistent-hint variant="outlined" class="ps-input" />
              </div>
              <div class="ps-field">
                <v-text-field v-model="createForm.clientMobile" placeholder="Customer Mobile" type="tel" :rules="mobileRules" required variant="outlined" class="ps-input" />
              </div>
            </div>
          </div>

          <v-btn block color="primary" type="submit" class="text-none ps-btn-glow dialog-submit" elevation="0" size="x-large" rounded="lg" :loading="creating" :disabled="!formValid">
            <v-icon start>mdi-rocket-launch-outline</v-icon>
            Create Project
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Filters & View Toggle -->
    <div class="toolbar ps-animate-in ps-animate-in-delay-1">
      <div class="toolbar__main">
        <div class="search-wrapper">
          <v-icon size="18" class="search-icon">mdi-magnify</v-icon>
          <input v-model="search" type="text" placeholder="Search projects..." class="search-input" />
          <button v-if="search" class="search-clear" @click="search = ''">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>

        <div class="filter-chips">
          <button v-for="f in filterOptions" :key="f.value" class="filter-chip" :class="{ 'filter-chip--active': statusFilter === f.value }" @click="statusFilter = f.value">
            <span v-if="f.dot" class="filter-dot" :class="`filter-dot--${f.value}`" />
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="view-toggle">
        <button class="toggle-btn" :class="{ 'toggle-btn--active': viewMode === 'grid' }" @click="viewMode = 'grid'">
          <v-icon size="18">mdi-view-grid-outline</v-icon>
        </button>
        <button class="toggle-btn" :class="{ 'toggle-btn--active': viewMode === 'list' }" @click="viewMode = 'list'">
          <v-icon size="18">mdi-view-list-outline</v-icon>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid' && filteredProjects.length > 0" class="projects-grid ps-stagger">
      <ProjectCard v-for="project in filteredProjects" :key="project.id" :project="project" />
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list' && filteredProjects.length > 0" class="project-list">
      <router-link v-for="project in filteredProjects" :key="project.id" :to="`/projects/${project.id}`" class="list-item">
        <v-avatar size="52" rounded="lg" class="list-item__avatar">
          <v-img :src="project.coverImage" cover />
        </v-avatar>
        <div class="list-item__info">
          <div class="list-item__name">{{ project.name }}</div>
          <div class="list-item__meta">
            {{ project.imageCount }} photos &middot; {{ project.selectedCount }} selected &middot; {{ formatDate(project.createdAt) }}
          </div>
        </div>
        <StatusBadge :status="project.status" />
        <v-icon size="16" class="list-item__arrow">mdi-chevron-right</v-icon>
      </router-link>
    </div>

    <!-- Load More -->
    <div v-if="filteredProjects.length > 0 && folderStore.hasMoreFolderProjects && statusFilter === 'all' && !search" class="load-more-wrapper ps-animate-in">
      <v-btn variant="outlined" color="primary" class="text-none load-more-btn" size="large" rounded="lg" :loading="folderStore.folderProjectsLoading" @click="loadMore">
        <v-icon start>mdi-refresh</v-icon>
        Load More
      </v-btn>
      <p class="load-more-meta">
        Showing {{ folderStore.folderProjects.length }} of {{ folderStore.folderProjectsPagination.total }} projects
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="folderStore.folderProjectsLoading && !folderStore.folderProjects.length" class="loading-wrapper ps-animate-in">
      <div class="loading-grid">
        <div v-for="n in 6" :key="n" class="loading-card">
          <div class="ps-shimmer" style="width: 100%; height: 160px; border-radius: 12px 12px 0 0" />
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px">
            <div class="ps-shimmer" style="width: 70%; height: 16px; border-radius: 8px" />
            <div class="ps-shimmer" style="width: 40%; height: 12px; border-radius: 6px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!filteredProjects.length && !folderStore.folderProjectsLoading"
      icon="mdi-folder-open-outline"
      title="No projects in this folder"
      description="Create your first project to get started."
      compact
    >
      <template #action>
        <v-btn v-if="search || statusFilter !== 'all'" variant="outlined" color="primary" size="small" class="text-none" @click="clearFilters">
          Clear Filters
        </v-btn>
        <v-btn v-else color="primary" size="small" class="text-none" @click="createDialog = true">
          <v-icon start size="18">mdi-plus</v-icon>
          New Project
        </v-btn>
      </template>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFolderStore } from '@/stores/folders'
import { useProjectStore } from '@/stores/projects'
import type { Project } from '@/types'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'

interface VFormInstance {
  validate: () => Promise<{ valid: boolean }>
}

const props = defineProps<{ id: string }>()

const router = useRouter()
const route = useRoute()
const folderStore = useFolderStore()
const projectStore = useProjectStore()

const search = ref('')
const statusFilter = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')

const folder = computed(() =>
  folderStore.folders.find(f => f.id === props.id) ?? null
)

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending', dot: true },
  { label: 'In Review', value: 'in_review', dot: true },
  { label: 'Completed', value: 'completed', dot: true },
]

// Create Project Dialog
const createDialog = ref(false)
const creating = ref(false)
const createFormRef = ref<VFormInstance | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const formValid = ref(false)

const createForm = reactive({
  name: '',
  eventType: '',
  clientName: '',
  clientEmail: '',
  clientMobile: '',
  clientImage: null as string | null,
  clientImagePreview: null as string | null,
})

const eventTypes = [
  { text: 'Wedding', value: 'wedding' },
  { text: 'Birthday', value: 'birthday' },
  { text: 'Corporate', value: 'corporate' },
  { text: 'Engagement', value: 'engagement' },
  { text: 'Portrait', value: 'portrait' },
  { text: 'Other', value: 'other' },
]

const nameRules = [(v: string) => !!v?.trim() || 'Project name is required', (v: string) => (v?.trim().length ?? 0) >= 3 || 'Project name must be at least 3 characters']
const eventTypeRules = [(v: string) => !!v || 'Please select an event type']
const clientNameRules = [(v: string) => !!v?.trim() || 'Customer name is required', (v: string) => (v?.trim().length ?? 0) >= 2 || 'Please enter a valid name']
const emailRules = [(v: string) => !v || /.+@.+\..+/.test(v) || 'Please enter a valid email address']
const mobileRules = [(v: string) => !!v?.trim() || 'Customer mobile number is required', (v: string) => /^[\d+\s-]{10,15}$/.test(v?.replace(/\s/g, '') ?? '') || 'Please enter a valid mobile number']

function triggerFileInput(): void {
  fileInput.value?.click()
}

function compressImage(file: File, maxWidth = 512, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = url
  })
}

async function handleImageUpload(e: Event): Promise<void> {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const base64 = await compressImage(file)
  createForm.clientImage = base64
  createForm.clientImagePreview = base64
}

async function handleCreate(): Promise<void> {
  const { valid } = await createFormRef.value!.validate()
  if (!valid) return

  creating.value = true
  try {
    const project = await projectStore.createProject({
      name: createForm.name.trim(),
      eventType: createForm.eventType,
      folderId: props.id,
      clientName: createForm.clientName.trim(),
      clientMobile: createForm.clientMobile.trim(),
      clientEmail: createForm.clientEmail?.trim() || undefined,
    })
    folderStore.incrementFolderProjectCount(props.id)
    resetAndClose()
    router.push(`/projects/${project.id}`)
  } catch {
    // handled by store
  } finally {
    creating.value = false
  }
}

function resetAndClose(): void {
  createDialog.value = false
  Object.assign(createForm, {
    name: '', eventType: '', clientName: '', clientEmail: '', clientMobile: '',
    clientImage: null, clientImagePreview: null,
  })
  if (fileInput.value) fileInput.value.value = ''
}

// Folder sharing
const sharing = ref(false)
const shareSnackbar = ref(false)
const shareSnackbarText = ref('')
const shareSnackbarColor = ref<'success' | 'error'>('success')

async function handleShare(): Promise<void> {
  sharing.value = true
  try {
    const updated = await folderStore.shareFolder(props.id)
    if (updated.shareId) {
      const link = `${window.location.origin}/gallery/folder/${updated.shareId}`
      await navigator.clipboard.writeText(link)
      shareSnackbarColor.value = 'success'
      shareSnackbarText.value = 'Share link copied to clipboard!'
      shareSnackbar.value = true
    }
  } catch {
    shareSnackbarColor.value = 'error'
    shareSnackbarText.value = 'Failed to share folder'
    shareSnackbar.value = true
  } finally {
    sharing.value = false
  }
}

async function copyShareLink(): Promise<void> {
  if (!folder.value?.shareId) return
  const link = `${window.location.origin}/gallery/folder/${folder.value.shareId}`
  await navigator.clipboard.writeText(link)
  shareSnackbarText.value = 'Share link copied!'
  shareSnackbar.value = true
}

function clearFilters(): void {
  search.value = ''
  statusFilter.value = 'all'
}

function loadMore(): void {
  folderStore.fetchMoreFolderProjects(props.id).catch(() => {})
}

const filteredProjects = computed<Project[]>(() => {
  let list = folderStore.folderProjects
  if (statusFilter.value !== 'all') {
    list = list.filter(p => p.status === statusFilter.value)
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function loadFolderData(): void {
  folderStore.selectFolder(props.id)
  folderStore.fetchFolderProjects(props.id, { perPage: 10 }).catch(() => {})
}

onMounted(() => {
  if (!folderStore.folders.length) {
    folderStore.fetchFolders().then(() => loadFolderData()).catch(() => {})
  } else {
    loadFolderData()
  }
})

watch(() => props.id, () => {
  loadFolderData()
})
</script>

<style scoped>
/* Reuse styles from ProjectsListView */
.folder-projects-page {
  display: flex;
  flex-direction: column;
  gap: var(--ps-section-gap);
  min-width: 0;
}

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-header__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.page-title { font-size: clamp(24px, 3vw, 32px); font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
.page-subtitle { font-size: 14px; color: #94A3B8; margin: 4px 0 0; }

/* Dialog */
.create-dialog { border-radius: var(--ps-radius-2xl) !important; box-shadow: var(--ps-shadow-xl) !important; overflow: hidden; }
.dialog-header { display: flex; align-items: center; gap: 14px; padding: 28px 32px 0; }
.dialog-header__icon { width: 48px; height: 48px; border-radius: 14px; background: var(--ps-gradient-brand); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dialog-title { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0; }
.dialog-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }
.dialog-close { margin-left: auto; }
.dialog-body { padding: 24px 32px 32px; display: flex; flex-direction: column; gap: 20px; }

/* Avatar */
.avatar-upload { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.avatar-upload__preview { position: relative; width: 100px; height: 100px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 3px solid #F1F5F9; transition: border-color 0.2s ease; }
.avatar-upload__preview:hover { border-color: var(--ps-primary-light); }
.avatar-upload__placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #F1F5F9, #E2E8F0); display: flex; align-items: center; justify-content: center; }
.avatar-upload__overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s ease; }
.avatar-upload__preview:hover .avatar-upload__overlay { opacity: 1; }
.avatar-upload__btn { font-size: 13px; font-weight: 600; color: var(--ps-primary); background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: var(--ps-radius-sm); }
.avatar-upload__btn:hover { background: rgba(79, 70, 229, 0.06); }

/* Form */
.form-grid { display: flex; flex-direction: column; gap: 18px; }
.form-row { display: flex; gap: 16px; }
.form-row > * { flex: 1; }

/* Toolbar */
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.toolbar__main { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; flex-wrap: wrap; }

.search-wrapper { position: relative; flex: 1; min-width: 200px; max-width: 320px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94A3B8; pointer-events: none; }
.search-input { width: 100%; height: 42px; padding: 0 36px 0 42px; border: 1px solid var(--ps-border); border-radius: var(--ps-radius-lg); background: white; font-size: 14px; outline: none; transition: all 0.2s ease; }
.search-input:focus { border-color: var(--ps-primary-light); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.search-clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; border-radius: 50%; border: none; background: #F1F5F9; cursor: pointer; color: #64748B; }

.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-chip { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; border: 1px solid var(--ps-border); background: white; font-size: 13px; font-weight: 500; color: #64748B; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.filter-chip:hover { border-color: #CBD5E1; background: #F8FAFC; }
.filter-chip--active { background: rgba(79, 70, 229, 0.06); border-color: rgba(79, 70, 229, 0.2); color: var(--ps-primary); font-weight: 600; }
.filter-dot { width: 6px; height: 6px; border-radius: 50%; }
.filter-dot--pending { background: #F59E0B; }
.filter-dot--in_review { background: #3B82F6; }
.filter-dot--completed { background: #10B981; }

.view-toggle { display: flex; border: 1px solid var(--ps-border); border-radius: var(--ps-radius-md); overflow: hidden; flex-shrink: 0; }
.toggle-btn { width: 38px; height: 38px; border: none; background: white; cursor: pointer; color: #94A3B8; transition: all 0.2s ease; }
.toggle-btn + .toggle-btn { border-left: 1px solid var(--ps-border); }
.toggle-btn--active { background: rgba(79, 70, 229, 0.06); color: var(--ps-primary); }

/* Grid */
.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

/* List */
.project-list { display: flex; flex-direction: column; background: white; border-radius: var(--ps-radius-xl); border: 1px solid var(--ps-border); overflow: hidden; }
.list-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; text-decoration: none; color: inherit; transition: background 0.2s ease; }
.list-item + .list-item { border-top: 1px solid #F1F5F9; }
.list-item:hover { background: #FAFBFC; }
.list-item__name { font-size: 14px; font-weight: 600; color: #1E293B; margin-bottom: 2px; }
.list-item__meta { font-size: 13px; color: #94A3B8; }
.list-item__arrow { color: #CBD5E1; flex-shrink: 0; }

/* Loading */
.loading-wrapper { width: 100%; }
.loading-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.loading-card { border-radius: var(--ps-radius-xl); background: white; border: 1px solid var(--ps-border); overflow: hidden; }

/* Load More */
.load-more-wrapper { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px 0; }
.load-more-btn { min-width: 160px; }
.load-more-meta { font-size: 13px; color: #94A3B8; margin: 0; }

/* Form Deep */
:deep(.ps-input .v-field) { border-radius: 12px; transition: all 0.25s ease; background: #FFFFFF; min-height: 48px; }
:deep(.ps-input .v-field--variant-outlined) { border-color: #E2E8F0; }
:deep(.ps-input .v-field:hover) { border-color: #CBD5E1; background: #FAFBFF; }
:deep(.ps-input .v-field--active) { border-color: var(--ps-primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12); }
:deep(.ps-input .v-label) { font-size: 14px; color: #94A3B8; }
:deep(.ps-input .v-field--active .v-label), :deep(.ps-input .v-field--dirty .v-label) { color: var(--ps-primary); font-weight: 600; transform: translateY(-10px) scale(0.85); }
:deep(.v-messages) { min-height: 16px; margin-top: 4px; }

/* Responsive */
@media (max-width: 960px) {
  .projects-grid, .loading-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .page-header, .toolbar__main { flex-direction: column; align-items: stretch; }
  .search-wrapper { max-width: none; min-width: 0; }
  .filter-chips { overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
  .form-row { flex-direction: column; gap: 14px; }
  .dialog-header, .dialog-body { padding-left: 20px; padding-right: 20px; }
  .projects-grid, .loading-grid { grid-template-columns: 1fr; }
}
</style>
