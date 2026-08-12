import { z } from 'zod'

import {
  optionalEmail,
  optionalPhone,
  optionalText,
  optionalUrl,
  requiredText,
} from '@/shared/schemas'

export const companySchema = z
  .object({
    name: requiredText('Nama perusahaan', 180),
    business_type: optionalText(100),
    industry: requiredText('Industri', 150),
    description: optionalText(3000),
    address: requiredText('Alamat', 2000),
    district: optionalText(120),
    city: requiredText('Kota/kabupaten', 100),
    province: optionalText(120),
    postal_code: z.union([z.literal(''), z.string().regex(/^\d{5}$/, 'Kode pos harus terdiri dari 5 angka')]),
    phone: optionalPhone(),
    email: optionalEmail,
    website: optionalUrl,
    maps_url: optionalUrl,
    status: z.enum([
      'candidate',
      'verifying',
      'active',
      'inactive',
      'expired',
      'not_recommended',
      'blocked',
    ]),
    capacity: z.number().int().min(0).max(10000),
    cooperation_start: z.string(),
    cooperation_end: z.string(),
    notes: optionalText(3000),
  })
  .refine(
    (value) =>
      !value.cooperation_start ||
      !value.cooperation_end ||
      value.cooperation_end >= value.cooperation_start,
    {
      path: ['cooperation_end'],
      message: 'Tanggal berakhir harus setelah tanggal mulai',
    },
  )
