import { userConfig } from '../components/user.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { CapabilityNotice } from '@/shared/components/feedback'
import { ResourceManagementPage } from '@/shared/components/forms'

export function UserListPage() {
  return (
    <ResourceManagementPage
      config={userConfig}
      permissions={{
        create: PERMISSIONS.user.create,
        update: PERMISSIONS.user.update,
        delete: PERMISSIONS.user.delete,
      }}
      eyebrow="Sistem"
      notice={<CapabilityNotice capability="userRoleAssignments" />}
    />
  )
}
