import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { documentKeys } from './document.keys'
import { API_ENDPOINTS } from '@/shared/constants'
import { getResourceList, type ListParams } from '@/shared/services'
import type { DocumentMetadata } from '@/shared/types'

export function useDocumentsQuery(params: ListParams) {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () =>
      getResourceList<DocumentMetadata>(API_ENDPOINTS.documents, params),
    placeholderData: keepPreviousData,
  })
}
