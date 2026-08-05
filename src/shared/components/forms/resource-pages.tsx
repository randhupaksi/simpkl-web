import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Save, Trash2 } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ResourceForm } from './resource-form'
import type { ResourceConfig, ResourceValues } from './resource-form.types'
import { hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { DescriptionList } from '@/shared/components/data-display'
import { ErrorState, LoadingState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import {
  Alert,
  Button,
  Card,
  CardContent,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  IconButton,
  buttonVariants,
} from '@/shared/components/ui'
import { FormActions, FormSection } from '@/shared/design-system/form'
import { PageHeader } from '@/shared/design-system/page'
import { StatusBadge } from '@/shared/design-system/status'
import { useDebouncedValue, useListState } from '@/shared/hooks'
import {
  createResource,
  deleteResource,
  getResource,
  getResourceList,
  updateResource,
} from '@/shared/services'
import type { ApiError, BaseEntity } from '@/shared/types'
import { formatDate, getStatusLabel } from '@/shared/utils'

type ResourcePermissions = {
  create?: string
  update?: string
  delete?: string
}

type ResourceManagementPageProps<T extends BaseEntity> = {
  config: ResourceConfig<T>
  permissions?: ResourcePermissions
  eyebrow?: string
  notice?: ReactNode
}

export function ResourceManagementPage<T extends BaseEntity>({
  config,
  permissions,
  eyebrow = 'Data Master',
  notice,
}: ResourceManagementPageProps<T>) {
  const granted = useAuthStore((state) => state.user?.permissions ?? [])
  const queryClient = useQueryClient()
  const { pagination, setPagination, search, setSearch } = useListState()
  const debouncedSearch = useDebouncedValue(search)
  const [editing, setEditing] = useState<T | null>(null)
  const [viewing, setViewing] = useState<T | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>()
  const listQuery = useQuery({
    queryKey: [
      config.queryKey,
      'list',
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
    ],
    queryFn: () =>
      getResourceList<T>(config.endpoint, {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: debouncedSearch || undefined,
      }),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [config.queryKey] })

  const createMutation = useMutation({
    mutationFn: (values: ResourceValues) =>
      createResource<T, ResourceValues>(
        config.endpoint,
        config.normalizeInput?.(values) ?? values,
      ),
    onSuccess: () => {
      toast.success(`${config.name} berhasil dibuat`)
      setCreateOpen(false)
      setApiErrors(undefined)
      void invalidate()
    },
    onError: (error: ApiError) => setApiErrors(error.errors),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ResourceValues }) =>
      updateResource<T, ResourceValues>(
        config.endpoint,
        id,
        config.normalizeInput?.(values) ?? values,
      ),
    onSuccess: () => {
      toast.success(`${config.name} berhasil diperbarui`)
      setEditing(null)
      setApiErrors(undefined)
      void invalidate()
    },
    onError: (error: ApiError) => setApiErrors(error.errors),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteResource(config.endpoint, id),
    onSuccess: () => {
      toast.success(`${config.name} berhasil dinonaktifkan`)
      void invalidate()
    },
    onError: () => toast.error(`${config.name} gagal dinonaktifkan`),
  })

  const canCreate = hasPermission(granted, permissions?.create)
  const canUpdate = hasPermission(granted, permissions?.update)
  const canDelete = hasPermission(granted, permissions?.delete)

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      ...config.tableFields.map((field): ColumnDef<T> => ({
        id: field.key,
        header: field.label,
        cell: ({ row }) =>
          formatField(row.original[field.key as keyof T], field.format),
      })),
      {
        id: 'actions',
        header: 'Aksi',
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <IconButton
              size="sm"
              tone="view"
              aria-label={`Lihat ${config.getDisplayName(row.original)}`}
              onClick={() => setViewing(row.original)}
            >
              <Eye />
            </IconButton>
            {canUpdate ? (
              <IconButton
                size="sm"
                tone="edit"
                aria-label={`Edit ${config.getDisplayName(row.original)}`}
                onClick={() => {
                  setApiErrors(undefined)
                  setEditing(row.original)
                }}
              >
                <Pencil />
              </IconButton>
            ) : null}
            {canDelete ? (
              <ConfirmationDialog
                trigger={
                  <IconButton
                    size="sm"
                    tone="delete"
                    aria-label={`Nonaktifkan ${config.getDisplayName(row.original)}`}
                  >
                    <Trash2 />
                  </IconButton>
                }
                title={`Nonaktifkan ${config.name}?`}
                description={`${config.getDisplayName(row.original)} tidak lagi tersedia untuk proses baru. Riwayat yang sudah ada tetap dipertahankan.`}
                confirmLabel="Ya, nonaktifkan"
                destructive
                isLoading={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate(row.original.id)}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [canDelete, canUpdate, config, deleteMutation],
  )

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={config.namePlural}
        description={config.description}
        actions={
          canCreate ? (
            <Button startIcon={<Plus />} onClick={() => setCreateOpen(true)}>
              Tambah {config.name.toLowerCase()}
            </Button>
          ) : null
        }
      />
      {notice}

      {listQuery.isError ? (
        <ErrorState
          message={`${config.namePlural} tidak dapat dimuat.`}
          onRetry={() => void listQuery.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={listQuery.data?.data ?? []}
          pageCount={listQuery.data?.meta.total_pages ?? 1}
          pagination={pagination}
          onPaginationChange={setPagination}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={config.searchPlaceholder}
          isLoading={listQuery.isPending}
          rowId={(row) => row.id}
          emptyTitle={`Belum ada ${config.name.toLowerCase()}`}
          emptyDescription={config.emptyDescription}
        />
      )}

      <ResourceFormDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open)
          if (!open) setApiErrors(undefined)
        }}
        title={`Tambah ${config.name}`}
        description={`Lengkapi data ${config.name.toLowerCase()} sesuai informasi resmi.`}
        formId={`${config.queryKey}-create-form`}
        config={config}
        schema={config.createSchema}
        isCreate
        apiErrors={apiErrors}
        isPending={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <ResourceFormDialog
        key={editing?.id ?? 'no-edit'}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
          setApiErrors(undefined)
        }}
        title={`Edit ${config.name}`}
        description={
          editing ? `Perbarui informasi ${config.getDisplayName(editing)}.` : ''
        }
        formId={`${config.queryKey}-edit-form`}
        config={config}
        schema={config.editSchema}
        defaultValues={editing ? toValues(config, editing) : undefined}
        apiErrors={apiErrors}
        isPending={updateMutation.isPending}
        onSubmit={(values) => {
          if (editing) updateMutation.mutate({ id: editing.id, values })
        }}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {viewing ? config.getDisplayName(viewing) : config.name}
            </DialogTitle>
            <DialogDescription>
              Detail data dan status terbaru yang tersimpan pada sistem.
            </DialogDescription>
          </DialogHeader>
          {viewing ? (
            <DescriptionList
              items={config.fields
                .filter((field) => field.type !== 'password')
                .map((field) => ({
                  label: field.label,
                  value: (
                    <ResourceFieldValue
                      field={field}
                      value={viewing[field.key as keyof T]}
                      format={
                        field.type === 'date'
                          ? 'date'
                          : field.type === 'switch'
                            ? 'boolean'
                            : field.key === 'status'
                              ? 'status'
                              : undefined
                      }
                    />
                  ),
                }))}
            />
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

type ResourceEditorPageProps<T extends BaseEntity> = {
  config: ResourceConfig<T>
  mode: 'create' | 'edit'
  listPath: string
  eyebrow: string
}

export function ResourceEditorPage<T extends BaseEntity>({
  config,
  mode,
  listPath,
  eyebrow,
}: ResourceEditorPageProps<T>) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>()
  const detailQuery = useQuery({
    queryKey: [config.queryKey, 'detail', id],
    queryFn: () => getResource<T>(config.endpoint, id),
    enabled: mode === 'edit' && Boolean(id),
  })
  const mutation = useMutation({
    mutationFn: (values: ResourceValues) =>
      mode === 'create'
        ? createResource<T, ResourceValues>(
            config.endpoint,
            config.normalizeInput?.(values) ?? values,
          )
        : updateResource<T, ResourceValues>(
            config.endpoint,
            id,
            config.normalizeInput?.(values) ?? values,
          ),
    onSuccess: (item) => {
      toast.success(
        `${config.name} berhasil ${mode === 'create' ? 'dibuat' : 'diperbarui'}`,
      )
      void queryClient.invalidateQueries({ queryKey: [config.queryKey] })
      navigate(`${listPath}/${item.id}`)
    },
    onError: (error: ApiError) => setApiErrors(error.errors),
  })

  if (detailQuery.isPending && mode === 'edit') return <LoadingState />
  if (detailQuery.isError)
    return (
      <ErrorState
        message={`${config.name} tidak dapat dimuat.`}
        onRetry={() => void detailQuery.refetch()}
      />
    )

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={`${mode === 'create' ? 'Tambah' : 'Edit'} ${config.name}`}
        description={`Lengkapi informasi ${config.name.toLowerCase()} dan pastikan data sudah benar sebelum disimpan.`}
        backTo={listPath}
      />
      {mutation.isError && !apiErrors ? (
        <Alert tone="danger" title="Data belum dapat disimpan">
          Periksa kembali isian atau coba beberapa saat lagi.
        </Alert>
      ) : null}
      <FormSection
        title={`Informasi ${config.name}`}
        description="Kolom bertanda bintang wajib diisi."
      >
        <ResourceForm
          key={detailQuery.data?.id ?? mode}
          id={`${config.queryKey}-${mode}-form`}
          fields={config.fields}
          schema={
            mode === 'create'
              ? (config.createSchema ?? config.schema)
              : (config.editSchema ?? config.schema)
          }
          defaultValues={
            detailQuery.data
              ? toValues(config, detailQuery.data)
              : defaultValues(config)
          }
          isCreate={mode === 'create'}
          apiErrors={apiErrors}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </FormSection>
      <FormActions>
        <Link to={listPath} className={buttonVariants({ variant: 'outline' })}>
          Batal
        </Link>
        <Button
          type="submit"
          form={`${config.queryKey}-${mode}-form`}
          isLoading={mutation.isPending}
          loadingText="Menyimpan…"
          startIcon={<Save />}
        >
          Simpan {config.name.toLowerCase()}
        </Button>
      </FormActions>
    </div>
  )
}

type ResourceDetailPageProps<T extends BaseEntity> = {
  config: ResourceConfig<T>
  listPath: string
  eyebrow: string
  updatePermission?: string
  renderAfter?: (item: T) => ReactNode
}

export function ResourceDetailPage<T extends BaseEntity>({
  config,
  listPath,
  eyebrow,
  updatePermission,
  renderAfter,
}: ResourceDetailPageProps<T>) {
  const { id = '' } = useParams()
  const granted = useAuthStore((state) => state.user?.permissions ?? [])
  const query = useQuery({
    queryKey: [config.queryKey, 'detail', id],
    queryFn: () => getResource<T>(config.endpoint, id),
    enabled: Boolean(id),
  })

  if (query.isPending) return <LoadingState />
  if (query.isError || !query.data)
    return (
      <ErrorState
        message={`${config.name} tidak dapat dimuat.`}
        onRetry={() => void query.refetch()}
      />
    )

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={config.getDisplayName(query.data)}
        description={`Detail ${config.name.toLowerCase()} dan informasi administratif terkait.`}
        backTo={listPath}
        actions={
          hasPermission(granted, updatePermission) ? (
            <Link
              to={`${listPath}/${id}/edit`}
              className={buttonVariants({ variant: 'primary' })}
            >
              <Pencil />
              Edit data
            </Link>
          ) : null
        }
      />
      <Card>
        <CardContent>
          <DescriptionList
            columns={3}
            items={config.fields
              .filter((field) => field.type !== 'password')
              .map((field) => ({
                label: field.label,
                value: (
                  <ResourceFieldValue
                    field={field}
                    value={query.data[field.key as keyof T]}
                    format={
                      field.type === 'date'
                        ? 'date'
                        : field.type === 'switch'
                          ? 'boolean'
                          : field.key === 'status' || field.key === 'pkl_status'
                            ? 'status'
                            : undefined
                    }
                  />
                ),
              }))}
          />
        </CardContent>
      </Card>
      {renderAfter?.(query.data)}
    </div>
  )
}

type ResourceFormDialogProps<T extends BaseEntity> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  formId: string
  config: ResourceConfig<T>
  schema?: ResourceConfig<T>['schema']
  defaultValues?: ResourceValues
  isCreate?: boolean
  apiErrors?: Record<string, string[]>
  isPending?: boolean
  onSubmit: (values: ResourceValues) => void
}

function ResourceFormDialog<T extends BaseEntity>({
  open,
  onOpenChange,
  title,
  description,
  formId,
  config,
  schema,
  defaultValues: values,
  isCreate,
  apiErrors,
  isPending,
  onSubmit,
}: ResourceFormDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ResourceForm
          id={formId}
          fields={config.fields}
          schema={schema ?? config.schema}
          defaultValues={values ?? defaultValues(config)}
          isCreate={isCreate}
          apiErrors={apiErrors}
          onSubmit={onSubmit}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="submit"
            form={formId}
            isLoading={isPending}
            loadingText="Menyimpan…"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function defaultValues<T extends BaseEntity>(
  config: ResourceConfig<T>,
): ResourceValues {
  return Object.fromEntries(
    config.fields.map((field) => [
      field.key,
      field.defaultValue ??
        (field.type === 'switch' ? false : field.type === 'number' ? 0 : ''),
    ]),
  )
}

function toValues<T extends BaseEntity>(
  config: ResourceConfig<T>,
  item: T,
): ResourceValues {
  if (config.normalizeEntity) return config.normalizeEntity(item)
  return Object.fromEntries(
    config.fields.map((field) => {
      const value = item[field.key as keyof T]
      if (field.type === 'date' && typeof value === 'string') {
        return [field.key, value.slice(0, 10)]
      }
      return [field.key, value as ResourceValues[string]]
    }),
  )
}

function formatField(
  value: unknown,
  format?: 'status' | 'date' | 'boolean' | 'number',
) {
  if (format === 'status' && typeof value === 'string') {
    return <StatusBadge status={value} label={getStatusLabel(value)} />
  }
  if (format === 'date')
    return formatDate(typeof value === 'string' ? value : '')
  if (format === 'boolean') return value ? 'Ya' : 'Tidak'
  if (format === 'number' && typeof value === 'number') {
    return new Intl.NumberFormat('id-ID').format(value)
  }
  if (value === null || value === undefined || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ') || '—'
  return String(value)
}

type ResourceOption = BaseEntity & Record<string, unknown>

function ResourceFieldValue({
  field,
  value,
  format,
}: {
  field: ResourceConfig<BaseEntity>['fields'][number]
  value: unknown
  format?: 'status' | 'date' | 'boolean' | 'number'
}) {
  const optionsQuery = useQuery({
    queryKey: ['resource-detail-options', field.optionsEndpoint],
    queryFn: () =>
      getResourceList<ResourceOption>(field.optionsEndpoint ?? '', {
        page: 1,
        per_page: 100,
      }),
    enabled: Boolean(field.optionsEndpoint && value),
    staleTime: 60_000,
  })

  if (field.optionsEndpoint && value) {
    const option = optionsQuery.data?.data.find(
      (item) => String(item[field.optionValueKey ?? 'id'] ?? item.id) === String(value),
    )

    if (option) {
      return <>{String(option[field.optionLabelKey ?? 'name'] ?? option.id)}</>
    }

    if (optionsQuery.isPending) return <>Memuat…</>
    return <>—</>
  }

  return formatField(value, format)
}
