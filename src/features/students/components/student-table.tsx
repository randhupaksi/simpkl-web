import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import { IconButton } from '@/shared/components/ui'
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

export function createStudentColumns(
  classNames: Record<string, string>,
  majorNames: Record<string, string>,
): ColumnDef<Student>[] {
  return [
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
      <span className="font-medium">
        {classNames[row.original.class_id] ?? compactId(row.original.class_id)}
      </span>
    ),
  },
  {
    accessorKey: 'major_id',
    header: 'Jurusan',
    cell: ({ row }) => (
      <span className="font-medium">
        {majorNames[row.original.major_id] ?? compactId(row.original.major_id)}
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
      <IconButton asChild aria-label="Lihat detail siswa" tone="view" size="sm">
        <Link to={`/students/${row.original.id}`}>
          <Eye />
        </Link>
      </IconButton>
    ),
  },
  ]
}
