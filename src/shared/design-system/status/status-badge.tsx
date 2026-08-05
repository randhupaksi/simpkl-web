import { Circle } from 'lucide-react'

import { Badge, type BadgeProps } from '@/shared/components/ui'
import { getStatusLabel } from '@/shared/utils'

const statusTone: Record<string, BadgeProps['tone']> = {
  active: 'success',
  aktif: 'success',
  complete: 'success',
  completed: 'success',
  ready: 'success',
  valid: 'success',
  approved: 'success',
  placed: 'success',
  verified: 'success',
  lengkap: 'success',
  pending: 'warning',
  pending_verification: 'warning',
  placement_process: 'warning',
  attention: 'warning',
  verifying: 'warning',
  preparation: 'info',
  draft: 'neutral',
  upcoming: 'info',
  revision: 'danger',
  revision_required: 'danger',
  rejected: 'danger',
  cancelled: 'danger',
  blocked: 'danger',
  incomplete: 'danger',
  expired: 'danger',
  inactive: 'neutral',
  archived: 'neutral',
  transferred: 'info',
  unplaced: 'warning',
}

type StatusBadgeProps = {
  status: string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge tone={statusTone[status.toLowerCase()] ?? 'neutral'}>
      <Circle className="size-2 fill-current" aria-hidden="true" />
      {label ?? getStatusLabel(status)}
    </Badge>
  )
}
