import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { companyKeys } from './company.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList, type ListParams } from '@/shared/services'
import type { Company } from '@/shared/types'

export function useCompaniesQuery(params: ListParams) {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => getResourceList<Company>(API_ENDPOINTS.companies, params),
    placeholderData: keepPreviousData,
  })
}
