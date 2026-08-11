import type { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { Calculator, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  useOverrideReadinessMutation,
  useReadinessQuery,
  useRecalculateReadinessMutation,
} from '../api/readiness.api'
import {
  readinessActionSchema,
  readinessOverrideSchema,
} from '../schemas/readiness.schema'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import {
  ResourceForm,
  type ResourceField,
  type ResourceValues,
} from '@/shared/components/forms'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Progress,
} from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { StatusBadge } from '@/shared/design-system/status'
import { useDebouncedValue, useListState } from '@/shared/hooks'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList } from '@/shared/services'
import type { Readiness, Student } from '@/shared/types'

const actionFields: ResourceField[] = [
  {
    key: 'student_id',
    label: 'Siswa',
    required: true,
    optionsEndpoint: API_ENDPOINTS.students,
    placeholder: 'Pilih siswa',
  },
  {
    key: 'period_id',
    label: 'Periode PKL',
    required: true,
    optionsEndpoint: API_ENDPOINTS.periods,
    placeholder: 'Pilih periode',
  },
  {
    key: 'reason',
    label: 'Alasan pengecualian',
    type: 'textarea',
    hint: 'Wajib untuk override dan akan tersimpan dalam audit administrasi.',
  },
]

function createReadinessColumns(
  studentNames: Record<string, string>,
): ColumnDef<Readiness>[] {
  return [
  {
    accessorKey: 'student_id',
    header: 'Siswa',
    cell: ({ row }) => studentNames[row.original.student_id] ?? row.original.student_id,
  },
  {
    id: 'progress',
    header: 'Kelengkapan',
    cell: ({ row }) => (
      <div className="min-w-40">
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span>
            {row.original.completed_count}/{row.original.required_count}
          </span>
          <span>{Math.round(row.original.percentage)}%</span>
        </div>
        <Progress value={row.original.percentage} />
      </div>
    ),
  },
  {
    accessorKey: 'company_assigned',
    header: 'Perusahaan',
    cell: ({ getValue }) => (getValue() ? 'Lengkap' : 'Belum'),
  },
  {
    accessorKey: 'supervisor_assigned',
    header: 'Pembimbing',
    cell: ({ getValue }) => (getValue() ? 'Lengkap' : 'Belum'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge status={String(getValue())} />,
  },
  ]
}

export function ReadinessPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [mode, setMode] = useState<'recalculate' | 'override' | null>(null)
  const recalculate = useRecalculateReadinessMutation()
  const override = useOverrideReadinessMutation()
  const query = useReadinessQuery({
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
    search: debouncedSearch || undefined,
  })
  const studentsQuery = useQuery({
    queryKey: ['readiness-labels', 'students'],
    queryFn: () =>
      getResourceList<Student>(API_ENDPOINTS.students, {
        page: 1,
        per_page: 100,
      }),
    staleTime: 60_000,
  })
  const columns = useMemo(
    () =>
      createReadinessColumns(
        Object.fromEntries(
          (studentsQuery.data?.data ?? []).map((student) => [
            student.id,
            student.name,
          ]),
        ),
      ),
    [studentsQuery.data?.data],
  )
  const mutation = mode === 'override' ? override : recalculate

  const submit = (values: ResourceValues) => {
    const input = {
      student_id: String(values.student_id),
      period_id: String(values.period_id),
    }
    if (mode === 'override') {
      override.mutate(
        { ...input, reason: String(values.reason) },
        {
          onSuccess: () => {
            toast.success('Pengecualian kesiapan berhasil diberikan')
            setMode(null)
          },
        },
      )
    } else {
      recalculate.mutate(input, {
        onSuccess: () => {
          toast.success('Kesiapan administrasi berhasil dihitung ulang')
          setMode(null)
        },
      })
    }
  }

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Manajemen PKL"
        title="Kesiapan Administrasi"
        description="Pantau checklist data, penempatan, pembimbing, tanggal, serta dokumen wajib setiap siswa."
        actions={
          <>
            {hasPermission(permissions, PERMISSIONS.readiness.update) ? (
              <Button
                variant="outline"
                startIcon={<Calculator />}
                onClick={() => setMode('recalculate')}
              >
                Hitung ulang
              </Button>
            ) : null}
            {hasPermission(permissions, PERMISSIONS.readiness.override) ? (
              <Button
                startIcon={<ShieldCheck />}
                onClick={() => setMode('override')}
              >
                Beri pengecualian
              </Button>
            ) : null}
          </>
        }
      />
      {query.isError ? (
        <ErrorState
          message="Kesiapan administrasi tidak dapat dimuat."
          onRetry={() => void query.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          pageCount={query.data?.meta.total_pages ?? 1}
          totalItems={query.data?.meta.total ?? 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari data kesiapan…"
          isLoading={query.isPending}
          rowId={(row) => row.id}
          emptyTitle="Belum ada hasil kesiapan"
          emptyDescription="Hitung kesiapan siswa pada periode aktif untuk menghasilkan checklist."
        />
      )}

      <Dialog open={Boolean(mode)} onOpenChange={() => setMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === 'override'
                ? 'Pengecualian kesiapan'
                : 'Hitung ulang kesiapan'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'override'
                ? 'Tindakan ini melewati hasil checklist otomatis dan harus disertai alasan yang dapat diaudit.'
                : 'Sistem akan mengevaluasi ulang data dan dokumen siswa pada periode terpilih.'}
            </DialogDescription>
          </DialogHeader>
          <ResourceForm
            id="readiness-action-form"
            fields={
              mode === 'override'
                ? actionFields
                : actionFields.filter((field) => field.key !== 'reason')
            }
            schema={
              mode === 'override'
                ? readinessOverrideSchema
                : readinessActionSchema
            }
            defaultValues={{ student_id: '', period_id: '', reason: '' }}
            onSubmit={submit}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="readiness-action-form"
              isLoading={mutation.isPending}
            >
              {mode === 'override' ? 'Simpan pengecualian' : 'Hitung ulang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
