import {
  userCreateSchema,
  userEditSchema,
  userSchema,
} from '../schemas/user.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { UserAccount } from '@/shared/types'

export const userConfig: ResourceConfig<UserAccount> = {
  name: 'Pengguna',
  namePlural: 'Pengguna',
  endpoint: API_ENDPOINTS.users,
  queryKey: 'users',
  description:
    'Kelola akun staf, ruang lingkup jurusan atau kelas, status, dan akses masuk.',
  searchPlaceholder: 'Cari nama, email, atau username…',
  emptyDescription: 'Tambahkan akun staf yang membutuhkan akses ke SIMPKL.',
  schema: userSchema,
  createSchema: userCreateSchema,
  editSchema: userEditSchema,
  getDisplayName: (item) => item.name,
  normalizeInput: (values) => ({ ...values, role_ids: values.role_ids ?? [] }),
  normalizeEntity: (item) => ({
    name: item.name,
    email: item.email,
    username: item.username,
    password: '',
    major_id: item.major_id,
    class_id: item.class_id,
    status: item.status,
    role_ids: item.role_ids ?? [],
  }),
  tableFields: [
    { key: 'name', label: 'Nama' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'last_login_at', label: 'Login terakhir', format: 'date' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'name', label: 'Nama lengkap', required: true },
    { key: 'username', label: 'Username', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    {
      key: 'password',
      label: 'Password awal',
      type: 'password',
      createOnly: true,
      required: true,
      hint: 'Minimal 8 karakter. Password tidak pernah ditampilkan kembali.',
    },
    {
      key: 'major_id',
      label: 'Ruang lingkup jurusan',
      optionsEndpoint: API_ENDPOINTS.majors,
      placeholder: 'Semua jurusan',
    },
    {
      key: 'class_id',
      label: 'Ruang lingkup kelas',
      optionsEndpoint: API_ENDPOINTS.classes,
      placeholder: 'Semua kelas',
    },
    {
      key: 'status',
      label: 'Status akun',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Tidak aktif' },
        { value: 'locked', label: 'Terkunci' },
      ],
    },
  ],
}
