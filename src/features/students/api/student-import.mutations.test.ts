import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { importStudents } from './student-import.mutations'
import { server } from '../../../../tests/mocks/server'
import { apiClient } from '@/shared/services'

describe('student import API', () => {
  it('sends the Excel file and preview flag as multipart data', async () => {
    const previousAdapter = apiClient.defaults.adapter
    apiClient.defaults.adapter = 'fetch'
    server.use(
      http.post(
        'http://localhost:8080/api/v1/students/import',
        ({ request }) => {
          expect(request.headers.get('content-type')).toContain(
            'multipart/form-data',
          )
          return HttpResponse.json({
            success: true,
            message: 'Validasi impor selesai',
            data: {
              total: 2,
              valid: 1,
              imported: 0,
              failed: 1,
              errors: [
                { row: 3, field: 'nis', message: 'NIS sudah terdaftar' },
              ],
            },
            meta: null,
          })
        },
      ),
    )

    try {
      const result = await importStudents(
        new File(['xlsx'], 'siswa.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        false,
      )

      expect(result.valid).toBe(1)
      expect(result.errors[0]?.row).toBe(3)
    } finally {
      apiClient.defaults.adapter = previousAdapter
    }
  })
})
