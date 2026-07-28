import { periodConfig } from '../components/period.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceDetailPage } from '@/shared/components/forms'

export function PeriodDetailPage() {
  return (
    <ResourceDetailPage
      config={periodConfig}
      listPath="/periods"
      eyebrow="Manajemen PKL"
      updatePermission={PERMISSIONS.period.update}
    />
  )
}
