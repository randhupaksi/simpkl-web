import { useQuery } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  useCompanyMajorCapacitiesQuery,
  useSetCompanyMajorCapacitiesMutation,
} from '../api/company-capacity.api'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ErrorState, LoadingState } from '@/shared/components/feedback'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from '@/shared/components/ui'
import { SectionTitle, Typography } from '@/shared/design-system/typography'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList } from '@/shared/services'
import type { Major } from '@/shared/types'

export function CompanyCapacityPanel({ companyId }: { companyId: string }) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const canEdit = hasPermission(permissions, PERMISSIONS.company.update)
  const capacities = useCompanyMajorCapacitiesQuery(companyId)
  const majors = useQuery({
    queryKey: ['majors', 'company-capacity-options'],
    queryFn: () =>
      getResourceList<Major>(API_ENDPOINTS.majors, {
        page: 1,
        per_page: 100,
        status: 'active',
      }),
  })
  const mutation = useSetCompanyMajorCapacitiesMutation(companyId)
  const [values, setValues] = useState<Record<string, number>>({})

  if (capacities.isPending || majors.isPending) {
    return <LoadingState label="Memuat kuota per jurusan…" />
  }
  if (capacities.isError || majors.isError) {
    return <ErrorState message="Kuota jurusan tidak dapat dimuat." compact />
  }

  const items = majors.data?.data ?? []
  const savedValues = Object.fromEntries(
    (capacities.data ?? []).map((item) => [item.major_id, item.capacity]),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <SectionTitle>Kuota per jurusan</SectionTitle>
          <Typography variant="muted" className="mt-1">
            Kuota ini digunakan backend saat memvalidasi kesesuaian dan
            kapasitas penempatan.
          </Typography>
        </div>
        {canEdit ? (
          <Button
            size="sm"
            startIcon={<Save />}
            isLoading={mutation.isPending}
            onClick={() =>
              mutation.mutate(
                items
                  .map((major) => ({
                    major_id: major.id,
                    capacity: values[major.id] ?? savedValues[major.id] ?? 0,
                  }))
                  .filter((item) => item.capacity > 0),
                {
                  onSuccess: () => {
                    setValues({})
                    toast.success('Kuota jurusan berhasil diperbarui')
                  },
                  onError: () => toast.error('Kuota jurusan gagal diperbarui'),
                },
              )
            }
          >
            Simpan kuota
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Typography variant="muted">
            Belum ada jurusan aktif yang dapat dikonfigurasi.
          </Typography>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((major) => (
              <label
                key={major.id}
                className="border-border bg-surface-subtle hover:border-border-hover flex items-center gap-3 rounded-[var(--radius-md)] border p-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {major.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {major.code}
                  </span>
                </span>
                <Input
                  type="number"
                  min={0}
                  max={10000}
                  className="w-24"
                  value={values[major.id] ?? savedValues[major.id] ?? 0}
                  placeholder="Masukkan kuota"
                  disabled={!canEdit}
                  aria-label={`Kuota ${major.name}`}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [major.id]: Math.max(0, event.target.valueAsNumber || 0),
                    }))
                  }
                />
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
