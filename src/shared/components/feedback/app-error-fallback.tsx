import type { FallbackProps } from 'react-error-boundary'
import { RotateCcw, TriangleAlert } from 'lucide-react'

import { Button, Card, CardContent } from '@/shared/components/ui'
import { PageTitle, Typography } from '@/shared/design-system/typography'

export function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <main className="bg-background grid min-h-screen place-items-center p-6">
      <Card className="max-w-lg text-center shadow-[var(--shadow-lg)]">
        <CardContent className="p-10">
          <TriangleAlert className="text-danger mx-auto size-12" />
          <PageTitle className="mt-5">Aplikasi mengalami kendala</PageTitle>
          <Typography variant="muted" className="mt-3">
            {error instanceof Error
              ? error.message
              : 'Terjadi kesalahan yang tidak terduga.'}
          </Typography>
          <Button
            onClick={resetErrorBoundary}
            className="mt-7"
            startIcon={<RotateCcw />}
          >
            Muat ulang aplikasi
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
