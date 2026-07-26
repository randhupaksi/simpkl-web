import { Bell, ChevronDown, Menu, School, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { NAVIGATION_ITEMS } from '@/shared/constants/navigation'
import { cn } from '@/shared/lib/utils'

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-transform lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950">
              <School className="size-5" />
            </div>
            <div>
              <p className="font-semibold">SIMPKL</p>
              <p className="text-xs text-slate-400">SMK Citra Negara</p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            type="button"
            aria-label="Tutup navigasi"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-teal-400 text-slate-950'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white',
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="size-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-900"
          >
            <div className="grid size-10 place-items-center rounded-full bg-slate-800 text-sm font-semibold">
              RP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Randhu Paksi</p>
              <p className="truncate text-xs text-slate-500">Administrator</p>
            </div>
            <ChevronDown className="size-4 text-slate-500" />
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            className="rounded-xl border border-slate-200 p-2.5 lg:hidden"
            type="button"
            aria-label="Buka navigasi"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <label className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <span className="sr-only">Cari data</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-10 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              placeholder="Cari siswa, perusahaan, atau penempatan..."
            />
          </label>
          <button
            type="button"
            className="relative ml-auto rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500" />
          </button>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Tutup navigasi"
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
    </div>
  )
}
