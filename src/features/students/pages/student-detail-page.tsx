import { studentConfig } from '../components/student.config'
import { PERMISSIONS } from '@/app/config/permissions'
import { ResourceDetailPage } from '@/shared/components/forms'

export function StudentDetailPage() {
  return (
    <ResourceDetailPage
      config={studentConfig}
      listPath="/students"
      eyebrow="Data Master"
      updatePermission={PERMISSIONS.student.update}
    />
  )
}
