import {
  Archive,
  Building2,
  FileBarChart,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
} from 'lucide-react'

import { ROUTE_PATHS } from '@/app/router'

export const NAVIGATION_ITEMS = [
  { label: 'Dashboard', path: ROUTE_PATHS.dashboard, icon: LayoutDashboard },
  { label: 'Periode PKL', path: '/periods', icon: GraduationCap },
  { label: 'Data Siswa', path: '/students', icon: Users },
  { label: 'Perusahaan', path: '/companies', icon: Building2 },
  { label: 'Penempatan', path: '/placements', icon: MapPin },
  { label: 'Dokumen', path: '/documents', icon: FileText },
  { label: 'Laporan', path: '/reports', icon: FileBarChart },
  { label: 'Arsip', path: '/archives', icon: Archive },
  { label: 'Pengaturan', path: '/settings', icon: Settings },
] as const
