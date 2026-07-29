import { useMutation } from '@tanstack/react-query'
import { saveAs } from 'file-saver'

import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { PlacementReportFilters } from '@/features/reports/types'

type ExportInput = {
  format: 'xlsx' | 'pdf'
  filters: PlacementReportFilters
}

export function useExportPlacementReportMutation() {
  return useMutation({
    mutationFn: async ({ format, filters }: ExportInput) => {
      const response = await apiClient.get(API_ENDPOINTS.placementReports, {
        params: { ...filters, format },
        responseType: 'blob',
      })
      saveAs(response.data as Blob, `laporan-penempatan.${format}`)
    },
  })
}
