import { z } from 'zod'

export const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`)

export const optionalText = (max: number) =>
  z.string().trim().max(max, `Maksimal ${max} karakter`)

export const optionalEmail = z.union([
  z.literal(''),
  z.email('Format email tidak valid'),
])

export const optionalUrl = z.union([
  z.literal(''),
  z.url('Format tautan tidak valid'),
])

export const requiredUuid = (label: string) => z.uuid(`${label} wajib dipilih`)
