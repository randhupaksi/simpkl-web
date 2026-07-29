import { Navigate, Outlet } from 'react-router-dom'

import { hasPermission } from '@/app/config/permissions'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'

type PermissionRouteProps = {
  permission: string | string[]
}

export function PermissionRoute({ permission }: PermissionRouteProps) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])

  if (!hasPermission(permissions, permission)) {
    return <Navigate to={ROUTE_PATHS.forbidden} replace />
  }

  return <Outlet />
}
