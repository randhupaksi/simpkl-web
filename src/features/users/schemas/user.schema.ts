import { z } from 'zod'

import { optionalEmail, requiredText } from '@/shared/schemas'

const userBaseSchema = z.object({
  name: requiredText('Nama pengguna', 150),
  email: optionalEmail.refine((value) => value.length > 0, {
    message: 'Email wajib diisi',
  }),
  username: requiredText('Username', 80),
  major_id: z.union([z.literal(''), z.uuid()]),
  class_id: z.union([z.literal(''), z.uuid()]),
  status: z.enum(['active', 'inactive', 'locked']),
})

export const userCreateSchema = userBaseSchema.extend({
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
})

export const userEditSchema = userBaseSchema.extend({
  password: z.literal(''),
})

export const userSchema = userEditSchema
