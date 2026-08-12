import { z } from 'zod'

import {
  optionalEmail,
  optionalPhone,
  optionalText,
  requiredPersonName,
} from '@/shared/schemas'

export const companyContactSchema = z.object({
  name: requiredPersonName('Nama PIC', 150),
  position: optionalText(100),
  division: optionalText(100),
  phone: optionalPhone(),
  email: optionalEmail,
  is_primary: z.boolean(),
  notes: optionalText(2000),
})
