import { roleSchema } from '../schemas/role.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Role } from '@/shared/types'

export const roleConfig: ResourceConfig<Role> = {
  name: 'Role',
  namePlural: 'Role dan Akses',
  endpoint: API_ENDPOINTS.roles,
  queryKey: 'roles',
  description:
    'Kelola kelompok akses staf. Role sistem ditandai agar perubahan berisiko mudah dikenali.',
  searchPlaceholder: 'Cari kode atau nama role…',
  emptyDescription: 'Tambahkan role untuk mengelompokkan permission pengguna.',
  schema: roleSchema,
  getDisplayName: (item) => item.name,
  normalizeEntity: (item) => ({
    code: item.code,
    name: item.name,
    description: item.description,
    is_system: item.is_system,
    status: item.status,
    permission_ids: item.permission_ids ?? [],
  }),
  tableFields: [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama role' },
    { key: 'is_system', label: 'Role sistem', format: 'boolean' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'code', label: 'Kode role', required: true },
    { key: 'name', label: 'Nama role', required: true },
    {
      key: 'is_system',
      label: 'Role sistem',
      type: 'switch',
      hint: 'Gunakan hanya untuk role bawaan yang dilindungi.',
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
    { key: 'description', label: 'Deskripsi', type: 'textarea' },
  ],
}
