import { z } from 'zod'

import { optionalText, requiredUuid } from '@/shared/schemas'

export const archiveSchema = z.object({
  period_id: requiredUuid('Periode'),
  reason: optionalText(2000),
})
