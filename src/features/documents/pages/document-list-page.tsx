import { useDocumentsQuery } from '@/features/documents/api'
import { documentColumns } from '@/features/documents/components/document-table'
import { DocumentUploadDialog } from '@/features/documents/components/document-upload-dialog'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { CapabilityNotice, ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import { PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'

export function DocumentListPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const query = useDocumentsQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
  })

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Administrasi"
        title="Dokumen"
        description="Kelola metadata, unggahan privat, status verifikasi, masa berlaku, dan versi dokumen administrasi."
        actions={
          hasPermission(permissions, PERMISSIONS.document.upload) ? (
            <DocumentUploadDialog />
          ) : null
        }
      />
      <CapabilityNotice capability="documentVersionHistory" />
      {query.isError ? (
        <ErrorState
          message="Daftar dokumen tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={documentColumns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta?.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama dokumen…"
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada dokumen"
          emptyDescription="Unggah dokumen privat untuk memulai pemeriksaan administrasi."
        />
      )}
    </div>
  )
}
