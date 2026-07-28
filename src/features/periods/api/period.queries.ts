import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { periodKeys } from './period.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList, type ListParams } from '@/shared/services'
import type { Period } from '@/shared/types'

export function usePeriodsQuery(params: ListParams) {
  return useQuery({
    queryKey: periodKeys.list(params),
    queryFn: () => getResourceList<Period>(API_ENDPOINTS.periods, params),
    placeholderData: keepPreviousData,
  })
}
