import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { queryClient } from './query-client'
import { AppErrorFallback } from '@/shared/components/feedback/app-error-fallback'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => window.location.assign('/')}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors closeButton />
        {import.meta.env.DEV ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
