import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { DashboardBreadcrumb } from './dashboard-breadcrumb'
import { ROUTE_PATHS } from '@/app/router'
import { useLogoutMutation } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui'

type DashboardHeaderProps = {
  onOpenNavigation: () => void
}

export function DashboardHeader({ onOpenNavigation }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logoutMutation = useLogoutMutation()
  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  async function handleLogout() {
    await logoutMutation.mutateAsync()
    toast.success('Anda telah keluar dari SIMPKL.')
    navigate(ROUTE_PATHS.login, { replace: true })
  }

  return (
    <header className="border-border bg-surface/95 sticky top-0 z-[var(--z-sticky)] flex min-w-0 h-[5.25rem] items-center gap-4 overflow-hidden border-b px-4 backdrop-blur sm:px-7">
      <IconButton
        aria-label="Buka navigasi"
        variant="outline"
        className="lg:hidden"
        onClick={onOpenNavigation}
      >
        <Menu />
      </IconButton>

      <DashboardBreadcrumb />

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden xl:block">
          <Input
            startIcon={<Search />}
            placeholder="Cari siswa atau perusahaan…"
            aria-label="Pencarian cepat"
            className="bg-surface-subtle placeholder:text-muted-foreground/80 focus:bg-surface h-11 w-[21rem] rounded-[var(--radius-lg)] shadow-none"
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              aria-label="Notifikasi"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground relative"
            >
              <Bell />
              <span className="bg-sidebar-active absolute top-2 right-2 size-1.5 rounded-full" />
            </IconButton>
          </TooltipTrigger>
          <TooltipContent>Notifikasi</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="border-border-subtle ml-1 h-11 gap-2 rounded-none border-l pr-1 pl-4"
            >
              <span className="bg-secondary-subtle text-secondary grid size-9 place-items-center rounded-[var(--radius-md)] text-xs font-bold">
                {initials || 'ST'}
              </span>
              <span className="hidden max-w-36 truncate text-sm sm:block">
                {user?.name ?? 'Staf sekolah'}
              </span>
              <ChevronDown className="text-muted-foreground size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <span className="text-foreground block truncate normal-case">
                {user?.name ?? 'Staf sekolah'}
              </span>
              <span className="text-muted-foreground mt-0.5 block truncate font-normal tracking-normal normal-case">
                {user?.email ?? 'Akun internal'}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate(ROUTE_PATHS.settings)}>
              <UserRound />
              Profil & pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              disabled={logoutMutation.isPending}
              onSelect={() => void handleLogout()}
            >
              <LogOut />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
