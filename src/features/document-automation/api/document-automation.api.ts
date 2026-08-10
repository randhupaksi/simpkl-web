import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { saveAs } from 'file-saver'

import type {
  AutomationFilters,
  AutomationPreview,
  DocumentTemplate,
  GenerateInput,
  GeneratedDocument,
  GenerationBatch,
  SchoolProfile,
  Signatory,
} from '../types'
import { API_ENDPOINTS } from '@/shared/constants'
import { apiClient } from '@/shared/services'
import type { ApiResponse } from '@/shared/types/api'

export const automationKeys = {
  all: ['document-automation'] as const,
  profile: () => [...automationKeys.all, 'profile'] as const,
  signatories: () => [...automationKeys.all, 'signatories'] as const,
  templates: () => [...automationKeys.all, 'templates'] as const,
  batches: () => [...automationKeys.all, 'batches'] as const,
  documents: () => [...automationKeys.all, 'documents'] as const,
}

async function getData<T>(url: string) {
  const response = await apiClient.get<ApiResponse<T>>(url)
  return response.data.data
}

export function useAutomationProfileQuery() {
  return useQuery({
    queryKey: automationKeys.profile(),
    queryFn: () => getData<SchoolProfile>(API_ENDPOINTS.automation.profile),
  })
}

export function useSignatoriesQuery() {
  return useQuery({
    queryKey: automationKeys.signatories(),
    queryFn: () => getData<Signatory[]>(API_ENDPOINTS.automation.signatories),
  })
}

export function useAutomationTemplatesQuery() {
  return useQuery({
    queryKey: automationKeys.templates(),
    queryFn: () =>
      getData<DocumentTemplate[]>(API_ENDPOINTS.automation.templates),
  })
}

export function useGenerationBatchesQuery() {
  return useQuery({
    queryKey: automationKeys.batches(),
    queryFn: () => getData<GenerationBatch[]>(API_ENDPOINTS.automation.batches),
  })
}

export function useGeneratedDocumentsQuery() {
  return useQuery({
    queryKey: automationKeys.documents(),
    queryFn: () =>
      getData<GeneratedDocument[]>(API_ENDPOINTS.automation.documents),
  })
}

export function usePreviewAutomationMutation() {
  return useMutation({
    mutationFn: async (input: {
      filters: AutomationFilters
      template_codes: string[]
      formats: string[]
    }) => {
      const response = await apiClient.post<ApiResponse<AutomationPreview>>(
        API_ENDPOINTS.automation.preview,
        input,
      )
      return response.data.data
    },
  })
}

export function useGenerateDocumentsMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (input: GenerateInput) => {
      const response = await apiClient.post<ApiResponse<GenerationBatch>>(
        API_ENDPOINTS.automation.generate,
        input,
        { timeout: 120_000 },
      )
      return response.data.data
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: automationKeys.all })
    },
  })
}

export function useSaveProfileMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (profile: SchoolProfile) => {
      const response = await apiClient.put<ApiResponse<SchoolProfile>>(
        API_ENDPOINTS.automation.profile,
        profile,
      )
      return response.data.data
    },
    onSuccess: (profile) =>
      client.setQueryData(automationKeys.profile(), profile),
  })
}

export function useSaveSignatoryMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (input: Partial<Signatory>) => {
      const response = input.id
        ? await apiClient.put<ApiResponse<Signatory>>(
            `${API_ENDPOINTS.automation.signatories}/${input.id}`,
            input,
          )
        : await apiClient.post<ApiResponse<Signatory>>(
            API_ENDPOINTS.automation.signatories,
            input,
          )
      return response.data.data
    },
    onSuccess: async () =>
      client.invalidateQueries({ queryKey: automationKeys.signatories() }),
  })
}

export function useDeleteSignatoryMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`${API_ENDPOINTS.automation.signatories}/${id}`),
    onSuccess: async () =>
      client.invalidateQueries({ queryKey: automationKeys.signatories() }),
  })
}

export function useSaveTemplateMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (input: Partial<DocumentTemplate>) => {
      const response = input.id
        ? await apiClient.put<ApiResponse<DocumentTemplate>>(
            `${API_ENDPOINTS.automation.templates}/${input.id}`,
            input,
          )
        : await apiClient.post<ApiResponse<DocumentTemplate>>(
            API_ENDPOINTS.automation.templates,
            input,
          )
      return response.data.data
    },
    onSuccess: async () =>
      client.invalidateQueries({ queryKey: automationKeys.templates() }),
  })
}

export async function downloadGeneratedDocument(document: GeneratedDocument) {
  const response = await apiClient.get(
    API_ENDPOINTS.automation.documentDownload(document.id),
    { responseType: 'blob' },
  )
  saveAs(response.data as Blob, document.original_name)
}

export async function downloadGenerationBatch(batch: GenerationBatch) {
  const response = await apiClient.get(
    API_ENDPOINTS.automation.batchDownload(batch.id),
    { responseType: 'blob' },
  )
  saveAs(response.data as Blob, batch.archive_name || `${batch.name}.zip`)
}
