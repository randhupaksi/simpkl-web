import { Plus } from 'lucide-react'
import { useState } from 'react'

import { usePlacementsQuery } from '@/features/placements/api'
import { placementColumns } from '@/features/placements/components/placement-table'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import { Select } from '@/shared/components/ui'
import { PageActionLink, PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'

export function PlacementListPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [status, setStatus] = useState('all')
  const query = usePlacementsQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: status === 'all' ? undefined : status,
  })

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Manajemen PKL"
        title="Penempatan PKL"
        description="Pantau penempatan siswa, perusahaan tujuan, penugasan, jadwal, dan status pelaksanaan."
        actions={
          hasPermission(permissions, PERMISSIONS.placement.create) ? (
            <PageActionLink to="/placements/new">
              <Plus className="size-4" />
              Buat penempatan
            </PageActionLink>
          ) : null
        }
      />
      {query.isError ? (
        <ErrorState
          message="Daftar penempatan tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={placementColumns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta?.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari data penempatan…"
          toolbar={
            <div className="w-full sm:w-52">
              <Select
                value={status}
                onValueChange={setStatus}
                ariaLabel="Filter status penempatan"
                options={[
                  { value: 'all', label: 'Semua status' },
                  { value: 'draft', label: 'Draft' },
                  {
                    value: 'pending_verification',
                    label: 'Menunggu verifikasi',
                  },
                  { value: 'approved', label: 'Disetujui' },
                  { value: 'ready', label: 'Siap' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'completed', label: 'Selesai' },
                  { value: 'cancelled', label: 'Dibatalkan' },
                  { value: 'transferred', label: 'Dipindahkan' },
                ]}
              />
            </div>
          }
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada penempatan"
          emptyDescription="Buat penempatan setelah periode, siswa, dan perusahaan tersedia."
        />
      )}
    </div>
  )
}
