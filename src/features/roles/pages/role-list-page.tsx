import { roleConfig } from '../components/role.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { CapabilityNotice } from '@/shared/components/feedback'
import { ResourceManagementPage } from '@/shared/components/forms'

export function RoleListPage() {
  return (
    <ResourceManagementPage
      config={roleConfig}
      permissions={{
        create: PERMISSIONS.role.create,
        update: PERMISSIONS.role.update,
        delete: PERMISSIONS.role.delete,
      }}
      eyebrow="Sistem"
      notice={<CapabilityNotice capability="rolePermissionAssignments" />}
    />
  )
}
