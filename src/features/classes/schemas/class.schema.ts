import { z } from 'zod'

import { optionalText, requiredText, requiredUuid } from '@/shared/schemas'

export const classSchema = z.object({
  name: requiredText('Nama kelas', 100),
  level: z.number().int().min(10).max(13),
  major_id: requiredUuid('Jurusan'),
  homeroom_teacher: optionalText(150),
  academic_year: requiredText('Tahun ajaran', 20),
  status: z.enum(['active', 'inactive']),
})
