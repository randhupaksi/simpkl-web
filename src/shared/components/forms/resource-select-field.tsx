import { useQuery } from '@tanstack/react-query'

import { Select } from '@/shared/components/ui'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList } from '@/shared/services'
import type { BaseEntity } from '@/shared/types'

type ResourceOption = BaseEntity & Record<string, unknown>

type ResourceSelectFieldProps = {
  endpoint: string
  value?: string
  onChange: (value: string) => void
  labelKey?: string
  valueKey?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  emptyLabel?: string
}

export function ResourceSelectField({
  endpoint,
  value,
  onChange,
  labelKey = 'name',
  valueKey = 'id',
  placeholder,
  invalid,
  disabled,
  emptyLabel,
}: ResourceSelectFieldProps) {
  const query = useQuery({
    queryKey: ['resource-options', endpoint],
    queryFn: () =>
      getResourceList<ResourceOption>(endpoint, { page: 1, per_page: 100 }),
    staleTime: 60_000,
  })
  const isPlacementOptions = endpoint === API_ENDPOINTS.placements
  const studentsQuery = useQuery({
    queryKey: ['resource-option-labels', API_ENDPOINTS.students],
    queryFn: () =>
      getResourceList<ResourceOption>(API_ENDPOINTS.students, {
        page: 1,
        per_page: 100,
      }),
    enabled: isPlacementOptions,
    staleTime: 60_000,
  })
  const companiesQuery = useQuery({
    queryKey: ['resource-option-labels', API_ENDPOINTS.companies],
    queryFn: () =>
      getResourceList<ResourceOption>(API_ENDPOINTS.companies, {
        page: 1,
        per_page: 100,
      }),
    enabled: isPlacementOptions,
    staleTime: 60_000,
  })

  const students = new Map(
    (studentsQuery.data?.data ?? []).map((item) => [item.id, String(item.name ?? item.id)]),
  )
  const companies = new Map(
    (companiesQuery.data?.data ?? []).map((item) => [item.id, String(item.name ?? item.id)]),
  )

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next === '__empty__' ? '' : next)}
      options={[
        ...(emptyLabel ? [{ value: '__empty__', label: emptyLabel }] : []),
        ...(query.data?.data ?? []).map((item) => ({
          value: String(item[valueKey] ?? item.id),
          label: isPlacementOptions
            ? `${students.get(String(item.student_id)) ?? 'Siswa'} — ${companies.get(String(item.company_id)) ?? 'Perusahaan'}`
            : String(item[labelKey] ?? item.name ?? item.code ?? item.title ?? 'Data tersedia'),
        })),
      ]}
      placeholder={query.isPending ? 'Memuat pilihan…' : placeholder}
      disabled={disabled || query.isPending || query.isError}
      invalid={invalid}
    />
  )
}
