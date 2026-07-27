import { env } from '@/app/config/env'

export const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
} as const
