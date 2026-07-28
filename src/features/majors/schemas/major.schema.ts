import { z } from 'zod'

import { optionalText, requiredText } from '@/shared/schemas'

export const majorSchema = z.object({
  code: requiredText('Kode jurusan', 20),
  name: requiredText('Nama jurusan', 150),
  abbreviation: requiredText('Singkatan', 30),
  head_name: optionalText(150),
  status: z.enum(['active', 'inactive']),
  description: optionalText(2000),
})
