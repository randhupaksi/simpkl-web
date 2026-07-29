import { z } from 'zod'

import { requiredText, requiredUuid } from '@/shared/schemas'

export const readinessActionSchema = z.object({
  student_id: requiredUuid('Siswa'),
  period_id: requiredUuid('Periode'),
  reason: z.string(),
})

export const readinessOverrideSchema = readinessActionSchema.extend({
  reason: requiredText('Alasan pengecualian', 2000),
})
