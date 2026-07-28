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
    },
    {
      key: 'student_id',
      label: 'Siswa',
      required: true,
      optionsEndpoint: API_ENDPOINTS.students,
      placeholder: 'Pilih siswa',
    },
    {
      key: 'company_id',
      label: 'Perusahaan',
      required: true,
      optionsEndpoint: API_ENDPOINTS.companies,
      placeholder: 'Pilih perusahaan',
    },
    {
      key: 'company_contact_id',
      label: 'PIC perusahaan',
      optionsEndpoint: API_ENDPOINTS.companyContacts,
      placeholder: 'Pilih PIC (opsional)',
    },
    {
      key: 'supervisor_id',
      label: 'Guru pembimbing',
      optionsEndpoint: API_ENDPOINTS.supervisors,
      placeholder: 'Pilih pembimbing (opsional)',
    },
    {
      key: 'previous_placement_id',
      label: 'Penempatan sebelumnya',
      optionsEndpoint: API_ENDPOINTS.placements,
      placeholder: 'Kosongkan untuk penempatan baru',
    },
    {
      key: 'division',
      label: 'Divisi',
      placeholder: 'Contoh: Teknologi Informasi',
    },
    { key: 'position', label: 'Posisi/tugas' },
    {
      key: 'work_system',
      label: 'Sistem kerja',
      type: 'select',
      required: true,
      defaultValue: 'wfo',
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
    },
    {
      key: 'end_date',
      label: 'Tanggal selesai',
      type: 'date',
      required: true,
    },
    {
      key: 'status',
      label: 'Status penempatan',
      type: 'select',
      required: true,
      defaultValue: 'draft',
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
      options: [
        { value: 'school', label: 'Sekolah' },
        { value: 'self_submission', label: 'Pengajuan siswa' },
        { value: 'teacher_recommendation', label: 'Rekomendasi guru' },
        { value: 'company_recruitment', label: 'Rekrutmen perusahaan' },
        { value: 'previous_partnership', label: 'Kemitraan sebelumnya' },
      ],
    },
    { key: 'address', label: 'Alamat pelaksanaan', type: 'textarea' },
    {
      key: 'override_reason',
      label: 'Alasan pengecualian',
      type: 'textarea',
      hint: 'Wajib dijelaskan jika aturan kuota atau jurusan dikecualikan.',
    },
    {
      key: 'transfer_reason',
      label: 'Riwayat alasan transfer',
      type: 'textarea',
      hint: 'Diisi oleh sistem saat proses transfer penempatan.',
    },
    { key: 'notes', label: 'Catatan internal', type: 'textarea' },
  ],
}
