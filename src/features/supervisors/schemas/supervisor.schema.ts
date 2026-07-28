import { z } from 'zod'

import { optionalEmail, optionalText, requiredText } from '@/shared/schemas'

export const supervisorSchema = z.object({
  employee_number: optionalText(50),
  name: requiredText('Nama pembimbing', 150),
  phone: optionalText(30),
  email: optionalEmail,
  major_id: z.union([z.literal(''), z.uuid()]),
  position: optionalText(100),
  status: z.enum(['active', 'inactive']),
  max_students: z.number().int().min(1).max(200),
})
