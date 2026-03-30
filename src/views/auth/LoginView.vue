<template>
  <v-container fluid class="login-page fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- Left Hero Panel (desktop only) -->
      <v-col cols="12" md="6" lg="7" class="d-none d-md-flex hero-panel">
        <div class="hero-content">
          <div class="hero-badge mb-6">
            <v-icon size="16" color="white" class="mr-1">mdi-camera</v-icon>
            Built for Photographers
          </div>
          <h1 class="hero-title mb-4">
            Photo selection,<br />
            <span class="text-gradient">simplified.</span>
          </h1>
          <p class="hero-subtitle mb-8">
            Share galleries with clients, let them pick their favorites,
            and deliver faster than ever.
          </p>
          <div class="hero-stats d-flex ga-8">
            <div>
              <div class="text-h5 font-weight-bold text-white">2,400+</div>
              <div class="text-body-2 text-white-50">Photographers</div>
            </div>
            <div>
              <div class="text-h5 font-weight-bold text-white">180K</div>
              <div class="text-body-2 text-white-50">Photos Shared</div>
            </div>
            <div>
              <div class="text-h5 font-weight-bold text-white">98%</div>
              <div class="text-body-2 text-white-50">Satisfaction</div>
            </div>
          </div>
        </div>
        <div class="hero-overlay" />
      </v-col>

      <!-- Right Login Form -->
      <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center">
        <div class="login-form-wrapper">
          <!-- Mobile Logo -->
          <div class="d-md-none text-center mb-8">
            <div class="logo-mark mx-auto mb-3" style="width: 48px; height: 48px; font-size: 20px;">P</div>
            <h2 class="text-h6 font-weight-bold">PhotoShare</h2>
          </div>

          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-2">
              {{ otpSent ? 'Enter verification code' : 'Welcome back' }}
            </h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ otpSent
                ? `We sent a 6-digit code to ${email}`
                : 'Sign in to your PhotoShare studio'
              }}
            </p>
          </div>

          <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-4" closable @click:close="errorMsg = ''">
            {{ errorMsg }}
          </v-alert>

          <!-- Email Step -->
          <v-form v-if="!otpSent" @submit.prevent="handleSendOtp">
            <v-text-field
              v-model="email"
              label="Email address"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Valid email required']"
              class="mb-4"
              autofocus
            />

            <v-btn
              type="submit"
              block
              size="x-large"
              color="primary"
              :loading="authStore.loading"
              class="text-none mb-4"
              elevation="0"
            >
              Continue with Email
            </v-btn>

            <div class="d-flex align-center my-6">
              <v-divider />
              <span class="text-caption text-medium-emphasis mx-4">or</span>
              <v-divider />
            </div>

            <v-btn
              block
              size="large"
              variant="outlined"
              color="on-surface"
              prepend-icon="mdi-google"
              class="text-none mb-3"
              disabled
            >
              Continue with Google
            </v-btn>
          </v-form>

          <!-- OTP Step -->
          <v-form v-else @submit.prevent="handleVerifyOtp">
            <div class="d-flex ga-3 mb-6 justify-center">
              <v-text-field
                v-for="(_, idx) in 6"
                :key="idx"
                :ref="el => { if (el) otpRefs[idx] = el }"
                v-model="otpDigits[idx]"
                maxlength="1"
                class="otp-input"
                variant="outlined"
                density="comfortable"
                hide-details
                @input="onOtpInput(idx)"
                @keydown.backspace="onOtpBackspace(idx)"
                :autofocus="idx === 0"
              />
            </div>

            <v-btn
              type="submit"
              block
              size="x-large"
              color="primary"
              :loading="authStore.loading"
              :disabled="otpCode.length < 6"
              class="text-none mb-4"
              elevation="0"
            >
              Verify & Sign In
            </v-btn>

            <div class="text-center">
              <v-btn
                variant="text"
                size="small"
                color="primary"
                class="text-none"
                @click="otpSent = false"
              >
                Use a different email
              </v-btn>
            </div>
          </v-form>

          <p class="text-caption text-medium-emphasis text-center mt-8">
            By continuing, you agree to PhotoShare's Terms of Service and Privacy Policy.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const otpSent = ref(false)
const errorMsg = ref('')
const otpDigits = reactive(['', '', '', '', '', ''])
const otpRefs = reactive([])

const otpCode = computed(() => otpDigits.join(''))

async function handleSendOtp() {
  if (!email.value) return
  errorMsg.value = ''
  try {
    await authStore.sendOtp(email.value)
    otpSent.value = true
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to send verification code'
  }
}

async function handleVerifyOtp() {
  if (otpCode.value.length < 6) return
  errorMsg.value = ''
  try {
    await authStore.verifyOtp(email.value, otpCode.value)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err?.message || 'Invalid verification code'
  }
}

function onOtpInput(idx) {
  if (otpDigits[idx] && idx < 5) {
    otpRefs[idx + 1]?.focus()
  }
}

function onOtpBackspace(idx) {
  if (!otpDigits[idx] && idx > 0) {
    otpRefs[idx - 1]?.focus()
  }
}
</script>

<style scoped>
.login-page {
  background: #FFFFFF;
  min-height: 100vh;
}

.hero-panel {
  position: relative;
  background: linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #0EA5E9 100%);
  overflow: hidden;
  align-items: flex-end;
  padding: 64px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 6px 16px;
  border-radius: 100px;
  color: white;
  font-size: 13px;
  font-weight: 500;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: linear-gradient(90deg, #93C5FD, #C4B5FD);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 440px;
  line-height: 1.6;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: url('https://picsum.photos/seed/hero/1200/900') center/cover;
  opacity: 0.08;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
}

.logo-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4F46E5, #0EA5E9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 16px;
}

.otp-input {
  max-width: 48px;
}

.otp-input :deep(input) {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0;
}

@media (max-width: 960px) {
  .login-form-wrapper {
    padding: 24px 20px;
  }
}
</style>
