import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from 'lucide-react'

import { Badge, Card } from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

type StatCardProps = {
  label: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    direction: 'up' | 'down' | 'flat'
    positive?: boolean
  }
  tone?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'
  interactive?: boolean
  onClick?: () => void
}

const toneStyles = {
  primary: 'bg-primary-subtle text-primary',
  info: 'bg-info-subtle text-info',
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger',
  neutral: 'bg-surface-muted text-subtle-foreground',
} as const

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  tone = 'primary',
  interactive,
  onClick,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? ArrowUpRight
      : trend?.direction === 'down'
        ? ArrowDownRight
        : Minus

  return (
    <Card
      variant={interactive ? 'interactive' : 'default'}
      className="p-5"
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (interactive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            'grid size-10 place-items-center rounded-[var(--radius-md)]',
            toneStyles[tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {trend ? (
          <Badge
            tone={
              trend.direction === 'flat'
                ? 'neutral'
                : trend.positive
                  ? 'success'
                  : 'danger'
            }
          >
            <TrendIcon className="size-3.5" />
            {trend.value}
          </Badge>
        ) : null}
      </div>
      <Typography variant="muted" className="mt-5 font-medium">
        {label}
      </Typography>
      <p className="mt-1 text-3xl font-bold tracking-[-0.035em]">{value}</p>
      {description ? (
        <Typography variant="caption" className="mt-2">
          {description}
        </Typography>
      ) : null}
    </Card>
  )
}
