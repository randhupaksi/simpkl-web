import { z } from 'zod'

import { optionalPersonName, optionalText, requiredText } from '@/shared/schemas'

export const majorSchema = z.object({
  code: requiredText('Kode jurusan', 20),
  name: requiredText('Nama jurusan', 150),
  abbreviation: requiredText('Singkatan', 30),
  head_name: optionalPersonName('Kepala jurusan', 150),
  status: z.enum(['active', 'inactive']),
  description: optionalText(2000),
})
