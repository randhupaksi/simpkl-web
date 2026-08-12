import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from 'lucide-react'
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
              closeButton
              duration={5000}
              icons={{
                success: <CircleCheck className="size-4" strokeWidth={2.25} />,
                error: <CircleAlert className="size-4" strokeWidth={2.25} />,
                warning: <TriangleAlert className="size-4" strokeWidth={2.25} />,
                info: <Info className="size-4" strokeWidth={2.25} />,
              }}
              toastOptions={{
                classNames: {
                  toast:
                    '!rounded-[var(--radius-md)] !border !text-foreground !shadow-[var(--shadow-md)]',
                  success:
                    '!border-success-border !bg-success-subtle [&_[data-icon]]:!text-success',
                  error:
                    '!border-danger-border !bg-danger-subtle [&_[data-icon]]:!text-danger',
                  warning:
                    '!border-warning-border !bg-warning-subtle [&_[data-icon]]:!text-warning',
                  info:
                    '!border-info-border !bg-info-subtle [&_[data-icon]]:!text-info',
                  title: '!font-semibold !text-foreground',
                  description: '!text-muted-foreground',
                  content: '!gap-1',
                  closeButton:
                    '!border-border-strong !bg-surface/70 !text-muted-foreground hover:!bg-surface-hover hover:!text-foreground',
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
