import type { ListParams } from '@/shared/services'

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: ListParams) => [...studentKeys.lists(), params] as const,
}
