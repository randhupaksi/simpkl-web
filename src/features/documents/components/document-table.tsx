import type { ColumnDef } from '@tanstack/react-table'
import { Download, FileCheck2, LoaderCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  useDeleteDocumentMutation,
  useDownloadDocumentMutation,
  useVerifyDocumentMutation,
} from '@/features/documents/api'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import {
  Button,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  Select,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui'
import { StatusBadge } from '@/shared/design-system/status'
import type { DocumentMetadata } from '@/shared/types'
import { formatDate, formatFileSize } from '@/shared/utils'

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  uploaded: 'Terunggah',
  pending: 'Menunggu verifikasi',
  valid: 'Terverifikasi',
  revision_required: 'Perlu revisi',
  rejected: 'Ditolak',
  expired: 'Kedaluwarsa',
  superseded: 'Digantikan',
}

function DocumentDownloadAction({ document }: { document: DocumentMetadata }) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const mutation = useDownloadDocumentMutation()

  if (!hasPermission(permissions, PERMISSIONS.document.download)) return null

  async function handleDownload() {
    try {
      await mutation.mutateAsync({
        id: document.id,
        filename: document.original_name,
      })
      toast.success('Dokumen berhasil diunduh.')
    } catch {
      toast.error('Dokumen gagal diunduh.')
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          aria-label={`Unduh ${document.original_name}`}
          variant="ghost"
          size="sm"
          disabled={mutation.isPending}
          onClick={() => void handleDownload()}
        >
          {mutation.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>Unduh dokumen privat</TooltipContent>
    </Tooltip>
  )
}

function DocumentActions({ document }: { document: DocumentMetadata }) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [status, setStatus] = useState(document.status)
  const [notes, setNotes] = useState(document.notes)
  const verify = useVerifyDocumentMutation()
  const remove = useDeleteDocumentMutation()

  return (
    <div className="flex justify-end gap-1">
      <DocumentDownloadAction document={document} />
      {hasPermission(permissions, PERMISSIONS.document.verify) ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label={`Verifikasi ${document.original_name}`}
                variant="ghost"
                size="sm"
                onClick={() => setVerifyOpen(true)}
              >
                <FileCheck2 />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Verifikasi atau minta revisi</TooltipContent>
          </Tooltip>
          <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verifikasi dokumen</DialogTitle>
                <DialogDescription>
                  Perbarui status {document.original_name} dan sertakan catatan
                  yang jelas jika perlu revisi atau ditolak.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={status}
                  onValueChange={setStatus}
                  ariaLabel="Status verifikasi"
                  options={[
                    { value: 'pending', label: 'Menunggu verifikasi' },
                    { value: 'valid', label: 'Valid' },
                    { value: 'revision_required', label: 'Perlu revisi' },
                    { value: 'rejected', label: 'Ditolak' },
                    { value: 'expired', label: 'Kedaluwarsa' },
                  ]}
                />
                <Textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Catatan verifikasi"
                  aria-label="Catatan verifikasi"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setVerifyOpen(false)}>
                  Batal
                </Button>
                <Button
                  isLoading={verify.isPending}
                  onClick={() =>
                    verify.mutate(
                      { id: document.id, status, notes },
                      {
                        onSuccess: () => {
                          toast.success('Status dokumen berhasil diperbarui')
                          setVerifyOpen(false)
                        },
                        onError: () =>
                          toast.error('Status dokumen gagal diperbarui'),
                      },
                    )
                  }
                >
                  Simpan verifikasi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
      {hasPermission(permissions, PERMISSIONS.document.delete) ? (
        <ConfirmationDialog
          trigger={
            <IconButton
              aria-label={`Hapus ${document.original_name}`}
              variant="ghost"
              size="sm"
            >
              <Trash2 />
            </IconButton>
          }
          title="Hapus dokumen?"
          description="Metadata dan file privat akan dihapus sesuai kebijakan backend. Tindakan ini tidak dapat dibatalkan dari frontend."
          confirmLabel="Ya, hapus"
          destructive
          isLoading={remove.isPending}
          onConfirm={() =>
            remove.mutate(document.id, {
              onSuccess: () => toast.success('Dokumen berhasil dihapus'),
              onError: () => toast.error('Dokumen gagal dihapus'),
            })
          }
        />
      ) : null}
    </div>
  )
}

export const documentColumns: ColumnDef<DocumentMetadata>[] = [
  {
    accessorKey: 'original_name',
    header: 'Dokumen',
    cell: ({ row }) => (
      <div className="max-w-72">
        <p className="truncate font-semibold">{row.original.original_name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {formatFileSize(row.original.size)} · versi {row.original.version}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'owner_type',
    header: 'Pemilik',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.owner_type}</span>
    ),
  },
  {
    accessorKey: 'valid_until',
    header: 'Berlaku hingga',
    cell: ({ row }) => formatDate(row.original.valid_until),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        label={statusLabels[row.original.status] ?? row.original.status}
      />
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    enableHiding: false,
    cell: ({ row }) => <DocumentActions document={row.original} />,
  },
]
