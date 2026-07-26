import { ArrowLeft, ShieldAlert, TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router'

type ErrorPageProps = {
  statusCode?: 403 | 404 | 500
}

export function ErrorPage({ statusCode }: ErrorPageProps) {
  const routeError = useRouteError()
  const inferredStatus = isRouteErrorResponse(routeError)
    ? routeError.status
    : 500
  const status = statusCode ?? inferredStatus
  const isForbidden = status === 403

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-slate-950 text-white">
          {isForbidden ? (
            <ShieldAlert className="size-8" />
          ) : (
            <TriangleAlert className="size-8" />
          )}
        </div>
        <p className="text-sm font-semibold tracking-[0.18em] text-teal-700 uppercase">
          Error {status}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {isForbidden
            ? 'Akses tidak diizinkan'
            : status === 404
              ? 'Halaman tidak ditemukan'
              : 'Terjadi kesalahan'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isForbidden
            ? 'Akun Anda tidak memiliki permission untuk membuka halaman ini.'
            : 'Silakan kembali ke dashboard atau coba lagi beberapa saat.'}
        </p>
        <Link
          to={ROUTE_PATHS.dashboard}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <ArrowLeft className="size-4" />
          Kembali ke dashboard
        </Link>
      </section>
    </main>
  )
}
