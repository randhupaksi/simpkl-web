import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  CompanyListPage,
  CompanyCreatePage,
  CompanyDetailPage,
  CompanyEditPage,
  ArchivePage,
  ClassListPage,
  DashboardPage,
  DocumentListPage,
  LoginPage,
  PeriodListPage,
  PeriodCreatePage,
  PeriodDetailPage,
  PeriodEditPage,
  PermissionListPage,
  PlacementListPage,
  PlacementCreatePage,
  PlacementDetailPage,
  PlacementEditPage,
  PlacementTransferPage,
  ReadinessPage,
  ReportPage,
  RoleListPage,
  SettingsPage,
  StudentCreatePage,
  StudentDetailPage,
  StudentEditPage,
  StudentImportPage,
  StudentListPage,
  SupervisorListPage,
  UserListPage,
  MajorListPage,
} from './lazy-routes'
import { PermissionRoute } from './permission-route'
import { ProtectedRoute } from './protected-route'
import { ROUTE_PATHS } from './route-paths'
import { PERMISSIONS } from '@/app/config/permissions'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { ErrorPage } from '@/layouts/error-layout'
import { PageLoader } from '@/shared/components/feedback/page-loader'

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.login,
        element: withSuspense(<LoginPage />),
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <PermissionRoute permission={PERMISSIONS.report.view} />,
            children: [
              {
                path: ROUTE_PATHS.dashboard,
                element: withSuspense(<DashboardPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.period.view} />,
            children: [
              {
                path: ROUTE_PATHS.periods,
                element: withSuspense(<PeriodListPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.period.create} />
                ),
                children: [
                  {
                    path: '/periods/new',
                    element: withSuspense(<PeriodCreatePage />),
                  },
                ],
              },
              {
                path: '/periods/:id',
                element: withSuspense(<PeriodDetailPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.period.update} />
                ),
                children: [
                  {
                    path: '/periods/:id/edit',
                    element: withSuspense(<PeriodEditPage />),
                  },
                ],
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.student.view} />,
            children: [
              {
                path: ROUTE_PATHS.students,
                element: withSuspense(<StudentListPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.student.create} />
                ),
                children: [
                  {
                    path: '/students/new',
                    element: withSuspense(<StudentCreatePage />),
                  },
                ],
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.student.import} />
                ),
                children: [
                  {
                    path: '/students/import',
                    element: withSuspense(<StudentImportPage />),
                  },
                ],
              },
              {
                path: '/students/:id',
                element: withSuspense(<StudentDetailPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.student.update} />
                ),
                children: [
                  {
                    path: '/students/:id/edit',
                    element: withSuspense(<StudentEditPage />),
                  },
                ],
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.company.view} />,
            children: [
              {
                path: ROUTE_PATHS.companies,
                element: withSuspense(<CompanyListPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.company.create} />
                ),
                children: [
                  {
                    path: '/companies/new',
                    element: withSuspense(<CompanyCreatePage />),
                  },
                ],
              },
              {
                path: '/companies/:id',
                element: withSuspense(<CompanyDetailPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.company.update} />
                ),
                children: [
                  {
                    path: '/companies/:id/edit',
                    element: withSuspense(<CompanyEditPage />),
                  },
                ],
              },
            ],
          },
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.placement.view} />
            ),
            children: [
              {
                path: ROUTE_PATHS.placements,
                element: withSuspense(<PlacementListPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.placement.create} />
                ),
                children: [
                  {
                    path: '/placements/new',
                    element: withSuspense(<PlacementCreatePage />),
                  },
                ],
              },
              {
                path: '/placements/:id',
                element: withSuspense(<PlacementDetailPage />),
              },
              {
                element: (
                  <PermissionRoute permission={PERMISSIONS.placement.update} />
                ),
                children: [
                  {
                    path: '/placements/:id/edit',
                    element: withSuspense(<PlacementEditPage />),
                  },
                ],
              },
              {
                element: (
                  <PermissionRoute
                    permission={PERMISSIONS.placement.transfer}
                  />
                ),
                children: [
                  {
                    path: '/placements/:id/transfer',
                    element: withSuspense(<PlacementTransferPage />),
                  },
                ],
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.document.view} />,
            children: [
              {
                path: ROUTE_PATHS.documents,
                element: withSuspense(<DocumentListPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.report.view} />,
            children: [
              {
                path: ROUTE_PATHS.reports,
                element: withSuspense(<ReportPage />),
              },
            ],
          },
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.readiness.view} />
            ),
            children: [
              {
                path: ROUTE_PATHS.readiness,
                element: withSuspense(<ReadinessPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.major.view} />,
            children: [
              {
                path: ROUTE_PATHS.majors,
                element: withSuspense(<MajorListPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.class.view} />,
            children: [
              {
                path: ROUTE_PATHS.classes,
                element: withSuspense(<ClassListPage />),
              },
            ],
          },
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.supervisor.view} />
            ),
            children: [
              {
                path: ROUTE_PATHS.supervisors,
                element: withSuspense(<SupervisorListPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.archive.view} />,
            children: [
              {
                path: ROUTE_PATHS.archives,
                element: withSuspense(<ArchivePage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.user.view} />,
            children: [
              {
                path: ROUTE_PATHS.users,
                element: withSuspense(<UserListPage />),
              },
            ],
          },
          {
            element: <PermissionRoute permission={PERMISSIONS.role.view} />,
            children: [
              {
                path: ROUTE_PATHS.roles,
                element: withSuspense(<RoleListPage />),
              },
            ],
          },
          {
            element: (
              <PermissionRoute permission={PERMISSIONS.permission.view} />
            ),
            children: [
              {
                path: ROUTE_PATHS.permissions,
                element: withSuspense(<PermissionListPage />),
              },
            ],
          },
          {
            path: ROUTE_PATHS.settings,
            element: withSuspense(<SettingsPage />),
          },
        ],
      },
    ],
  },
  {
    path: ROUTE_PATHS.forbidden,
    element: <ErrorPage statusCode={403} />,
  },
  {
    path: ROUTE_PATHS.notFound,
    element: <ErrorPage statusCode={404} />,
  },
  {
    path: '*',
    element: <ErrorPage statusCode={404} />,
  },
])
