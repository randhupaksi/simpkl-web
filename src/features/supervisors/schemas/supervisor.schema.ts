import { z } from 'zod'

import {
  optionalDigits,
  optionalEmail,
  optionalPhone,
  optionalText,
  requiredPersonName,
} from '@/shared/schemas'

export const supervisorSchema = z.object({
  employee_number: optionalDigits('NIP/NIK', 18),
  name: requiredPersonName('Nama pembimbing', 150),
  phone: optionalPhone(),
  email: optionalEmail,
  major_id: z.union([z.literal(''), z.uuid()]),
  position: optionalText(100),
  status: z.enum(['active', 'inactive']),
  max_students: z.number().int().min(1).max(200),
})
