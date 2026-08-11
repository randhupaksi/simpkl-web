import { Plus } from 'lucide-react'
import { useState } from 'react'

import { useCompaniesQuery } from '@/features/companies/api'
import { companyColumns } from '@/features/companies/components/company-table'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import { Select } from '@/shared/components/ui'
import { PageActionLink, PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'

export function CompanyListPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [status, setStatus] = useState('all')
  const query = useCompaniesQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: status === 'all' ? undefined : status,
  })

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Data Master"
        title="Perusahaan"
        description="Kelola mitra PKL, lokasi, kapasitas, status kerja sama, dan masa berlaku kemitraan."
        actions={
          hasPermission(permissions, PERMISSIONS.company.create) ? (
            <PageActionLink to="/companies/new">
              <Plus className="size-4" />
              Tambah perusahaan
            </PageActionLink>
          ) : null
        }
      />
      {query.isError ? (
        <ErrorState
          message="Daftar perusahaan tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={companyColumns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta?.total_pages ?? 1}
          totalItems={query.data?.meta?.total ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama atau industri…"
          toolbar={
            <div className="w-full sm:w-52">
              <Select
                value={status}
                onValueChange={setStatus}
                ariaLabel="Filter status perusahaan"
                options={[
                  { value: 'all', label: 'Semua status' },
                  { value: 'candidate', label: 'Kandidat' },
                  { value: 'verifying', label: 'Verifikasi' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'inactive', label: 'Tidak aktif' },
                  { value: 'expired', label: 'Kedaluwarsa' },
                  {
                    value: 'not_recommended',
                    label: 'Tidak direkomendasikan',
                  },
                  { value: 'blocked', label: 'Diblokir' },
                ]}
              />
            </div>
          }
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada perusahaan"
          emptyDescription="Tambahkan perusahaan mitra untuk menyiapkan penempatan siswa."
        />
      )}
    </div>
  )
}
