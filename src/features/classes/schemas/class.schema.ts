import { z } from 'zod'

import {
  optionalPersonName,
  requiredAcademicYear,
  requiredText,
  requiredUuid,
} from '@/shared/schemas'

export const classSchema = z.object({
  name: requiredText('Nama kelas', 100),
  level: z.number().int().min(10).max(13),
  major_id: requiredUuid('Jurusan'),
  homeroom_teacher: optionalPersonName('Wali kelas', 150),
  academic_year: requiredAcademicYear('Tahun ajaran'),
  status: z.enum(['active', 'inactive']),
})
