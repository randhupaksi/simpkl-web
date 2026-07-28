import { companySchema } from '../schemas/company.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Company } from '@/shared/types'

export const companyConfig: ResourceConfig<Company> = {
  name: 'Perusahaan',
  namePlural: 'Perusahaan',
  endpoint: API_ENDPOINTS.companies,
  queryKey: 'companies',
  description:
    'Kelola mitra PKL, kapasitas, status kerja sama, lokasi, dan masa berlaku kemitraan.',
  searchPlaceholder: 'Cari perusahaan, industri, atau kota…',
  emptyDescription:
    'Tambahkan perusahaan mitra agar dapat dipilih saat membuat penempatan.',
  schema: companySchema,
  getDisplayName: (item) => item.name,
  normalizeInput: (values) => ({
    ...values,
    cooperation_start: values.cooperation_start
      ? `${values.cooperation_start}T00:00:00+07:00`
      : null,
    cooperation_end: values.cooperation_end
      ? `${values.cooperation_end}T00:00:00+07:00`
      : null,
  }),
  tableFields: [
    { key: 'name', label: 'Perusahaan' },
    { key: 'industry', label: 'Industri' },
    { key: 'city', label: 'Kota' },
    { key: 'capacity', label: 'Kuota', format: 'number' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    { key: 'name', label: 'Nama perusahaan', required: true },
    { key: 'business_type', label: 'Bentuk usaha' },
    { key: 'industry', label: 'Industri', required: true },
    {
      key: 'capacity',
      label: 'Kuota keseluruhan',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      key: 'status',
      label: 'Status kerja sama',
      type: 'select',
      required: true,
      defaultValue: 'candidate',
      options: [
        { value: 'candidate', label: 'Kandidat' },
        { value: 'verifying', label: 'Verifikasi' },
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Tidak aktif' },
        { value: 'expired', label: 'Kedaluwarsa' },
        { value: 'not_recommended', label: 'Tidak direkomendasikan' },
        { value: 'blocked', label: 'Diblokir' },
      ],
    },
    { key: 'phone', label: 'Nomor telepon' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'website', label: 'Website', placeholder: 'https://…' },
    { key: 'maps_url', label: 'Tautan peta', placeholder: 'https://…' },
    { key: 'district', label: 'Kecamatan' },
    { key: 'city', label: 'Kota/kabupaten', required: true },
    { key: 'province', label: 'Provinsi' },
    { key: 'postal_code', label: 'Kode pos' },
    {
      key: 'cooperation_start',
      label: 'Mulai kerja sama',
      type: 'date',
    },
    {
      key: 'cooperation_end',
      label: 'Berakhir kerja sama',
      type: 'date',
    },
    {
      key: 'address',
      label: 'Alamat lengkap',
      type: 'textarea',
      required: true,
    },
    { key: 'description', label: 'Profil perusahaan', type: 'textarea' },
    { key: 'notes', label: 'Catatan internal', type: 'textarea' },
  ],
}
