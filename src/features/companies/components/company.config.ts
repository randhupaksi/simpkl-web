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
    { key: 'name', label: 'Nama perusahaan', required: true, section: { title: 'A. Profil perusahaan', description: 'Identitas dasar mitra yang akan tampil pada penempatan dan dokumen.' } },
    { key: 'business_type', label: 'Bentuk usaha', section: { title: 'A. Profil perusahaan', description: 'Identitas dasar mitra yang akan tampil pada penempatan dan dokumen.' } },
    { key: 'industry', label: 'Industri', required: true, section: { title: 'A. Profil perusahaan', description: 'Identitas dasar mitra yang akan tampil pada penempatan dan dokumen.' } },
    {
      key: 'capacity',
      label: 'Kuota keseluruhan',
      type: 'number',
      required: true,
      defaultValue: 0,
      section: { title: 'B. Kapasitas dan kerja sama', description: 'Tetapkan daya tampung umum serta kondisi hubungan kerja sama.' },
    },
    {
      key: 'status',
      label: 'Status kerja sama',
      type: 'select',
      required: true,
      defaultValue: 'candidate',
      section: { title: 'B. Kapasitas dan kerja sama', description: 'Tetapkan daya tampung umum serta kondisi hubungan kerja sama.' },
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
    { key: 'phone', label: 'Nomor telepon', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'email', label: 'Email', type: 'email', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'website', label: 'Website', placeholder: 'https://…', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'maps_url', label: 'Tautan peta', placeholder: 'https://…', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'district', label: 'Kecamatan', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'city', label: 'Kota/kabupaten', required: true, section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'province', label: 'Provinsi', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    { key: 'postal_code', label: 'Kode pos', section: { title: 'C. Kontak dan lokasi', description: 'Saluran komunikasi serta alamat operasional perusahaan.' } },
    {
      key: 'cooperation_start',
      label: 'Mulai kerja sama',
      type: 'date',
      section: { title: 'D. Masa berlaku kemitraan', description: 'Kosongkan bila belum ada batas waktu kerja sama yang disepakati.' },
    },
    {
      key: 'cooperation_end',
      label: 'Berakhir kerja sama',
      type: 'date',
      section: { title: 'D. Masa berlaku kemitraan', description: 'Kosongkan bila belum ada batas waktu kerja sama yang disepakati.' },
    },
    {
      key: 'address',
      label: 'Alamat lengkap',
      type: 'textarea',
      required: true,
      section: { title: 'E. Keterangan tambahan', description: 'Alamat pelaksanaan, profil usaha, dan catatan yang dipakai tim sekolah.' },
    },
    { key: 'description', label: 'Profil perusahaan', type: 'textarea', section: { title: 'E. Keterangan tambahan', description: 'Alamat pelaksanaan, profil usaha, dan catatan yang dipakai tim sekolah.' } },
    { key: 'notes', label: 'Catatan internal', type: 'textarea', section: { title: 'E. Keterangan tambahan', description: 'Alamat pelaksanaan, profil usaha, dan catatan yang dipakai tim sekolah.' } },
  ],
}
