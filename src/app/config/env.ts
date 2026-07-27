const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1'
const DEFAULT_API_TIMEOUT_MS = 15_000

function parsePositiveNumber(value: string | undefined, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  apiTimeoutMs: parsePositiveNumber(
    import.meta.env.VITE_API_TIMEOUT_MS,
    DEFAULT_API_TIMEOUT_MS,
  ),
} as const
