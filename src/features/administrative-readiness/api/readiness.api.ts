import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient, getResourceList, type ListParams } from '@/shared/services'
import type { ApiResponse, Readiness } from '@/shared/types'

export const readinessKeys = {
  all: ['readiness'] as const,
  list: (params: ListParams) => [...readinessKeys.all, 'list', params] as const,
}

export function useReadinessQuery(params: ListParams) {
  return useQuery({
    queryKey: readinessKeys.list(params),
    queryFn: () => getResourceList<Readiness>(API_ENDPOINTS.readiness, params),
    placeholderData: keepPreviousData,
  })
}

async function recalculateReadiness(input: {
  student_id: string
  period_id: string
}) {
  const response = await apiClient.post<ApiResponse<Readiness>>(
    API_ENDPOINTS.readinessRecalculate,
    input,
  )
  return response.data.data
}

async function overrideReadiness(input: {
  student_id: string
  period_id: string
  reason: string
}) {
  const response = await apiClient.post<ApiResponse<Readiness>>(
    API_ENDPOINTS.readinessOverride,
    input,
  )
  return response.data.data
}

export function useRecalculateReadinessMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: recalculateReadiness,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: readinessKeys.all }),
  })
}

export function useOverrideReadinessMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: overrideReadiness,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: readinessKeys.all }),
  })
}
