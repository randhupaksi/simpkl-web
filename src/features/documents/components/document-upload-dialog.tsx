import { zodResolver } from '@hookform/resolvers/zod'
import { FileUp } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { useUploadDocumentMutation } from '@/features/documents/api'
import {
  documentUploadSchema,
  type DocumentUploadInput,
} from '@/features/documents/schemas'
import { FileDropzone, ResourceSelectField } from '@/shared/components/forms'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DatePicker,
  Input,
  Select,
  Textarea,
} from '@/shared/components/ui'
import { FormField } from '@/shared/design-system/form'
import { API_ENDPOINTS } from '@/shared/constants'

const ownerOptions = [
  { value: 'student', label: 'Siswa' },
  { value: 'company', label: 'Perusahaan' },
  { value: 'placement', label: 'Penempatan' },
  { value: 'period', label: 'Periode' },
]

export function DocumentUploadDialog() {
  const [open, setOpen] = useState(false)
  const mutation = useUploadDocumentMutation()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentUploadInput>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      document_type_id: '',
      owner_type: 'student',
      owner_id: '',
      period_id: '',
      placement_id: '',
      number: '',
      issued_at: '',
      valid_from: '',
      valid_until: '',
      notes: '',
    },
  })
  const ownerType = useWatch({ control, name: 'owner_type' })
  const ownerEndpoint = {
    student: API_ENDPOINTS.students,
    company: API_ENDPOINTS.companies,
    placement: API_ENDPOINTS.placements,
    period: API_ENDPOINTS.periods,
  }[ownerType]

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values)
    toast.success('Dokumen berhasil diunggah.')
    reset()
    setOpen(false)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button startIcon={<FileUp />}>Unggah dokumen</Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-border shrink-0 border-b px-6 py-5">
          <DialogTitle>Unggah dokumen privat</DialogTitle>
          <DialogDescription>
            File dikirim ke endpoint privat dan tidak pernah menggunakan URL
            publik.
          </DialogDescription>
        </DialogHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <FormSubsection
            title="A. Berkas dan klasifikasi"
            description="Pilih file privat beserta tipe dokumen yang sesuai."
          />
          <Controller
            control={control}
            name="file"
            render={({ field }) => (
              <FormField
                id="file"
                label="File dokumen"
                error={errors.file?.message}
                required
              >
                <FileDropzone
                  value={field.value}
                  onChange={field.onChange}
                  maxSize={10 * 1024 * 1024}
                  accept={{
                    'application/pdf': ['.pdf'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                      ['.docx'],
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      ['.xlsx'],
                  }}
                />
              </FormField>
            )}
          />
          <FormSubsection
            title="B. Keterkaitan dokumen"
            description="Hubungkan dokumen ke pemilik, periode, atau penempatan bila relevan."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="document_type_id"
              render={({ field }) => (
                <FormField
                  id="document_type_id"
                  label="Tipe dokumen"
                  error={errors.document_type_id?.message}
                  required
                >
                  <ResourceSelectField
                    endpoint={API_ENDPOINTS.documentTypes}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih tipe dokumen"
                    invalid={Boolean(errors.document_type_id)}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="owner_type"
              render={({ field }) => (
                <FormField
                  id="owner_type"
                  label="Jenis pemilik"
                  error={errors.owner_type?.message}
                  required
                >
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={ownerOptions}
                    placeholder="Pilih jenis pemilik"
                    ariaLabel="Jenis pemilik dokumen"
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="owner_id"
              render={({ field }) => (
                <FormField
                  id="owner_id"
                  label="Pemilik dokumen"
                  error={errors.owner_id?.message}
                  required
                >
                  <ResourceSelectField
                    endpoint={ownerEndpoint}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih pemilik"
                    invalid={Boolean(errors.owner_id)}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="period_id"
              render={({ field }) => (
                <FormField
                  id="period_id"
                  label="Periode PKL"
                  error={errors.period_id?.message}
                  hint="Opsional sesuai jenis dokumen."
                >
                  <ResourceSelectField
                    endpoint={API_ENDPOINTS.periods}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih periode (opsional)"
                    emptyLabel="Tanpa periode"
                    invalid={Boolean(errors.period_id)}
                  />
                </FormField>
              )}
            />
            <Controller
              control={control}
              name="placement_id"
              render={({ field }) => (
                <FormField
                  id="placement_id"
                  label="Penempatan"
                  error={errors.placement_id?.message}
                  hint="Opsional, untuk dokumen terkait penempatan tertentu."
                >
                  <ResourceSelectField
                    endpoint={API_ENDPOINTS.placements}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pilih penempatan (opsional)"
                    emptyLabel="Tanpa penempatan"
                    invalid={Boolean(errors.placement_id)}
                  />
                </FormField>
              )}
            />
            <FormField id="number" label="Nomor dokumen">
              <Input
                id="number"
                placeholder="Nomor surat atau dokumen"
                {...register('number')}
              />
            </FormField>
            <div className="border-border sm:col-span-2 mt-2 border-b pb-3">
              <p className="text-foreground text-sm font-semibold">C. Masa berlaku</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Isi tanggal yang tersedia pada dokumen untuk memudahkan pemantauan.
              </p>
            </div>
            {([
              ['issued_at', 'Tanggal terbit', 'Pilih tanggal terbit'],
              ['valid_from', 'Berlaku mulai', 'Pilih tanggal mulai berlaku'],
              ['valid_until', 'Berlaku hingga', 'Pilih tanggal akhir berlaku'],
            ] as const).map(([name, label, placeholder]) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field }) => (
                  <FormField id={name} label={label} error={errors[name]?.message}>
                    <DatePicker
                      id={name}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={placeholder}
                      invalid={Boolean(errors[name])}
                    />
                  </FormField>
                )}
              />
            ))}
          </div>
          <FormSubsection
            title="D. Catatan internal"
            description="Tambahkan konteks singkat yang hanya diperlukan oleh pengelola sekolah."
          />
          <FormField id="notes" label="Catatan" error={errors.notes?.message}>
            <Textarea
              id="notes"
              placeholder="Catatan dokumen (opsional)"
              {...register('notes')}
            />
          </FormField>
          </div>
          <DialogFooter className="border-border bg-surface shrink-0 border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={mutation.isPending}
              loadingText="Mengunggah…"
            >
              Unggah dokumen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FormSubsection({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-border border-b pb-4">
      <p className="text-foreground text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm leading-5">{description}</p>
    </div>
  )
}
