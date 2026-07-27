export type CapabilityKey =
  | 'userRoleAssignments'
  | 'rolePermissionAssignments'
  | 'documentVersionHistory'
  | 'dashboardMajorBreakdown'
  | 'recentActivity'
  | 'serverSorting'

type Capability = {
  available: boolean
  label: string
  reason: string
  backendRequirement: string
}

export const FEATURE_CAPABILITIES: Record<CapabilityKey, Capability> = {
  userRoleAssignments: {
    available: false,
    label: 'Assignment role pengguna',
    reason:
      'Frontend belum dapat membaca assignment role yang sedang aktif secara aman.',
    backendRequirement:
      'Response detail pengguna perlu memuat role_ids aktual sebelum operasi replace assignment diaktifkan.',
  },
  rolePermissionAssignments: {
    available: false,
    label: 'Assignment permission role',
    reason:
      'Frontend belum dapat membaca assignment permission yang sedang aktif secara aman.',
    backendRequirement:
      'Response detail role perlu memuat permission_ids aktual sebelum operasi replace assignment diaktifkan.',
  },
  documentVersionHistory: {
    available: false,
    label: 'Riwayat versi dokumen',
    reason:
      'Metadata hanya menyediakan nomor versi dokumen saat ini tanpa koleksi riwayat.',
    backendRequirement:
      'Backend perlu menyediakan daftar versi yang dapat dibaca berdasarkan dokumen atau pemilik.',
  },
  dashboardMajorBreakdown: {
    available: false,
    label: 'Grafik siswa per jurusan',
    reason:
      'Response dashboard belum memuat distribusi peserta berdasarkan jurusan.',
    backendRequirement:
      'Response dashboard perlu menambahkan breakdown jurusan dengan label dan jumlah.',
  },
  recentActivity: {
    available: false,
    label: 'Aktivitas terbaru',
    reason: 'Belum tersedia feed aktivitas yang aman untuk dashboard.',
    backendRequirement:
      'Backend perlu menyediakan aktivitas terotorisasi dengan waktu, actor, dan ringkasan aksi.',
  },
  serverSorting: {
    available: false,
    label: 'Sorting server-side',
    reason: 'List backend saat ini hanya menerima page, per_page, dan search.',
    backendRequirement:
      'Kontrak pagination perlu mendefinisikan sort field dan direction yang diizinkan.',
  },
}
