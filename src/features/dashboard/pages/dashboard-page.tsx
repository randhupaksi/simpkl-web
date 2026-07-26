import { ArrowRight, CalendarDays, Plus } from 'lucide-react'

import { DASHBOARD_MOCK } from '../api/dashboard.mock'
import { cn } from '@/shared/lib/utils'

const toneStyles = {
  teal: 'bg-teal-50 text-teal-700',
  blue: 'bg-blue-50 text-blue-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
} as const

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Tahun ajaran 2026/2027
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Ringkasan PKL
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Pantau kesiapan administrasi dan progres penempatan peserta.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="size-4" />
          Tambah periode
        </button>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_MOCK.metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div
                className={cn(
                  'grid size-11 place-items-center rounded-xl',
                  toneStyles[metric.tone],
                )}
              >
                <Icon className="size-5" />
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {metric.description}
              </p>
            </article>
          )
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Timeline periode aktif</h2>
              <p className="mt-1 text-sm text-slate-500">
                PKL semester ganjil 2026/2027
              </p>
            </div>
            <CalendarDays className="size-5 text-slate-400" />
          </div>
          <div className="mt-8">
            <div className="mb-3 flex justify-between text-xs font-medium text-slate-500">
              <span>Persiapan</span>
              <span>Pelaksanaan</span>
              <span>Evaluasi</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[64%] rounded-full bg-teal-500" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Mulai PKL</p>
                <p className="mt-1 text-sm font-semibold">13 Juli 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Selesai PKL</p>
                <p className="mt-1 text-sm font-semibold">18 Desember 2026</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Perlu tindakan</h2>
              <p className="mt-1 text-sm text-slate-500">
                Prioritas administrasi saat ini
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              2 prioritas
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {DASHBOARD_MOCK.actions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  type="button"
                  className="flex w-full items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-slate-300 hover:bg-slate-50"
                >
                  <Icon className="mt-0.5 size-5 shrink-0 text-amber-600" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {action.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {action.detail}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-slate-400" />
                </button>
              )
            })}
          </div>
        </article>
      </section>
    </div>
  )
}
