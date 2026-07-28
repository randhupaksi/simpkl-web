import { useMutation, useQueryClient } from '@tanstack/react-query'

import { studentKeys } from './student.keys'
import { apiClient } from '@/shared/services'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ApiResponse } from '@/shared/types'

export type StudentImportError = {
  row: number
  field: string
  message: string
}

export type StudentImportResult = {
  total: number
  valid: number
  imported: number
  failed: number
  errors: StudentImportError[]
}

export async function importStudents(file: File, commit: boolean) {
  const body = new FormData()
  body.append('file', file)
  body.append('commit', String(commit))
  const response = await apiClient.post<ApiResponse<StudentImportResult>>(
    API_ENDPOINTS.studentImport,
    body,
  )
  return response.data.data
}

export function useStudentImportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, commit }: { file: File; commit: boolean }) =>
      importStudents(file, commit),
    onSuccess: (result) => {
      if (result.imported > 0) {
        void queryClient.invalidateQueries({ queryKey: studentKeys.all })
      }
    },
  })
}
