import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTE_PATHS } from './route-paths'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.tokens?.accessToken),
  )
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.login}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}
