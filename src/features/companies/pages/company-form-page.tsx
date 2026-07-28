import { companyConfig } from '../components/company.config'
import { ResourceEditorPage } from '@/shared/components/forms'

export function CompanyCreatePage() {
  return (
    <ResourceEditorPage
      config={companyConfig}
      mode="create"
      listPath="/companies"
      eyebrow="Data Master"
    />
  )
}

export function CompanyEditPage() {
  return (
    <ResourceEditorPage
      config={companyConfig}
      mode="edit"
      listPath="/companies"
      eyebrow="Data Master"
    />
  )
}
