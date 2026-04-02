<template>
  <div class="folders-page">
    <!-- Header -->
    <div class="page-header ps-animate-in">
      <div class="page-header__text">
        <h1 class="page-title">Folders venkiii</h1>
        <p class="page-subtitle">{{ folderStore.totalFolders }} folder{{ folderStore.totalFolders !== 1 ? 's' : '' }}</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="text-none ps-btn-glow"
        elevation="0"
        size="large"
        rounded="lg"
        @click="showCreate = true"
      >
        Create Folder
      </v-btn>
    </div>

    <!-- Inline Create -->
    <div v-if="showCreate" class="create-inline ps-animate-in">
      <v-icon size="22" color="primary">mdi-folder-plus-outline</v-icon>
      <input
        ref="createInputRef"
        v-model="newName"
        type="text"
        placeholder="Enter folder name..."
        class="create-inline__input"
        @keyup.enter="handleCreate"
        @keyup.escape="cancelCreate"
      />
      <v-btn size="small" color="primary" variant="flat" class="text-none" :disabled="!newName.trim()" :loading="creating" @click="handleCreate">
        Create
      </v-btn>
      <v-btn size="small" variant="text" class="text-none" @click="cancelCreate">
        Cancel
      </v-btn>
    </div>

    <!-- Loading -->
    <div v-if="folderStore.loading && !folderStore.folders.length" class="folders-grid">
      <div v-for="n in 6" :key="n" class="folder-card-skeleton">
        <div class="ps-shimmer" style="width: 100%; height: 120px; border-radius: 12px 12px 0 0" />
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px">
          <div class="ps-shimmer" style="width: 60%; height: 16px; border-radius: 8px" />
          <div class="ps-shimmer" style="width: 30%; height: 12px; border-radius: 6px" />
        </div>
      </div>
    </div>

    <!-- Folders Grid -->
    <div v-else-if="folderStore.folders.length" class="folders-grid ps-stagger">
      <div
        v-for="folder in folderStore.folders"
        :key="folder.id"
        class="folder-card-wrapper"
      >
        <router-link :to="`/folders/${folder.id}`" class="folder-card">
          <div class="folder-card__icon-area">
            <div class="folder-card__icon">
              <v-icon size="32" color="white">mdi-folder</v-icon>
            </div>
          </div>
          <div class="folder-card__body">
            <h3 class="folder-card__name">{{ folder.name }}</h3>
            <span class="folder-card__meta">
              {{ folder.projectCount }} project{{ folder.projectCount !== 1 ? 's' : '' }}
            </span>
          </div>
          <v-icon size="16" class="folder-card__arrow">mdi-chevron-right</v-icon>
        </router-link>
        <v-menu location="bottom end" :close-on-content-click="true">
          <template #activator="{ props }">
            <button class="folder-card__menu" v-bind="props" @click.prevent.stop>
              <v-icon size="18">mdi-dots-vertical</v-icon>
            </button>
          </template>
          <v-list density="compact" class="folder-context-menu" rounded="lg">
            <v-list-item @click="startDelete(folder)">
              <template #prepend><v-icon size="18" color="error">mdi-delete-outline</v-icon></template>
              <v-list-item-title class="text-error">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      icon="mdi-folder-plus-outline"
      title="Create your first folder"
      description="Folders help you organize projects by client, event type, or season. Start by creating a folder."
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
          class="text-none ps-btn-glow"
          elevation="0"
          rounded="lg"
          @click="showCreate = true"
        >
          Create Folder
        </v-btn>
      </template>
    </EmptyState>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="delete-confirm" rounded="xl">
        <div class="delete-confirm__body">
          <div class="delete-confirm__icon">
            <v-icon size="28" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <h4 class="delete-confirm__title">Delete folder?</h4>
          <p class="delete-confirm__text">
            This will permanently delete <strong>{{ folderToDelete?.name }}</strong> and all its
            {{ folderToDelete?.projectCount ?? 0 }} project(s). This cannot be undone.
          </p>
        </div>
        <div class="delete-confirm__actions">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="deleting" @click="confirmDelete">
            Delete
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor" location="top">
      <div class="d-flex align-center ga-2 justify-center">
        <v-icon size="18">{{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFolderStore } from '@/stores/folders'
import type { Folder } from '@/types'
import EmptyState from '@/components/ui/EmptyState.vue'

const folderStore = useFolderStore()
const router = useRouter()

const showCreate = ref(false)
const newName = ref('')
const creating = ref(false)
const createInputRef = ref<HTMLInputElement | null>(null)

// Delete
const deleteDialog = ref(false)
const folderToDelete = ref<Folder | null>(null)
const deleting = ref(false)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'success' | 'error'>('success')

onMounted(() => {
  if (!folderStore.folders.length) {
    folderStore.fetchFolders().catch(() => {})
  }
})

watch(showCreate, (val) => {
  if (val) nextTick(() => createInputRef.value?.focus())
})

async function handleCreate(): Promise<void> {
  if (!newName.value.trim()) return
  creating.value = true
  try {
    const folder = await folderStore.createFolder({ name: newName.value.trim() })
    newName.value = ''
    showCreate.value = false
    router.push(`/folders/${folder.id}`)
  } catch {
    // handled by store
  } finally {
    creating.value = false
  }
}

function cancelCreate(): void {
  showCreate.value = false
  newName.value = ''
}

function startDelete(folder: Folder): void {
  folderToDelete.value = folder
  deleteDialog.value = true
}

async function confirmDelete(): Promise<void> {
  if (!folderToDelete.value) return
  deleting.value = true
  try {
    await folderStore.deleteFolder(folderToDelete.value.id)
    deleteDialog.value = false
    snackbarColor.value = 'success'
    snackbarText.value = 'Folder deleted successfully'
    snackbar.value = true
  } catch {
    snackbarColor.value = 'error'
    snackbarText.value = 'Failed to delete folder'
    snackbar.value = true
  } finally {
    deleting.value = false
    folderToDelete.value = null
  }
}
</script>

<style scoped>
.folders-page {
  display: flex;
  flex-direction: column;
  gap: var(--ps-section-gap);
  min-width: 0;
}

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

/* ─── Inline Create ──────────────────────────────────────────────────── */

.create-inline {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: var(--ps-radius-lg);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.06);
}

.create-inline__input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-sm);
  font-size: 14px;
  outline: none;
  background: #FAFBFF;
  transition: border-color 0.2s ease;
}

.create-inline__input:focus {
  border-color: var(--ps-primary-light);
}

/* ─── Folders Grid ───────────────────────────────────────────────────── */

.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.folder-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: var(--ps-radius-lg);
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

.folder-card__icon-area {
  flex-shrink: 0;
}

.folder-card__icon {
  width: 52px;
  height: 52px;
  border-radius: var(--ps-radius-md);
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  transition: transform var(--ps-duration-normal) var(--ps-ease-spring);
}

.folder-card:hover .folder-card__icon {
  transform: scale(1.06);
}

.folder-card__body {
  flex: 1;
  min-width: 0;
}

.folder-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-card__meta {
  font-size: 13px;
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

/* ─── Card wrapper with menu ─────────────────────────────────────────── */

.folder-card-wrapper {
  position: relative;
}

.folder-card__menu {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  opacity: 0;
  transition: all 0.15s ease;
  z-index: 2;
}

.folder-card-wrapper:hover .folder-card__menu {
  opacity: 1;
}

.folder-card__menu:hover {
  background: white;
  color: #64748B;
  box-shadow: var(--ps-shadow-sm);
}

.folder-context-menu {
  border-radius: 12px !important;
  min-width: 130px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* ─── Delete Dialog ──────────────────────────────────────────────────── */

.delete-confirm__body {
  padding: 28px 24px 16px;
  text-align: center;
}

.delete-confirm__icon {
  margin-bottom: 12px;
}

.delete-confirm__title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px;
}

.delete-confirm__text {
  font-size: 14px;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

.delete-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px 20px;
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */

.folder-card-skeleton {
  border-radius: var(--ps-radius-lg);
  background: white;
  border: 1px solid var(--ps-border);
  overflow: hidden;
}

/* ─── Responsive ─────────────────────────────────────────────────────── */

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .create-inline {
    flex-wrap: wrap;
  }

  .folders-grid {
    grid-template-columns: 1fr;
  }
}
</style>
