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
import type { Period } from '@/shared/types'
import { formatDate } from '@/shared/utils'

const periodLabels: Record<string, string> = {
  draft: 'Draft',
  preparation: 'Persiapan',
  active: 'Aktif',
  completed: 'Selesai',
  archived: 'Diarsipkan',
}

export const periodColumns: ColumnDef<Period>[] = [
  {
    accessorKey: 'name',
    header: 'Periode',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {row.original.academic_year} ·{' '}
          {row.original.semester === 'odd' ? 'Ganjil' : 'Genap'}
        </p>
      </div>
    ),
  },
  { accessorKey: 'cohort', header: 'Angkatan' },
  {
    id: 'date',
    header: 'Rentang PKL',
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
        label={periodLabels[row.original.status]}
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
          <IconButton aria-label="Aksi periode" variant="ghost" size="sm">
            <MoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/periods/${row.original.id}`}>
              <Eye />
              Lihat detail
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
