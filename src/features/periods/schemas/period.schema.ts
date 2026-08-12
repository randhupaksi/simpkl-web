import { z } from 'zod'

import { optionalText, requiredAcademicYear, requiredText } from '@/shared/schemas'

export const periodSchema = z
  .object({
    name: requiredText('Nama periode', 150),
    academic_year: requiredAcademicYear('Tahun ajaran'),
    semester: z.enum(['odd', 'even'], {
      message: 'Semester wajib dipilih',
    }),
    start_date: requiredText('Tanggal mulai', 10),
    end_date: requiredText('Tanggal selesai', 10),
    cohort: z.number().int().min(2000).max(2200),
    status: z.enum(['draft', 'preparation', 'active', 'completed', 'archived']),
    notes: optionalText(2000),
  })
  .refine((value) => value.end_date > value.start_date, {
    path: ['end_date'],
    message: 'Tanggal selesai harus setelah tanggal mulai',
  })
