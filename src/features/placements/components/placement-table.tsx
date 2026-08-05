import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Repeat2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
} from '@/shared/components/ui'
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Aksi penempatan" tone="neutral" size="sm">
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/placements/${row.original.id}`}>
              <Eye />
              Lihat detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/placements/${row.original.id}/transfer`}>
              <Repeat2 />
              Transfer penempatan
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ]
}
