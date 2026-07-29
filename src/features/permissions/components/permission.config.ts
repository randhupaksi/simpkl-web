import { permissionSchema } from '../schemas/permission.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Permission } from '@/shared/types'

export const permissionConfig: ResourceConfig<Permission> = {
  name: 'Permission',
  namePlural: 'Permission',
  endpoint: API_ENDPOINTS.permissions,
  queryKey: 'permissions',
  description:
    'Katalog izin granular yang digunakan backend untuk membatasi menu, halaman, dan aksi.',
  searchPlaceholder: 'Cari kode, nama, atau modul…',
  emptyDescription: 'Permission backend akan tampil di sini setelah tersedia.',
  schema: permissionSchema,
  getDisplayName: (item) => item.name,
  tableFields: [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama permission' },
    { key: 'module', label: 'Modul' },
    { key: 'description', label: 'Deskripsi' },
  ],
  fields: [
    { key: 'code', label: 'Kode permission', required: true },
    { key: 'name', label: 'Nama permission', required: true },
    { key: 'module', label: 'Modul', required: true },
    { key: 'description', label: 'Deskripsi', type: 'textarea' },
  ],
}
