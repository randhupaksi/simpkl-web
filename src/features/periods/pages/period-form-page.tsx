import { periodConfig } from '../components/period.config'
import { ResourceEditorPage } from '@/shared/components/forms'

export function PeriodCreatePage() {
  return (
    <ResourceEditorPage
      config={periodConfig}
      mode="create"
      listPath="/periods"
      eyebrow="Manajemen PKL"
    />
  )
}

export function PeriodEditPage() {
  return (
    <ResourceEditorPage
      config={periodConfig}
      mode="edit"
      listPath="/periods"
      eyebrow="Manajemen PKL"
    />
  )
}
