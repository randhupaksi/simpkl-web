import { companyConfig } from '../components/company.config'
import { CompanyCapacityPanel } from '../components/company-capacity-panel'
import { CompanyContactsPanel } from '@/features/company-contacts/components'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceDetailPage } from '@/shared/components/forms'

export function CompanyDetailPage() {
  return (
    <ResourceDetailPage
      config={companyConfig}
      listPath="/companies"
      eyebrow="Data Master"
      updatePermission={PERMISSIONS.company.update}
      renderAfter={(company) => (
        <div className="space-y-6">
          <CompanyContactsPanel companyId={company.id} />
          <CompanyCapacityPanel companyId={company.id} />
        </div>
      )}
    />
  )
}
