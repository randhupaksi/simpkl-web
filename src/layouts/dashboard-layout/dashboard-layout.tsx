import { memo, useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'
import { MobileNavigation } from './mobile-navigation'
import { cn } from '@/shared/lib/utils'

const DashboardContent = memo(function DashboardContent({
  onOpenNavigation,
}: {
  onOpenNavigation: () => void
}) {
  return (
    <>
      <DashboardHeader onOpenNavigation={onOpenNavigation} />
      <main className="p-4 sm:p-6 xl:p-8">
        <div className="content-shell">
          <Outlet />
        </div>
      </main>
    </>
  )
})

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMobileNavigation = useCallback(() => setMobileOpen(true), [])

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden overscroll-x-none">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[var(--z-sticky)] hidden shrink-0 transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-standard)] lg:block',
          collapsed
            ? 'w-20 min-w-20 max-w-20'
            : 'w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] max-w-[var(--sidebar-width)]',
        )}
      >
        <DashboardSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </div>
      <div
        className={cn(
          'min-w-0 min-h-screen overflow-x-hidden',
          collapsed ? 'lg:pl-20' : 'lg:pl-[var(--sidebar-width)]',
        )}
      >
        <DashboardContent onOpenNavigation={openMobileNavigation} />
      </div>
      <MobileNavigation open={mobileOpen} onOpenChange={setMobileOpen} />
    </div>
  )
}
