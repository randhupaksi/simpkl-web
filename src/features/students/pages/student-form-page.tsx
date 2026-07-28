import { studentConfig } from '../components/student.config'
import { ResourceEditorPage } from '@/shared/components/forms'

export function StudentCreatePage() {
  return (
    <ResourceEditorPage
      config={studentConfig}
      mode="create"
      listPath="/students"
      eyebrow="Data Master"
    />
  )
}

export function StudentEditPage() {
  return (
    <ResourceEditorPage
      config={studentConfig}
      mode="edit"
      listPath="/students"
      eyebrow="Data Master"
    />
  )
}
