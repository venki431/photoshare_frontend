/**
 * API Client — Central HTTP layer for PhotoShare
 *
 * Toggle USE_MOCK to switch between mock data and a real backend.
 * Set VITE_USE_MOCK=false in your .env to hit real endpoints.
 *
 * All methods return a normalised response:
 *   { success, data, message, meta? }
 */

// ─── Single source of truth for mock toggle ─────────────────────────────────
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ─── Base URL (ignored when USE_MOCK = true) ─────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.photoshare.app/v1'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAuthHeaders() {
  const token = localStorage.getItem('ps_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildUrl(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })
  return url.toString()
}

/**
 * Normalise every API error into a consistent shape so the rest
 * of the app never has to inspect raw fetch/HTTP errors.
 */
function normaliseError(err) {
  return {
    success: false,
    data: null,
    message: err?.message || 'An unexpected error occurred',
  }
}

// ─── Real fetch adapter ───────────────────────────────────────────────────────

async function fetchAdapter(method, endpoint, { params = {}, body } = {}) {
  const url = buildUrl(endpoint, params)

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeaders(),
    },
  }

  if (body) options.body = JSON.stringify(body)

  const response = await fetch(url, options)
  const json = await response.json()

  if (!response.ok) {
    throw { message: json?.message || `HTTP ${response.status}`, status: response.status }
  }

  return json // Assumes the real API already returns { success, data, message }
}

// ─── Public API client ────────────────────────────────────────────────────────

/**
 * apiClient is only used when USE_MOCK = false.
 * Services call it transparently — they never call fetch directly.
 */
export const apiClient = {
  get(endpoint, options = {}) {
    return fetchAdapter('GET', endpoint, options)
  },
  post(endpoint, body, options = {}) {
    return fetchAdapter('POST', endpoint, { ...options, body })
  },
  put(endpoint, body, options = {}) {
    return fetchAdapter('PUT', endpoint, { ...options, body })
  },
  patch(endpoint, body, options = {}) {
    return fetchAdapter('PATCH', endpoint, { ...options, body })
  },
  delete(endpoint, options = {}) {
    return fetchAdapter('DELETE', endpoint, options)
  },
}

// ─── Response builders (used by mock handlers) ────────────────────────────────

export function buildSuccess(data, message = 'Success', meta = null) {
  const response = { success: true, data, message }
  if (meta) response.meta = meta
  return response
}

export function buildError(message = 'Something went wrong') {
  return { success: false, data: null, message }
}
