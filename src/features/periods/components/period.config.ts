import { periodSchema } from '../schemas/period.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Period } from '@/shared/types'

export const periodConfig: ResourceConfig<Period> = {
  name: 'Periode PKL',
  namePlural: 'Periode PKL',
  endpoint: API_ENDPOINTS.periods,
  queryKey: 'periods',
  description:
    'Atur rentang pelaksanaan, tahun ajaran, angkatan, dan status setiap periode PKL.',
  searchPlaceholder: 'Cari nama periode…',
  emptyDescription:
    'Buat periode pertama untuk mulai mengatur peserta dan penempatan.',
  schema: periodSchema,
  getDisplayName: (item) => item.name,
  normalizeInput: (values) => ({
    ...values,
    start_date: `${values.start_date}T00:00:00+07:00`,
    end_date: `${values.end_date}T00:00:00+07:00`,
  }),
  tableFields: [
    { key: 'name', label: 'Periode' },
    { key: 'academic_year', label: 'Tahun ajaran' },
    { key: 'start_date', label: 'Mulai', format: 'date' },
    { key: 'end_date', label: 'Selesai', format: 'date' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    {
      key: 'name',
      label: 'Nama periode',
      required: true,
      placeholder: 'PKL Tahun Ajaran 2026/2027',
      section: { title: 'A. Identitas periode', description: 'Nama dan tahun ajaran yang akan dikenali pada seluruh proses PKL.' },
    },
    {
      key: 'academic_year',
      label: 'Tahun ajaran',
      required: true,
      placeholder: '2026/2027',
      inputMode: 'numeric',
      maxLength: 9,
      sanitizer: 'academic-year',
      hint: 'Masukkan tahun awal dan akhir berurutan, misalnya 2026/2027.',
      section: { title: 'A. Identitas periode', description: 'Nama dan tahun ajaran yang akan dikenali pada seluruh proses PKL.' },
    },
    {
      key: 'semester',
      label: 'Semester',
      type: 'select',
      required: true,
      defaultValue: 'odd',
      section: { title: 'A. Identitas periode', description: 'Nama dan tahun ajaran yang akan dikenali pada seluruh proses PKL.' },
      options: [
        { value: 'odd', label: 'Ganjil' },
        { value: 'even', label: 'Genap' },
      ],
    },
    {
      key: 'cohort',
      label: 'Angkatan',
      type: 'number',
      required: true,
      defaultValue: new Date().getFullYear(),
      section: { title: 'A. Identitas periode', description: 'Nama dan tahun ajaran yang akan dikenali pada seluruh proses PKL.' },
    },
    {
      key: 'start_date',
      label: 'Tanggal mulai',
      type: 'date',
      required: true,
      section: { title: 'B. Rentang pelaksanaan', description: 'Tanggal ini menjadi acuan validasi penempatan dan dokumen.' },
    },
    {
      key: 'end_date',
      label: 'Tanggal selesai',
      type: 'date',
      required: true,
      section: { title: 'B. Rentang pelaksanaan', description: 'Tanggal ini menjadi acuan validasi penempatan dan dokumen.' },
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      section: { title: 'C. Status dan catatan', description: 'Atur kesiapan periode serta informasi internal yang menyertainya.' },
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'preparation', label: 'Persiapan' },
        { value: 'active', label: 'Aktif' },
        { value: 'completed', label: 'Selesai' },
        { value: 'archived', label: 'Diarsipkan' },
      ],
    },
    {
      key: 'notes',
      label: 'Catatan',
      type: 'textarea',
      placeholder: 'Catatan internal periode (opsional)',
      section: { title: 'C. Status dan catatan', description: 'Atur kesiapan periode serta informasi internal yang menyertainya.' },
    },
  ],
}
