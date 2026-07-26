const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1'
const DEFAULT_API_TIMEOUT_MS = 15_000

function resolveTimeout(value: string | undefined) {
  const timeout = Number(value)

  return Number.isFinite(timeout) && timeout > 0
    ? timeout
    : DEFAULT_API_TIMEOUT_MS
}

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  timeout: resolveTimeout(import.meta.env.VITE_API_TIMEOUT_MS),
} as const
