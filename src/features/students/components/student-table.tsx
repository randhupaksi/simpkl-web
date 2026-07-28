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
import type { Student } from '@/shared/types'
import { compactId } from '@/shared/utils'

const pklLabels: Record<string, string> = {
  unregistered: 'Belum didaftarkan',
  unplaced: 'Belum ditempatkan',
  placement_process: 'Proses penempatan',
  awaiting_documents: 'Menunggu dokumen',
  ready: 'Siap PKL',
  active: 'Sedang PKL',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  transferred: 'Dipindahkan',
  not_participating: 'Tidak mengikuti',
}

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: 'Siswa',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          NIS {row.original.nis}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'class_id',
    header: 'Kelas',
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {compactId(row.original.class_id)}
      </span>
    ),
  },
  {
    accessorKey: 'major_id',
    header: 'Jurusan',
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {compactId(row.original.major_id)}
      </span>
    ),
  },
  { accessorKey: 'cohort', header: 'Angkatan' },
  {
    accessorKey: 'pkl_status',
    header: 'Status PKL',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.pkl_status}
        label={pklLabels[row.original.pkl_status] ?? row.original.pkl_status}
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
          <IconButton aria-label="Aksi siswa" variant="ghost" size="sm">
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/students/${row.original.id}`}>
              <Eye />
              Lihat detail
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
