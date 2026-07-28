import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  useCompanyContactMutations,
  useCompanyContactsQuery,
} from '../api/company-contact.api'
import { companyContactSchema } from '../schemas/company-contact.schema'
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
  Card,
  CardContent,
  CardHeader,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
} from '@/shared/components/ui'
import { StatusBadge } from '@/shared/design-system/status'
import { SectionTitle, Typography } from '@/shared/design-system/typography'
import type { CompanyContact } from '@/shared/types'

const fields: ResourceField[] = [
  { key: 'name', label: 'Nama PIC', required: true },
  { key: 'position', label: 'Jabatan' },
  { key: 'division', label: 'Divisi' },
  { key: 'phone', label: 'Nomor telepon' },
  { key: 'email', label: 'Email', type: 'email' },
  {
    key: 'is_primary',
    label: 'Kontak utama',
    type: 'switch',
    hint: 'Satu perusahaan hanya memiliki satu kontak utama.',
  },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]

export function CompanyContactsPanel({ companyId }: { companyId: string }) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const canCreate = hasPermission(permissions, PERMISSIONS.company.create)
  const canUpdate = hasPermission(permissions, PERMISSIONS.company.update)
  const canDelete = hasPermission(permissions, PERMISSIONS.company.delete)
  const query = useCompanyContactsQuery(companyId)
  const mutations = useCompanyContactMutations(companyId)
  const [editing, setEditing] = useState<CompanyContact | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const columns: ColumnDef<CompanyContact>[] = [
    { accessorKey: 'name', header: 'Nama PIC' },
    { accessorKey: 'position', header: 'Jabatan' },
    { accessorKey: 'division', header: 'Divisi' },
    { accessorKey: 'phone', header: 'Telepon' },
    {
      accessorKey: 'is_primary',
      header: 'Prioritas',
      cell: ({ getValue }) =>
        getValue() ? (
          <StatusBadge status="active" label="Kontak utama" />
        ) : (
          'Kontak lain'
        ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {canUpdate ? (
            <IconButton
              size="sm"
              variant="ghost"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => setEditing(row.original)}
            >
              <Pencil />
            </IconButton>
          ) : null}
          {canDelete ? (
            <ConfirmationDialog
              trigger={
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label={`Hapus ${row.original.name}`}
                >
                  <Trash2 />
                </IconButton>
              }
              title="Hapus kontak perusahaan?"
              description="Kontak akan dinonaktifkan dan tidak dapat dipilih pada penempatan baru."
              destructive
              confirmLabel="Ya, hapus"
              isLoading={mutations.remove.isPending}
              onConfirm={() =>
                mutations.remove.mutate(row.original.id, {
                  onSuccess: () => toast.success('Kontak berhasil dihapus'),
                  onError: () => toast.error('Kontak gagal dihapus'),
                })
              }
            />
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <SectionTitle>PIC dan kontak perusahaan</SectionTitle>
          <Typography variant="muted" className="mt-1">
            Kontak resmi yang dapat dipilih pada penempatan siswa.
          </Typography>
        </div>
        {canCreate ? (
          <Button
            size="sm"
            startIcon={<Plus />}
            onClick={() => setCreateOpen(true)}
          >
            Tambah PIC
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <ErrorState
            message="Kontak perusahaan tidak dapat dimuat."
            compact
            onRetry={() => void query.refetch()}
          />
        ) : (
          <DataTable
            columns={columns}
            data={query.data?.data ?? []}
            isLoading={query.isPending}
            rowId={(row) => row.id}
            emptyTitle="Belum ada PIC"
            emptyDescription="Tambahkan kontak utama perusahaan untuk memudahkan koordinasi penempatan."
          />
        )}
      </CardContent>

      <ContactDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tambah PIC perusahaan"
        formId="company-contact-create"
        isPending={mutations.create.isPending}
        onSubmit={(values) =>
          mutations.create.mutate(values, {
            onSuccess: () => {
              toast.success('Kontak berhasil ditambahkan')
              setCreateOpen(false)
            },
            onError: () => toast.error('Kontak gagal ditambahkan'),
          })
        }
      />
      <ContactDialog
        key={editing?.id ?? 'contact-edit'}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        title="Edit PIC perusahaan"
        formId="company-contact-edit"
        defaultValues={
          editing
            ? {
                name: editing.name,
                position: editing.position,
                division: editing.division,
                phone: editing.phone,
                email: editing.email,
                is_primary: editing.is_primary,
                notes: editing.notes,
              }
            : undefined
        }
        isPending={mutations.update.isPending}
        onSubmit={(values) => {
          if (!editing) return
          mutations.update.mutate(
            { id: editing.id, values },
            {
              onSuccess: () => {
                toast.success('Kontak berhasil diperbarui')
                setEditing(null)
              },
              onError: () => toast.error('Kontak gagal diperbarui'),
            },
          )
        }}
      />
    </Card>
  )
}

function ContactDialog({
  open,
  onOpenChange,
  title,
  formId,
  defaultValues,
  isPending,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  formId: string
  defaultValues?: ResourceValues
  isPending: boolean
  onSubmit: (values: ResourceValues) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Simpan jabatan, divisi, dan kanal komunikasi PIC yang dapat
            diverifikasi.
          </DialogDescription>
        </DialogHeader>
        <ResourceForm
          id={formId}
          fields={fields}
          schema={companyContactSchema}
          defaultValues={
            defaultValues ?? {
              name: '',
              position: '',
              division: '',
              phone: '',
              email: '',
              is_primary: false,
              notes: '',
            }
          }
          onSubmit={onSubmit}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form={formId} isLoading={isPending}>
            Simpan kontak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
