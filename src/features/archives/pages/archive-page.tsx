import type { ColumnDef } from '@tanstack/react-table'
import { ArchiveIcon, Eye } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useArchivesQuery, useCreateArchiveMutation } from '../api/archive.api'
import { archiveSchema } from '../schemas/archive.schema'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import {
  ResourceForm,
  type ResourceField,
  type ResourceValues,
} from '@/shared/components/forms'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
} from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { useDebouncedValue, useListState } from '@/shared/hooks'
import { API_ENDPOINTS } from '@/shared/constants'
import type { Archive } from '@/shared/types'
import { compactId, formatDate } from '@/shared/utils'

const fields: ResourceField[] = [
  {
    key: 'period_id',
    label: 'Periode PKL',
    required: true,
    optionsEndpoint: API_ENDPOINTS.periods,
    placeholder: 'Pilih periode selesai',
  },
  {
    key: 'reason',
    label: 'Catatan arsip',
    type: 'textarea',
    placeholder: 'Alasan atau catatan penutupan periode',
  },
]

export function ArchivePage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [createOpen, setCreateOpen] = useState(false)
  const [viewing, setViewing] = useState<Archive | null>(null)
  const query = useArchivesQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
  })
  const mutation = useCreateArchiveMutation()
  const columns: ColumnDef<Archive>[] = [
    {
      accessorKey: 'period_id',
      header: 'Periode',
      cell: ({ getValue }) => compactId(String(getValue())),
    },
    {
      accessorKey: 'archived_at',
      header: 'Diarsipkan',
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    { accessorKey: 'reason', header: 'Catatan' },
    {
      id: 'actions',
      header: 'Aksi',
      enableHiding: false,
      cell: ({ row }) => (
        <IconButton
          size="sm"
          tone="view"
          aria-label="Lihat snapshot arsip"
          onClick={() => setViewing(row.original)}
        >
          <Eye />
        </IconButton>
      ),
    },
  ]

  const submit = (values: ResourceValues) => {
    mutation.mutate(
      {
        period_id: String(values.period_id),
        reason: String(values.reason ?? ''),
      },
      {
        onSuccess: () => {
          toast.success('Periode berhasil diarsipkan')
          setCreateOpen(false)
        },
      },
    )
  }

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Administrasi"
        title="Arsip Periode"
        description="Snapshot final periode mempertahankan data administratif untuk penelusuran dan audit."
        actions={
          hasPermission(permissions, PERMISSIONS.period.archive) ? (
            <Button
              startIcon={<ArchiveIcon />}
              onClick={() => setCreateOpen(true)}
            >
              Arsipkan periode
            </Button>
          ) : null
        }
      />
      {query.isError ? (
        <ErrorState
          message="Arsip tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari arsip periode…"
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada arsip"
          emptyDescription="Periode yang sudah selesai dapat diarsipkan menjadi snapshot permanen."
        />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arsipkan periode</DialogTitle>
            <DialogDescription>
              Proses ini membuat snapshot final dan mengubah periode menjadi
              arsip. Pastikan seluruh administrasi telah selesai.
            </DialogDescription>
          </DialogHeader>
          <ResourceForm
            id="archive-form"
            fields={fields}
            schema={archiveSchema}
            defaultValues={{ period_id: '', reason: '' }}
            onSubmit={submit}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="archive-form"
              isLoading={mutation.isPending}
            >
              Buat snapshot arsip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewing)} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Snapshot arsip</DialogTitle>
            <DialogDescription>
              Representasi snapshot read-only yang disimpan backend pada saat
              periode ditutup.
            </DialogDescription>
          </DialogHeader>
          <pre className="border-border bg-surface-subtle scrollbar-subtle max-h-[28rem] overflow-auto rounded-[var(--radius-md)] border p-4 text-xs leading-6">
            {prettySnapshot(viewing?.snapshot)}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function prettySnapshot(snapshot?: string) {
  if (!snapshot) return 'Snapshot tidak tersedia.'
  try {
    return JSON.stringify(JSON.parse(snapshot), null, 2)
  } catch {
    return snapshot
  }
}
