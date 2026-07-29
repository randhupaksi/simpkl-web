import { z } from 'zod'

import { optionalText, requiredText } from '@/shared/schemas'

export const roleSchema = z.object({
  code: requiredText('Kode role', 80),
  name: requiredText('Nama role', 120),
  description: optionalText(2000),
  is_system: z.boolean(),
  status: z.enum(['active', 'inactive']),
})
