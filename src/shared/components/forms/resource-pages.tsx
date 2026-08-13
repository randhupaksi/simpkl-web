import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import {
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarRange,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Hash,
  MapPin,
  NotebookText,
  Phone,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ResourceForm } from './resource-form'
import type { ResourceConfig, ResourceValues } from './resource-form.types'
import { hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { DescriptionList } from '@/shared/components/data-display'
import { ErrorState } from '@/shared/components/feedback'
import { DataTable } from '@/shared/components/tables'
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Skeleton,
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

const ERROR_FIELD_BY_CODE: Record<string, string> = {
  INVALID_DATE_RANGE: 'end_date',
  PERIOD_NOT_FOUND: 'period_id',
  PERIOD_CLOSED: 'period_id',
  PLACEMENT_OUTSIDE_PERIOD: 'end_date',
  STUDENT_NOT_AVAILABLE: 'student_id',
  ACTIVE_PLACEMENT_EXISTS: 'student_id',
  COMPANY_NOT_FOUND: 'company_id',
  COMPANY_NOT_ALLOWED: 'company_id',
  MAJOR_NOT_ACCEPTED: 'company_id',
  COMPANY_CAPACITY_EXCEEDED: 'company_id',
  MAJOR_CAPACITY_EXCEEDED: 'company_id',
  INVALID_COMPANY_CONTACT: 'company_contact_id',
  SUPERVISOR_NOT_AVAILABLE: 'supervisor_id',
  SUPERVISOR_CAPACITY_EXCEEDED: 'supervisor_id',
  INVALID_STATUS_TRANSITION: 'status',
}

function toFormErrors(error: ApiError): Record<string, string[]> {
  const errors = error.errors ?? {}
  const explicitField = Object.keys(errors).find(
    (field) => field !== 'request' && field !== 'form',
  )
  if (explicitField) return errors

  const field = error.code ? ERROR_FIELD_BY_CODE[error.code] : undefined
  if (field) return { [field]: [error.message] }

  return errors.form || errors.request
    ? errors
    : { form: [error.message] }
}

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
    onError: (error: ApiError) => setApiErrors(toFormErrors(error)),
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
    onError: (error: ApiError) => setApiErrors(toFormErrors(error)),
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
          totalItems={listQuery.data?.meta.total ?? 0}
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
  const [clientValidationError, setClientValidationError] = useState(false)
  const detailQuery = useQuery<T, Error, T, [string, string, string]>({
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
    onError: (error: ApiError) => {
      setApiErrors(toFormErrors(error))
      setClientValidationError(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  })

  if (detailQuery.isPending && mode === 'edit') {
    return (
      <ResourceEditorSkeleton
        config={config}
        mode={mode}
        listPath={listPath}
        eyebrow={eyebrow}
      />
    )
  }
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
      {mutation.isError || clientValidationError ? (
        <Alert tone="danger">
          <AlertTitle>Data belum dapat disimpan</AlertTitle>
          <AlertDescription>
            {clientValidationError && !mutation.isError
              ? 'Periksa bidang yang ditandai merah. Lengkapi atau perbaiki nilainya sesuai petunjuk sebelum menyimpan kembali.'
              : (mutation.error as ApiError | null)?.message ??
                'Periksa bidang yang ditandai merah sebelum menyimpan kembali.'}
          </AlertDescription>
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
          onInvalid={() => {
            setApiErrors(undefined)
            setClientValidationError(true)
          }}
          onSubmit={(values) => {
            setApiErrors(undefined)
            setClientValidationError(false)
            mutation.reset()
            mutation.mutate(values)
          }}
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
  const query = useQuery<T, Error, T, [string, string, string]>({
    queryKey: [config.queryKey, 'detail', id],
    queryFn: () => getResource<T>(config.endpoint, id),
    enabled: Boolean(id),
  })

  if (query.isPending) {
    return (
      <ResourceDetailSkeleton
        config={config}
        listPath={listPath}
        eyebrow={eyebrow}
      />
    )
  }
  if (query.isError || !query.data)
    return (
      <ErrorState
        message={`${config.name} tidak dapat dimuat.`}
        onRetry={() => void query.refetch()}
      />
    )

  const detailFields = config.fields.filter((field) => field.type !== 'password')
  const detailSections = groupDetailFields(detailFields)
  const statusField = detailFields.find(
    (field) => field.key === 'status' || field.key === 'pkl_status',
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
      <Card className="overflow-hidden border-t-2 border-t-primary">
        <CardContent className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span className="bg-primary-subtle text-primary grid size-12 shrink-0 place-items-center rounded-[var(--radius-md)]">
              <DetailResourceIcon queryKey={config.queryKey} />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground text-[0.6875rem] font-bold tracking-[0.14em] uppercase">
                Ringkasan {config.name}
              </p>
              <p className="text-foreground mt-1 truncate text-lg font-bold tracking-[-0.025em]">
                {config.getDisplayName(query.data)}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                Informasi utama dan status administratif terkini.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {statusField ? (
              <DetailMeta
                icon={BadgeCheck}
                label={statusField.label}
                value={
                  <ResourceFieldValue
                    field={statusField}
                    value={query.data[statusField.key as keyof T]}
                    format="status"
                  />
                }
              />
            ) : null}
            <DetailMeta
              icon={Hash}
              label="ID data"
              value={<span className="font-mono text-xs">{query.data.id.slice(0, 8).toUpperCase()}</span>}
            />
            <DetailMeta
              icon={Clock}
              label="Diperbarui"
              value={formatDetailTimestamp(query.data.updated_at)}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid items-start gap-6 2xl:grid-cols-2">
        {detailSections.map((section, index) => (
          <DetailSectionCard
            key={section.title}
            section={section}
            item={query.data}
            index={index}
          />
        ))}
      </div>
      {renderAfter?.(query.data)}
    </div>
  )
}

type DetailSection = {
  title: string
  description?: string
  fields: ResourceConfig<BaseEntity>['fields']
}

function groupDetailFields(
  fields: ResourceConfig<BaseEntity>['fields'],
): DetailSection[] {
  const sections = new Map<string, DetailSection>()

  fields.forEach((field) => {
    const title = field.section?.title ?? 'Informasi tambahan'
    const current = sections.get(title) ?? {
      title,
      description: field.section?.description,
      fields: [],
    }
    current.fields.push(field)
    sections.set(title, current)
  })

  return [...sections.values()]
}

function DetailSectionCard<T extends BaseEntity>({
  section,
  item,
  index,
}: {
  section: DetailSection
  item: T
  index: number
}) {
  const tone = detailSectionTones[index % detailSectionTones.length]

  return (
    <Card className={`overflow-hidden border-t-2 ${tone.border}`}>
      <div className="border-border flex items-start gap-3 border-b px-5 py-4 sm:px-6">
        <span className={`grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)] ${tone.icon}`}>
          <DetailSectionIcon title={section.title} />
        </span>
        <div className="min-w-0">
          <p className="text-foreground text-sm font-bold">{section.title}</p>
          {section.description ? (
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              {section.description}
            </p>
          ) : null}
        </div>
      </div>
      <CardContent className="py-5 sm:px-6">
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2">
          {section.fields.map((field) => (
            <div
              key={field.key}
              className={`flex min-w-0 gap-3 ${field.type === 'textarea' ? 'sm:col-span-2 xl:col-span-3 2xl:col-span-2' : ''}`}
            >
              <span className="bg-surface-subtle text-primary grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)]">
                <DetailFieldIcon fieldKey={field.key} />
              </span>
              <div className="min-w-0 pt-0.5">
                <dt className="text-muted-foreground text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
                  {field.label}
                </dt>
                <dd className="text-foreground mt-1 break-words text-sm leading-6 font-semibold">
                  <ResourceFieldValue
                    field={field}
                    value={item[field.key as keyof T]}
                    format={getDetailFieldFormat(field)}
                  />
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function DetailMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
}) {
  return (
    <div className="border-border bg-surface-subtle min-w-0 rounded-[var(--radius-md)] border px-3 py-2.5">
      <div className="text-muted-foreground flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.1em] uppercase">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="text-foreground mt-1 min-h-5 truncate text-sm font-semibold">{value}</div>
    </div>
  )
}

const detailSectionTones = [
  { border: 'border-t-primary', icon: 'bg-primary-subtle text-primary' },
  { border: 'border-t-info', icon: 'bg-info-subtle text-info' },
  { border: 'border-t-success', icon: 'bg-success-subtle text-success' },
  { border: 'border-t-warning', icon: 'bg-warning-subtle text-warning' },
] as const

function DetailResourceIcon({ queryKey }: { queryKey: string }) {
  if (queryKey === 'students') return <GraduationCap className="size-6" />
  if (queryKey === 'companies') return <Building2 className="size-6" />
  if (queryKey === 'periods') return <CalendarRange className="size-6" />
  if (queryKey === 'placements') return <BriefcaseBusiness className="size-6" />
  return <FileText className="size-6" />
}

function DetailSectionIcon({ title }: { title: string }) {
  const normalizedTitle = title.toLocaleLowerCase('id')
  if (normalizedTitle.includes('identitas') || normalizedTitle.includes('peserta')) return <UserRound className="size-5" />
  if (normalizedTitle.includes('akademik')) return <GraduationCap className="size-5" />
  if (normalizedTitle.includes('kontak')) return <Phone className="size-5" />
  if (normalizedTitle.includes('kapasitas')) return <UsersRound className="size-5" />
  if (normalizedTitle.includes('profil')) return <Building2 className="size-5" />
  if (normalizedTitle.includes('tanggal') || normalizedTitle.includes('rentang') || normalizedTitle.includes('masa berlaku') || normalizedTitle.includes('jadwal')) return <CalendarDays className="size-5" />
  if (normalizedTitle.includes('lokasi') || normalizedTitle.includes('alamat')) return <MapPin className="size-5" />
  if (normalizedTitle.includes('peran') || normalizedTitle.includes('kerja')) return <BriefcaseBusiness className="size-5" />
  if (normalizedTitle.includes('status')) return <BadgeCheck className="size-5" />
  if (normalizedTitle.includes('catatan') || normalizedTitle.includes('keterangan')) return <NotebookText className="size-5" />
  return <BookOpenCheck className="size-5" />
}

function DetailFieldIcon({ fieldKey }: { fieldKey: string }) {
  const normalizedKey = fieldKey.toLocaleLowerCase('id')
  const Icon = normalizedKey.includes('phone') ? Phone
    : normalizedKey.includes('date') ? CalendarDays
      : normalizedKey.includes('address') || normalizedKey.includes('city') || normalizedKey.includes('province') || normalizedKey.includes('district') || normalizedKey.includes('maps') ? MapPin
        : normalizedKey.includes('status') ? BadgeCheck
          : normalizedKey.includes('notes') || normalizedKey.includes('description') ? NotebookText
            : normalizedKey.includes('company') ? Building2
              : normalizedKey.includes('student') || normalizedKey.includes('supervisor') || normalizedKey.includes('parent') || normalizedKey.includes('name') ? UserRound
                : normalizedKey.includes('major') || normalizedKey.includes('class') ? GraduationCap
                  : normalizedKey.includes('period') || normalizedKey.includes('semester') || normalizedKey.includes('cohort') ? CalendarRange
                    : normalizedKey.includes('position') || normalizedKey.includes('division') || normalizedKey.includes('work') ? BriefcaseBusiness
                      : FileText

  return <Icon className="size-4" />
}

function getDetailFieldFormat(
  field: ResourceConfig<BaseEntity>['fields'][number],
) {
  if (field.type === 'date') return 'date' as const
  if (field.type === 'switch') return 'boolean' as const
  if (field.key === 'status' || field.key === 'pkl_status') return 'status' as const
  if (field.type === 'number') return 'number' as const
  return undefined
}

function formatDetailTimestamp(value?: string) {
  if (!value) return 'Belum tersedia'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
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
      <DialogContent className="flex max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border shrink-0 border-b px-6 py-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <ResourceForm
            id={formId}
            fields={config.fields}
            schema={schema ?? config.schema}
            defaultValues={values ?? defaultValues(config)}
            isCreate={isCreate}
            apiErrors={apiErrors}
            onSubmit={onSubmit}
          />
        </div>
        <DialogFooter className="border-border bg-surface shrink-0 border-t px-6 py-4">
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

function ResourceDetailSkeleton<T extends BaseEntity>({
  config,
  listPath,
  eyebrow,
}: {
  config: ResourceConfig<T>
  listPath: string
  eyebrow: string
}) {
  return (
    <div className="enter-animation space-y-6" aria-busy="true">
      <PageHeader
        eyebrow={eyebrow}
        title={config.name}
        description="Menyiapkan detail data terbaru…"
        backTo={listPath}
      />
      <Card>
        <CardContent>
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
            {config.fields
              .filter((field) => field.type !== 'password')
              .map((field) => (
                <div key={field.key} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-40 max-w-full" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResourceEditorSkeleton<T extends BaseEntity>({
  config,
  mode,
  listPath,
  eyebrow,
}: {
  config: ResourceConfig<T>
  mode: 'create' | 'edit'
  listPath: string
  eyebrow: string
}) {
  return (
    <div className="enter-animation space-y-6" aria-busy="true">
      <PageHeader
        eyebrow={eyebrow}
        title={`${mode === 'create' ? 'Tambah' : 'Edit'} ${config.name}`}
        description="Menyiapkan struktur formulir…"
        backTo={listPath}
      />
      <FormSection
        title={`Informasi ${config.name}`}
        description="Kolom bertanda bintang wajib diisi."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-[var(--control-md)] w-full rounded-[var(--radius-md)]" />
            </div>
          ))}
        </div>
      </FormSection>
    </div>
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
  if (value === null || value === undefined || value === '') return '-'
  if (Array.isArray(value)) return value.join(', ') || '-'
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
    return <>-</>
  }

  return formatField(value, format)
}
