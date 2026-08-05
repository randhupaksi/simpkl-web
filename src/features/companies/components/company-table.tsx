import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
} from '@/shared/components/ui'
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
    cell: ({ row }) => row.original.city || '—',
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Aksi perusahaan" tone="neutral" size="sm">
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/companies/${row.original.id}`}>
              <Eye />
              Lihat detail
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
