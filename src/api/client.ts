import type { ApiResponse, ApiError } from '@/types'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.photoshare.app/v1'

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('ps_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildUrl(endpoint: string, params: Record<string, string | number | boolean | undefined | null> = {}): string {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })
  return url.toString()
}

function normaliseError(err: unknown): ApiError {
  const message = err instanceof Error
    ? err.message
    : (err as { message?: string })?.message ?? 'An unexpected error occurred'
  return { success: false, data: null, message }
}

interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
}

async function fetchAdapter<T>(method: string, endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { params = {}, body } = options
  const url = buildUrl(endpoint, params)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...getAuthHeaders(),
  }

  const init: RequestInit = { method, headers }
  if (body) init.body = JSON.stringify(body)

  const response = await fetch(url, init)
  const json = await response.json()

  if (!response.ok) {
    throw { message: json?.message || `HTTP ${response.status}`, status: response.status }
  }

  return json as ApiResponse<T>
}

export const apiClient = {
  get<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return fetchAdapter<T>('GET', endpoint, options)
  },
  post<T>(endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return fetchAdapter<T>('POST', endpoint, { ...options, body })
  },
  put<T>(endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return fetchAdapter<T>('PUT', endpoint, { ...options, body })
  },
  patch<T>(endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return fetchAdapter<T>('PATCH', endpoint, { ...options, body })
  },
  delete<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
    return fetchAdapter<T>('DELETE', endpoint, options)
  },
}

export function buildSuccess<T>(data: T, message = 'Success', meta?: ApiResponse['meta']): ApiResponse<T> {
  const response: ApiResponse<T> = { success: true, data, message }
  if (meta) response.meta = meta
  return response
}

export function buildError(message = 'Something went wrong'): ApiError {
  return { success: false, data: null, message }
}

export { normaliseError }
