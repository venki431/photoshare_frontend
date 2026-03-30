<template>
  <div class="projects-page ps-page">
    <!-- Header -->
    <div class="ps-page-header">
      <div class="ps-page-intro">
        <h1 class="text-h4 font-weight-bold">Projects</h1>
        <p class="text-body-2 text-medium-emphasis">{{ projectStore.totalProjects }} total projects</p>
      </div>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-plus" 
        class="text-none" 
        elevation="0" 
        size="large" 
        @click="createDialog = true"
      >
        New Project
      </v-btn>
    </div>

    <!-- Create Project Dialog -->
    <v-dialog v-model="createDialog" max-width="560" persistent>
      <v-card class="pa-8">
        <div class="d-flex align-center justify-space-between mb-6">
          <h3 class="text-h6 font-weight-bold">Create New Project</h3>
          <v-btn icon="mdi-close" size="small" variant="text" @click="resetAndClose" />
        </div>

        <v-form 
          ref="createFormRef" 
          @submit.prevent="handleCreate" 
          v-model="formValid"
        >
          <!-- Customer Image Upload -->
          <div class="mb-7">
            <div class="customer-image-upload d-flex flex-column align-center mx-auto">
              <v-avatar
                v-if="createForm.clientImagePreview"
                size="128"
                class="mb-3"
              >
                <v-img :src="createForm.clientImagePreview" cover />
              </v-avatar>
              <v-avatar
                v-else
                size="128"
                color="grey-lighten-3"
                class="mb-3"
              >
                <v-icon size="52" color="grey-lighten-1">mdi-account</v-icon>
              </v-avatar>

              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="triggerFileInput"
                class="text-none"
              >
                <v-icon start>mdi-camera</v-icon>
                {{ createForm.clientImagePreview ? 'Change Photo' : 'Add Customer Photo' }}
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                @change="handleImageUpload"
              />
            </div>
          </div>

          <!-- Form Fields -->
          <v-text-field
            v-model="createForm.name"
            label="Project Name"
            placeholder="e.g. Sarah & James Wedding"
            :rules="nameRules"
            required
            density="comfortable"
            class="mb-5"
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
            class="mb-5"
          />

          <v-text-field
            v-model="createForm.clientName"
            label="Customer Name"
            placeholder="Full name"
            :rules="clientNameRules"
            required
            density="comfortable"
            class="mb-5"
          />

          <v-row dense>
            <v-col cols="12" sm="7">
              <v-text-field
                v-model="createForm.clientEmail"
                label="Customer Email"
                placeholder="email@example.com"
                type="email"
                density="comfortable"
                class="mb-5"
                :rules="emailRules"
                hint="Optional"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="createForm.clientMobile"
                label="Customer Mobile"
                placeholder="+91 98765 43210"
                type="tel"
                :rules="mobileRules"
                required
                density="comfortable"
                class="mb-5"
              />
            </v-col>
          </v-row>

          <v-btn
            block
            color="primary"
            type="submit"
            class="text-none mt-6"
            elevation="0"
            size="large"
            :loading="creating"
            :disabled="!formValid"
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
        <v-chip-group 
          v-model="statusFilter" 
          selected-class="text-primary" 
          mandatory 
          class="status-filter-group"
        >
          <v-chip filter value="all" size="small">All</v-chip>
          <v-chip filter value="pending" size="small">Pending</v-chip>
          <v-chip filter value="in_review" size="small">In Review</v-chip>
          <v-chip filter value="completed" size="small">Completed</v-chip>
        </v-chip-group>
      </div>
      <v-btn-toggle 
        v-model="viewMode" 
        density="compact" 
        mandatory 
        variant="outlined" 
        divided 
        rounded="lg" 
        class="ps-toolbar-toggle"
      >
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
            <v-img :src="project.coverImage" height="200" cover class="rounded-t-xl">
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
              <v-img :src="project.coverImage" cover />
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

// Validation Rules
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

function triggerFileInput() {
  fileInput.value?.click()
}

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

  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file (JPEG, PNG, or WebP)')
    return
  }
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
    if (createForm.clientEmail?.trim()) {
      payload.clientEmail = createForm.clientEmail.trim()
    }
    if (createForm.clientImage) {
      payload.coverImage = createForm.clientImage
    }

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
    name: '',
    eventType: '',
    clientName: '',
    clientEmail: '',
    clientMobile: '',
    clientImage: null,
    clientImagePreview: null,
  })
  if (fileInput.value) fileInput.value.value = ''
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
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
</script>

<style scoped>
.projects-page {
  min-width: 0;
}

.customer-image-upload {
  width: fit-content;
}

.customer-image-upload .v-avatar {
  border: 4px solid #f5f5f5;
  transition: all 0.25s ease;
}

.customer-image-upload .v-avatar:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.04);
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

.project-cover { 
  position: relative; 
}

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