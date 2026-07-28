import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { companyKeys } from './company.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { ApiResponse } from '@/shared/types'

export type CompanyMajorCapacity = {
  company_id: string
  major_id: string
  capacity: number
}

export function useCompanyMajorCapacitiesQuery(companyId: string) {
  return useQuery({
    queryKey: [...companyKeys.all, 'major-capacities', companyId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CompanyMajorCapacity[]>>(
        API_ENDPOINTS.companyMajorCapacities(companyId),
      )
      return response.data.data
    },
    enabled: Boolean(companyId),
  })
}

export function useSetCompanyMajorCapacitiesMutation(companyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      items: Array<{ major_id: string; capacity: number }>,
    ) => {
      const response = await apiClient.put<ApiResponse<CompanyMajorCapacity[]>>(
        API_ENDPOINTS.companyMajorCapacities(companyId),
        { items },
      )
      return response.data.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...companyKeys.all, 'major-capacities', companyId],
      }),
  })
}
