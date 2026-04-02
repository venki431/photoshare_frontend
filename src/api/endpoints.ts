export const ENDPOINTS = {
  AUTH: {
    CHECK_EMAIL: '/auth/check-email',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_ME: '/auth/me',
  },

  FOLDERS: {
    LIST: '/folders',
    CREATE: '/folders',
    DETAIL: (id: string) => `/folders/${id}`,
    UPDATE: (id: string) => `/folders/${id}`,
    DELETE: (id: string) => `/folders/${id}`,
  },

  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    BY_FOLDER: (folderId: string) => `/projects/folder/${folderId}`,
    BY_SHARE_ID: (shareId: string) => `/projects/share/${shareId}`,
  },

  PHOTOS: {
    LIST_BY_PROJECT: (projectId: string) => `/projects/${projectId}/photos`,
    SELECTED: (projectId: string) => `/projects/${projectId}/photos/selected`,
    SELECTED_DOWNLOAD: (projectId: string) => `/projects/${projectId}/photos/selected/download`,
    DETAIL: (id: string) => `/photos/${id}`,
    UPLOAD: (projectId: string) => `/projects/${projectId}/photos`,
    DELETE: (id: string) => `/photos/${id}`,
    BULK_DELETE: '/photos/bulk-delete',
  },

  SELECTIONS: {
    GET_BY_SHARE: (shareId: string) => `/selections/${shareId}`,
    TOGGLE_PHOTO: (shareId: string) => `/selections/${shareId}/toggle`,
    SET_COMMENT: (shareId: string) => `/selections/${shareId}/comment`,
    SUBMIT: (shareId: string) => `/selections/${shareId}/submit`,
  },
} as const
