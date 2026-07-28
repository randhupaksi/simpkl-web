import type { ListParams } from '@/shared/services'

export const placementKeys = {
  all: ['placements'] as const,
  lists: () => [...placementKeys.all, 'list'] as const,
  list: (params: ListParams) => [...placementKeys.lists(), params] as const,
}
