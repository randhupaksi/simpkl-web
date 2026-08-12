import { placementSchema } from '../schemas/placement.schema'
import { API_ENDPOINTS } from '@/shared/constants'
import type { ResourceConfig } from '@/shared/components/forms'
import type { Placement } from '@/shared/types'

export const placementConfig: ResourceConfig<Placement> = {
  name: 'Penempatan',
  namePlural: 'Penempatan PKL',
  endpoint: API_ENDPOINTS.placements,
  queryKey: 'placements',
  description:
    'Atur relasi siswa, perusahaan, PIC, pembimbing, periode, tanggal, dan status penempatan.',
  searchPlaceholder: 'Cari data penempatan…',
  emptyDescription:
    'Buat penempatan setelah periode, siswa, perusahaan, dan pembimbing tersedia.',
  schema: placementSchema,
  getDisplayName: (item) => `Penempatan ${item.student_id.slice(0, 8)}`,
  normalizeInput: (values) => ({
    ...values,
    start_date: `${values.start_date}T00:00:00+07:00`,
    end_date: `${values.end_date}T00:00:00+07:00`,
  }),
  tableFields: [
    { key: 'student_id', label: 'Siswa' },
    { key: 'company_id', label: 'Perusahaan' },
    { key: 'start_date', label: 'Mulai', format: 'date' },
    { key: 'end_date', label: 'Selesai', format: 'date' },
    { key: 'status', label: 'Status', format: 'status' },
  ],
  fields: [
    {
      key: 'period_id',
      label: 'Periode PKL',
      required: true,
      optionsEndpoint: API_ENDPOINTS.periods,
      placeholder: 'Pilih periode',
      section: { title: 'A. Peserta dan tujuan', description: 'Tentukan periode, siswa, perusahaan, dan pihak yang terlibat.' },
    },
    {
      key: 'student_id',
      label: 'Siswa',
      required: true,
      optionsEndpoint: API_ENDPOINTS.students,
      placeholder: 'Pilih siswa',
      section: { title: 'A. Peserta dan tujuan', description: 'Tentukan periode, siswa, perusahaan, dan pihak yang terlibat.' },
    },
    {
      key: 'company_id',
      label: 'Perusahaan',
      required: true,
      optionsEndpoint: API_ENDPOINTS.eligibleCompanies,
      optionsParams: (values) => ({
        student_id:
          typeof values.student_id === 'string' ? values.student_id : undefined,
      }),
      placeholder: 'Pilih perusahaan',
      section: { title: 'A. Peserta dan tujuan', description: 'Tentukan periode, siswa, perusahaan, dan pihak yang terlibat.' },
    },
    {
      key: 'company_contact_id',
      label: 'PIC perusahaan',
      optionsEndpoint: API_ENDPOINTS.companyContacts,
      dependentOn: 'company_id',
      optionsParams: (values) => ({
        company_id:
          typeof values.company_id === 'string' ? values.company_id : undefined,
      }),
      placeholder: 'Pilih PIC (opsional)',
      section: { title: 'A. Peserta dan tujuan', description: 'Tentukan periode, siswa, perusahaan, dan pihak yang terlibat.' },
    },
    {
      key: 'supervisor_id',
      label: 'Guru pembimbing',
      optionsEndpoint: API_ENDPOINTS.supervisors,
      placeholder: 'Pilih pembimbing (opsional)',
      section: { title: 'A. Peserta dan tujuan', description: 'Tentukan periode, siswa, perusahaan, dan pihak yang terlibat.' },
    },
    {
      key: 'division',
      label: 'Divisi',
      placeholder: 'Contoh: Teknologi Informasi',
      section: { title: 'B. Peran dan pola kerja', description: 'Jelaskan unit kerja, tugas, dan cara pelaksanaan PKL.' },
    },
    {
      key: 'position',
      label: 'Posisi/tugas',
      placeholder: 'Contoh: Junior Web Developer',
      section: { title: 'B. Peran dan pola kerja', description: 'Jelaskan unit kerja, tugas, dan cara pelaksanaan PKL.' },
    },
    {
      key: 'work_system',
      label: 'Sistem kerja',
      type: 'select',
      required: true,
      defaultValue: 'wfo',
      section: { title: 'B. Peran dan pola kerja', description: 'Jelaskan unit kerja, tugas, dan cara pelaksanaan PKL.' },
      options: [
        { value: 'wfo', label: 'WFO / di lokasi' },
        { value: 'wfh', label: 'WFH / jarak jauh' },
        { value: 'hybrid', label: 'Hibrida' },
        { value: 'company_policy', label: 'Kebijakan perusahaan' },
      ],
    },
    {
      key: 'start_date',
      label: 'Tanggal mulai',
      type: 'date',
      required: true,
      section: { title: 'C. Jadwal dan administrasi', description: 'Pastikan tanggal pelaksanaan dan sumber penempatan sudah benar.' },
    },
    {
      key: 'end_date',
      label: 'Tanggal selesai',
      type: 'date',
      required: true,
      section: { title: 'C. Jadwal dan administrasi', description: 'Pastikan tanggal pelaksanaan dan sumber penempatan sudah benar.' },
    },
    {
      key: 'status',
      label: 'Status penempatan',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      hidden: true,
      section: { title: 'C. Jadwal dan administrasi', description: 'Pastikan tanggal pelaksanaan dan sumber penempatan sudah benar.' },
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending_verification', label: 'Menunggu verifikasi' },
        { value: 'approved', label: 'Disetujui' },
        { value: 'ready', label: 'Siap' },
        { value: 'active', label: 'Aktif' },
        { value: 'completed', label: 'Selesai' },
        { value: 'cancelled', label: 'Dibatalkan' },
        { value: 'transferred', label: 'Dipindahkan' },
      ],
    },
    {
      key: 'source',
      label: 'Sumber penempatan',
      type: 'select',
      required: true,
      defaultValue: 'school',
      section: { title: 'C. Jadwal dan administrasi', description: 'Pastikan tanggal pelaksanaan dan sumber penempatan sudah benar.' },
      options: [
        { value: 'school', label: 'Sekolah' },
        { value: 'self_submission', label: 'Pengajuan siswa' },
        { value: 'teacher_recommendation', label: 'Rekomendasi guru' },
        { value: 'company_recruitment', label: 'Rekrutmen perusahaan' },
        { value: 'previous_partnership', label: 'Kemitraan sebelumnya' },
      ],
    },
    {
      key: 'address',
      label: 'Alamat pelaksanaan',
      type: 'textarea',
      placeholder: 'Contoh: Jl. Sudirman No. 10, Jakarta',
      section: { title: 'D. Lokasi dan catatan', description: 'Tambahkan informasi pelaksanaan yang membantu koordinasi internal.' },
    },
    {
      key: 'notes',
      label: 'Catatan internal',
      type: 'textarea',
      placeholder: 'Tambahkan catatan jika diperlukan',
      section: { title: 'D. Lokasi dan catatan', description: 'Tambahkan informasi pelaksanaan yang membantu koordinasi internal.' },
    },
  ],
}
