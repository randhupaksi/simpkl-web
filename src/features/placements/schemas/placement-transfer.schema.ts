import { placementSchema } from './placement.schema'
import { requiredText } from '@/shared/schemas'

export const placementTransferSchema = placementSchema.extend({
  current_end_date: requiredText('Tanggal akhir penempatan lama', 10),
  reason: requiredText('Alasan transfer', 2000),
})
