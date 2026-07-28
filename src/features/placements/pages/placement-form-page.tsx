import { placementConfig } from '../components/placement.config'
import { ResourceEditorPage } from '@/shared/components/forms'

export function PlacementCreatePage() {
  return (
    <ResourceEditorPage
      config={placementConfig}
      mode="create"
      listPath="/placements"
      eyebrow="Manajemen PKL"
    />
  )
}

export function PlacementEditPage() {
  return (
    <ResourceEditorPage
      config={placementConfig}
      mode="edit"
      listPath="/placements"
      eyebrow="Manajemen PKL"
    />
  )
}
