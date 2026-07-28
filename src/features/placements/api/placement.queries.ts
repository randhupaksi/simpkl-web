import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { placementKeys } from './placement.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList, type ListParams } from '@/shared/services'
import type { Placement } from '@/shared/types'

export function usePlacementsQuery(params: ListParams) {
  return useQuery({
    queryKey: placementKeys.list(params),
    queryFn: () => getResourceList<Placement>(API_ENDPOINTS.placements, params),
    placeholderData: keepPreviousData,
  })
}
