import { classConfig } from '../components/class.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceManagementPage } from '@/shared/components/forms'

export function ClassListPage() {
  return (
    <ResourceManagementPage
      config={classConfig}
      permissions={{
        create: PERMISSIONS.class.create,
        update: PERMISSIONS.class.update,
        delete: PERMISSIONS.class.delete,
      }}
    />
  )
}
