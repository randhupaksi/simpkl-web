import { majorSchema } from '../schemas/major.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Major } from '@/shared/types'

export const majorConfig: ResourceConfig<Major> = {
  name: 'Jurusan',
  namePlural: 'Jurusan',
  endpoint: API_ENDPOINTS.majors,
  queryKey: 'majors',
  description:
    'Kelola kompetensi keahlian, kode, pimpinan jurusan, dan status referensi.',
  searchPlaceholder: 'Cari kode atau nama jurusan…',
  emptyDescription: 'Tambahkan jurusan agar kelas dan siswa dapat direlasikan.',
  schema: majorSchema,
  getDisplayName: (item) => item.name,
  tableFields: [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama jurusan' },
    { key: 'abbreviation', label: 'Singkatan' },
    { key: 'head_name', label: 'Kepala jurusan' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'code', label: 'Kode jurusan', required: true },
    { key: 'abbreviation', label: 'Singkatan', required: true },
    { key: 'name', label: 'Nama jurusan', required: true },
    { key: 'head_name', label: 'Kepala jurusan' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Tidak aktif' },
      ],
    },
    { key: 'description', label: 'Deskripsi', type: 'textarea' },
  ],
}
