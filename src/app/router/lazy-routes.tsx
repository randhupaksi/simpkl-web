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
