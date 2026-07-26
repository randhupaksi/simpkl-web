import type { FallbackProps } from 'react-error-boundary'
import { RotateCcw, TriangleAlert } from 'lucide-react'

export function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <section className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
        <TriangleAlert className="mx-auto size-12 text-rose-600" />
        <h1 className="mt-5 text-2xl font-semibold">
          Aplikasi mengalami kendala
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {error instanceof Error
            ? error.message
            : 'Terjadi kesalahan yang tidak terduga.'}
        </p>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          <RotateCcw className="size-4" />
          Muat ulang aplikasi
        </button>
      </section>
    </main>
  )
}
