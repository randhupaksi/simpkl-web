import { z } from 'zod'

import { optionalText, requiredText } from '@/shared/schemas'

export const permissionSchema = z.object({
  code: requiredText('Kode permission', 120),
  name: requiredText('Nama permission', 150),
  module: requiredText('Modul', 80),
  description: optionalText(2000),
})
