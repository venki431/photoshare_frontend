import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/api/services/auth.service'
import type { User, SignupPayload } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('ps_auth_token'))
  const loading = ref(false)
  const otpSent = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const userName = computed(() => user.value?.name ?? 'Photographer')

  const userInitials = computed(() => {
    const name = user.value?.name ?? 'P'
    return name
      .split(' ')
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  async function checkEmail(email: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const res = await authService.checkEmail(email)
      return res.data?.exists ?? false
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to check email'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function sendOtp(email: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await authService.sendOtp(email)
      otpSent.value = true
      return true
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Failed to send OTP'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyOtp(email: string, otp: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const res = await authService.verifyOtp(email, otp)
      token.value = res.data?.token ?? null
      user.value = res.data?.user ?? null
      if (token.value) {
        localStorage.setItem('ps_auth_token', token.value)
      }
      return true
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Invalid OTP'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signup(payload: SignupPayload): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      const res = await authService.signup(payload)
      token.value = res.data?.token ?? null
      user.value = res.data?.user ?? null
      if (token.value) {
        localStorage.setItem('ps_auth_token', token.value)
      }
      return true
    } catch (err: unknown) {
      error.value = (err as { message?: string })?.message ?? 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    token.value = null
    user.value = null
    otpSent.value = false
    localStorage.removeItem('ps_auth_token')
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    try {
      const res = await authService.getMe()
      user.value = res.data ?? null
    } catch {
      logout()
    }
  }

  // Auto-restore session on load
  if (token.value) {
    fetchUser()
  }

  return {
    user, token, loading, otpSent, error,
    isAuthenticated, userName, userInitials,
    checkEmail, sendOtp, verifyOtp, signup, logout, fetchUser,
  }
})
