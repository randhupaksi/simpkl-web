import { supervisorConfig } from '../components/supervisor.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceManagementPage } from '@/shared/components/forms'

export function SupervisorListPage() {
  return (
    <ResourceManagementPage
      config={supervisorConfig}
      permissions={{
        create: PERMISSIONS.supervisor.create,
        update: PERMISSIONS.supervisor.update,
        delete: PERMISSIONS.supervisor.delete,
      }}
    />
  )
}
