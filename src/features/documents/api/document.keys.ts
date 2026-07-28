import type { ListParams } from '@/shared/services'

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (params: ListParams) => [...documentKeys.lists(), params] as const,
}
