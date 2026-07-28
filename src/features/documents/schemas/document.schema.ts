import { z } from 'zod'

export const documentUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Pilih file yang akan diunggah.' })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'Ukuran file maksimal 10 MB.',
    ),
  document_type_id: z.uuid('ID tipe dokumen tidak valid.'),
  owner_type: z.enum(['student', 'company', 'placement', 'period']),
  owner_id: z.uuid('ID pemilik dokumen tidak valid.'),
  period_id: z
    .union([z.literal(''), z.uuid('ID periode tidak valid.')])
    .optional(),
  placement_id: z
    .union([z.literal(''), z.uuid('ID penempatan tidak valid.')])
    .optional(),
  number: z.string().max(120).optional(),
  issued_at: z.string().optional(),
  valid_from: z.string().optional(),
  valid_until: z.string().optional(),
  notes: z.string().max(2000).optional(),
})

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>
