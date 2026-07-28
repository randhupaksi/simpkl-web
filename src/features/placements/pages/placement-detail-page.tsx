import { placementConfig } from '../components/placement.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceDetailPage } from '@/shared/components/forms'

export function PlacementDetailPage() {
  return (
    <ResourceDetailPage
      config={placementConfig}
      listPath="/placements"
      eyebrow="Manajemen PKL"
      updatePermission={PERMISSIONS.placement.update}
    />
  )
}
