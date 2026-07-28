import { Plus } from 'lucide-react'
import { useState } from 'react'

import { usePeriodsQuery } from '@/features/periods/api'
import { periodColumns } from '@/features/periods/components/period-table'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import { Select } from '@/shared/components/ui'
import { PageActionLink, PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'

export function PeriodListPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [status, setStatus] = useState('all')
  const query = usePeriodsQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: status === 'all' ? undefined : status,
  })

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Manajemen PKL"
        title="Periode PKL"
        description="Atur rentang pelaksanaan, tahun ajaran, angkatan, dan status setiap periode PKL."
        actions={
          hasPermission(permissions, PERMISSIONS.period.create) ? (
            <PageActionLink to="/periods/new">
              <Plus className="size-4" />
              Tambah periode
            </PageActionLink>
          ) : null
        }
      />
      {query.isError ? (
        <ErrorState
          message="Daftar periode tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={periodColumns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta?.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama periode…"
          toolbar={
            <div className="w-full sm:w-48">
              <Select
                value={status}
                onValueChange={setStatus}
                ariaLabel="Filter status periode"
                options={[
                  { value: 'all', label: 'Semua status' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'preparation', label: 'Persiapan' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'completed', label: 'Selesai' },
                  { value: 'archived', label: 'Diarsipkan' },
                ]}
              />
            </div>
          }
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada periode PKL"
          emptyDescription="Buat periode pertama untuk mulai mengatur peserta dan penempatan."
        />
      )}
    </div>
  )
}
