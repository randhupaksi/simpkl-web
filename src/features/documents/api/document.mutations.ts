import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveAs } from 'file-saver'

import { documentKeys } from './document.keys'
import { apiClient } from '@/shared/services/api/client'
import { API_ENDPOINTS } from '@/shared/constants'
import type { DocumentUploadInput } from '@/features/documents/schemas'
import type { ApiResponse, DocumentMetadata } from '@/shared/types'

async function uploadDocument(input: DocumentUploadInput) {
  const formData = new FormData()
  formData.append('file', input.file)
  formData.append('document_type_id', input.document_type_id)
  formData.append('owner_type', input.owner_type)
  formData.append('owner_id', input.owner_id)
  if (input.period_id) formData.append('period_id', input.period_id)
  if (input.placement_id) formData.append('placement_id', input.placement_id)
  if (input.number) formData.append('number', input.number)
  if (input.issued_at) formData.append('issued_at', input.issued_at)
  if (input.valid_from) formData.append('valid_from', input.valid_from)
  if (input.valid_until) formData.append('valid_until', input.valid_until)
  if (input.notes) formData.append('notes', input.notes)

  await apiClient.post(API_ENDPOINTS.documents, formData)
}

async function downloadDocument(id: string, filename: string) {
  const response = await apiClient.get(API_ENDPOINTS.documentDownload(id), {
    responseType: 'blob',
  })
  saveAs(response.data as Blob, filename)
}

export async function verifyDocument(input: {
  id: string
  status: string
  notes: string
}) {
  const response = await apiClient.put<ApiResponse<DocumentMetadata>>(
    API_ENDPOINTS.documentVerify(input.id),
    { status: input.status, notes: input.notes },
  )
  return response.data.data
}

async function deleteDocument(id: string) {
  await apiClient.delete(API_ENDPOINTS.documents + `/${id}`)
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
  })
}

export function useDownloadDocumentMutation() {
  return useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) =>
      downloadDocument(id, filename),
  })
}

export function useVerifyDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: verifyDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
  })
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() }),
  })
}
