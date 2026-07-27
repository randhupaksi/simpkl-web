import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/shared/components/ui'
import { PageTitle, Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  backTo?: string
  backLabel?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  backTo,
  backLabel = 'Kembali',
}: PageHeaderProps) {
  return (
    <header className="border-border flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backTo ? (
          <Link
            to={backTo}
            className="text-primary hover:text-primary-hover mb-3 inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        ) : null}
        {eyebrow ? (
          <Typography variant="overline" className="mb-1.5">
            {eyebrow}
          </Typography>
        ) : null}
        <PageTitle>{title}</PageTitle>
        {description ? (
          <Typography variant="muted" className="mt-2 max-w-3xl">
            {description}
          </Typography>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export function PageActionLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(buttonVariants({ variant: 'primary' }), className)}
    >
      {children}
    </Link>
  )
}
