<template>
  <v-container fluid class="login-page pa-0">
    <v-row no-gutters class="login-layout">
      <!-- Left Hero Panel (Desktop only) -->
      <v-col cols="12" md="6" lg="6" class="d-none d-md-flex hero-panel">
        <div class="hero-bg">
          <div class="hero-orb hero-orb--1" />
          <div class="hero-orb hero-orb--2" />
          <div class="hero-orb hero-orb--3" />
          <div class="hero-grid" />
        </div>

        <div class="hero-content ps-animate-in">
          <div class="hero-badge">
            <v-icon size="16" color="white" class="mr-2">mdi-camera</v-icon>
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

          <!-- Feature cards -->
          <div class="hero-features">
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-lightning-bolt</v-icon>
              Auto compression
            </div>
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-heart</v-icon>
              Client selection
            </div>
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-share-variant</v-icon>
              Beautiful galleries
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Login Form Panel -->
      <v-col cols="12" md="6" lg="6" class="login-column">
        <div class="login-form-container">
          <!-- Mobile Header -->
          <div class="login-brand d-md-none">
            <div class="logo-mark-mobile">
              <span class="logo-letter">P</span>
            </div>
            <h2 class="brand-title">PhotoShare</h2>
          </div>

          <div class="login-card ps-animate-in">
            <!-- Header -->
            <div class="login-header">
              <h2 class="login-title">
                {{ otpSent ? 'Verify your email' : 'Welcome back' }}
              </h2>
              <p class="login-subtitle" v-html="
                otpSent
                  ? `We've sent a 6-digit code to <strong>${email}</strong>`
                  : 'Sign in to manage your photography studio'
              " />
            </div>

            <!-- Error Message -->
            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-6"
              closable
              rounded="lg"
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
                placeholder="you@yourstudio.com"
                rounded="lg"
              />

              <v-btn
                type="submit"
                block
                size="x-large"
                color="primary"
                :loading="authStore.loading"
                class="text-none font-weight-medium ps-btn-glow"
                elevation="0"
                rounded="lg"
              >
                Continue with Email
                <v-icon end size="18">mdi-arrow-right</v-icon>
              </v-btn>
            </v-form>

            <!-- OTP Step -->
            <v-form v-else class="login-form" @submit.prevent="handleVerifyOtp">
              <div class="otp-section">
                <p class="otp-instruction">Enter the 6-digit code sent to your email</p>
                <div class="otp-grid">
                  <input
                    v-for="(digit, idx) in otpDigits"
                    :key="idx"
                    :ref="el => { if (el) otpInputRefs[idx] = el }"
                    v-model="otpDigits[idx]"
                    maxlength="1"
                    inputmode="numeric"
                    class="otp-input"
                    :class="{ 'otp-input--filled': otpDigits[idx] }"
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
                class="text-none font-weight-medium ps-btn-glow"
                elevation="0"
                rounded="lg"
              >
                <v-icon start size="18">mdi-shield-check-outline</v-icon>
                Verify & Sign In
              </v-btn>

              <div class="text-center mt-4">
                <button type="button" class="back-link" @click="resetToEmailStep">
                  <v-icon size="14">mdi-arrow-left</v-icon>
                  Use a different email
                </button>
              </div>
            </v-form>

            <!-- Footer Terms -->
            <p class="login-terms">
              By signing in, you agree to our
              <router-link to="/terms" class="terms-link">Terms of Service</router-link> and
              <router-link to="/privacy" class="terms-link">Privacy Policy</router-link>.
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
const otpInputRefs = reactive([])

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
  if (otpDigits[idx] && idx < 5) otpInputRefs[idx + 1]?.focus()
}

function onOtpBackspace(idx) {
  if (!otpDigits[idx] && idx > 0) otpInputRefs[idx - 1]?.focus()
}

function resetToEmailStep() {
  otpSent.value = false
  otpDigits.fill('')
  errorMsg.value = ''
}
</script>

<style scoped>
.login-page {
  background: white;
  min-height: 100vh;
}

.login-layout { min-height: 100vh; }

/* ═══════════════════════════════════════════════════════════════════════════
   HERO PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

.hero-panel {
  position: relative;
  background: var(--ps-gradient-hero);
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 80px 60px;
  min-height: 100vh;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.hero-orb--1 {
  width: 500px;
  height: 500px;
  background: rgba(139, 92, 246, 0.15);
  top: -150px;
  right: -100px;
  animation: ps-float 20s ease-in-out infinite;
}

.hero-orb--2 {
  width: 300px;
  height: 300px;
  background: rgba(14, 165, 233, 0.1);
  bottom: -80px;
  left: -60px;
  animation: ps-float 18s ease-in-out infinite 5s;
}

.hero-orb--3 {
  width: 200px;
  height: 200px;
  background: rgba(236, 72, 153, 0.08);
  top: 50%;
  left: 50%;
  animation: ps-float 15s ease-in-out infinite 3s;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 32px 32px;
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
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: var(--ps-radius-full);
  color: white;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-title {
  font-size: clamp(36px, 4vw, 52px);
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
  font-size: 18px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 30px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
}

.hero-features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feature-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--ps-radius-full);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN FORM
   ═══════════════════════════════════════════════════════════════════════════ */

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
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Mobile Brand */
.login-brand {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.logo-mark-mobile {
  width: 56px;
  height: 56px;
  background: var(--ps-gradient-brand);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.25);
}

.logo-mark-mobile .logo-letter {
  color: white;
  font-size: 26px;
  font-weight: 800;
}

.brand-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
}

/* Login Card */
.login-card {
  background: white;
  border-radius: var(--ps-radius-2xl);
  padding: 44px 36px;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.08);
  border: 1px solid #F1F5F9;
}

.login-header {
  margin-bottom: 28px;
  text-align: center;
}

.login-title {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.login-subtitle {
  font-size: 15px;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* OTP Section */
.otp-section {
  text-align: center;
}

.otp-instruction {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 20px;
}

.otp-grid {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 8px;
}

.otp-input {
  width: 50px;
  height: 56px;
  border: 2px solid #E2E8F0;
  border-radius: var(--ps-radius-md);
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  font-family: inherit;
  color: #0F172A;
  outline: none;
  transition: all var(--ps-duration-fast);
  background: #FAFBFC;
}

.otp-input:focus {
  border-color: var(--ps-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: white;
}

.otp-input--filled {
  border-color: var(--ps-primary-light);
  background: rgba(79, 70, 229, 0.04);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

.back-link:hover { background: rgba(79, 70, 229, 0.06); }

/* Terms */
.login-terms {
  margin-top: 28px;
  text-align: center;
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.6;
}

.terms-link {
  color: var(--ps-primary);
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover { text-decoration: underline; }

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 960px) {
  .hero-panel { padding: 60px 40px; }
  .hero-title { font-size: 40px; }
}

@media (max-width: 600px) {
  .login-column { padding: 24px 16px; }
  .login-card { padding: 32px 24px; border-radius: var(--ps-radius-xl); }
  .otp-input { width: 44px; height: 50px; font-size: 20px; }
  .otp-grid { gap: 8px; }
}
</style>
