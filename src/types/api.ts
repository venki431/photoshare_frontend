/** Standard API envelope returned by all endpoints */
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface ApiError {
  success: false
  data: null
  message: string
  status?: number
}

/** Query params accepted by paginated list endpoints */
export interface PaginationParams {
  page?: number
  perPage?: number
}
