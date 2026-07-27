import { useQuery } from '@tanstack/react-query'

import { Select } from '@/shared/components/ui'
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

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => onChange(next === '__empty__' ? '' : next)}
      options={[
        ...(emptyLabel ? [{ value: '__empty__', label: emptyLabel }] : []),
        ...(query.data?.data ?? []).map((item) => ({
          value: String(item[valueKey] ?? item.id),
          label: String(item[labelKey] ?? item.id),
        })),
      ]}
      placeholder={query.isPending ? 'Memuat pilihan…' : placeholder}
      disabled={disabled || query.isPending || query.isError}
      invalid={invalid}
    />
  )
}
