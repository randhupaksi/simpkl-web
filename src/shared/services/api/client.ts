import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from './config'
import { normalizeApiError } from './normalize-error'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import type { AuthTokens } from '@/features/auth/types/auth'
import type { ApiResponse } from '@/shared/types/api'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const refreshClient = axios.create(API_CONFIG)

export const apiClient = axios.create({
  ...API_CONFIG,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let refreshRequest: Promise<AuthTokens> | null = null

async function refreshTokens(refreshToken: string) {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<ApiResponse<AuthTokens>>('/auth/refresh', {
        refresh_token: refreshToken,
      })
      .then((response) => response.data.data)
      .finally(() => {
        refreshRequest = null
      })
  }

  return refreshRequest
}

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status
    const session = useAuthStore.getState()
    const isAuthRequest =
      request?.url?.includes('/auth/login') ||
      request?.url?.includes('/auth/refresh')

    if (
      status === 401 &&
      request &&
      !request._retry &&
      !isAuthRequest &&
      session.tokens?.refreshToken
    ) {
      request._retry = true

      try {
        const tokens = await refreshTokens(session.tokens.refreshToken)
        session.setTokens(tokens)
        request.headers.Authorization = `Bearer ${tokens.accessToken}`

        return apiClient(request)
      } catch (refreshError) {
        session.clearSession()
        return Promise.reject(normalizeApiError(refreshError))
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
