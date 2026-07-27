import { apiClient } from './client'
import type {
  ApiResponse,
  PaginatedMeta,
  PaginatedResponse,
} from '@/shared/types/api'

export type ListParams = {
  page: number
  per_page: number
  search?: string
  [key: string]: string | number | undefined
}

export async function getResourceList<T>(endpoint: string, params: ListParams) {
  const response = await apiClient.get<PaginatedResponse<T>>(endpoint, {
    params,
  })
  return response.data
}

export async function createResource<TData, TInput>(
  endpoint: string,
  input: TInput,
) {
  const response = await apiClient.post<ApiResponse<TData>>(endpoint, input)
  return response.data.data
}

export async function getResource<TData>(endpoint: string, id: string) {
  const response = await apiClient.get<ApiResponse<TData>>(`${endpoint}/${id}`)
  return response.data.data
}

export async function updateResource<TData, TInput>(
  endpoint: string,
  id: string,
  input: TInput,
) {
  const response = await apiClient.put<ApiResponse<TData>>(
    `${endpoint}/${id}`,
    input,
  )
  return response.data.data
}

export async function deleteResource(endpoint: string, id: string) {
  await apiClient.delete<ApiResponse<null>>(`${endpoint}/${id}`)
}

export const EMPTY_PAGINATION_META: PaginatedMeta = {
  page: 1,
  per_page: 20,
  total: 0,
  total_pages: 1,
}
