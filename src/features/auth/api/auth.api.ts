import { apiClient } from '@/shared/services/api/client'
import type { ApiResponse } from '@/shared/types/api'
import type {
  AuthResultPayload,
  AuthUserPayload,
} from '@/features/auth/types/auth'
import type { LoginInput } from '@/features/auth/schemas'

export async function login(input: LoginInput) {
  const response = await apiClient.post<ApiResponse<AuthResultPayload>>(
    '/auth/login',
    input,
  )
  return response.data.data
}

export async function logout(refreshToken: string) {
  await apiClient.post('/auth/logout', { refresh_token: refreshToken })
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiResponse<AuthUserPayload>>('/auth/me')
  return response.data.data
}

export async function refresh(refreshToken: string) {
  const response = await apiClient.post<ApiResponse<AuthResultPayload>>(
    '/auth/refresh',
    { refresh_token: refreshToken },
  )
  return response.data.data
}
