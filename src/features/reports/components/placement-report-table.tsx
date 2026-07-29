import type { ColumnDef } from '@tanstack/react-table'

import { StatusBadge } from '@/shared/design-system/status'
import type { PlacementReportRow } from '@/features/reports/types'
import { formatDate } from '@/shared/utils'

export const placementReportColumns: ColumnDef<PlacementReportRow>[] = [
  {
    accessorKey: 'student_name',
    header: 'Siswa',
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.student_name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          NIS {row.original.nis}
        </p>
      </div>
    ),
  },
  { accessorKey: 'class_name', header: 'Kelas' },
  { accessorKey: 'major_name', header: 'Jurusan' },
  { accessorKey: 'company_name', header: 'Perusahaan' },
  { accessorKey: 'supervisor_name', header: 'Pembimbing' },
  {
    id: 'period',
    header: 'Tanggal',
    cell: ({ row }) =>
      `${formatDate(row.original.start_date)} – ${formatDate(row.original.end_date)}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
]
