<template>
  <v-dialog v-model="model" max-width="600" persistent>
    <div class="copy-dialog">
      <!-- Header -->
      <div class="copy-header">
        <div class="copy-header__icon">
          <v-icon size="22" color="white">mdi-content-copy</v-icon>
        </div>
        <div class="copy-header__text">
          <h3 class="copy-title">Copy Selected Photos</h3>
          <p class="copy-subtitle">Copy {{ fileNames.length }} selected photos from source to destination</p>
        </div>
        <button class="copy-close" @click="handleClose">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="copy-body">
        <!-- Source Folder Picker -->
        <div class="copy-section">
          <label class="copy-label">Original Folder (Source)</label>
          <div class="picker-row">
            <div class="picker-display">
              <v-icon size="16" class="picker-icon" :color="sourceDir ? 'primary' : 'grey'">
                mdi-folder-open-outline
              </v-icon>
              <span class="picker-text" :class="{ 'picker-text--empty': !sourceDir }">
                {{ sourceName || 'No folder selected' }}
              </span>
            </div>
            <button class="picker-btn" @click="pickSource">
              <v-icon size="16">mdi-folder-search-outline</v-icon>
              Browse
            </button>
          </div>
        </div>

        <!-- Destination Folder Picker -->
        <div class="copy-section">
          <label class="copy-label">Destination Folder</label>
          <div class="picker-row">
            <div class="picker-display">
              <v-icon size="16" class="picker-icon" :color="destDir ? 'primary' : 'grey'">
                mdi-folder-outline
              </v-icon>
              <span class="picker-text" :class="{ 'picker-text--empty': !destDir }">
                {{ destName || 'No folder selected' }}
              </span>
            </div>
            <button class="picker-btn" @click="pickDest">
              <v-icon size="16">mdi-folder-search-outline</v-icon>
              Browse
            </button>
          </div>
        </div>

        <!-- Selected Files List -->
        <div class="copy-section">
          <label class="copy-label">
            Selected Images
            <span class="file-count-badge">{{ fileNames.length }}</span>
          </label>
          <div class="file-list">
            <div
              v-for="(name, idx) in fileNames"
              :key="idx"
              class="file-item"
              :class="{ 'file-item--copied': copiedFiles.has(name), 'file-item--failed': failedFiles.has(name) }"
            >
              <div class="file-item__left">
                <v-icon size="14" :color="fileItemColor(name)">
                  {{ fileItemIcon(name) }}
                </v-icon>
                <span class="file-name">{{ name }}</span>
              </div>
              <span v-if="copiedFiles.has(name)" class="file-status file-status--ok">Copied</span>
              <span v-else-if="failedFiles.has(name)" class="file-status file-status--err">Not found</span>
              <span v-else class="file-index">#{{ idx + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="copying" class="copy-progress">
          <v-progress-linear
            :model-value="progressPct"
            color="primary"
            rounded
            height="6"
          />
          <span class="progress-text">
            Copying {{ copiedFiles.size + failedFiles.size }} / {{ fileNames.length }}...
          </span>
        </div>

        <!-- Result -->
        <div v-if="done" class="copy-result" :class="failedFiles.size ? 'copy-result--warn' : 'copy-result--ok'">
          <v-icon size="18" :color="failedFiles.size ? 'warning' : 'success'">
            {{ failedFiles.size ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline' }}
          </v-icon>
          <span v-if="!failedFiles.size">
            All {{ copiedFiles.size }} photos copied successfully!
          </span>
          <span v-else>
            {{ copiedFiles.size }} copied, {{ failedFiles.size }} not found in source folder.
          </span>
        </div>

        <!-- Browser Support Warning -->
        <div v-if="!isSupported" class="copy-warning">
          <v-icon size="16" color="warning">mdi-alert-outline</v-icon>
          <span>
            File System Access requires Chrome, Edge, or Opera. This feature is not supported in your browser.
          </span>
        </div>
      </div>

      <!-- Footer -->
      <div class="copy-footer">
        <v-btn variant="text" class="text-none" color="grey-darken-1" @click="handleClose">
          {{ done ? 'Close' : 'Cancel' }}
        </v-btn>
        <v-btn
          v-if="!done"
          color="primary"
          class="text-none ps-btn-glow"
          elevation="0"
          rounded="lg"
          :disabled="!canCopy"
          :loading="copying"
          @click="startCopy"
        >
          <v-icon start size="18">mdi-content-copy</v-icon>
          Copy Files
        </v-btn>
        <v-btn
          v-if="done && failedFiles.size"
          color="primary"
          variant="tonal"
          class="text-none"
          rounded="lg"
          @click="resetState"
        >
          <v-icon start size="18">mdi-refresh</v-icon>
          Retry
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  fileNames?: string[]
}>(), {
  modelValue: false,
  fileNames: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const isSupported = 'showDirectoryPicker' in window

const sourceDir = ref<FileSystemDirectoryHandle | null>(null)
const destDir = ref<FileSystemDirectoryHandle | null>(null)
const sourceName = ref('')
const destName = ref('')

const copying = ref(false)
const done = ref(false)
const copiedFiles = ref<Set<string>>(new Set())
const failedFiles = ref<Set<string>>(new Set())

const canCopy = computed(() =>
  isSupported && !!sourceDir.value && !!destDir.value && props.fileNames.length > 0 && !copying.value
)

const progressPct = computed(() => {
  if (!props.fileNames.length) return 0
  return Math.round(((copiedFiles.value.size + failedFiles.value.size) / props.fileNames.length) * 100)
})

function fileItemIcon(name: string): string {
  if (copiedFiles.value.has(name)) return 'mdi-check-circle'
  if (failedFiles.value.has(name)) return 'mdi-close-circle'
  return 'mdi-image-outline'
}

function fileItemColor(name: string): string {
  if (copiedFiles.value.has(name)) return 'success'
  if (failedFiles.value.has(name)) return 'error'
  return 'grey'
}

async function pickSource(): Promise<void> {
  try {
    const handle = await (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker()
    sourceDir.value = handle
    sourceName.value = handle.name
  } catch {
    // User cancelled
  }
}

async function pickDest(): Promise<void> {
  try {
    const handle = await (window as unknown as { showDirectoryPicker: (opts?: { mode?: string }) => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker({ mode: 'readwrite' })
    destDir.value = handle
    destName.value = handle.name
  } catch {
    // User cancelled
  }
}

async function startCopy(): Promise<void> {
  if (!sourceDir.value || !destDir.value) return

  copying.value = true
  done.value = false
  copiedFiles.value = new Set()
  failedFiles.value = new Set()

  for (const name of props.fileNames) {
    try {
      const fileHandle = await sourceDir.value.getFileHandle(name)
      const file = await fileHandle.getFile()
      const destFileHandle = await destDir.value.getFileHandle(name, { create: true })
      const writable = await destFileHandle.createWritable()
      await writable.write(file)
      await writable.close()
      copiedFiles.value = new Set(copiedFiles.value).add(name)
    } catch {
      failedFiles.value = new Set(failedFiles.value).add(name)
    }
  }

  copying.value = false
  done.value = true
}

function resetState(): void {
  done.value = false
  copiedFiles.value = new Set()
  failedFiles.value = new Set()
}

function handleClose(): void {
  model.value = false
  // Reset after dialog close animation
  setTimeout(() => {
    resetState()
    sourceDir.value = null
    destDir.value = null
    sourceName.value = ''
    destName.value = ''
  }, 300)
}
</script>

<style scoped>
.copy-dialog {
  background: white;
  border-radius: var(--ps-radius-2xl);
  overflow: hidden;
  box-shadow: var(--ps-shadow-xl);
}

/* ── Header ──────────────────────────────────────────────────────────── */

.copy-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 28px 0;
}

.copy-header__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.copy-header__text { flex: 1; }

.copy-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.copy-subtitle {
  font-size: 13px;
  color: #94A3B8;
  margin: 2px 0 0;
}

.copy-close {
  width: 32px;
  height: 32px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  transition: all var(--ps-duration-fast);
}

.copy-close:hover { background: #F1F5F9; color: #475569; }

/* ── Body ────────────────────────────────────────────────────────────── */

.copy-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.copy-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.copy-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: var(--ps-radius-full);
  background: rgba(79, 70, 229, 0.08);
  color: var(--ps-primary);
  text-transform: none;
  letter-spacing: 0;
}

/* ── Folder Picker ───────────────────────────────────────────────────── */

.picker-row {
  display: flex;
  gap: 8px;
}

.picker-display {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-md);
  background: #F8FAFC;
  min-width: 0;
}

.picker-icon { flex-shrink: 0; }

.picker-text {
  font-size: 13px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.picker-text--empty {
  color: #CBD5E1;
  font-weight: 400;
}

.picker-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--ps-radius-md);
  border: 1px solid var(--ps-border);
  background: white;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all var(--ps-duration-fast);
  font-family: inherit;
  white-space: nowrap;
}

.picker-btn:hover {
  border-color: var(--ps-primary-light);
  color: var(--ps-primary);
}

/* ── File List ───────────────────────────────────────────────────────── */

.file-list {
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-md);
  background: #FAFBFC;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  font-size: 13px;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.15s ease;
}

.file-item:last-child { border-bottom: none; }

.file-item__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #334155;
}

.file-index {
  font-size: 11px;
  font-weight: 600;
  color: #CBD5E1;
  flex-shrink: 0;
}

.file-status {
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
  padding: 1px 8px;
  border-radius: var(--ps-radius-full);
}

.file-status--ok {
  color: #059669;
  background: rgba(16, 185, 129, 0.08);
}

.file-status--err {
  color: #DC2626;
  background: rgba(239, 68, 68, 0.08);
}

.file-item--copied {
  background: rgba(16, 185, 129, 0.03);
}

.file-item--failed {
  background: rgba(239, 68, 68, 0.03);
}

/* ── Progress ────────────────────────────────────────────────────────── */

.copy-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
  text-align: center;
}

/* ── Result ──────────────────────────────────────────────────────────── */

.copy-result {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--ps-radius-md);
  font-size: 13px;
  font-weight: 500;
}

.copy-result--ok {
  background: rgba(16, 185, 129, 0.06);
  color: #059669;
}

.copy-result--warn {
  background: rgba(245, 158, 11, 0.06);
  color: #D97706;
}

/* ── Warning ─────────────────────────────────────────────────────────── */

.copy-warning {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--ps-radius-md);
  background: rgba(245, 158, 11, 0.06);
  font-size: 13px;
  color: #92400E;
  line-height: 1.5;
}

/* ── Footer ──────────────────────────────────────────────────────────── */

.copy-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 28px 24px;
}

/* ── Scrollbar ───────────────────────────────────────────────────────── */

.file-list::-webkit-scrollbar { width: 6px; }
.file-list::-webkit-scrollbar-track { background: transparent; }
.file-list::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 3px; }
.file-list::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
</style>
