export interface ApiError {
  message: string
  code?: string
  status?: number
  errors?: Record<string, string[]>
  requestId?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: unknown
}

export interface PaginatedMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginatedMeta
}
