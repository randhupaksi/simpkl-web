import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Repeat2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { IconButton } from '@/shared/components/ui'
import { StatusBadge } from '@/shared/design-system/status'
import type { Placement } from '@/shared/types'
import { compactId, formatDate, getStatusLabel } from '@/shared/utils'

export function createPlacementColumns(
  studentNames: Record<string, string>,
  companyNames: Record<string, string>,
): ColumnDef<Placement>[] {
  return [
  {
    accessorKey: 'student_id',
    header: 'Siswa',
    cell: ({ row }) => (
      <span className="font-medium">
        {studentNames[row.original.student_id] ?? compactId(row.original.student_id)}
      </span>
    ),
  },
  {
    accessorKey: 'company_id',
    header: 'Perusahaan',
    cell: ({ row }) => (
      <span className="font-medium">
        {companyNames[row.original.company_id] ?? compactId(row.original.company_id)}
      </span>
    ),
  },
  {
    id: 'assignment',
    header: 'Penugasan',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.position || 'Belum diisi'}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {row.original.division || 'Divisi belum diisi'} ·{' '}
          {row.original.work_system.toUpperCase()}
        </p>
      </div>
    ),
  },
  {
    id: 'date',
    header: 'Periode',
    cell: ({ row }) => (
      <span>
        {formatDate(row.original.start_date)} –{' '}
        {formatDate(row.original.end_date)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status}
        label={getStatusLabel(row.original.status)}
      />
    ),
  },
  {
    id: 'actions',
    header: 'Aksi',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <IconButton
          asChild
          aria-label="Lihat detail penempatan"
          tone="view"
          size="sm"
        >
          <Link to={`/placements/${row.original.id}`}>
            <Eye />
          </Link>
        </IconButton>
        <IconButton
          asChild
          aria-label="Transfer penempatan"
          tone="edit"
          size="sm"
        >
          <Link to={`/placements/${row.original.id}/transfer`}>
            <Repeat2 />
          </Link>
        </IconButton>
      </div>
    ),
  },
  ]
}
