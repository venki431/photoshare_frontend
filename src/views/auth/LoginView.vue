<template>
  <v-container fluid class="login-page pa-0">
    <v-row no-gutters class="login-layout">
      <!-- Left Hero Panel (Desktop only) -->
      <v-col cols="12" md="6" lg="6" class="d-none d-md-flex hero-panel">
        <div class="hero-content">
          <div class="hero-badge">
            <v-icon size="18" color="white" class="mr-2">mdi-camera</v-icon>
            Built for Professional Photographers
          </div>

          <h1 class="hero-title">
            Client photo selection,<br />
            <span class="text-gradient">made effortless.</span>
          </h1>

          <p class="hero-subtitle">
            Share beautiful galleries with your clients, collect their favorite selections, 
            and deliver final images faster than ever before.
          </p>

          <div class="hero-stats">
            <div class="hero-stat">
              <div class="stat-number">2,400+</div>
              <div class="stat-label">Photographers trust us</div>
            </div>
            <div class="hero-stat">
              <div class="stat-number">180K+</div>
              <div class="stat-label">Photos selected by clients</div>
            </div>
            <div class="hero-stat">
              <div class="stat-number">98%</div>
              <div class="stat-label">Client satisfaction rate</div>
            </div>
          </div>
        </div>

        <!-- Subtle background image overlay -->
        <div class="hero-overlay" />
        <div class="hero-pattern" />
      </v-col>

      <!-- Right Login Form Panel -->
      <v-col cols="12" md="6" lg="6" class="login-column">
        <div class="login-form-container">
          <!-- Mobile Header -->
          <div class="login-brand d-md-none mb-8">
            <div class="logo-mark mx-auto mb-3">P</div>
            <h2 class="text-h5 font-weight-bold text-center">PhotoShare</h2>
          </div>

          <div class="login-card">
            <!-- Header -->
            <div class="login-header text-center">
              <h2 class="text-h4 font-weight-bold mb-2">
                {{ otpSent ? 'Verify your email' : 'Welcome back' }}
              </h2>
              <p class="text-body-1 text-medium-emphasis">
                {{ otpSent 
                  ? `We've sent a 6-digit code to <strong>${email}</strong>` 
                  : 'Sign in to manage your photography studio'
                }}
              </p>
            </div>

            <!-- Error Message -->
            <v-alert 
              v-if="errorMsg" 
              type="error" 
              variant="tonal" 
              density="compact" 
              class="mb-6"
              closable 
              @click:close="errorMsg = ''"
            >
              {{ errorMsg }}
            </v-alert>

            <!-- Email Step -->
            <v-form v-if="!otpSent" class="login-form" @submit.prevent="handleSendOtp">
              <v-text-field
                v-model="email"
                label="Business Email Address"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                variant="outlined"
                density="comfortable"
                autofocus
                class="mb-6"
                placeholder="you@yourstudio.com"
              />

              <v-btn
                type="submit"
                block
                size="x-large"
                color="primary"
                :loading="authStore.loading"
                class="text-none font-weight-medium"
                elevation="0"
                rounded="lg"
              >
                Continue with Email
              </v-btn>

              <div class="login-divider my-8" v-if="false">
                <v-divider />
                <span class="text-caption text-medium-emphasis px-4">or continue with</span>
                <v-divider />
              </div>

              <v-btn
                block
                size="large"
                variant="outlined"
                color="grey-darken-3"
                prepend-icon="mdi-google"
                class="text-none"
                disabled
                v-if="false"
              >
                Sign in with Google
              </v-btn>
            </v-form>

            <!-- OTP Step -->
            <v-form v-else class="login-form" @submit.prevent="handleVerifyOtp">
              <div class="otp-section mb-8">
                <p class="text-body-2 text-medium-emphasis text-center mb-4">
                  Enter the 6-digit code sent to your email
                </p>
                <div class="otp-grid">
                  <v-text-field
                    v-for="(digit, idx) in otpDigits"
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
              </div>

              <v-btn
                type="submit"
                block
                size="x-large"
                color="primary"
                :loading="authStore.loading"
                :disabled="otpCode.length < 6"
                class="text-none font-weight-medium"
                elevation="0"
                rounded="lg"
              >
                Verify &amp; Sign In
              </v-btn>

              <div class="text-center mt-6">
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  class="text-none"
                  @click="resetToEmailStep"
                >
                  ← Use a different email
                </v-btn>
              </div>
            </v-form>

            <!-- Footer Terms -->
            <p class="login-terms text-caption text-medium-emphasis text-center mt-10">
              By signing in, you agree to our 
              <a href="#" class="text-primary">Terms of Service</a> and 
              <a href="#" class="text-primary">Privacy Policy</a>.
            </p>
          </div>
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
const otpDigits = reactive(Array(6).fill(''))
const otpRefs = reactive([])

const otpCode = computed(() => otpDigits.join(''))

const emailRules = [
  v => !!v?.trim() || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Please enter a valid email address'
]

async function handleSendOtp() {
  errorMsg.value = ''
  try {
    await authStore.sendOtp(email.value)
    otpSent.value = true
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to send verification code. Please try again.'
  }
}

async function handleVerifyOtp() {
  if (otpCode.value.length < 6) return
  errorMsg.value = ''
  try {
    await authStore.verifyOtp(email.value, otpCode.value)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err?.message || 'Invalid or expired verification code'
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

function resetToEmailStep() {
  otpSent.value = false
  otpDigits.fill('')
  errorMsg.value = ''
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.login-layout {
  min-height: 100vh;
}

/* Hero Panel */
.hero-panel {
  position: relative;
  background: linear-gradient(135deg, #1e2937 0%, #312e81 45%, #4f46e5 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 80px 60px;
  min-height: 100vh;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 520px;
  padding: 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 9999px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 52px;
  line-height: 1.05;
  font-weight: 800;
  color: white;
  letter-spacing: -0.025em;
  margin-bottom: 20px;
}

.text-gradient {
  background: linear-gradient(90deg, #a5b4fc, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 19px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.78);
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

/* Background Elements */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: url('https://picsum.photos/seed/photographer/1400/1200') center/cover;
  opacity: 0.12;
  mix-blend-mode: overlay;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.06) 0%, transparent 60%);
  z-index: 1;
}

/* Login Form Side */
.login-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  background: white;
}

.login-form-container {
  width: 100%;
  max-width: 520px;
}

.login-brand {
  text-align: center;
}

.logo-mark {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: 800;
  box-shadow: 0 10px 15px -3px rgb(79 70 229 / 0.3);
}

.login-card {
  background: white;
  border-radius: 28px;
  padding: 48px 40px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.12);
  border: 1px solid #f1f5f9;
}

.login-header {
  margin-bottom: 32px;
}

.login-form {
  display: grid;
  gap: 24px;
}

.login-divider {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 13px;
}

.otp-section {
  text-align: center;
}

.otp-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
  margin-bottom: 12px;
}

.otp-input {
  max-width: 58px;
  margin: 0 auto;
}

.otp-input :deep(.v-field) {
  border-radius: 14px;
  font-size: 24px;
}

.otp-input :deep(input) {
  text-align: center;
  font-weight: 700;
  letter-spacing: 2px;
}

.login-terms {
  margin-top: 32px;
}

.login-terms a {
  text-decoration: none;
}

@media (max-width: 960px) {
  .hero-panel {
    padding: 60px 40px;
  }
  .hero-title {
    font-size: 42px;
  }
}

@media (max-width: 600px) {
  .login-column {
    padding: 24px 16px;
  }
  .login-card {
    padding: 32px 24px;
    border-radius: 24px;
  }
  .hero-panel {
    padding: 60px 32px;
  }
}
</style>