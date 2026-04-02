<template>
  <div class="folder-list">
    <div class="folder-list__header">
      <span class="folder-list__title">Folders</span>
      <button class="folder-list__add-btn" @click="showCreateInput = true" title="New folder">
        <v-icon size="18">mdi-plus</v-icon>
      </button>
    </div>

    <!-- Create folder inline input -->
    <div v-if="showCreateInput" class="folder-create">
      <input
        ref="createInputRef"
        v-model="newFolderName"
        type="text"
        placeholder="Folder name..."
        class="folder-create__input"
        @keyup.enter="handleCreate"
        @keyup.escape="cancelCreate"
      />
      <button class="folder-create__btn folder-create__btn--confirm" @click="handleCreate" :disabled="!newFolderName.trim()">
        <v-icon size="16">mdi-check</v-icon>
      </button>
      <button class="folder-create__btn folder-create__btn--cancel" @click="cancelCreate">
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="folderStore.loading && !folderStore.folders.length" class="folder-list__loading">
      <div v-for="n in 3" :key="n" class="ps-shimmer" style="height: 40px; border-radius: 10px; margin-bottom: 4px" />
    </div>

    <!-- Folder items -->
    <div v-else class="folder-list__items">
      <div
        v-for="folder in folderStore.folders"
        :key="folder.id"
        class="folder-item"
        :class="{ 'folder-item--active': folderStore.selectedFolderId === folder.id }"
        @click="handleSelect(folder.id)"
      >
        <v-icon size="20" class="folder-item__icon">
          {{ folderStore.selectedFolderId === folder.id ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>

        <!-- Rename mode -->
        <input
          v-if="renamingId === folder.id"
          ref="renameInputRef"
          v-model="renameValue"
          type="text"
          class="folder-item__rename-input"
          @keyup.enter="confirmRename(folder.id)"
          @keyup.escape="cancelRename"
          @blur="confirmRename(folder.id)"
          @click.stop
        />

        <!-- Normal display -->
        <template v-else>
          <span class="folder-item__name text-truncate">{{ folder.name }}</span>
          <span class="folder-item__count">{{ folder.projectCount }}</span>
        </template>

        <!-- Context menu trigger -->
        <v-menu v-if="renamingId !== folder.id" location="bottom end" :close-on-content-click="true">
          <template #activator="{ props }">
            <button class="folder-item__menu-btn" v-bind="props" @click.stop>
              <v-icon size="16">mdi-dots-vertical</v-icon>
            </button>
          </template>
          <v-list density="compact" class="folder-context-menu">
            <v-list-item @click.stop="startRename(folder)">
              <template #prepend><v-icon size="18">mdi-pencil-outline</v-icon></template>
              <v-list-item-title>Rename</v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="handleDelete(folder)" class="text-error">
              <template #prepend><v-icon size="18" color="error">mdi-delete-outline</v-icon></template>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!folderStore.loading && !folderStore.folders.length" class="folder-list__empty">
      <v-icon size="28" color="grey-lighten-1">mdi-folder-plus-outline</v-icon>
      <span>No folders yet</span>
    </div>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="delete-confirm-card">
        <div class="delete-confirm-card__body">
          <div class="delete-confirm-card__icon">
            <v-icon size="28" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <h4 class="delete-confirm-card__title">Delete folder?</h4>
          <p class="delete-confirm-card__text">
            This will permanently delete <strong>{{ folderToDelete?.name }}</strong> and all its
            {{ folderToDelete?.projectCount ?? 0 }} project(s). This action cannot be undone.
          </p>
        </div>
        <div class="delete-confirm-card__actions">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="deleting" @click="confirmDelete">
            Delete
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useFolderStore } from '@/stores/folders'
import type { Folder } from '@/types'

const folderStore = useFolderStore()
const router = useRouter()

const showCreateInput = ref(false)
const newFolderName = ref('')
const createInputRef = ref<HTMLInputElement | null>(null)

const renamingId = ref<string | null>(null)
const renameValue = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

const deleteDialog = ref(false)
const folderToDelete = ref<Folder | null>(null)
const deleting = ref(false)

function handleSelect(id: string): void {
  folderStore.selectFolder(id)
  router.push(`/folders/${id}`)
}

async function handleCreate(): Promise<void> {
  if (!newFolderName.value.trim()) return
  try {
    const folder = await folderStore.createFolder({ name: newFolderName.value.trim() })
    newFolderName.value = ''
    showCreateInput.value = false
    handleSelect(folder.id)
  } catch {
    // error handled by store
  }
}

function cancelCreate(): void {
  showCreateInput.value = false
  newFolderName.value = ''
}

function startRename(folder: Folder): void {
  renamingId.value = folder.id
  renameValue.value = folder.name
  nextTick(() => {
    const inputs = renameInputRef.value
    if (Array.isArray(inputs)) {
      inputs[0]?.focus()
      inputs[0]?.select()
    }
  })
}

async function confirmRename(id: string): Promise<void> {
  if (!renameValue.value.trim() || renamingId.value !== id) {
    cancelRename()
    return
  }
  try {
    await folderStore.updateFolder(id, { name: renameValue.value.trim() })
  } catch {
    // error handled by store
  }
  cancelRename()
}

function cancelRename(): void {
  renamingId.value = null
  renameValue.value = ''
}

function handleDelete(folder: Folder): void {
  folderToDelete.value = folder
  deleteDialog.value = true
}

async function confirmDelete(): Promise<void> {
  if (!folderToDelete.value) return
  deleting.value = true
  try {
    await folderStore.deleteFolder(folderToDelete.value.id)
    deleteDialog.value = false
    // Navigate to first remaining folder or projects page
    if (folderStore.folders.length > 0) {
      handleSelect(folderStore.folders[0].id)
    } else {
      router.push('/projects')
    }
  } catch {
    // error handled by store
  } finally {
    deleting.value = false
    folderToDelete.value = null
  }
}

// Focus create input when shown
import { watch } from 'vue'
watch(showCreateInput, (val) => {
  if (val) nextTick(() => createInputRef.value?.focus())
})
</script>

<style scoped>
.folder-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.folder-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 6px;
}

.folder-list__title {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.folder-list__add-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: all 0.15s ease;
}

.folder-list__add-btn:hover {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
}

/* Create Input */
.folder-create {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
}

.folder-create__input {
  flex: 1;
  height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: white;
}

.folder-create__input:focus {
  border-color: var(--ps-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.folder-create__btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.folder-create__btn--confirm {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.folder-create__btn--confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.folder-create__btn--cancel {
  background: rgba(239, 68, 68, 0.08);
  color: #EF4444;
}

/* Folder Items */
.folder-list__items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 4px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  transition: all 0.15s ease;
}

.folder-item:hover {
  background: #F8FAFC;
  color: #334155;
}

.folder-item--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
  font-weight: 600;
}

.folder-item--active:hover {
  background: rgba(79, 70, 229, 0.08);
}

.folder-item__icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.folder-item--active .folder-item__icon {
  opacity: 1;
  color: var(--ps-primary);
}

.folder-item__name {
  flex: 1;
  min-width: 0;
}

.folder-item__count {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.04);
  color: #94A3B8;
  flex-shrink: 0;
}

.folder-item--active .folder-item__count {
  background: rgba(79, 70, 229, 0.1);
  color: var(--ps-primary);
}

.folder-item__menu-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #CBD5E1;
  opacity: 0;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.folder-item:hover .folder-item__menu-btn {
  opacity: 1;
}

.folder-item__menu-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #64748B;
}

.folder-item__rename-input {
  flex: 1;
  height: 30px;
  padding: 0 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  min-width: 0;
}

.folder-item__rename-input:focus {
  border-color: var(--ps-primary);
}

/* Context Menu */
.folder-context-menu {
  border-radius: 12px !important;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

/* Loading */
.folder-list__loading {
  padding: 4px 8px;
}

/* Empty */
.folder-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 12px;
  font-size: 12px;
  color: #94A3B8;
}

/* Delete Confirmation */
.delete-confirm-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.delete-confirm-card__body {
  padding: 28px 24px 16px;
  text-align: center;
}

.delete-confirm-card__icon {
  margin-bottom: 12px;
}

.delete-confirm-card__title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px;
}

.delete-confirm-card__text {
  font-size: 14px;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

.delete-confirm-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px 20px;
}
</style>
