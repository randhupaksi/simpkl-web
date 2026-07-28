import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { transferPlacement } from './placement.mutations'
import { server } from '../../../../tests/mocks/server'

describe('placement transfer API', () => {
  it('maps the transfer payload and date to the proven backend contract', async () => {
    server.use(
      http.post(
        'http://localhost:8080/api/v1/placements/placement-old/transfer',
        async ({ request }) => {
          const body = (await request.json()) as {
            end_date: string
            reason: string
            new_placement: { company_id: string }
          }
          expect(body).toEqual({
            end_date: '2026-08-01T00:00:00+07:00',
            reason: 'Perubahan lokasi',
            new_placement: { company_id: 'company-new' },
          })
          return HttpResponse.json({
            success: true,
            message: 'Siswa berhasil dipindahkan',
            data: { id: 'placement-new' },
            meta: null,
          })
        },
      ),
    )

    const result = await transferPlacement({
      id: 'placement-old',
      end_date: '2026-08-01',
      reason: 'Perubahan lokasi',
      new_placement: { company_id: 'company-new' },
    })

    expect(result.id).toBe('placement-new')
  })
})
