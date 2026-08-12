import { z } from 'zod'

import { optionalText, requiredText, requiredUuid } from '@/shared/schemas'

const optionalUuid = z.union([z.literal(''), z.uuid()]).default('')
const optionalTextWithDefault = optionalText(2000).default('')

export const placementSchema = z
  .object({
    period_id: requiredUuid('Periode'),
    student_id: requiredUuid('Siswa'),
    company_id: requiredUuid('Perusahaan'),
    company_contact_id: optionalUuid,
    supervisor_id: optionalUuid,
    previous_placement_id: optionalUuid,
    division: optionalText(120),
    position: optionalText(120),
    work_system: z.enum(['wfo', 'wfh', 'hybrid', 'company_policy']),
    address: optionalText(2000),
    start_date: requiredText('Tanggal mulai', 10),
    end_date: requiredText('Tanggal selesai', 10),
    status: z.enum([
      'draft',
      'pending_verification',
      'approved',
      'ready',
      'active',
      'completed',
      'cancelled',
      'transferred',
    ]),
    source: z.enum([
      'school',
      'self_submission',
      'teacher_recommendation',
      'company_recruitment',
      'previous_partnership',
    ]),
    override_reason: optionalTextWithDefault,
    transfer_reason: optionalTextWithDefault,
    notes: optionalTextWithDefault,
  })
  .refine((value) => value.end_date > value.start_date, {
    path: ['end_date'],
    message: 'Tanggal selesai harus setelah tanggal mulai',
  })
