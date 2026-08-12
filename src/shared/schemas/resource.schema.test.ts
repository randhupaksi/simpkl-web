import { describe, expect, it } from 'vitest'

import {
  optionalPhone,
  requiredAcademicYear,
  requiredDigits,
  requiredPersonName,
} from './resource.schema'

describe('resource form validation helpers', () => {
  it('requires NISN to contain exactly ten digits', () => {
    expect(requiredDigits('NISN', 10).safeParse('1234567890').success).toBe(true)
    expect(requiredDigits('NISN', 10).safeParse('123456789').success).toBe(false)
    expect(requiredDigits('NISN', 10).safeParse('12345abcde').success).toBe(false)
  })

  it('accepts Indonesian phone formats and rejects invalid lengths', () => {
    expect(optionalPhone().safeParse('081234567890').success).toBe(true)
    expect(optionalPhone().safeParse('+6281234567890').success).toBe(true)
    expect(optionalPhone().safeParse('081234').success).toBe(false)
  })

  it('rejects digits in person names and enforces consecutive academic years', () => {
    expect(requiredPersonName('Nama lengkap', 150).safeParse('Siti Rahma').success).toBe(true)
    expect(requiredPersonName('Nama lengkap', 150).safeParse('Siti Rahma 2').success).toBe(false)
    expect(requiredAcademicYear('Tahun ajaran').safeParse('2026/2027').success).toBe(true)
    expect(requiredAcademicYear('Tahun ajaran').safeParse('2026/2028').success).toBe(false)
  })
})
