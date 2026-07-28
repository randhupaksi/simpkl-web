import { majorConfig } from '../components/major.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceManagementPage } from '@/shared/components/forms'

export function MajorListPage() {
  return (
    <ResourceManagementPage
      config={majorConfig}
      permissions={{
        create: PERMISSIONS.major.create,
        update: PERMISSIONS.major.update,
        delete: PERMISSIONS.major.delete,
      }}
    />
  )
}
