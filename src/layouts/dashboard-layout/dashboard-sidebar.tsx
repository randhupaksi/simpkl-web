import { ChevronLeft, School } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { NAVIGATION_GROUPS } from '@/app/config/navigation'
import { hasPermission } from '@/app/config/permissions'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import {
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'

type DashboardSidebarProps = {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  className?: string
  onNavigate?: () => void
}

export function DashboardSidebar({
  collapsed,
  onCollapsedChange,
  className,
  onNavigate,
}: DashboardSidebarProps) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])

  return (
    <aside
      className={cn(
        'border-sidebar-border bg-sidebar-background text-sidebar-foreground flex h-full flex-col overflow-hidden rounded-tr-[var(--radius-lg)] rounded-br-[var(--radius-lg)] border-r',
        className,
      )}
      aria-label="Navigasi utama"
    >
      <div
        className={cn(
          'border-sidebar-border flex h-[5.25rem] items-center border-b',
          collapsed ? 'justify-center px-2' : 'px-5',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-sidebar-active text-sidebar-active-foreground relative grid size-11 shrink-0 place-items-center rounded-[var(--radius-lg)] shadow-[0_8px_20px_rgb(20_159_145_/_0.2)]">
            <School className="size-[1.35rem]" />
            <span className="border-sidebar-background absolute right-0.5 bottom-0.5 size-2 rounded-full border-2 bg-[#8de0c0]" />
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="text-inverse-foreground truncate text-[0.9375rem] font-bold tracking-[-0.02em]">
                SIMPKL
              </p>
              <p className="text-sidebar-muted mt-0.5 truncate text-[0.6875rem] tracking-wide">
                Practical Work Placement Management
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <nav
        className={cn(
          'scrollbar-subtle flex-1 overflow-y-auto py-6',
          collapsed ? 'px-2' : 'px-3.5',
        )}
      >
        <div className={cn(collapsed ? 'space-y-4' : 'space-y-7')}>
          {NAVIGATION_GROUPS.map((group) => {
            const visibleItems = group.items.filter((item) =>
              hasPermission(
                permissions,
                'permission' in item ? item.permission : undefined,
              ),
            )
            if (visibleItems.length === 0) return null

            return (
              <section key={group.label}>
                {!collapsed ? (
                  <p className="text-sidebar-muted mb-2.5 px-3 text-[0.625rem] font-bold tracking-[0.18em] uppercase">
                    {group.label}
                  </p>
                ) : null}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    const link = (
                      <NavLink
                        to={item.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            'interactive-surface pressed-feedback group hover:bg-sidebar-hover hover:text-inverse-foreground active:bg-sidebar-pressed relative flex min-h-11 items-center rounded-[var(--radius-md)] border-l-2 border-l-transparent text-sm font-medium outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sidebar-active)_30%,transparent)]',
                            collapsed
                              ? 'mx-auto size-12 justify-center border-l-0 px-0'
                              : 'gap-3 px-3.5',
                            isActive &&
                              (collapsed
                                ? 'ring-sidebar-active bg-sidebar-surface text-sidebar-active-foreground hover:bg-sidebar-surface active:bg-sidebar-surface shadow-[0_8px_18px_rgb(3_10_20_/_0.12)] ring-1 ring-inset'
                                : 'border-l-sidebar-active bg-sidebar-surface text-sidebar-active-foreground hover:bg-sidebar-surface active:bg-sidebar-surface shadow-[0_8px_18px_rgb(3_10_20_/_0.12)]'),
                          )
                        }
                      >
                        <Icon className="size-[1.125rem] shrink-0" />
                        {!collapsed ? (
                          <span className="truncate">{item.label}</span>
                        ) : null}
                      </NavLink>
                    )

                    return collapsed ? (
                      <Tooltip key={item.path}>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div key={item.path}>{link}</div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </nav>

      <div className="border-sidebar-border hidden border-t p-3 lg:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              aria-label={collapsed ? 'Perluas sidebar' : 'Ringkas sidebar'}
              variant="ghost"
              className={cn(
                'text-sidebar-muted hover:bg-sidebar-hover hover:text-inverse-foreground active:bg-sidebar-pressed',
                collapsed ? 'mx-auto size-12' : 'w-full',
              )}
              onClick={() => onCollapsedChange(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  'transition-transform duration-[var(--duration-normal)]',
                  collapsed && 'rotate-180',
                )}
              />
              {!collapsed ? (
                <span className="ml-2 text-sm">Ringkas sidebar</span>
              ) : null}
            </IconButton>
          </TooltipTrigger>
          {collapsed ? (
            <TooltipContent side="right">Perluas sidebar</TooltipContent>
          ) : null}
        </Tooltip>
      </div>
    </aside>
  )
}
