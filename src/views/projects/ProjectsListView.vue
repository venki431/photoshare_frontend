<template>
  <div class="projects-page">
    <!-- Header -->
    <div class="page-header ps-animate-in">
      <div class="page-header__text">
        <h1 class="page-title">Projects</h1>
        <p class="page-subtitle">
          {{ projectStore.totalProjects }} total project{{ projectStore.totalProjects !== 1 ? 's' : '' }}
          <span v-if="projectStore.pendingCount" class="subtitle-badge">
            &middot; {{ projectStore.pendingCount }} pending review
          </span>
        </p>
      </div>
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

    <!-- Create Project Dialog -->
    <v-dialog v-model="createDialog" max-width="580" persistent>
      <v-card class="create-dialog">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="dialog-header__icon">
            <v-icon size="24" color="white">mdi-folder-plus-outline</v-icon>
          </div>
          <div>
            <h3 class="dialog-title">Create New Project</h3>
            <p class="dialog-subtitle">Set up a new gallery for your client</p>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" class="dialog-close" @click="resetAndClose" />
        </div>

        <v-form
          ref="createFormRef"
          @submit.prevent="handleCreate"
          v-model="formValid"
          class="dialog-body"
        >
          <!-- Customer Image Upload -->
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
            <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              @change="handleImageUpload"
            />
          </div>

          <!-- Form Fields -->
          <div class="form-grid">
            <v-text-field
              v-model="createForm.name"
              label="Project Name"
              placeholder="e.g. Sarah & James Wedding"
              :rules="nameRules"
              required
              density="comfortable"
              variant="outlined"
            />

            <v-select
              v-model="createForm.eventType"
              label="Event Type"
              :items="eventTypes"
              item-title="text"
              item-value="value"
              :rules="eventTypeRules"
              required
              density="comfortable"
              variant="outlined"
            />

            <v-text-field
              v-model="createForm.clientName"
              label="Customer Name"
              placeholder="Full name"
              :rules="clientNameRules"
              required
              density="comfortable"
              variant="outlined"
            />

            <div class="form-row">
              <v-text-field
                v-model="createForm.clientEmail"
                label="Customer Email"
                placeholder="email@example.com"
                type="email"
                density="comfortable"
                variant="outlined"
                :rules="emailRules"
                hint="Optional"
                persistent-hint
                class="form-row__wide"
              />
              <v-text-field
                v-model="createForm.clientMobile"
                label="Customer Mobile"
                placeholder="+91 98765 43210"
                type="tel"
                :rules="mobileRules"
                required
                density="comfortable"
                variant="outlined"
                class="form-row__narrow"
              />
            </div>
          </div>

          <v-btn
            block
            color="primary"
            type="submit"
            class="text-none ps-btn-glow dialog-submit"
            elevation="0"
            size="x-large"
            rounded="lg"
            :loading="creating"
            :disabled="!formValid"
          >
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
          <input
            v-model="search"
            type="text"
            placeholder="Search projects..."
            class="search-input"
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>
        <div class="filter-chips">
          <button
            v-for="f in filterOptions"
            :key="f.value"
            class="filter-chip"
            :class="{ 'filter-chip--active': statusFilter === f.value }"
            @click="statusFilter = f.value"
          >
            <span v-if="f.dot" class="filter-dot" :class="`filter-dot--${f.value}`" />
            {{ f.label }}
            <span v-if="f.count !== undefined" class="filter-count">{{ f.count }}</span>
          </button>
        </div>
      </div>
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          <v-icon size="18">mdi-view-grid-outline</v-icon>
        </button>
        <button
          class="toggle-btn"
          :class="{ 'toggle-btn--active': viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <v-icon size="18">mdi-view-list-outline</v-icon>
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid' && filteredProjects.length > 0" class="projects-grid ps-stagger">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list' && filteredProjects.length > 0" class="project-list">
      <router-link
        v-for="project in filteredProjects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        class="list-item"
      >
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

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="mdi-magnify"
      title="No projects found"
      description="Try adjusting your search or filters to find what you're looking for."
      compact
    >
      <template #action>
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          class="text-none"
          @click="search = ''; statusFilter = 'all'"
        >
          Clear Filters
        </v-btn>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
const projectStore = useProjectStore()

const search = ref('')
const statusFilter = ref('all')
const viewMode = ref('grid')

const filterOptions = computed(() => [
  { label: 'All', value: 'all', count: projectStore.totalProjects },
  { label: 'Pending', value: 'pending', dot: true, count: projectStore.pendingCount },
  { label: 'In Review', value: 'in_review', dot: true, count: projectStore.inReviewCount },
  { label: 'Completed', value: 'completed', dot: true, count: projectStore.completedCount },
])

// Create Project Dialog
const createDialog = ref(false)
const creating = ref(false)
const createFormRef = ref(null)
const fileInput = ref(null)
const formValid = ref(false)

const createForm = reactive({
  name: '',
  eventType: '',
  clientName: '',
  clientEmail: '',
  clientMobile: '',
  clientImage: null,
  clientImagePreview: null,
})

const eventTypes = [
  { text: 'Wedding', value: 'wedding' },
  { text: 'Birthday', value: 'birthday' },
  { text: 'Corporate', value: 'corporate' },
  { text: 'Engagement', value: 'engagement' },
  { text: 'Portrait', value: 'portrait' },
  { text: 'Other', value: 'other' }
]

const nameRules = [
  v => !!v?.trim() || 'Project name is required',
  v => (v?.trim().length >= 3) || 'Project name must be at least 3 characters'
]
const eventTypeRules = [v => !!v || 'Please select an event type']
const clientNameRules = [
  v => !!v?.trim() || 'Customer name is required',
  v => (v?.trim().length >= 2) || 'Please enter a valid name'
]
const emailRules = [
  v => !v || /.+@.+\..+/.test(v) || 'Please enter a valid email address'
]
const mobileRules = [
  v => !!v?.trim() || 'Customer mobile number is required',
  v => /^[\d+\s-]{10,15}$/.test(v?.replace(/\s/g, '')) || 'Please enter a valid mobile number'
]

function triggerFileInput() { fileInput.value?.click() }

function compressImage(file, maxWidth = 512, quality = 0.7) {
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
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = url
  })
}

async function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return
  const base64 = await compressImage(file)
  createForm.clientImage = base64
  createForm.clientImagePreview = base64
}

async function handleCreate() {
  const { valid } = await createFormRef.value.validate()
  if (!valid) return
  creating.value = true
  try {
    const payload = {
      name: createForm.name.trim(),
      eventType: createForm.eventType,
      clientName: createForm.clientName.trim(),
      clientMobile: createForm.clientMobile.trim(),
    }
    if (createForm.clientEmail?.trim()) payload.clientEmail = createForm.clientEmail.trim()
    if (createForm.clientImage) payload.coverImage = createForm.clientImage
    const project = await projectStore.createProject(payload)
    resetAndClose()
    router.push(`/projects/${project.id}`)
  } catch (err) {
    console.error('Failed to create project:', err?.message || err)
  } finally {
    creating.value = false
  }
}

function resetAndClose() {
  createDialog.value = false
  Object.assign(createForm, {
    name: '', eventType: '', clientName: '', clientEmail: '', clientMobile: '',
    clientImage: null, clientImagePreview: null,
  })
  if (fileInput.value) fileInput.value.value = ''
}

onMounted(() => { projectStore.fetchProjects().catch(() => {}) })

const filteredProjects = computed(() => {
  let list = projectStore.projects
  if (statusFilter.value !== 'all') list = list.filter(p => p.status === statusFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q))
  }
  return list
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
.projects-page {
  display: flex;
  flex-direction: column;
  gap: var(--ps-section-gap);
  min-width: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 14px;
  color: #94A3B8;
  margin: 4px 0 0;
}

.subtitle-badge {
  color: #F59E0B;
  font-weight: 600;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CREATE DIALOG
   ═══════════════════════════════════════════════════════════════════════════ */

.create-dialog {
  border-radius: var(--ps-radius-2xl) !important;
  overflow: hidden;
  box-shadow: var(--ps-shadow-xl) !important;
  border: none !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 32px 0;
}

.dialog-header__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.dialog-subtitle {
  font-size: 13px;
  color: #94A3B8;
  margin: 2px 0 0;
}

.dialog-close {
  margin-left: auto;
}

.dialog-body {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Avatar Upload */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-upload__preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #F1F5F9;
  transition: border-color var(--ps-duration-fast);
}

.avatar-upload__preview:hover {
  border-color: var(--ps-primary-light);
}

.avatar-upload__placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F1F5F9, #E2E8F0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--ps-duration-fast);
}

.avatar-upload__preview:hover .avatar-upload__overlay {
  opacity: 1;
}

.avatar-upload__btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--ps-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--ps-radius-sm);
  transition: background var(--ps-duration-fast);
}

.avatar-upload__btn:hover {
  background: rgba(79, 70, 229, 0.06);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row__wide { flex: 7; }
.form-row__narrow { flex: 5; }

.dialog-submit {
  margin-top: 8px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOOLBAR
   ═══════════════════════════════════════════════════════════════════════════ */

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar__main {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
}

/* Search */
.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 42px;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-lg);
  background: white;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all var(--ps-duration-fast);
  color: #1E293B;
}

.search-input::placeholder {
  color: #CBD5E1;
}

.search-input:focus {
  border-color: var(--ps-primary-light);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #F1F5F9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
}

/* Filter Chips */
.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--ps-radius-full);
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: all var(--ps-duration-fast);
  font-family: inherit;
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: #CBD5E1;
  background: #F8FAFC;
}

.filter-chip--active {
  background: rgba(79, 70, 229, 0.06);
  border-color: rgba(79, 70, 229, 0.2);
  color: var(--ps-primary);
  font-weight: 600;
}

.filter-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.filter-dot--pending { background: #F59E0B; }
.filter-dot--in_review { background: #3B82F6; }
.filter-dot--completed { background: #10B981; }

.filter-count {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--ps-radius-full);
  background: rgba(0, 0, 0, 0.04);
}

.filter-chip--active .filter-count {
  background: rgba(79, 70, 229, 0.1);
  color: var(--ps-primary);
}

/* View Toggle */
.view-toggle {
  display: flex;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: all var(--ps-duration-fast);
}

.toggle-btn + .toggle-btn {
  border-left: 1px solid var(--ps-border);
}

.toggle-btn--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
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
   LIST VIEW
   ═══════════════════════════════════════════════════════════════════════════ */

.project-list {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: var(--ps-radius-xl);
  border: 1px solid var(--ps-border);
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  text-decoration: none;
  color: inherit;
  transition: background var(--ps-duration-fast);
  cursor: pointer;
}

.list-item + .list-item {
  border-top: 1px solid #F1F5F9;
}

.list-item:hover {
  background: #FAFBFC;
}

.list-item__avatar {
  flex-shrink: 0;
  border-radius: var(--ps-radius-md) !important;
  overflow: hidden;
}

.list-item__info {
  flex: 1;
  min-width: 0;
}

.list-item__name {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 2px;
}

.list-item__meta {
  font-size: 13px;
  color: #94A3B8;
}

.list-item__arrow {
  color: #CBD5E1;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 960px) {
  .search-wrapper { max-width: none; }
}

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: stretch; }
  .toolbar__main { flex-direction: column; align-items: stretch; }
  .search-wrapper { min-width: 0; }
  .filter-chips { overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
  .form-row { flex-direction: column; gap: 4px; }
  .form-row__wide, .form-row__narrow { flex: 1; }
  .dialog-header { padding: 24px 20px 0; }
  .dialog-body { padding: 20px 20px 24px; }
}
</style>
