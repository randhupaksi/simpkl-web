import { useQuery } from '@tanstack/react-query'

import { Select } from '@/shared/components/ui'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient, getResourceList } from '@/shared/services'
import type { ApiResponse, BaseEntity } from '@/shared/types'

type ResourceOption = BaseEntity & Record<string, unknown>

type ResourceSelectFieldProps = {
  endpoint: string
  value?: string
  onChange: (value: string) => void
  labelKey?: string
  valueKey?: string
  placeholder?: string
  queryParams?: Record<string, string | number | undefined>
  dependentValue?: string | number | boolean | null
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
  queryParams,
  dependentValue,
  invalid,
  disabled,
  emptyLabel,
}: ResourceSelectFieldProps) {
  const query = useQuery({
    queryKey: ['resource-options', endpoint, queryParams, dependentValue],
    queryFn: () =>
      getResourceList<ResourceOption>(endpoint, {
        page: 1,
        per_page: 100,
        ...queryParams,
      }),
    staleTime: 60_000,
    enabled: !disabled && (!dependentValue || Boolean(dependentValue)),
  })
  const capacitiesQuery = useQuery({
    queryKey: ['company-major-capacities', dependentValue],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Array<{ major_id: string }>>>(
        API_ENDPOINTS.companyMajorCapacities(String(dependentValue)),
      )
      return response.data.data
    },
    enabled: endpoint === API_ENDPOINTS.students && Boolean(dependentValue),
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

  const rawOptions = query.data?.data ?? []
  const acceptedMajorIds = new Set(
    (capacitiesQuery.data ?? []).map((capacity) => capacity.major_id),
  )
  const isStudentCompanyFilter = endpoint === API_ENDPOINTS.students && Boolean(dependentValue)
  const isCapacityUnavailable = capacitiesQuery.isPending || capacitiesQuery.isError
  const optionsData =
    isStudentCompanyFilter && isCapacityUnavailable
      ? []
      : isStudentCompanyFilter && acceptedMajorIds.size > 0
      ? rawOptions.filter((item) => acceptedMajorIds.has(String(item.major_id)))
      : rawOptions

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next === '__empty__' ? '' : next)}
      options={[
        ...(emptyLabel ? [{ value: '__empty__', label: emptyLabel }] : []),
        ...optionsData
          .map((item) => ({
            value: String(item[valueKey] ?? item.id),
            label: isPlacementOptions
              ? `${students.get(String(item.student_id)) ?? 'Siswa'} — ${companies.get(String(item.company_id)) ?? 'Perusahaan'}`
              : String(item[labelKey] ?? item.name ?? item.code ?? item.title ?? 'Data tersedia'),
          }))
          .sort((first, second) =>
            first.label.localeCompare(second.label, 'id', {
              numeric: true,
              sensitivity: 'base',
            }),
          ),
      ]}
      placeholder={
        disabled
          ? placeholder
          : isStudentCompanyFilter && capacitiesQuery.isPending
          ? 'Menyesuaikan siswa dengan jurusan perusahaan…'
          : isStudentCompanyFilter && capacitiesQuery.isError
            ? 'Jurusan perusahaan gagal dimuat'
            : query.isPending
              ? 'Memuat pilihan…'
              : query.isError
                ? 'Pilihan gagal dimuat — coba buka lagi'
              : placeholder
      }
      disabled={
        disabled ||
        (isStudentCompanyFilter && isCapacityUnavailable)
      }
      invalid={invalid}
    />
  )
}
