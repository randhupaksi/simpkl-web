import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileArchive,
  FileCheck2,
  FileCog,
  FileSpreadsheet,
  FileText,
  History,
  LoaderCircle,
  PenLine,
  Plus,
  Save,
  School,
  Settings2,
  Trash2,
  UsersRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  downloadGeneratedDocument,
  downloadGenerationBatch,
  useAutomationProfileQuery,
  useAutomationTemplatesQuery,
  useDeleteSignatoryMutation,
  useGeneratedDocumentsQuery,
  useGenerateDocumentsMutation,
  useGenerationBatchesQuery,
  usePreviewAutomationMutation,
  useSaveProfileMutation,
  useSaveSignatoryMutation,
  useSaveTemplateMutation,
  useSignatoriesQuery,
} from '../api'
import type {
  AutomationFilters,
  DocumentTemplate,
  SchoolProfile,
  Signatory,
} from '../types'
import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { ResourceSelectField } from '@/shared/components/forms'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ConfirmationDialog,
  DatePicker,
  Input,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@/shared/components/ui'
import { API_ENDPOINTS } from '@/shared/constants'
import { FormField } from '@/shared/design-system/form'
import { PageHeader } from '@/shared/design-system/page'
import { SectionTitle, Typography } from '@/shared/design-system/typography'
import { formatDate, formatFileSize } from '@/shared/utils/formatters'

const today = new Date().toISOString().slice(0, 10)

const templateIcons: Record<string, typeof FileText> = {
  introduction_letter: FileText,
  placement_letter: FileCheck2,
  supervisor_assignment: UsersRound,
  parent_consent: PenLine,
  placement_recap: FileSpreadsheet,
}

const emptyProfile: SchoolProfile = {
  id: '',
  institution_name: '',
  institution_type: 'Sekolah Menengah Kejuruan',
  npsn: '',
  address: '',
  village: '',
  district: '',
  city: '',
  province: '',
  postal_code: '',
  phone: '',
  email: '',
  website: '',
  letterhead_tagline: '',
  timezone: 'Asia/Jakarta',
}

const emptySignatory: Partial<Signatory> = {
  name: '',
  title: '',
  employee_number: '',
  role_code: 'principal',
  is_default: false,
  status: 'active',
}

const emptyTemplate: Partial<DocumentTemplate> = {
  code: '',
  name: '',
  category: 'letter',
  subject_template: '',
  body_template: '',
  number_pattern: '{{sequence}}/PKL/{{month_roman}}/{{year}}',
  is_active: true,
}

export function DocumentAutomationPage() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const canManage = hasPermission(permissions, PERMISSIONS.automation.manage)

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Administrasi PKL"
        title="Pusat Otomasi Dokumen"
        description="Gunakan data penempatan satu kali untuk membuat surat resmi Word dan PDF, rekap Excel, serta paket ZIP secara individual atau massal."
      />
      <Tabs defaultValue="generate">
        <TabsList className="justify-start">
          <TabsTrigger value="generate">
            <FileCog className="size-4 shrink-0" />
            Buat Dokumen
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="size-4 shrink-0" />
            Riwayat
          </TabsTrigger>
          <TabsTrigger value="profile">
            <School className="size-4 shrink-0" />
            Profil Institusi
          </TabsTrigger>
          <TabsTrigger value="signatories">
            <PenLine className="size-4 shrink-0" />
            Penandatangan
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Settings2 className="size-4 shrink-0" />
            Template
          </TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <GeneratorPanel />
        </TabsContent>
        <TabsContent value="history">
          <HistoryPanel />
        </TabsContent>
        <TabsContent value="profile">
          <ProfilePanel canManage={canManage} />
        </TabsContent>
        <TabsContent value="signatories">
          <SignatoriesPanel canManage={canManage} />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesPanel canManage={canManage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GeneratorPanel() {
  const templatesQuery = useAutomationTemplatesQuery()
  const signatoriesQuery = useSignatoriesQuery()
  const previewMutation = usePreviewAutomationMutation()
  const generateMutation = useGenerateDocumentsMutation()
  const [filters, setFilters] = useState<AutomationFilters>({})
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([
    'introduction_letter',
    'placement_recap',
  ])
  const [formats, setFormats] = useState<string[]>(['docx', 'pdf'])
  const [signatoryID, setSignatoryID] = useState('')
  const [letterDate, setLetterDate] = useState(today)
  const [batchName, setBatchName] = useState('')
  const activeTemplates = useMemo(
    () => (templatesQuery.data ?? []).filter((item) => item.is_active),
    [templatesQuery.data],
  )

  const effectiveSignatoryID =
    signatoryID ||
    signatoriesQuery.data?.find((item) => item.is_default)?.id ||
    ''

  function toggle(
    list: string[],
    value: string,
    setter: (value: string[]) => void,
  ) {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    )
    previewMutation.reset()
  }

  async function preview() {
    try {
      await previewMutation.mutateAsync({
        filters,
        template_codes: selectedTemplates,
        formats,
      })
    } catch {
      toast.error('Pratinjau dokumen gagal dihitung.')
    }
  }

  async function generate() {
    try {
      const batch = await generateMutation.mutateAsync({
        name: batchName,
        filters,
        template_codes: selectedTemplates,
        formats,
        signatory_id: effectiveSignatoryID,
        letter_date: `${letterDate}T00:00:00+07:00`,
      })
      toast.success(`${batch.generated_count} dokumen berhasil dibuat.`)
      previewMutation.reset()
    } catch {
      toast.error(
        'Dokumen gagal dibuat. Periksa kembali data yang belum lengkap.',
      )
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <StepTitle
              number="1"
              title="Pilih data PKL"
              description="Filter dapat menghasilkan satu surat atau satu batch untuk seluruh kelas, jurusan, perusahaan, maupun periode."
            />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FilterSelect
              label="Periode PKL"
              endpoint={API_ENDPOINTS.periods}
              value={filters.period_id}
              placeholder="Pilih periode PKL"
              onChange={(period_id) => {
                setFilters((current) => ({
                  ...current,
                  period_id: period_id || undefined,
                }))
                previewMutation.reset()
              }}
            />
            <FilterSelect
              label="Kelas"
              endpoint={API_ENDPOINTS.classes}
              value={filters.class_id}
              placeholder="Semua kelas"
              onChange={(class_id) => {
                setFilters((current) => ({
                  ...current,
                  class_id: class_id || undefined,
                }))
                previewMutation.reset()
              }}
            />
            <FilterSelect
              label="Jurusan"
              endpoint={API_ENDPOINTS.majors}
              value={filters.major_id}
              placeholder="Semua jurusan"
              onChange={(major_id) => {
                setFilters((current) => ({
                  ...current,
                  major_id: major_id || undefined,
                }))
                previewMutation.reset()
              }}
            />
            <FilterSelect
              label="Perusahaan"
              endpoint={API_ENDPOINTS.companies}
              value={filters.company_id}
              placeholder="Semua perusahaan"
              onChange={(company_id) => {
                setFilters((current) => ({
                  ...current,
                  company_id: company_id || undefined,
                }))
                previewMutation.reset()
              }}
            />
            <FilterSelect
              label="Guru pembimbing"
              endpoint={API_ENDPOINTS.supervisors}
              value={filters.supervisor_id}
              placeholder="Semua pembimbing"
              onChange={(supervisor_id) => {
                setFilters((current) => ({
                  ...current,
                  supervisor_id: supervisor_id || undefined,
                }))
                previewMutation.reset()
              }}
            />
            <FormField
              id="filter-specific-placement"
              label="Siswa/penempatan spesifik"
              hint="Opsional; pilih satu data untuk membuat surat individual."
            >
              <ResourceSelectField
                endpoint={API_ENDPOINTS.placements}
                value={filters.placement_ids?.[0] ?? ''}
                onChange={(placementID) => {
                  setFilters((current) => ({
                    ...current,
                    placement_ids: placementID ? [placementID] : undefined,
                  }))
                  previewMutation.reset()
                }}
                placeholder="Semua siswa sesuai filter"
                emptyLabel="Semua siswa sesuai filter"
              />
            </FormField>
            <FormField
              id="batch-name"
              label="Nama paket"
              hint="Opsional; digunakan sebagai nama riwayat dan ZIP."
            >
              <Input
                id="batch-name"
                value={batchName}
                onChange={(event) => setBatchName(event.target.value)}
                placeholder="Contoh: Surat PKL XII RPL 2026"
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <StepTitle
              number="2"
              title="Pilih keluaran"
              description="Template surat menggunakan data resmi saat generate dan menyimpan snapshot untuk kebutuhan audit."
            />
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeTemplates.map((template) => {
                const Icon = templateIcons[template.code] ?? FileText
                const checked = selectedTemplates.includes(template.code)
                return (
                  <label
                    key={template.id}
                    className={`interactive-surface flex cursor-pointer gap-3 rounded-[var(--radius-md)] border p-4 ${checked ? 'border-border-selected bg-primary-subtle' : 'border-border bg-surface hover:border-border-hover'}`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        toggle(
                          selectedTemplates,
                          template.code,
                          setSelectedTemplates,
                        )
                      }
                      aria-label={`Pilih ${template.name}`}
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="text-primary size-4" />
                        {template.name}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Versi {template.version} ·{' '}
                        {template.category === 'spreadsheet'
                          ? 'Excel'
                          : 'Surat resmi'}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="formats"
                label="Format surat"
                hint="Rekap selalu dibuat sebagai XLSX."
              >
                <div
                  id="formats"
                  className="border-border flex min-h-11 items-center gap-5 rounded-[var(--radius-md)] border px-4"
                >
                  {['docx', 'pdf'].map((format) => (
                    <label
                      key={format}
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium"
                    >
                      <Checkbox
                        checked={formats.includes(format)}
                        onCheckedChange={() =>
                          toggle(formats, format, setFormats)
                        }
                      />
                      {format.toUpperCase()}
                    </label>
                  ))}
                </div>
              </FormField>
              <FormField id="signatory" label="Penandatangan" required>
                <Select
                  value={effectiveSignatoryID}
                  onValueChange={setSignatoryID}
                  placeholder="Pilih penandatangan"
                  options={(signatoriesQuery.data ?? [])
                    .filter((item) => item.status === 'active')
                    .map((item) => ({
                      value: item.id,
                      label: `${item.name} — ${item.title}`,
                    }))}
                />
              </FormField>
              <FormField id="letter-date" label="Tanggal surat" required>
                <DatePicker
                  id="letter-date"
                  value={letterDate}
                  onChange={(value) => setLetterDate(value)}
                  placeholder="Pilih tanggal surat"
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <StepTitle
              number="3"
              title="Validasi dan generate"
              description="SIMPKL memeriksa nama, kelas, jurusan, perusahaan, pembimbing, orang tua, profil institusi, dan penandatangan."
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                startIcon={<CheckCircle2 />}
                isLoading={previewMutation.isPending}
                disabled={!filters.period_id || selectedTemplates.length === 0}
                onClick={() => void preview()}
              >
                Periksa Kelengkapan
              </Button>
              <Button
                startIcon={<FileCog />}
                isLoading={generateMutation.isPending}
                loadingText="Membuat dokumen…"
                disabled={!previewMutation.data?.ready || !effectiveSignatoryID}
                onClick={() => void generate()}
              >
                Buat Semua Dokumen
              </Button>
            </div>
            {!filters.period_id ? (
              <Alert tone="info">
                <AlertCircle />
                <div>
                  <AlertTitle>Pilih periode PKL</AlertTitle>
                  <AlertDescription>
                    Periode menjadi batas utama agar batch tidak mengambil data
                    tahun ajaran lain.
                  </AlertDescription>
                </div>
              </Alert>
            ) : null}
            {previewMutation.data ? (
              <PreviewResult preview={previewMutation.data} />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <Card variant="subtle">
          <CardHeader>
            <SectionTitle>Ringkasan batch</SectionTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow
              label="Data penempatan"
              value={
                previewMutation.data
                  ? String(previewMutation.data.placement_count)
                  : 'Belum diperiksa'
              }
            />
            <SummaryRow
              label="Estimasi file"
              value={
                previewMutation.data
                  ? String(previewMutation.data.document_count)
                  : '—'
              }
            />
            <SummaryRow
              label="Jenis dokumen"
              value={String(selectedTemplates.length)}
            />
            <SummaryRow
              label="Format surat"
              value={
                formats.map((item) => item.toUpperCase()).join(', ') || '—'
              }
            />
          </CardContent>
        </Card>
        <Alert tone="neutral">
          <FileArchive />
          <div>
            <AlertTitle>Satu klik, satu paket</AlertTitle>
            <AlertDescription>
              Setelah selesai, seluruh DOCX, PDF, dan XLSX digabung otomatis
              dalam file ZIP. File satuan tetap tersedia di riwayat.
            </AlertDescription>
          </div>
        </Alert>
      </aside>
    </div>
  )
}

function PreviewResult({
  preview,
}: {
  preview: ReturnType<typeof usePreviewAutomationMutation>['data']
}) {
  if (!preview) return null
  return (
    <div className="space-y-4">
      <Alert tone={preview.ready ? 'success' : 'danger'}>
        {preview.ready ? <CheckCircle2 /> : <AlertCircle />}
        <div>
          <AlertTitle>
            {preview.ready
              ? 'Data siap dibuat'
              : `${preview.issues.length} masalah perlu diperbaiki`}
          </AlertTitle>
          <AlertDescription>
            {preview.placement_count} penempatan akan menghasilkan sekitar{' '}
            {preview.document_count} file.
          </AlertDescription>
        </div>
      </Alert>
      {preview.issues.length > 0 ? (
        <div className="border-border max-h-64 overflow-y-auto rounded-[var(--radius-md)] border">
          <ul className="divide-border-subtle divide-y">
            {preview.issues.map((issue, index) => (
              <li
                key={`${issue.placement_id}-${issue.field}-${index}`}
                className="flex gap-3 px-4 py-3 text-sm"
              >
                <AlertCircle className="text-danger mt-0.5 size-4 shrink-0" />
                <span>
                  <strong>{issue.student_name || 'Konfigurasi sistem'}:</strong>{' '}
                  {issue.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {preview.placements.length > 0 ? (
        <div className="border-border overflow-x-auto rounded-[var(--radius-md)] border">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-surface-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kelas/Jurusan</th>
                <th className="px-4 py-3">Perusahaan</th>
                <th className="px-4 py-3">Pembimbing</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {preview.placements.slice(0, 10).map((row) => (
                <tr key={row.placement_id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{row.student_name}</p>
                    <p className="text-muted-foreground text-xs">
                      NIS {row.student_nis}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {row.class_name}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {row.major_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.company_name}</td>
                  <td className="px-4 py-3">
                    {row.supervisor_name || 'Belum dipilih'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.placements.length > 10 ? (
            <p className="border-border text-muted-foreground border-t px-4 py-3 text-xs">
              Menampilkan 10 dari {preview.placements.length} data.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function HistoryPanel() {
  const batchesQuery = useGenerationBatchesQuery()
  const documentsQuery = useGeneratedDocumentsQuery()
  const [downloading, setDownloading] = useState('')
  async function download(action: () => Promise<void>, id: string) {
    try {
      setDownloading(id)
      await action()
      toast.success('File berhasil diunduh.')
    } catch {
      toast.error('File gagal diunduh.')
    } finally {
      setDownloading('')
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <SectionTitle>Paket dokumen terbaru</SectionTitle>
          <Typography variant="caption">
            Setiap proses massal disimpan sebagai batch yang dapat diunduh
            ulang.
          </Typography>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-surface-muted text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Paket</th>
                  <th className="px-5 py-3">Waktu</th>
                  <th className="px-5 py-3 text-center">Hasil</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Unduh</th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {(batchesQuery.data ?? []).map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{batch.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {batch.archive_name || 'Arsip tidak tersedia'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {formatDate(batch.created_at)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {batch.generated_count}
                      {batch.failed_count ? (
                        <span className="text-danger">
                          {' '}
                          / {batch.failed_count} gagal
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        startIcon={
                          downloading === batch.id ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <Download />
                          )
                        }
                        disabled={!batch.archive_name || Boolean(downloading)}
                        onClick={() =>
                          void download(
                            () => downloadGenerationBatch(batch),
                            batch.id,
                          )
                        }
                      >
                        ZIP
                      </Button>
                    </td>
                  </tr>
                ))}
                {!batchesQuery.isPending && !batchesQuery.data?.length ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-muted-foreground px-5 py-12 text-center"
                    >
                      Belum ada batch dokumen.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <SectionTitle>File yang dihasilkan</SectionTitle>
          <Typography variant="caption">
            Dokumen menyimpan versi template, nomor surat, snapshot, serta
            checksum integritas.
          </Typography>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="bg-surface-muted text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Dokumen</th>
                  <th className="px-5 py-3">Siswa</th>
                  <th className="px-5 py-3">Nomor</th>
                  <th className="px-5 py-3">Format</th>
                  <th className="px-5 py-3">Ukuran</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {(documentsQuery.data ?? []).map((document) => (
                  <tr key={document.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{document.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {document.original_name} · Template v
                        {document.template_version}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {document.student_name || 'Rekap massal'}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {document.document_number || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        tone={
                          document.format === 'pdf'
                            ? 'danger'
                            : document.format === 'xlsx'
                              ? 'success'
                              : 'info'
                        }
                      >
                        {document.format.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        startIcon={<Download />}
                        disabled={Boolean(downloading)}
                        onClick={() =>
                          void download(
                            () => downloadGeneratedDocument(document),
                            document.id,
                          )
                        }
                      >
                        Unduh
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfilePanel({ canManage }: { canManage: boolean }) {
  const query = useAutomationProfileQuery()
  if (query.isPending)
    return (
      <Card>
        <CardContent className="flex min-h-48 items-center justify-center">
          <LoaderCircle className="text-primary size-6 animate-spin" />
        </CardContent>
      </Card>
    )
  return (
    <ProfileForm
      key={query.data?.updated_at ?? 'profile'}
      initial={query.data ?? emptyProfile}
      canManage={canManage}
    />
  )
}

function ProfileForm({
  initial,
  canManage,
}: {
  initial: SchoolProfile
  canManage: boolean
}) {
  const mutation = useSaveProfileMutation()
  const [profile, setProfile] = useState<SchoolProfile>(initial)
  function update(field: keyof SchoolProfile, value: string) {
    setProfile((current) => ({ ...current, [field]: value }))
  }
  async function save() {
    try {
      await mutation.mutateAsync(profile)
      toast.success('Profil institusi berhasil disimpan.')
    } catch {
      toast.error('Profil institusi gagal disimpan.')
    }
  }
  const fields: Array<[keyof SchoolProfile, string, string]> = [
    ['institution_name', 'Nama institusi', 'Contoh: SMK Nusantara Teknologi'],
    [
      'institution_type',
      'Jenis institusi',
      'Contoh: Sekolah Menengah Kejuruan',
    ],
    ['npsn', 'NPSN', 'Masukkan NPSN'],
    [
      'letterhead_tagline',
      'Tagline kop surat',
      'Contoh: Terampil, Profesional, dan Berintegritas',
    ],
    ['phone', 'Nomor telepon', 'Contoh: (021) 7700000'],
    ['email', 'Email resmi', 'Contoh: info@sekolah.sch.id'],
    ['website', 'Website', 'Contoh: https://sekolah.sch.id'],
    ['city', 'Kota/Kabupaten', 'Contoh: Kota Depok'],
    ['province', 'Provinsi', 'Contoh: Jawa Barat'],
    ['district', 'Kecamatan', 'Contoh: Sukmajaya'],
    ['village', 'Kelurahan/Desa', 'Contoh: Mekarjaya'],
    ['postal_code', 'Kode pos', 'Contoh: 16411'],
  ]
  return (
    <Card>
      <CardHeader>
        <SectionTitle>Identitas pada kop surat</SectionTitle>
        <Typography variant="caption">
          Informasi ini muncul pada seluruh DOCX dan PDF. Lengkapi sebelum
          melakukan generate.
        </Typography>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([field, label, placeholder]) => (
            <FormField
              key={field}
              id={`profile-${field}`}
              label={label}
              required={field === 'institution_name'}
            >
              <Input
                id={`profile-${field}`}
                value={String(profile[field] ?? '')}
                disabled={!canManage}
                onChange={(event) => update(field, event.target.value)}
                placeholder={placeholder}
              />
            </FormField>
          ))}
        </div>
        <FormField id="profile-address" label="Alamat lengkap" required>
          <Textarea
            id="profile-address"
            value={profile.address}
            disabled={!canManage}
            onChange={(event) => update('address', event.target.value)}
            placeholder="Masukkan alamat lengkap untuk kop surat"
          />
        </FormField>
        {canManage ? (
          <div className="flex justify-end">
            <Button
              startIcon={<Save />}
              isLoading={mutation.isPending}
              onClick={() => void save()}
            >
              Simpan Profil
            </Button>
          </div>
        ) : (
          <Alert tone="info">
            <AlertCircle />
            <div>
              <AlertTitle>Akses lihat saja</AlertTitle>
              <AlertDescription>
                Anda tidak memiliki permission untuk mengubah pengaturan
                dokumen.
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function SignatoriesPanel({ canManage }: { canManage: boolean }) {
  const query = useSignatoriesQuery()
  const saveMutation = useSaveSignatoryMutation()
  const deleteMutation = useDeleteSignatoryMutation()
  const [form, setForm] = useState<Partial<Signatory>>(emptySignatory)
  function edit(item?: Signatory) {
    setForm(item ? { ...item } : { ...emptySignatory })
  }
  async function save() {
    try {
      await saveMutation.mutateAsync(form)
      toast.success('Penandatangan berhasil disimpan.')
      edit()
    } catch {
      toast.error('Penandatangan gagal disimpan.')
    }
  }
  async function remove(id: string) {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Penandatangan dihapus.')
    } catch {
      toast.error('Penandatangan gagal dihapus.')
    }
  }
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card>
        <CardHeader>
          <SectionTitle>Daftar penandatangan</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(query.data ?? []).map((item) => (
            <div
              key={item.id}
              className="border-border flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{item.name}</p>
                  {item.is_default ? <Badge tone="primary">Utama</Badge> : null}
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.title}
                  {item.employee_number
                    ? ` · NIP/NIK ${item.employee_number}`
                    : ''}
                </p>
              </div>
              {canManage ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    startIcon={<PenLine />}
                    onClick={() => edit(item)}
                  >
                    Edit
                  </Button>
                  <ConfirmationDialog
                    title="Hapus penandatangan?"
                    description={`Data ${item.name} akan dihapus dari pilihan surat berikutnya. Riwayat dokumen yang sudah dibuat tetap tersimpan.`}
                    confirmLabel="Ya, hapus"
                    destructive
                    isLoading={deleteMutation.isPending}
                    onConfirm={() => void remove(item.id)}
                    trigger={
                      <Button size="sm" variant="danger" startIcon={<Trash2 />}>
                        Hapus
                      </Button>
                    }
                  />
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
      {canManage ? (
        <Card className="self-start">
          <CardHeader>
            <SectionTitle>
              {form.id ? 'Edit penandatangan' : 'Tambah penandatangan'}
            </SectionTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="signatory-name" label="Nama lengkap" required>
              <Input
                id="signatory-name"
                value={form.name ?? ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Contoh: Drs. Ahmad Fauzi, M.Pd."
              />
            </FormField>
            <FormField id="signatory-title" label="Jabatan" required>
              <Input
                id="signatory-title"
                value={form.title ?? ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Contoh: Kepala Sekolah"
              />
            </FormField>
            <FormField id="signatory-number" label="NIP/NIK">
              <Input
                id="signatory-number"
                value={form.employee_number ?? ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    employee_number: event.target.value,
                  }))
                }
                placeholder="Masukkan NIP atau NIK"
              />
            </FormField>
            <FormField id="signatory-status" label="Status">
              <Select
                value={form.status}
                onValueChange={(status) =>
                  setForm((current) => ({
                    ...current,
                    status: status as Signatory['status'],
                  }))
                }
                options={[
                  { value: 'active', label: 'Aktif' },
                  { value: 'inactive', label: 'Tidak aktif' },
                ]}
              />
            </FormField>
            <label className="flex items-center gap-3 text-sm font-medium">
              <Checkbox
                checked={form.is_default}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    is_default: Boolean(checked),
                  }))
                }
              />
              Jadikan penandatangan utama
            </label>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                startIcon={<Save />}
                isLoading={saveMutation.isPending}
                onClick={() => void save()}
              >
                Simpan
              </Button>
              {form.id ? (
                <Button variant="outline" onClick={() => edit()}>
                  Batal
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function TemplatesPanel({ canManage }: { canManage: boolean }) {
  const query = useAutomationTemplatesQuery()
  const mutation = useSaveTemplateMutation()
  const [form, setForm] = useState<Partial<DocumentTemplate> | null>(null)
  const active = (query.data ?? []).filter((item) => item.is_active)
  async function save() {
    if (!form) return
    try {
      await mutation.mutateAsync(form)
      toast.success(
        form.id
          ? 'Versi template baru berhasil dibuat.'
          : 'Template berhasil dibuat.',
      )
      setForm(null)
    } catch {
      toast.error('Template gagal disimpan.')
    }
  }
  return (
    <div className="space-y-6">
      {canManage && !form ? (
        <div className="flex justify-end">
          <Button
            startIcon={<Plus />}
            onClick={() => setForm({ ...emptyTemplate })}
          >
            Template Baru
          </Button>
        </div>
      ) : null}
      {form ? (
        <Card>
          <CardHeader>
            <SectionTitle>
              {form.id
                ? `Edit ${form.name} — akan dibuat sebagai versi baru`
                : 'Template dokumen baru'}
            </SectionTitle>
            <Typography variant="caption">
              Gunakan placeholder seperti {'{{student_name}}'},{' '}
              {'{{class_name}}'}, {'{{company_name}}'}, {'{{supervisor_name}}'},
              dan {'{{placement_start}}'}.
            </Typography>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField id="template-code" label="Kode template" required>
                <Input
                  id="template-code"
                  value={form.code ?? ''}
                  disabled={Boolean(form.id)}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current!,
                      code: event.target.value,
                    }))
                  }
                  placeholder="Contoh: company_application"
                />
              </FormField>
              <FormField id="template-name" label="Nama template" required>
                <Input
                  id="template-name"
                  value={form.name ?? ''}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current!,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Surat Permohonan Perusahaan"
                />
              </FormField>
              <FormField id="template-category" label="Kategori">
                <Select
                  value={form.category}
                  onValueChange={(category) =>
                    setForm((current) => ({
                      ...current!,
                      category: category as DocumentTemplate['category'],
                    }))
                  }
                  options={[
                    { value: 'letter', label: 'Surat resmi' },
                    { value: 'spreadsheet', label: 'Spreadsheet' },
                  ]}
                />
              </FormField>
              <FormField id="template-subject" label="Perihal/judul" required>
                <Input
                  id="template-subject"
                  value={form.subject_template ?? ''}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current!,
                      subject_template: event.target.value,
                    }))
                  }
                  placeholder="Masukkan perihal surat"
                />
              </FormField>
            </div>
            <FormField
              id="template-number"
              label="Pola nomor surat"
              hint="Placeholder tersedia: sequence, code, month, month_roman, year."
            >
              <Input
                id="template-number"
                value={form.number_pattern ?? ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current!,
                    number_pattern: event.target.value,
                  }))
                }
                placeholder="{{sequence}}/PKL/{{month_roman}}/{{year}}"
              />
            </FormField>
            <FormField id="template-body" label="Isi dokumen" required>
              <Textarea
                id="template-body"
                className="min-h-72 font-mono text-xs leading-6"
                value={form.body_template ?? ''}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current!,
                    body_template: event.target.value,
                  }))
                }
                placeholder="Tulis isi surat dan sisipkan placeholder data..."
              />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setForm(null)}>
                Batal
              </Button>
              <Button
                startIcon={<Save />}
                isLoading={mutation.isPending}
                onClick={() => void save()}
              >
                Simpan Versi
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {active.map((template) => {
          const Icon = templateIcons[template.code] ?? FileText
          return (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="bg-primary-subtle text-primary grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <SectionTitle>{template.name}</SectionTitle>
                    <Typography variant="caption">
                      {template.code} · versi {template.version}
                    </Typography>
                  </div>
                </div>
                <Badge
                  tone={
                    template.category === 'spreadsheet' ? 'success' : 'info'
                  }
                >
                  {template.category === 'spreadsheet' ? 'Excel' : 'Surat'}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-subtle-foreground line-clamp-3 text-sm leading-6">
                  {template.body_template}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <code className="bg-surface-muted rounded px-2 py-1 text-xs">
                    {template.number_pattern}
                  </code>
                  {canManage ? (
                    <Button
                      size="sm"
                      variant="outline"
                      startIcon={<PenLine />}
                      onClick={() => setForm({ ...template })}
                    >
                      Buat Versi Baru
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  endpoint,
  value,
  placeholder,
  onChange,
}: {
  label: string
  endpoint: string
  value?: string
  placeholder: string
  onChange: (value: string) => void
}) {
  const id = `filter-${label.toLowerCase().replaceAll(' ', '-')}`
  return (
    <FormField id={id} label={label}>
      <ResourceSelectField
        endpoint={endpoint}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        emptyLabel={placeholder}
      />
    </FormField>
  )
}

function StepTitle({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold">
        {number}
      </span>
      <div>
        <SectionTitle>{title}</SectionTitle>
        <Typography variant="caption" className="mt-1">
          {description}
        </Typography>
      </div>
    </div>
  )
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border-subtle flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <strong className="text-right text-sm">{value}</strong>
    </div>
  )
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
  > = {
    completed: { label: 'Selesai', tone: 'success' },
    completed_with_errors: { label: 'Selesai dengan kendala', tone: 'warning' },
    failed: { label: 'Gagal', tone: 'danger' },
    processing: { label: 'Sedang diproses', tone: 'warning' },
    active: { label: 'Aktif', tone: 'success' },
    inactive: { label: 'Tidak aktif', tone: 'neutral' },
  }
  const current = map[status] ?? { label: status, tone: 'neutral' as const }
  return <Badge tone={current.tone}>{current.label}</Badge>
}
