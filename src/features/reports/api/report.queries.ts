import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { ApiResponse } from '@/shared/types'
import type {
  PlacementReportFilters,
  PlacementReportRow,
} from '@/features/reports/types'

export const reportKeys = {
  all: ['reports'] as const,
  placements: (filters: PlacementReportFilters) =>
    [...reportKeys.all, 'placements', filters] as const,
}

export function usePlacementReportQuery(filters: PlacementReportFilters) {
  return useQuery({
    queryKey: reportKeys.placements(filters),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PlacementReportRow[]>>(
        API_ENDPOINTS.placementReports,
        { params: { ...filters, format: 'json' } },
      )
      return response.data.data
    },
  })
}
