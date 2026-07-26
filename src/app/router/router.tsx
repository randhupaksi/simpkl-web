import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { DashboardPage, LoginPage } from './lazy-routes'
import { ROUTE_PATHS } from './route-paths'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { ErrorPage } from '@/layouts/error-layout'
import { PageLoader } from '@/shared/components/feedback/page-loader'

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const appRouter = createBrowserRouter([
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
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATHS.dashboard,
        element: withSuspense(<DashboardPage />),
      },
    ],
  },
  {
    path: ROUTE_PATHS.forbidden,
    element: <ErrorPage statusCode={403} />,
  },
  {
    path: '*',
    element: <ErrorPage statusCode={404} />,
  },
])
