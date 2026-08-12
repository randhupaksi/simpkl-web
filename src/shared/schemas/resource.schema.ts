import { z } from 'zod'

export const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`)

export const optionalText = (max: number) =>
  z.string().trim().max(max, `Maksimal ${max} karakter`)

const personNamePattern = /^[\p{L}][\p{L}\s.'’,-]*$/u
const phonePattern = /^(?:0\d{8,12}|\+62\d{8,11})$/

export const requiredPersonName = (label: string, max: number) =>
  requiredText(label, max).regex(
    personNamePattern,
    `${label} hanya boleh berisi huruf, spasi, titik, apostrof, koma, atau tanda hubung`,
  )

export const optionalPersonName = (label: string, max: number) =>
  optionalText(max).refine(
    (value) => !value || personNamePattern.test(value),
    `${label} hanya boleh berisi huruf, spasi, titik, apostrof, koma, atau tanda hubung`,
  )

export const requiredDigits = (label: string, length: number) =>
  z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${length}}$`), `${label} harus terdiri dari tepat ${length} angka`)

export const optionalDigits = (label: string, max: number) =>
  z
    .string()
    .trim()
    .refine(
      (value) => !value || new RegExp(`^\\d{1,${max}}$`).test(value),
      `${label} hanya boleh berisi angka dan maksimal ${max} digit`,
    )

export const optionalPhone = (label = 'Nomor telepon') =>
  z
    .string()
    .trim()
    .refine(
      (value) => !value || phonePattern.test(value),
      `${label} harus diawali 0 atau +62 dan berisi 9–13 angka, misalnya 081234567890 atau +6281234567890`,
    )

export const requiredAcademicYear = (label: string) =>
  requiredText(label, 9).refine(
    (value) => {
      const match = /^(\d{4})\/(\d{4})$/.exec(value)
      if (!match) return false
      return Number(match[2]) === Number(match[1]) + 1
    },
    `${label} harus memakai format tahun berurutan, misalnya 2026/2027`,
  )

export const optionalEmail = z.union([
  z.literal(''),
  z.email('Format email tidak valid'),
])

export const optionalUrl = z.union([
  z.literal(''),
  z.url('Format tautan tidak valid'),
])

export const requiredUuid = (label: string) => z.uuid(`${label} wajib dipilih`)
