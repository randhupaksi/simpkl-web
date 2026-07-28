import { classSchema } from '../schemas/class.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { SchoolClass } from '@/shared/types'

export const classConfig: ResourceConfig<SchoolClass> = {
  name: 'Kelas',
  namePlural: 'Kelas',
  endpoint: API_ENDPOINTS.classes,
  queryKey: 'classes',
  description:
    'Kelola rombongan belajar berdasarkan jurusan, tingkat, tahun ajaran, dan wali kelas.',
  searchPlaceholder: 'Cari kelas atau wali kelas…',
  emptyDescription: 'Tambahkan kelas untuk mengelompokkan data siswa.',
  schema: classSchema,
  getDisplayName: (item) => item.name,
  tableFields: [
    { key: 'name', label: 'Kelas' },
    { key: 'level', label: 'Tingkat', format: 'number' },
    { key: 'academic_year', label: 'Tahun ajaran' },
    { key: 'homeroom_teacher', label: 'Wali kelas' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'name', label: 'Nama kelas', required: true },
    {
      key: 'level',
      label: 'Tingkat',
      type: 'number',
      required: true,
      defaultValue: 11,
    },
    {
      key: 'major_id',
      label: 'Jurusan',
      required: true,
      optionsEndpoint: API_ENDPOINTS.majors,
      placeholder: 'Pilih jurusan',
    },
    { key: 'homeroom_teacher', label: 'Wali kelas' },
    {
      key: 'academic_year',
      label: 'Tahun ajaran',
      required: true,
      placeholder: '2026/2027',
    },
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
  ],
}
