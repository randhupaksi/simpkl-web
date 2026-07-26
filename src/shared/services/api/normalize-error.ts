import axios from 'axios'

import type { ApiError } from '@/shared/types/api'

type ApiErrorPayload = {
  message?: string
  code?: string
  errors?: Record<string, string[]>
  request_id?: string
}

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError<ApiErrorPayload>(error)) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan yang tidak terduga.',
    }
  }

  if (!error.response) {
    return {
      message: 'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
      code: 'NETWORK_ERROR',
    }
  }

  const { data, status } = error.response

  return {
    message: data?.message ?? 'Permintaan tidak dapat diproses.',
    code: data?.code,
    status,
    errors: data?.errors,
    requestId: data?.request_id,
  }
}
