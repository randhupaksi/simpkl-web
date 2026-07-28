import { z } from 'zod'

import { optionalEmail, optionalText, requiredText } from '@/shared/schemas'

export const companyContactSchema = z.object({
  name: requiredText('Nama PIC', 150),
  position: optionalText(100),
  division: optionalText(100),
  phone: optionalText(30),
  email: optionalEmail,
  is_primary: z.boolean(),
  notes: optionalText(2000),
})
