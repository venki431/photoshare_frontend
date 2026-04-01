import { apiClient, buildError } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'
import type { AuthPayload, CheckEmailResponse, SignupPayload, User } from '@/types'

async function safeCall<T>(fn: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T>> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'success' in err) throw err
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Network error. Please try again.'
    throw buildError(message)
  }
}

export const authService = {
  async checkEmail(email: string): Promise<ApiResponse<CheckEmailResponse>> {
    return safeCall(() => apiClient.post<CheckEmailResponse>(ENDPOINTS.AUTH.CHECK_EMAIL, { email }))
  },

  async sendOtp(email: string): Promise<ApiResponse<null>> {
    return safeCall(() => apiClient.post<null>(ENDPOINTS.AUTH.SEND_OTP, { email }))
  },

  async verifyOtp(email: string, otp: string): Promise<ApiResponse<AuthPayload>> {
    return safeCall(() => apiClient.post<AuthPayload>(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp }))
  },

  async signup(payload: SignupPayload): Promise<ApiResponse<AuthPayload>> {
    return safeCall(() => apiClient.post<AuthPayload>(ENDPOINTS.AUTH.SIGNUP, payload))
  },

  async getMe(): Promise<ApiResponse<User>> {
    return safeCall(() => apiClient.get<User>(ENDPOINTS.AUTH.ME))
  },

  async updateMe(data: Partial<User>): Promise<ApiResponse<User>> {
    return safeCall(() => apiClient.put<User>(ENDPOINTS.AUTH.UPDATE_ME, data))
  },
}
