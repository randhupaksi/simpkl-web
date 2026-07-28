import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { verifyDocument } from './document.mutations'
import { server } from '../../../../tests/mocks/server'

describe('document verification API', () => {
  it('sends status and reviewer notes without leaking unrelated fields', async () => {
    server.use(
      http.put(
        'http://localhost:8080/api/v1/documents/document-1/verify',
        async ({ request }) => {
          expect(await request.json()).toEqual({
            status: 'revision_required',
            notes: 'Nomor surat belum terlihat.',
          })
          return HttpResponse.json({
            success: true,
            message: 'Dokumen berhasil diverifikasi',
            data: {
              id: 'document-1',
              status: 'revision_required',
              notes: 'Nomor surat belum terlihat.',
            },
            meta: null,
          })
        },
      ),
    )

    const result = await verifyDocument({
      id: 'document-1',
      status: 'revision_required',
      notes: 'Nomor surat belum terlihat.',
    })

    expect(result.status).toBe('revision_required')
  })
})
