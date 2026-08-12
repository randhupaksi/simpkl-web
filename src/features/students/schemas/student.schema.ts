import { z } from 'zod'

import {
  optionalEmail,
  optionalText,
  requiredText,
  requiredUuid,
} from '@/shared/schemas'

export const studentSchema = z.object({
  nis: requiredText('NIS', 50),
  nisn: optionalText(50),
  name: requiredText('Nama lengkap', 150),
  nickname: optionalText(80),
  gender: z.enum(['male', 'female'], {
    message: 'Jenis kelamin wajib dipilih',
  }),
  class_id: requiredUuid('Kelas'),
  major_id: requiredUuid('Jurusan'),
  phone: optionalText(30),
  email: optionalEmail,
  address: optionalText(2000),
  parent_name: optionalText(150),
  parent_phone: optionalText(30),
  status: z.enum([
    'active',
    'inactive',
    'graduated',
    'transferred',
    'withdrawn',
  ]),
  pkl_status: z.enum([
    'unplaced',
    'placement_process',
    'placed',
    'ready',
    'active',
    'completed',
    'cancelled',
  ]),
  notes: optionalText(2000),
})
