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
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        message:
          'Server membutuhkan waktu terlalu lama untuk merespons. Periksa koneksi database lalu coba lagi.',
        code: 'REQUEST_TIMEOUT',
      }
    }
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
