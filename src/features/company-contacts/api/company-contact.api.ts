import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/shared/constants'
import {
  createResource,
  deleteResource,
  getResourceList,
  updateResource,
} from '@/shared/services'
import type { CompanyContact } from '@/shared/types'
import type { ResourceValues } from '@/shared/components/forms'

export const companyContactKeys = {
  all: ['company-contacts'] as const,
  company: (companyId: string) =>
    [...companyContactKeys.all, companyId] as const,
}

export function useCompanyContactsQuery(companyId: string) {
  return useQuery({
    queryKey: companyContactKeys.company(companyId),
    queryFn: () =>
      getResourceList<CompanyContact>(API_ENDPOINTS.companyContacts, {
        page: 1,
        per_page: 100,
        company_id: companyId,
      }),
    enabled: Boolean(companyId),
  })
}

export function useCompanyContactMutations(companyId: string) {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: companyContactKeys.company(companyId),
    })
  return {
    create: useMutation({
      mutationFn: (values: ResourceValues) =>
        createResource<CompanyContact, ResourceValues>(
          API_ENDPOINTS.companyContacts,
          { ...values, company_id: companyId },
        ),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: string; values: ResourceValues }) =>
        updateResource<CompanyContact, ResourceValues>(
          API_ENDPOINTS.companyContacts,
          id,
          { ...values, company_id: companyId },
        ),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id: string) =>
        deleteResource(API_ENDPOINTS.companyContacts, id),
      onSuccess: invalidate,
    }),
  }
}
