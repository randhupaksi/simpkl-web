import { Building2, CircleAlert, FileCheck2, MapPin, Users } from 'lucide-react'

export const DASHBOARD_MOCK = {
  metrics: [
    {
      label: 'Peserta aktif',
      value: 248,
      description: 'Tahun ajaran 2026/2027',
      icon: Users,
      tone: 'teal',
    },
    {
      label: 'Sudah ditempatkan',
      value: 216,
      description: '87% dari total peserta',
      icon: MapPin,
      tone: 'blue',
    },
    {
      label: 'Perusahaan aktif',
      value: 64,
      description: '8 kerja sama akan berakhir',
      icon: Building2,
      tone: 'violet',
    },
    {
      label: 'Dokumen lengkap',
      value: 198,
      description: '50 peserta perlu melengkapi',
      icon: FileCheck2,
      tone: 'amber',
    },
  ],
  actions: [
    {
      title: '32 siswa belum memiliki penempatan',
      detail: 'Prioritaskan kelas XII RPL 2 dan XII TKJ 1.',
      icon: CircleAlert,
    },
    {
      title: '8 kerja sama perusahaan segera berakhir',
      detail: 'Masa berlaku berakhir dalam 30 hari.',
      icon: Building2,
    },
  ],
} as const
