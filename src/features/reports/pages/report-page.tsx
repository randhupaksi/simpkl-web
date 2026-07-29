import { Download, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  useExportPlacementReportMutation,
  usePlacementReportQuery,
} from '@/features/reports/api'
import { placementReportColumns } from '@/features/reports/components/placement-report-table'
import type { PlacementReportFilters } from '@/features/reports/types'
import { ErrorState } from '@/shared/components/feedback'
import { ResourceSelectField } from '@/shared/components/forms'
import { Button, Card, CardContent, Select } from '@/shared/components/ui'
import { API_ENDPOINTS } from '@/shared/constants'
import { DataTable, FilterToolbar } from '@/shared/components/tables'
import { PageHeader } from '@/shared/design-system/page'
import { Typography } from '@/shared/design-system/typography'

const statusOptions = [
  { value: 'all', label: 'Semua status' },
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'active', label: 'Sedang PKL' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'transferred', label: 'Dipindahkan' },
]

export function ReportPage() {
  const [filters, setFilters] = useState<PlacementReportFilters>({})
  const query = usePlacementReportQuery(filters)
  const exportMutation = useExportPlacementReportMutation()

  async function handleExport(format: 'xlsx' | 'pdf') {
    try {
      await exportMutation.mutateAsync({ format, filters })
      toast.success(`Laporan ${format.toUpperCase()} berhasil diunduh.`)
    } catch {
      toast.error('Laporan gagal diekspor.')
    }
  }

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Administrasi"
        title="Laporan Penempatan"
        description="Tinjau rekap penempatan dan ekspor melalui endpoint resmi backend dalam format Excel atau PDF."
        actions={
          <>
            <Button
              variant="outline"
              startIcon={<FileSpreadsheet />}
              isLoading={exportMutation.isPending}
              onClick={() => void handleExport('xlsx')}
            >
              Excel
            </Button>
            <Button
              startIcon={<Download />}
              isLoading={exportMutation.isPending}
              onClick={() => void handleExport('pdf')}
            >
              PDF
            </Button>
          </>
        }
      />

      <Card variant="subtle">
        <CardContent>
          <Typography variant="label" className="mb-3">
            Filter laporan
          </Typography>
          <FilterToolbar>
            <div className="w-full sm:w-52">
              <ResourceSelectField
                endpoint={API_ENDPOINTS.periods}
                value={filters.period_id ?? ''}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    period_id: value || undefined,
                  }))
                }
                placeholder="Semua periode"
                emptyLabel="Semua periode"
              />
            </div>
            <div className="w-full sm:w-52">
              <ResourceSelectField
                endpoint={API_ENDPOINTS.majors}
                value={filters.major_id ?? ''}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    major_id: value || undefined,
                  }))
                }
                placeholder="Semua jurusan"
                emptyLabel="Semua jurusan"
              />
            </div>
            <div className="w-full sm:w-52">
              <ResourceSelectField
                endpoint={API_ENDPOINTS.classes}
                value={filters.class_id ?? ''}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    class_id: value || undefined,
                  }))
                }
                placeholder="Semua kelas"
                emptyLabel="Semua kelas"
              />
            </div>
            <div className="w-full sm:w-52">
              <ResourceSelectField
                endpoint={API_ENDPOINTS.companies}
                value={filters.company_id ?? ''}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    company_id: value || undefined,
                  }))
                }
                placeholder="Semua perusahaan"
                emptyLabel="Semua perusahaan"
              />
            </div>
            <div className="w-full sm:w-52">
              <Select
                value={filters.status ?? 'all'}
                onValueChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    status: value === 'all' ? undefined : value,
                  }))
                }
                options={statusOptions}
                ariaLabel="Filter status"
              />
            </div>
          </FilterToolbar>
          <Typography variant="caption" className="mt-3">
            Filter menggunakan referensi master resmi dan diteruskan ke endpoint
            laporan backend.
          </Typography>
        </CardContent>
      </Card>

      {query.isError ? (
        <ErrorState
          message="Laporan penempatan tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={placementReportColumns}
          data={query.data ?? []}
          isLoading={query.isPending}
          emptyTitle="Tidak ada data laporan"
          emptyDescription="Ubah filter atau pastikan penempatan sudah tersedia."
        />
      )}
    </div>
  )
}
