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
  meta: unknown | null
}

export interface PaginatedMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginatedMeta
}
