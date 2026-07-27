import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'

import { queryClient } from './query-client'
import { ThemeProvider } from './theme-provider'
import { AppErrorFallback } from '@/shared/components/feedback/app-error-fallback'
import { TooltipProvider } from '@/shared/components/ui'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => window.location.assign('/')}
    >
      <ThemeProvider>
        <TooltipProvider delayDuration={400}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    '!rounded-[var(--radius-md)] !border-border !bg-surface !text-foreground !shadow-[var(--shadow-md)]',
                },
              }}
            />
            {import.meta.env.DEV ? (
              <ReactQueryDevtools initialIsOpen={false} />
            ) : null}
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
