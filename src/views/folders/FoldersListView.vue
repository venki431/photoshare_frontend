<template>
  <div class="folders-page">
    <!-- Header -->
    <div class="page-header ps-animate-in">
      <div class="page-header__text">
        <h1 class="page-title">Folders</h1>
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
      <router-link
        v-for="folder in folderStore.folders"
        :key="folder.id"
        :to="`/folders/${folder.id}`"
        class="folder-card"
      >
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFolderStore } from '@/stores/folders'
import EmptyState from '@/components/ui/EmptyState.vue'

const folderStore = useFolderStore()
const router = useRouter()

const showCreate = ref(false)
const newName = ref('')
const creating = ref(false)
const createInputRef = ref<HTMLInputElement | null>(null)

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
