import { describe, expect, it } from 'vitest'

import { documentUploadSchema } from './document.schema'

describe('documentUploadSchema', () => {
  it('rejects files larger than the private upload limit', () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'besar.pdf', {
      type: 'application/pdf',
    })
    const result = documentUploadSchema.safeParse({
      file,
      document_type_id: '66813d30-5f4f-4a29-8410-4fbcc21d9c84',
      owner_type: 'student',
      owner_id: 'ec8ba099-04e1-4c65-a050-36fce29fa6ef',
      period_id: '',
    })

    expect(result.success).toBe(false)
  })
})
