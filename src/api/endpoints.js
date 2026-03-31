/**
 * API Endpoints — single registry of every URL path used by the app.
 *
 * Keeping endpoints here means:
 *  - One place to update when the backend changes a URL.
 *  - Mock handlers and real requests always reference the same string.
 *  - Easy to audit the API surface area.
 *
 * Dynamic segments use a factory function, e.g. ENDPOINTS.PROJECTS.DETAIL('proj_1')
 */

export const ENDPOINTS = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  AUTH: {
    CHECK_EMAIL: '/auth/check-email',
    SEND_OTP:    '/auth/send-otp',
    VERIFY_OTP:  '/auth/verify-otp',
    SIGNUP:      '/auth/signup',
    LOGOUT:      '/auth/logout',
    ME:          '/auth/me',
    UPDATE_ME:   '/auth/me',
  },

  // ── Projects ────────────────────────────────────────────────────────────────
  PROJECTS: {
    LIST:          '/projects',
    DETAIL:        (id)      => `/projects/${id}`,
    CREATE:        '/projects',
    UPDATE:        (id)      => `/projects/${id}`,
    DELETE:        (id)      => `/projects/${id}`,
    BY_SHARE_ID:   (shareId) => `/projects/share/${shareId}`,
  },

  // ── Photos ──────────────────────────────────────────────────────────────────
  PHOTOS: {
    LIST_BY_PROJECT: (projectId) => `/projects/${projectId}/photos`,
    SELECTED:        (projectId) => `/projects/${projectId}/photos/selected`,
    DETAIL:          (id)        => `/photos/${id}`,
    UPLOAD:          (projectId) => `/projects/${projectId}/photos`,
    DELETE:          (id)        => `/photos/${id}`,
    BULK_DELETE:     '/photos/bulk-delete',
  },

  // ── Selections ───────────────────────────────────────────────────────────────
  SELECTIONS: {
    GET_BY_SHARE:   (shareId) => `/selections/${shareId}`,
    TOGGLE_PHOTO:   (shareId) => `/selections/${shareId}/toggle`,
    SET_COMMENT:    (shareId) => `/selections/${shareId}/comment`,
    SUBMIT:         (shareId) => `/selections/${shareId}/submit`,
  },
}
