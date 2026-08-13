import { useQuery } from '@tanstack/react-query'

import { Select } from '@/shared/components/ui'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient, getResourceList } from '@/shared/services'
import type { ApiResponse, BaseEntity } from '@/shared/types'

type ResourceOption = BaseEntity & Record<string, unknown>

type ResourceSelectFieldProps = {
  endpoint: string
  cacheKey?: string
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
  cacheKey,
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
    queryKey: [
      'resource-options',
      endpoint,
      cacheKey,
      queryParams,
      dependentValue,
    ],
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
  const classesQuery = useQuery({
    queryKey: ['resource-option-labels', API_ENDPOINTS.classes],
    queryFn: () =>
      getResourceList<ResourceOption>(API_ENDPOINTS.classes, {
        page: 1,
        per_page: 100,
      }),
    enabled: isPlacementOptions,
    staleTime: 60_000,
  })

  const students = new Map(
    (studentsQuery.data?.data ?? []).map((item) => [
      item.id,
      {
        name: String(item.name ?? item.id),
        classId: String(item.class_id ?? ''),
      },
    ]),
  )
  const classes = new Map(
    (classesQuery.data?.data ?? []).map((item) => [
      item.id,
      String(item.name ?? item.id),
    ]),
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
  const validPlacementOptions = isPlacementOptions
    ? studentsQuery.isError || classesQuery.isError
      ? []
      : optionsData.filter((item) => {
        const student = students.get(String(item.student_id))
        return Boolean(student?.classId && classes.has(student.classId))
        })
      : optionsData
  const placementStatusPriority: Record<string, number> = {
    active: 5,
    ready: 4,
    approved: 3,
    pending_verification: 2,
    draft: 1,
    completed: 0,
    transferred: 0,
    cancelled: -1,
  }
  const deduplicatedPlacementOptions = isPlacementOptions
    ? Array.from(
        validPlacementOptions.reduce((unique, item) => {
          const student = students.get(String(item.student_id))
          if (!student) return unique

          const relationKey = `${item.student_id}:${student.classId}`
          const current = unique.get(relationKey)
          if (!current) {
            unique.set(relationKey, item)
            return unique
          }

          const currentPriority =
            placementStatusPriority[String(current.status ?? '')] ?? 0
          const nextPriority =
            placementStatusPriority[String(item.status ?? '')] ?? 0
          const currentDate = Date.parse(
            String(current.start_date ?? current.created_at ?? ''),
          )
          const nextDate = Date.parse(
            String(item.start_date ?? item.created_at ?? ''),
          )

          if (
            nextPriority > currentPriority ||
            (nextPriority === currentPriority && nextDate > currentDate)
          ) {
            unique.set(relationKey, item)
          }
          return unique
        }, new Map<string, ResourceOption>()).values(),
      )
    : validPlacementOptions
  const isPlacementRelationPending =
    isPlacementOptions && (studentsQuery.isPending || classesQuery.isPending)
  const isPlacementRelationUnavailable =
    isPlacementOptions && (studentsQuery.isError || classesQuery.isError)

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next === '__empty__' ? '' : next)}
      options={[
        ...(emptyLabel ? [{ value: '__empty__', label: emptyLabel }] : []),
        ...deduplicatedPlacementOptions
          .map((item) => ({
            value: String(item[valueKey] ?? item.id),
            label: isPlacementOptions
              ? `${students.get(String(item.student_id))?.name ?? 'Siswa'} - ${classes.get(students.get(String(item.student_id))?.classId ?? '') ?? 'Kelas belum terhubung'}`
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
            : isPlacementRelationPending
              ? 'Memuat relasi siswa dan kelas…'
              : isPlacementRelationUnavailable
                ? 'Relasi siswa-kelas gagal dimuat - coba buka lagi'
            : query.isPending
              ? 'Memuat pilihan…'
              : query.isError
                ? 'Pilihan gagal dimuat - coba buka lagi'
              : placeholder
      }
      disabled={
        disabled ||
        (isStudentCompanyFilter && isCapacityUnavailable) ||
        isPlacementRelationPending ||
        isPlacementRelationUnavailable
      }
      invalid={invalid}
    />
  )
}
