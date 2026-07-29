import { permissionConfig } from '../components/permission.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceManagementPage } from '@/shared/components/forms'

export function PermissionListPage() {
  return (
    <ResourceManagementPage
      config={permissionConfig}
      permissions={{
        create: PERMISSIONS.permission.create,
        update: PERMISSIONS.permission.update,
        delete: PERMISSIONS.permission.delete,
      }}
      eyebrow="Sistem"
    />
  )
}
