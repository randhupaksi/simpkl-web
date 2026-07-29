import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient, getResourceList, type ListParams } from '@/shared/services'
import type { ApiResponse, Archive } from '@/shared/types'

export const archiveKeys = {
  all: ['archives'] as const,
  list: (params: ListParams) => [...archiveKeys.all, 'list', params] as const,
}

export function useArchivesQuery(params: ListParams) {
  return useQuery({
    queryKey: archiveKeys.list(params),
    queryFn: () => getResourceList<Archive>(API_ENDPOINTS.archives, params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateArchiveMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { period_id: string; reason: string }) => {
      const response = await apiClient.post<ApiResponse<Archive>>(
        API_ENDPOINTS.archives,
        input,
      )
      return response.data.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: archiveKeys.all }),
  })
}
