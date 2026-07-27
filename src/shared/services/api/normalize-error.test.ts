import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { normalizeApiError } from './normalize-error'

describe('normalizeApiError', () => {
  it('normalizes backend error envelope', () => {
    const response = {
      status: 422,
      data: {
        message: 'Data tidak valid',
        code: 'VALIDATION_ERROR',
        errors: { login: ['Login wajib diisi'] },
        request_id: 'request-123',
      },
    } as AxiosResponse
    const error = new AxiosError(
      'Request failed',
      '422',
      undefined,
      undefined,
      response,
    )

    expect(normalizeApiError(error)).toEqual({
      message: 'Data tidak valid',
      code: 'VALIDATION_ERROR',
      status: 422,
      errors: { login: ['Login wajib diisi'] },
      requestId: 'request-123',
    })
  })

  it('normalizes network failures without exposing internals', () => {
    const error = new AxiosError('Network Error')
    expect(normalizeApiError(error)).toMatchObject({
      code: 'NETWORK_ERROR',
    })
  })
})
