const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1'
// Keep the browser timeout slightly above the API write timeout (30 seconds),
// so the server can return its own structured error instead of a cancelled request.
const DEFAULT_API_TIMEOUT_MS = 35_000

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
