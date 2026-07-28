import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { findNavigationItem } from '@/app/config/navigation'
import { ROUTE_PATHS } from '@/app/router'

export function DashboardBreadcrumb() {
  const { pathname } = useLocation()
  const item = findNavigationItem(pathname)
  const isDashboard = pathname === ROUTE_PATHS.dashboard
  const segment = pathname.split('/').filter(Boolean).at(-1)
  const detailLabel =
    segment && segment !== item?.path.split('/').at(-1)
      ? segment === 'new'
        ? 'Tambah'
        : segment === 'edit'
          ? 'Edit'
          : 'Detail'
      : null

  return (
    <nav
      aria-label="Breadcrumb"
      className="hidden items-center gap-1.5 md:flex"
    >
      <Link
        to={ROUTE_PATHS.dashboard}
        className="interactive-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-pressed rounded-[var(--radius-sm)] p-1.5"
        aria-label="Dashboard"
      >
        <Home className="size-4" />
      </Link>
      {!isDashboard && item ? (
        <>
          <ChevronRight className="text-disabled-foreground size-3.5" />
          <Link
            to={item.path}
            className="text-muted-foreground hover:text-link rounded-[var(--radius-xs)] px-1.5 py-1 text-sm"
          >
            {item.label}
          </Link>
        </>
      ) : null}
      {detailLabel ? (
        <>
          <ChevronRight className="text-disabled-foreground size-3.5" />
          <span className="text-foreground text-sm font-medium">
            {detailLabel}
          </span>
        </>
      ) : null}
    </nav>
  )
}
