import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from './config'
import { normalizeApiError } from './normalize-error'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import type {
  AuthResultPayload,
  AuthTokens,
  AuthUser,
} from '@/features/auth/types/auth'
import { mapAuthTokens, mapAuthUser } from '@/features/auth/utils'
import type { ApiResponse } from '@/shared/types/api'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const refreshClient = axios.create(API_CONFIG)

export const apiClient = axios.create({
  ...API_CONFIG,
  headers: {
    Accept: 'application/json',
  },
})

let refreshRequest: Promise<{
  tokens: AuthTokens
  user: AuthUser
}> | null = null

async function refreshTokens(refreshToken: string) {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<ApiResponse<AuthResultPayload>>('/auth/refresh', {
        refresh_token: refreshToken,
      })
      .then((response) => ({
        tokens: mapAuthTokens(response.data.data.tokens),
        user: mapAuthUser(response.data.data.user),
      }))
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
        const refreshed = await refreshTokens(session.tokens.refreshToken)
        session.setSession(refreshed.user, refreshed.tokens)
        request.headers.Authorization = `Bearer ${refreshed.tokens.accessToken}`

        return apiClient(request)
      } catch (refreshError) {
        session.clearSession()
        if (!window.location.pathname.startsWith('/auth/login')) {
          window.location.assign('/auth/login')
        }
        return Promise.reject(normalizeApiError(refreshError))
      }
    }

    if (status === 401 && !isAuthRequest) {
      session.clearSession()
      if (!window.location.pathname.startsWith('/auth/login')) {
        window.location.assign('/auth/login')
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
