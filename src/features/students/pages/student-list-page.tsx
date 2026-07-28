import { FileUp, Plus } from 'lucide-react'
import { useState } from 'react'

import { useStudentsQuery } from '@/features/students/api'
import { studentColumns } from '@/features/students/components/student-table'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ErrorState } from '@/shared/components/feedback'
import { buttonVariants, Select } from '@/shared/components/ui'
import { DataTable } from '@/shared/components/tables'
import { PageActionLink, PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'
import { Link } from 'react-router-dom'

export function StudentListPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [pklStatus, setPklStatus] = useState('all')
  const query = useStudentsQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
    pkl_status: pklStatus === 'all' ? undefined : pklStatus,
  })

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Data Master"
        title="Data Siswa"
        description="Kelola identitas peserta, kelas, jurusan, angkatan, dan status kesiapan PKL."
        actions={
          <>
            {hasPermission(permissions, PERMISSIONS.student.import) ? (
              <Link
                to="/students/import"
                className={buttonVariants({ variant: 'outline' })}
              >
                <FileUp className="size-4" />
                Import
              </Link>
            ) : null}
            {hasPermission(permissions, PERMISSIONS.student.create) ? (
              <PageActionLink to="/students/new">
                <Plus className="size-4" />
                Tambah siswa
              </PageActionLink>
            ) : null}
          </>
        }
      />
      {query.isError ? (
        <ErrorState
          message="Daftar siswa tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={studentColumns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta?.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama atau NIS siswa…"
          toolbar={
            <div className="w-full sm:w-52">
              <Select
                value={pklStatus}
                onValueChange={setPklStatus}
                ariaLabel="Filter status PKL siswa"
                options={[
                  { value: 'all', label: 'Semua status PKL' },
                  { value: 'unplaced', label: 'Belum ditempatkan' },
                  { value: 'placement_process', label: 'Proses penempatan' },
                  { value: 'ready', label: 'Siap PKL' },
                  { value: 'active', label: 'Sedang PKL' },
                  { value: 'completed', label: 'Selesai' },
                  { value: 'cancelled', label: 'Dibatalkan' },
                ]}
              />
            </div>
          }
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada siswa"
          emptyDescription="Tambahkan siswa secara manual atau gunakan impor Excel untuk data dalam jumlah besar."
        />
      )}
    </div>
  )
}
