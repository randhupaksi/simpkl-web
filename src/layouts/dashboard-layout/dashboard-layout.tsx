import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { DashboardHeader } from './dashboard-header'
import { DashboardSidebar } from './dashboard-sidebar'
import { MobileNavigation } from './mobile-navigation'
import { cn } from '@/shared/lib/utils'

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[var(--z-sticky)] hidden transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-standard)] lg:block',
          collapsed ? 'w-20' : 'w-[var(--sidebar-width)]',
        )}
      >
        <DashboardSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
      </div>
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-[var(--duration-normal)] ease-[var(--ease-standard)]',
          collapsed ? 'lg:pl-20' : 'lg:pl-[var(--sidebar-width)]',
        )}
      >
        <DashboardHeader onOpenNavigation={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 xl:p-8">
          <div className="content-shell">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNavigation open={mobileOpen} onOpenChange={setMobileOpen} />
    </div>
  )
}
