import { ArrowLeft, ShieldAlert, TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

import { ROUTE_PATHS } from '@/app/router'
import { buttonVariants, Card, CardContent } from '@/shared/components/ui'
import { PageTitle, Typography } from '@/shared/design-system/typography'

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
  const title = isForbidden
    ? 'Akses tidak diizinkan'
    : status === 404
      ? 'Halaman tidak ditemukan'
      : 'Terjadi kesalahan'
  const description = isForbidden
    ? 'Akun Anda tidak memiliki permission yang diperlukan untuk membuka halaman ini.'
    : status === 404
      ? 'Alamat yang Anda buka tidak tersedia atau telah dipindahkan.'
      : 'Aplikasi mengalami kendala yang tidak terduga. Silakan coba kembali.'

  return (
    <main className="bg-background grid min-h-screen place-items-center p-6">
      <Card variant="raised" className="w-full max-w-lg text-center">
        <CardContent className="p-8 sm:p-12">
          <span className="bg-secondary text-secondary-foreground mx-auto mb-6 grid size-16 place-items-center rounded-[var(--radius-xl)]">
            {isForbidden ? (
              <ShieldAlert className="size-8" />
            ) : (
              <TriangleAlert className="size-8" />
            )}
          </span>
          <Typography variant="overline">Error {status}</Typography>
          <PageTitle className="mt-3">{title}</PageTitle>
          <Typography variant="muted" className="mt-3">
            {description}
          </Typography>
          <Link
            to={ROUTE_PATHS.dashboard}
            className={`${buttonVariants({ variant: 'primary' })} mt-8`}
          >
            <ArrowLeft className="size-4" />
            Kembali ke dashboard
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
