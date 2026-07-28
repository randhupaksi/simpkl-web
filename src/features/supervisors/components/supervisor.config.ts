import { supervisorSchema } from '../schemas/supervisor.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Supervisor } from '@/shared/types'

export const supervisorConfig: ResourceConfig<Supervisor> = {
  name: 'Guru Pembimbing',
  namePlural: 'Guru Pembimbing',
  endpoint: API_ENDPOINTS.supervisors,
  queryKey: 'supervisors',
  description:
    'Kelola identitas guru, jurusan, jabatan, status, dan kapasitas bimbingan.',
  searchPlaceholder: 'Cari nama, NIP, atau kontak…',
  emptyDescription:
    'Tambahkan guru pembimbing sebelum membuat penempatan siswa.',
  schema: supervisorSchema,
  getDisplayName: (item) => item.name,
  tableFields: [
    { key: 'employee_number', label: 'NIP/NIK' },
    { key: 'name', label: 'Nama pembimbing' },
    { key: 'position', label: 'Jabatan' },
    { key: 'max_students', label: 'Maks. siswa', format: 'number' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'employee_number', label: 'NIP/NIK' },
    { key: 'name', label: 'Nama lengkap', required: true },
    { key: 'phone', label: 'Nomor telepon' },
    { key: 'email', label: 'Email', type: 'email' },
    {
      key: 'major_id',
      label: 'Jurusan',
      optionsEndpoint: API_ENDPOINTS.majors,
      placeholder: 'Pilih jurusan (opsional)',
    },
    { key: 'position', label: 'Jabatan' },
    {
      key: 'max_students',
      label: 'Kapasitas siswa',
      type: 'number',
      required: true,
      defaultValue: 20,
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
