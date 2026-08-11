import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import { IconButton } from '@/shared/components/ui'
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
      <IconButton asChild aria-label="Lihat detail periode" tone="view" size="sm">
        <Link to={`/periods/${row.original.id}`}>
          <Eye />
        </Link>
      </IconButton>
    ),
  },
]
