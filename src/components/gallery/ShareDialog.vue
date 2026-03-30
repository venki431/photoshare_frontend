<template>
  <v-dialog v-model="model" max-width="520" persistent>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center pa-5 pb-2">
        <v-icon class="mr-2" color="primary">mdi-share-variant</v-icon>
        Share Project
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="model = false" />
      </v-card-title>

      <v-card-text class="px-5">
        <!-- Shareable Link -->
        <label class="text-caption text-medium-emphasis d-block mb-1">Shareable link</label>
        <div class="d-flex align-center ga-2 mb-4">
          <v-text-field
            :model-value="shareUrl"
            readonly
            variant="outlined"
            density="compact"
            hide-details
            class="flex-grow-1"
            @focus="$event.target.select()"
          />
          <v-btn
            :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
            :color="copied ? 'success' : undefined"
            variant="tonal"
            @click="copyLink"
          />
        </div>

        <!-- Password Protection -->
        <div class="d-flex align-center justify-space-between mb-2">
          <div>
            <div class="text-body-2 font-weight-medium">Password protection</div>
            <div class="text-caption text-medium-emphasis">
              Require a password to view this gallery
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
          <div v-if="passwordEnabled" class="mb-2">
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              variant="outlined"
              density="compact"
              hide-details
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
            />
          </div>
        </v-expand-transition>

        <!-- Expiry -->
        <div class="d-flex align-center justify-space-between mt-2">
          <div>
            <div class="text-body-2 font-weight-medium">Link expiry</div>
            <div class="text-caption text-medium-emphasis">
              Auto-expire this share link
            </div>
          </div>
          <v-select
            v-model="expiry"
            :items="expiryOptions"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 160px"
          />
        </div>
      </v-card-text>

      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn variant="text" @click="model = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSave">
          Save & Copy Link
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  shareId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// ── Share URL ────────────────────────────────────────
const shareUrl = computed(() => {
  const base = window.location.origin
  return `${base}/gallery/${props.shareId}`
})

// ── Copy ─────────────────────────────────────────────
const copied = ref(false)
let copyTimeout = null

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for insecure contexts
    const input = document.createElement('input')
    input.value = shareUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { copied.value = false }, 2000)
  }
}

// ── Password ─────────────────────────────────────────
const passwordEnabled = ref(false)
const password = ref('')
const showPassword = ref(false)

// ── Expiry ───────────────────────────────────────────
const expiryOptions = [
  { title: 'Never', value: 'never' },
  { title: '1 day', value: '1d' },
  { title: '7 days', value: '7d' },
  { title: '30 days', value: '30d' },
]
const expiry = ref('never')

// ── Save ─────────────────────────────────────────────
async function handleSave() {
  await copyLink()
  // In production, POST share settings to API here:
  // await api.updateShareSettings(props.projectId, { passwordEnabled, password, expiry })
  model.value = false
}
</script>
