import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { studentKeys } from './student.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList, type ListParams } from '@/shared/services'
import type { Student } from '@/shared/types'

export function useStudentsQuery(params: ListParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => getResourceList<Student>(API_ENDPOINTS.students, params),
    placeholderData: keepPreviousData,
  })
}
