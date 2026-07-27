import { CircleAlert } from 'lucide-react'

import {
  FEATURE_CAPABILITIES,
  type CapabilityKey,
} from '@/app/config/capabilities'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui'

export function CapabilityNotice({
  capability,
  className,
}: {
  capability: CapabilityKey
  className?: string
}) {
  const item = FEATURE_CAPABILITIES[capability]

  if (item.available) return null

  return (
    <Alert tone="info" className={className}>
      <CircleAlert />
      <div>
        <AlertTitle>{item.label} belum diaktifkan</AlertTitle>
        <AlertDescription>
          {item.reason} Fitur tetap disembunyikan untuk mencegah perubahan data
          yang tidak disengaja.
        </AlertDescription>
      </div>
    </Alert>
  )
}
