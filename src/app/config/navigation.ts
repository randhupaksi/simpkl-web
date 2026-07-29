import {
  Archive,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  ClipboardCheck,
  FileBarChart,
  Files,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UserRoundCog,
  type LucideIcon,
} from 'lucide-react'

import { PERMISSIONS } from './permissions'
import { ROUTE_PATHS } from '@/app/router/route-paths'

export type NavigationItem = {
  label: string
  path: string
  icon: LucideIcon
  permission?: string | readonly string[]
}

export type NavigationGroup = {
  label: string
  items: readonly NavigationItem[]
}

export const NAVIGATION_GROUPS: readonly NavigationGroup[] = [
  {
    label: 'Utama',
    items: [
      {
        label: 'Dashboard',
        path: ROUTE_PATHS.dashboard,
        icon: LayoutDashboard,
        permission: PERMISSIONS.report.view,
      },
    ],
  },
  {
    label: 'Manajemen PKL',
    items: [
      {
        label: 'Periode PKL',
        path: ROUTE_PATHS.periods,
        icon: CalendarRange,
        permission: PERMISSIONS.period.view,
      },
      {
        label: 'Penempatan PKL',
        path: ROUTE_PATHS.placements,
        icon: MapPin,
        permission: PERMISSIONS.placement.view,
      },
      {
        label: 'Kesiapan Administrasi',
        path: ROUTE_PATHS.readiness,
        icon: ClipboardCheck,
        permission: PERMISSIONS.readiness.view,
      },
    ],
  },
  {
    label: 'Data Master',
    items: [
      {
        label: 'Siswa',
        path: ROUTE_PATHS.students,
        icon: GraduationCap,
        permission: PERMISSIONS.student.view,
      },
      {
        label: 'Jurusan',
        path: ROUTE_PATHS.majors,
        icon: BriefcaseBusiness,
        permission: PERMISSIONS.major.view,
      },
      {
        label: 'Kelas',
        path: ROUTE_PATHS.classes,
        icon: Users,
        permission: PERMISSIONS.class.view,
      },
      {
        label: 'Perusahaan',
        path: ROUTE_PATHS.companies,
        icon: Building2,
        permission: PERMISSIONS.company.view,
      },
      {
        label: 'Guru Pembimbing',
        path: ROUTE_PATHS.supervisors,
        icon: UserRoundCog,
        permission: PERMISSIONS.supervisor.view,
      },
    ],
  },
  {
    label: 'Administrasi',
    items: [
      {
        label: 'Dokumen',
        path: ROUTE_PATHS.documents,
        icon: Files,
        permission: PERMISSIONS.document.view,
      },
      {
        label: 'Laporan',
        path: ROUTE_PATHS.reports,
        icon: FileBarChart,
        permission: PERMISSIONS.report.view,
      },
      {
        label: 'Arsip',
        path: ROUTE_PATHS.archives,
        icon: Archive,
        permission: PERMISSIONS.archive.view,
      },
    ],
  },
  {
    label: 'Sistem',
    items: [
      {
        label: 'Pengguna',
        path: ROUTE_PATHS.users,
        icon: UserRoundCog,
        permission: PERMISSIONS.user.view,
      },
      {
        label: 'Role & Permission',
        path: ROUTE_PATHS.roles,
        icon: ShieldCheck,
        permission: [PERMISSIONS.role.view, PERMISSIONS.permission.view],
      },
      {
        label: 'Pengaturan',
        path: ROUTE_PATHS.settings,
        icon: SlidersHorizontal,
      },
    ],
  },
]

export function findNavigationItem(pathname: string) {
  return NAVIGATION_GROUPS.flatMap((group) => group.items).find(
    (item) =>
      pathname === item.path ||
      (item.path !== ROUTE_PATHS.dashboard &&
        pathname.startsWith(`${item.path}/`)),
  )
}
