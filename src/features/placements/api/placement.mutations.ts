import { useMutation, useQueryClient } from '@tanstack/react-query'

import { placementKeys } from './placement.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { ApiResponse, Placement } from '@/shared/types'

export type PlacementTransferInput = {
  id: string
  end_date: string
  reason: string
  new_placement: Record<string, unknown>
}

export async function transferPlacement(input: PlacementTransferInput) {
  const response = await apiClient.post<ApiResponse<Placement>>(
    API_ENDPOINTS.placementTransfer(input.id),
    {
      end_date: `${input.end_date}T00:00:00+07:00`,
      reason: input.reason,
      new_placement: input.new_placement,
    },
  )
  return response.data.data
}

export function usePlacementTransferMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: transferPlacement,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: placementKeys.all }),
  })
}
