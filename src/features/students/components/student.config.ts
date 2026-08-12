import { studentSchema } from '../schemas/student.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Student } from '@/shared/types'

export const studentConfig: ResourceConfig<Student> = {
  name: 'Siswa',
  namePlural: 'Siswa',
  endpoint: API_ENDPOINTS.students,
  queryKey: 'students',
  description:
    'Kelola identitas siswa, relasi kelas dan jurusan, serta status administrasi PKL.',
  searchPlaceholder: 'Cari NIS atau nama siswa…',
  emptyDescription:
    'Tambahkan siswa secara manual atau gunakan impor Excel untuk data dalam jumlah besar.',
  schema: studentSchema,
  getDisplayName: (item) => item.name,
  tableFields: [
    { key: 'nis', label: 'NIS' },
    { key: 'name', label: 'Nama siswa' },
    { key: 'pkl_status', label: 'Status PKL', format: 'status' },
  ],
  fields: [
    { key: 'nis', label: 'NIS', required: true, section: { title: 'A. Identitas siswa', description: 'Nomor induk dan nama yang digunakan pada administrasi PKL.' } },
    { key: 'nisn', label: 'NISN', section: { title: 'A. Identitas siswa', description: 'Nomor induk dan nama yang digunakan pada administrasi PKL.' } },
    { key: 'name', label: 'Nama lengkap', required: true, section: { title: 'A. Identitas siswa', description: 'Nomor induk dan nama yang digunakan pada administrasi PKL.' } },
    { key: 'nickname', label: 'Nama panggilan', section: { title: 'A. Identitas siswa', description: 'Nomor induk dan nama yang digunakan pada administrasi PKL.' } },
    {
      key: 'gender',
      label: 'Jenis kelamin',
      type: 'select',
      required: true,
      section: { title: 'A. Identitas siswa', description: 'Nomor induk dan nama yang digunakan pada administrasi PKL.' },
      options: [
        { value: 'male', label: 'Laki-laki' },
        { value: 'female', label: 'Perempuan' },
      ],
    },
    {
      key: 'major_id',
      label: 'Jurusan',
      required: true,
      optionsEndpoint: API_ENDPOINTS.majors,
      placeholder: 'Pilih jurusan',
      section: { title: 'B. Data akademik', description: 'Kelas dan jurusan menentukan konteks penempatan siswa.' },
    },
    {
      key: 'class_id',
      label: 'Kelas',
      required: true,
      optionsEndpoint: API_ENDPOINTS.classes,
      placeholder: 'Pilih kelas',
      section: { title: 'B. Data akademik', description: 'Kelas dan jurusan menentukan konteks penempatan siswa.' },
    },
    { key: 'phone', label: 'Nomor telepon', type: 'text', section: { title: 'C. Kontak dan wali', description: 'Gunakan kontak yang dapat dihubungi selama proses PKL.' } },
    { key: 'email', label: 'Email', type: 'email', section: { title: 'C. Kontak dan wali', description: 'Gunakan kontak yang dapat dihubungi selama proses PKL.' } },
    { key: 'parent_name', label: 'Nama orang tua/wali', section: { title: 'C. Kontak dan wali', description: 'Gunakan kontak yang dapat dihubungi selama proses PKL.' } },
    { key: 'parent_phone', label: 'Telepon orang tua/wali', section: { title: 'C. Kontak dan wali', description: 'Gunakan kontak yang dapat dihubungi selama proses PKL.' } },
    {
      key: 'status',
      label: 'Status siswa',
      type: 'select',
      required: true,
      defaultValue: 'active',
      section: { title: 'D. Status administrasi', description: 'Status ini dipakai untuk menjaga data siswa dan progres PKL tetap akurat.' },
      options: [
        { value: 'active', label: 'Aktif' },
        { value: 'inactive', label: 'Tidak aktif' },
        { value: 'graduated', label: 'Lulus' },
        { value: 'transferred', label: 'Pindah' },
        { value: 'withdrawn', label: 'Mengundurkan diri' },
      ],
    },
    {
      key: 'pkl_status',
      label: 'Status PKL',
      type: 'select',
      required: true,
      defaultValue: 'unplaced',
      section: { title: 'D. Status administrasi', description: 'Status ini dipakai untuk menjaga data siswa dan progres PKL tetap akurat.' },
      options: [
        { value: 'unplaced', label: 'Belum ditempatkan' },
        { value: 'placement_process', label: 'Proses penempatan' },
        { value: 'placed', label: 'Sudah ditempatkan' },
        { value: 'ready', label: 'Siap PKL' },
        { value: 'active', label: 'Sedang PKL' },
        { value: 'completed', label: 'Selesai' },
        { value: 'cancelled', label: 'Dibatalkan' },
      ],
    },
    {
      key: 'address',
      label: 'Alamat',
      type: 'textarea',
      className: 'sm:col-span-2',
      section: { title: 'E. Alamat dan catatan', description: 'Informasi pendukung untuk koordinasi internal sekolah.' },
    },
    {
      key: 'notes',
      label: 'Catatan internal',
      type: 'textarea',
      className: 'sm:col-span-2',
      section: { title: 'E. Alamat dan catatan', description: 'Informasi pendukung untuk koordinasi internal sekolah.' },
    },
  ],
}
