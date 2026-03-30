/**
 * Auth Service — handles OTP login and session verification.
 */

import { apiClient, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'

async function safeCall(fn) {
  try {
    return await fn()
  } catch (err) {
    if (err && 'success' in err) throw err
    throw buildError(err?.message || 'Network error. Please try again.')
  }
}

export const authService = {
  async sendOtp(email) {
    return safeCall(() => apiClient.post(ENDPOINTS.AUTH.SEND_OTP, { email }))
  },

  async verifyOtp(email, otp) {
    return safeCall(() => apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp }))
  },

  async getMe() {
    return safeCall(() => apiClient.get(ENDPOINTS.AUTH.ME))
  },
}
