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
    { key: 'code', label: 'Kode permission', required: true, section: { title: 'A. Identitas izin', description: 'Kode dan nama izin granular yang diperiksa oleh backend.' } },
    { key: 'name', label: 'Nama permission', required: true, section: { title: 'A. Identitas izin', description: 'Kode dan nama izin granular yang diperiksa oleh backend.' } },
    { key: 'module', label: 'Modul', required: true, section: { title: 'B. Cakupan modul', description: 'Tentukan modul aplikasi yang dilindungi oleh izin ini.' } },
    { key: 'description', label: 'Deskripsi', type: 'textarea', section: { title: 'C. Penjelasan akses', description: 'Jelaskan tindakan yang diizinkan agar konfigurasi mudah diaudit.' } },
  ],
}
