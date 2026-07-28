import type { ListParams } from '@/shared/services'

export const periodKeys = {
  all: ['periods'] as const,
  lists: () => [...periodKeys.all, 'list'] as const,
  list: (params: ListParams) => [...periodKeys.lists(), params] as const,
}
