import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import { IconButton } from '@/shared/components/ui'
import { StatusBadge } from '@/shared/design-system/status'
import type { Company } from '@/shared/types'
import { formatDate } from '@/shared/utils'

const companyStatusLabels: Record<string, string> = {
  candidate: 'Kandidat',
  verifying: 'Verifikasi',
  active: 'Aktif',
  inactive: 'Nonaktif',
  expired: 'Berakhir',
  not_recommended: 'Tidak direkomendasikan',
  blocked: 'Diblokir',
}

export const companyColumns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: 'Perusahaan',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {row.original.industry || 'Industri belum diisi'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'city',
    header: 'Lokasi',
    cell: ({ row }) => row.original.city || '-',
  },
  {
    accessorKey: 'capacity',
    header: 'Kuota',
    cell: ({ row }) => `${row.original.capacity} siswa`,
  },
  {
    accessorKey: 'cooperation_end',
    header: 'Berlaku hingga',
    cell: ({ row }) => formatDate(row.original.cooperation_end),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        label={companyStatusLabels[row.original.status] ?? row.original.status}
      />
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    enableHiding: false,
    cell: ({ row }) => (
      <IconButton asChild aria-label="Lihat detail perusahaan" tone="view" size="sm">
        <Link to={`/companies/${row.original.id}`}>
          <Eye />
        </Link>
      </IconButton>
    ),
  },
]
