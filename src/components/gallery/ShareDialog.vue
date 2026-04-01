<template>
  <v-dialog v-model="model" max-width="520" persistent>
    <div class="share-dialog">
      <!-- Header -->
      <div class="share-header">
        <div class="share-header__icon">
          <v-icon size="22" color="white">mdi-share-variant-outline</v-icon>
        </div>
        <div class="share-header__text">
          <h3 class="share-title">Share Gallery</h3>
          <p class="share-subtitle">Send a beautiful gallery link to your client</p>
        </div>
        <button class="share-close" @click="model = false">
          <v-icon size="18">mdi-close</v-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="share-body">
        <!-- Link Section -->
        <div class="share-section">
          <label class="share-label">Gallery Link</label>
          <div class="link-row">
            <div class="link-input" @click="selectLink">
              <v-icon size="16" class="link-icon">mdi-link</v-icon>
              <span class="link-text">{{ shareUrl }}</span>
            </div>
            <button class="copy-btn" :class="{ 'copy-btn--copied': copied }" @click="copyLink">
              <v-icon size="18">{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <!-- Password Protection -->
        <div class="share-section">
          <div class="toggle-row">
            <div class="toggle-info">
              <v-icon size="18" class="toggle-icon">mdi-lock-outline</v-icon>
              <div>
                <div class="toggle-title">Password Protection</div>
                <div class="toggle-desc">Require a password to view</div>
              </div>
            </div>
            <v-switch
              v-model="passwordEnabled"
              color="primary"
              hide-details
              density="compact"
              inset
            />
          </div>

          <v-expand-transition>
            <div v-if="passwordEnabled" class="toggle-content">
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />
            </div>
          </v-expand-transition>
        </div>

        <!-- Expiry -->
        <div class="share-section">
          <div class="toggle-row">
            <div class="toggle-info">
              <v-icon size="18" class="toggle-icon">mdi-clock-outline</v-icon>
              <div>
                <div class="toggle-title">Link Expiry</div>
                <div class="toggle-desc">Auto-expire this link</div>
              </div>
            </div>
            <v-select
              v-model="expiry"
              :items="expiryOptions"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              style="max-width: 140px"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="share-footer">
        <v-btn variant="text" class="text-none" color="grey-darken-1" @click="model = false">
          Cancel
        </v-btn>
        <v-btn color="primary" class="text-none ps-btn-glow" elevation="0" rounded="lg" @click="handleSave">
          <v-icon start size="18">mdi-content-copy</v-icon>
          Save & Copy Link
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  shareId?: string
}>(), {
  modelValue: false,
  shareId: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const shareUrl = computed(() => `${window.location.origin}/gallery/${props.shareId}`)

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function selectLink(): void {
  const range = document.createRange()
  const el = document.querySelector('.link-text')
  if (el) {
    range.selectNodeContents(el)
    window.getSelection()?.removeAllRanges()
    window.getSelection()?.addRange(range)
  }
}

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    const input = document.createElement('input')
    input.value = shareUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  copied.value = true
  if (copyTimeout) clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => { copied.value = false }, 2000)
}

const passwordEnabled = ref(false)
const password = ref('')
const showPassword = ref(false)

const expiryOptions = [
  { title: 'Never', value: 'never' },
  { title: '1 day', value: '1d' },
  { title: '7 days', value: '7d' },
  { title: '30 days', value: '30d' },
]
const expiry = ref('never')

async function handleSave(): Promise<void> {
  await copyLink()
  model.value = false
}
</script>

<style scoped>
.share-dialog {
  background: white;
  border-radius: var(--ps-radius-2xl);
  overflow: hidden;
  box-shadow: var(--ps-shadow-xl);
}

/* ── Header ───────────────────────────────────────────────────────────── */

.share-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 28px 0;
}

.share-header__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.share-header__text { flex: 1; }

.share-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.share-subtitle {
  font-size: 13px;
  color: #94A3B8;
  margin: 2px 0 0;
}

.share-close {
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

.share-close:hover { background: #F1F5F9; color: #475569; }

/* ── Body ─────────────────────────────────────────────────────────────── */

.share-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.link-row {
  display: flex;
  gap: 8px;
}

.link-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-md);
  background: #F8FAFC;
  cursor: text;
  min-width: 0;
}

.link-icon { color: #94A3B8; flex-shrink: 0; }

.link-text {
  font-size: 13px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
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

.copy-btn:hover { border-color: var(--ps-primary-light); color: var(--ps-primary); }

.copy-btn--copied {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
  color: #059669;
}

/* Toggle rows */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.toggle-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-icon { color: #94A3B8; }

.toggle-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.toggle-desc {
  font-size: 12px;
  color: #94A3B8;
}

.toggle-content {
  padding-top: 4px;
}

/* ── Footer ───────────────────────────────────────────────────────────── */

.share-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 28px 24px;
}
</style>
