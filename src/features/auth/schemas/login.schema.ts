import { z } from 'zod'

export const loginSchema = z.object({
  login: z.string().trim().min(1, 'Email atau username wajib diisi.'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.')
    .max(72, 'Password maksimal 72 karakter.'),
})

export type LoginInput = z.infer<typeof loginSchema>
