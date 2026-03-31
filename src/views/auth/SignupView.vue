<template>
  <v-container fluid class="signup-page pa-0">
    <v-row no-gutters class="signup-layout">
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
            Join Thousands of Photographers
          </div>

          <h1 class="hero-title">
            Start sharing your<br />
            <span class="text-gradient">best work today.</span>
          </h1>

          <p class="hero-subtitle">
            Create your free account, build stunning galleries, and let clients
            pick their favorite shots — all in one seamless workflow.
          </p>

          <div class="hero-features">
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-lightning-bolt</v-icon>
              Free to start
            </div>
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-shield-check</v-icon>
              Secure & private
            </div>
            <div class="feature-pill">
              <v-icon size="16" color="primary-darken-1">mdi-clock-fast</v-icon>
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Signup Form Panel -->
      <v-col cols="12" md="6" lg="6" class="signup-column">
        <div class="signup-form-container">
          <!-- Mobile Header -->
          <div class="signup-brand d-md-none">
            <div class="logo-mark-mobile">
              <span class="logo-letter">P</span>
            </div>
            <h2 class="brand-title">PhotoShare</h2>
          </div>

          <div class="signup-card ps-animate-in">
            <!-- Step indicator -->
            <div class="step-indicator" v-if="!signupComplete">
              <div class="step" :class="{ active: step === 1, done: step > 1 }">
                <div class="step-dot">
                  <v-icon v-if="step > 1" size="14" color="white">mdi-check</v-icon>
                  <span v-else>1</span>
                </div>
                <span class="step-label">Your Info</span>
              </div>
              <div class="step-line" :class="{ active: step >= 2 }" />
              <div class="step" :class="{ active: step === 2 }">
                <div class="step-dot">
                  <span>2</span>
                </div>
                <span class="step-label">Verify Email</span>
              </div>
            </div>

            <!-- Header -->
            <div class="signup-header">
              <h2 class="signup-title">
                {{ step === 1 ? 'Create your account' : 'Verify your email' }}
              </h2>
              <p class="signup-subtitle" v-html="
                step === 1
                  ? 'Fill in your details to get started with PhotoShare'
                  : `We've sent a 6-digit code to <strong>${form.email}</strong>`
              " />
            </div>

            <!-- Error Message -->
            <v-alert
              v-if="errorMsg"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-5"
              closable
              rounded="lg"
              @click:close="errorMsg = ''"
            >
              {{ errorMsg }}
            </v-alert>

            <!-- Step 1: Profile Form -->
            <v-form
              v-if="step === 1"
              ref="formRef"
              class="signup-form"
              @submit.prevent="handleSendOtp"
              v-model="formValid"
            >
              <v-text-field
                v-model="form.name"
                label="Full Name"
                prepend-inner-icon="mdi-account-outline"
                :rules="nameRules"
                autofocus
                placeholder="John Doe"
              />

              <v-text-field
                v-model="form.email"
                label="Email Address"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="emailRules"
                placeholder="you@yourstudio.com"
              />

              <v-text-field
                v-model="form.phone_number"
                label="Phone Number"
                type="tel"
                prepend-inner-icon="mdi-phone-outline"
                :rules="phoneRules"
                placeholder="+91 98765 43210"
              />

              <v-text-field
                v-model="form.date_of_birth"
                label="Date of Birth"
                type="date"
                prepend-inner-icon="mdi-calendar-outline"
                :rules="dobRules"
                :max="maxDob"
              />

              <v-textarea
                v-model="form.address"
                label="Address"
                prepend-inner-icon="mdi-map-marker-outline"
                :rules="addressRules"
                placeholder="Your full address"
                rows="2"
                auto-grow
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details="auto"
              />

              <v-btn
                type="submit"
                block
                size="x-large"
                color="primary"
                :loading="authStore.loading"
                :disabled="!formValid || submitting"
                class="text-none font-weight-medium ps-btn-glow mt-2"
                elevation="0"
                rounded="lg"
              >
                Send Verification Code
                <v-icon end size="18">mdi-arrow-right</v-icon>
              </v-btn>
            </v-form>

            <!-- Step 2: OTP Verification -->
            <v-form v-if="step === 2" class="signup-form" @submit.prevent="handleSignup">
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
                    @paste="onOtpPaste($event)"
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
                :disabled="otpCode.length < 6 || submitting"
                class="text-none font-weight-medium ps-btn-glow"
                elevation="0"
                rounded="lg"
              >
                <v-icon start size="18">mdi-shield-check-outline</v-icon>
                Create Account
              </v-btn>

              <div class="otp-actions">
                <button
                  type="button"
                  class="back-link"
                  @click="step = 1; otpDigits.fill(''); errorMsg = ''"
                >
                  <v-icon size="14">mdi-arrow-left</v-icon>
                  Back to form
                </button>

                <button
                  type="button"
                  class="resend-link"
                  :disabled="resendCooldown > 0"
                  @click="handleResendOtp"
                >
                  {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
                </button>
              </div>
            </v-form>

            <!-- Footer -->
            <p class="signup-terms">
              Already have an account?
              <router-link to="/login" class="terms-link font-weight-bold">Sign in</router-link>
            </p>

            <p class="signup-terms mt-1">
              By signing up, you agree to our
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
import { ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const step = ref(1)
const formRef = ref(null)
const formValid = ref(false)
const errorMsg = ref('')
const submitting = ref(false)
const signupComplete = ref(false)
const resendCooldown = ref(0)

const form = reactive({
  name: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  address: '',
})

const otpDigits = reactive(Array(6).fill(''))
const otpInputRefs = reactive([])
const otpCode = computed(() => otpDigits.join(''))

// Max DOB: must be at least 13 years old
const maxDob = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 13)
  return d.toISOString().split('T')[0]
})

// ─── Validation rules ───────────────────────────────────────────────────────

const nameRules = [
  v => !!v?.trim() || 'Full name is required',
  v => v?.trim().length >= 2 || 'Name must be at least 2 characters',
]

const emailRules = [
  v => !!v?.trim() || 'Email is required',
  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
]

const phoneRules = [
  v => !!v?.trim() || 'Phone number is required',
  v => /^[+]?[\d\s()-]{7,20}$/.test(v) || 'Please enter a valid phone number',
]

const dobRules = [
  v => !!v || 'Date of birth is required',
  v => {
    if (!v) return true
    const age = (new Date() - new Date(v)) / (365.25 * 24 * 60 * 60 * 1000)
    return age >= 13 || 'You must be at least 13 years old'
  },
]

const addressRules = [
  v => !!v?.trim() || 'Address is required',
  v => v?.trim().length >= 5 || 'Address must be at least 5 characters',
]

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleSendOtp() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  errorMsg.value = ''
  submitting.value = true
  try {
    // Check if email already exists
    const exists = await authStore.checkEmail(form.email)
    if (exists) {
      errorMsg.value = 'An account with this email already exists. Please sign in instead.'
      return
    }
    await authStore.sendOtp(form.email)
    step.value = 2
    startResendCooldown()
    await nextTick()
    otpInputRefs[0]?.focus()
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to send verification code'
  } finally {
    submitting.value = false
  }
}

async function handleSignup() {
  if (otpCode.value.length < 6) return
  errorMsg.value = ''
  submitting.value = true
  try {
    await authStore.signup({
      name: form.name,
      email: form.email,
      phone_number: form.phone_number,
      date_of_birth: form.date_of_birth,
      address: form.address,
      otp: otpCode.value,
    })
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err?.message || 'Signup failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function handleResendOtp() {
  if (resendCooldown.value > 0) return
  errorMsg.value = ''
  try {
    await authStore.sendOtp(form.email)
    otpDigits.fill('')
    startResendCooldown()
    await nextTick()
    otpInputRefs[0]?.focus()
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to resend code'
  }
}

function startResendCooldown() {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

// ─── OTP input helpers ───────────────────────────────────────────────────────

function onOtpInput(idx) {
  const val = otpDigits[idx]
  if (!/^\d$/.test(val)) {
    otpDigits[idx] = ''
    return
  }
  if (idx < 5) otpInputRefs[idx + 1]?.focus()
  // Auto-submit when all 6 digits filled
  if (otpCode.value.length === 6) handleSignup()
}

function onOtpBackspace(idx) {
  if (!otpDigits[idx] && idx > 0) otpInputRefs[idx - 1]?.focus()
}

function onOtpPaste(event) {
  const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (pasted.length === 0) return
  event.preventDefault()
  for (let i = 0; i < 6; i++) {
    otpDigits[i] = pasted[i] || ''
  }
  const focusIdx = Math.min(pasted.length, 5)
  otpInputRefs[focusIdx]?.focus()
  if (pasted.length === 6) handleSignup()
}
</script>

<style scoped>
.signup-page {
  background: white;
  min-height: 100vh;
}

.signup-layout { min-height: 100vh; }

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
   SIGNUP FORM
   ═══════════════════════════════════════════════════════════════════════════ */

.signup-column {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
  background: white;
}

.signup-form-container {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Mobile Brand */
.signup-brand {
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

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 28px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: #E2E8F0;
  color: #64748B;
  transition: all 0.3s ease;
}

.step.active .step-dot {
  background: var(--ps-gradient-brand);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.step.done .step-dot {
  background: #10B981;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #94A3B8;
  white-space: nowrap;
}

.step.active .step-label { color: #4F46E5; }
.step.done .step-label { color: #10B981; }

.step-line {
  width: 80px;
  height: 2px;
  background: #E2E8F0;
  margin: 0 12px;
  margin-bottom: 22px;
  border-radius: 2px;
  transition: background 0.3s ease;
}

.step-line.active {
  background: linear-gradient(90deg, #10B981, #4F46E5);
}

/* Signup Card */
.signup-card {
  background: white;
  border-radius: var(--ps-radius-2xl);
  padding: 40px 36px;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.08);
  border: 1px solid #F1F5F9;
}

.signup-header {
  margin-bottom: 24px;
  text-align: center;
}

.signup-title {
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.signup-subtitle {
  font-size: 15px;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  transition: all 0.2s ease;
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

.otp-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.back-link,
.resend-link {
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
  transition: background 0.2s ease;
}

.back-link:hover,
.resend-link:hover { background: rgba(79, 70, 229, 0.06); }

.resend-link:disabled {
  color: #94A3B8;
  cursor: not-allowed;
}

.resend-link:disabled:hover { background: none; }

/* Terms */
.signup-terms {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.6;
}

.signup-terms:last-child { margin-top: 4px; }

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
  .signup-column { padding: 24px 16px; }
  .signup-card { padding: 28px 20px; border-radius: var(--ps-radius-xl); }
  .otp-input { width: 44px; height: 50px; font-size: 20px; }
  .otp-grid { gap: 8px; }
  .step-line { width: 50px; }
}
</style>
