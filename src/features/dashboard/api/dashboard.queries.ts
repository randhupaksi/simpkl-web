import { useQuery } from '@tanstack/react-query'

import { dashboardKeys } from './dashboard.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { ApiResponse } from '@/shared/types'
import type { DashboardSummary } from '@/features/dashboard/types'

async function getDashboardSummary(periodId?: string) {
  const response = await apiClient.get<ApiResponse<DashboardSummary>>(
    API_ENDPOINTS.dashboard,
    { params: periodId ? { period_id: periodId } : undefined },
  )
  return response.data.data
}

export function useDashboardQuery(periodId?: string) {
  return useQuery({
    queryKey: dashboardKeys.summary(periodId),
    queryFn: () => getDashboardSummary(periodId),
  })
}
