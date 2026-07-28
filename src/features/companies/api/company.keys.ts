import type { ListParams } from '@/shared/services'

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (params: ListParams) => [...companyKeys.lists(), params] as const,
}
