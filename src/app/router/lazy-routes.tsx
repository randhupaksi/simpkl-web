import { lazy } from 'react'

export const LoginPage = lazy(() =>
  import('@/features/auth/pages/login-page').then((module) => ({
    default: module.LoginPage,
  })),
)

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  })),
)

export const PeriodListPage = lazy(() =>
  import('@/features/periods/pages').then((module) => ({
    default: module.PeriodListPage,
  })),
)

export const PeriodCreatePage = lazy(() =>
  import('@/features/periods/pages').then((module) => ({
    default: module.PeriodCreatePage,
  })),
)
export const PeriodDetailPage = lazy(() =>
  import('@/features/periods/pages').then((module) => ({
    default: module.PeriodDetailPage,
  })),
)
export const PeriodEditPage = lazy(() =>
  import('@/features/periods/pages').then((module) => ({
    default: module.PeriodEditPage,
  })),
)

export const StudentListPage = lazy(() =>
  import('@/features/students/pages').then((module) => ({
    default: module.StudentListPage,
  })),
)
export const StudentCreatePage = lazy(() =>
  import('@/features/students/pages').then((module) => ({
    default: module.StudentCreatePage,
  })),
)
export const StudentDetailPage = lazy(() =>
  import('@/features/students/pages').then((module) => ({
    default: module.StudentDetailPage,
  })),
)
export const StudentEditPage = lazy(() =>
  import('@/features/students/pages').then((module) => ({
    default: module.StudentEditPage,
  })),
)
export const StudentImportPage = lazy(() =>
  import('@/features/students/pages').then((module) => ({
    default: module.StudentImportPage,
  })),
)

export const CompanyListPage = lazy(() =>
  import('@/features/companies/pages').then((module) => ({
    default: module.CompanyListPage,
  })),
)
export const CompanyCreatePage = lazy(() =>
  import('@/features/companies/pages').then((module) => ({
    default: module.CompanyCreatePage,
  })),
)
export const CompanyDetailPage = lazy(() =>
  import('@/features/companies/pages').then((module) => ({
    default: module.CompanyDetailPage,
  })),
)
export const CompanyEditPage = lazy(() =>
  import('@/features/companies/pages').then((module) => ({
    default: module.CompanyEditPage,
  })),
)

export const PlacementListPage = lazy(() =>
  import('@/features/placements/pages').then((module) => ({
    default: module.PlacementListPage,
  })),
)
export const PlacementCreatePage = lazy(() =>
  import('@/features/placements/pages').then((module) => ({
    default: module.PlacementCreatePage,
  })),
)
export const PlacementDetailPage = lazy(() =>
  import('@/features/placements/pages').then((module) => ({
    default: module.PlacementDetailPage,
  })),
)
export const PlacementEditPage = lazy(() =>
  import('@/features/placements/pages').then((module) => ({
    default: module.PlacementEditPage,
  })),
)
export const PlacementTransferPage = lazy(() =>
  import('@/features/placements/pages').then((module) => ({
    default: module.PlacementTransferPage,
  })),
)

export const DocumentListPage = lazy(() =>
  import('@/features/documents/pages').then((module) => ({
    default: module.DocumentListPage,
  })),
)

export const ReportPage = lazy(() =>
  import('@/features/reports/pages').then((module) => ({
    default: module.ReportPage,
  })),
)

export const ReadinessPage = lazy(() =>
  import('@/features/administrative-readiness/pages').then((module) => ({
    default: module.ReadinessPage,
  })),
)
export const MajorListPage = lazy(() =>
  import('@/features/majors/pages').then((module) => ({
    default: module.MajorListPage,
  })),
)
export const ClassListPage = lazy(() =>
  import('@/features/classes/pages').then((module) => ({
    default: module.ClassListPage,
  })),
)
export const SupervisorListPage = lazy(() =>
  import('@/features/supervisors/pages').then((module) => ({
    default: module.SupervisorListPage,
  })),
)
export const ArchivePage = lazy(() =>
  import('@/features/archives/pages').then((module) => ({
    default: module.ArchivePage,
  })),
)
export const UserListPage = lazy(() =>
  import('@/features/users/pages').then((module) => ({
    default: module.UserListPage,
  })),
)
export const RoleListPage = lazy(() =>
  import('@/features/roles/pages').then((module) => ({
    default: module.RoleListPage,
  })),
)
export const PermissionListPage = lazy(() =>
  import('@/features/permissions/pages').then((module) => ({
    default: module.PermissionListPage,
  })),
)
export const SettingsPage = lazy(() =>
  import('@/features/settings/pages').then((module) => ({
    default: module.SettingsPage,
  })),
)

export const ContractPage = lazy(() =>
  import('@/shared/components/feedback').then((module) => ({
    default: module.ContractPage,
  })),
)
