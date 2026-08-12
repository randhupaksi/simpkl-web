import { z } from 'zod'

import {
  optionalPersonName,
  optionalPhone,
  optionalEmail,
  optionalText,
  optionalDigits,
  requiredDigits,
  requiredPersonName,
  requiredUuid,
} from '@/shared/schemas'

export const studentSchema = z.object({
  nis: optionalDigits('NIS', 30).refine((value) => value.length > 0, {
    message: 'NIS wajib diisi',
  }),
  nisn: z.union([z.literal(''), requiredDigits('NISN', 10)]),
  name: requiredPersonName('Nama lengkap', 150),
  nickname: optionalPersonName('Nama panggilan', 80),
  gender: z.enum(['male', 'female'], {
    message: 'Jenis kelamin wajib dipilih',
  }),
  class_id: requiredUuid('Kelas'),
  major_id: requiredUuid('Jurusan'),
  phone: optionalPhone(),
  email: optionalEmail,
  address: optionalText(2000),
  parent_name: optionalPersonName('Nama orang tua/wali', 150),
  parent_phone: optionalPhone('Telepon orang tua/wali'),
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
