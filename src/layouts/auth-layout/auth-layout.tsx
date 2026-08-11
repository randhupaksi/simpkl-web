import { CheckCircle2, Files, School, ShieldCheck } from 'lucide-react'
import { Outlet } from 'react-router-dom'

import { Typography } from '@/shared/design-system/typography'

const benefits = [
  {
    icon: Files,
    title: 'Administrasi terstruktur',
    description: 'Periode, penempatan, dan dokumen dalam satu alur kerja.',
  },
  {
    icon: ShieldCheck,
    title: 'Akses berbasis peran',
    description: 'Menu dan tindakan mengikuti tanggung jawab setiap staf.',
  },
] as const

export function AuthLayout() {
  return (
    <main className="bg-background grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
      <section className="auth-visual border-sidebar-border bg-sidebar-background text-sidebar-foreground relative hidden min-h-screen overflow-hidden border-r px-12 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-14">
        <div className="relative z-10 flex items-center gap-3.5">
          <span className="bg-sidebar-active text-sidebar-active-foreground grid size-12 place-items-center rounded-[var(--radius-lg)] shadow-[var(--shadow-md)]">
            <School className="size-6" />
          </span>
          <div>
            <p className="font-bold tracking-tight">SIMPKL</p>
            <p className="text-sidebar-muted mt-0.5 text-xs">
              Sistem Manajemen Praktik Kerja Lapangan
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl py-12">
          <span className="border-sidebar-border bg-sidebar-surface text-sidebar-foreground inline-flex items-center gap-2 rounded-[var(--radius-full)] border px-3 py-1.5 text-xs font-semibold">
            <CheckCircle2 className="text-sidebar-active size-3.5" />
            Workspace administrasi internal
          </span>
          <h1 className="text-inverse-foreground mt-6 max-w-xl text-4xl leading-[1.15] font-bold tracking-[-0.035em] xl:text-5xl">
            Kelola administrasi PKL dengan alur yang tertib dan terukur.
          </h1>
          <Typography className="text-sidebar-muted mt-5 max-w-xl">
            Dirancang untuk membantu staf sekolah memantau kesiapan siswa,
            kapasitas mitra, penempatan, dan kelengkapan dokumen tanpa
            kehilangan konteks penting.
          </Typography>

          <div className="mt-10 grid max-w-xl gap-4 xl:grid-cols-2">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="border-sidebar-border bg-sidebar-surface/80 rounded-[var(--radius-lg)] border p-4"
              >
                <Icon className="text-sidebar-active size-5" />
                <p className="text-inverse-foreground mt-3 text-sm font-semibold">
                  {title}
                </p>
                <p className="text-sidebar-muted mt-1 text-xs leading-5">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <p className="text-sidebar-muted relative z-10 text-xs">
          Practical Work Placement Administration
        </p>
      </section>

      <section className="bg-surface flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <Outlet />
      </section>
    </main>
  )
}
