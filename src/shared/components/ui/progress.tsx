import { cn } from '@/shared/lib/utils'

type ProgressProps = {
  value: number
  label?: string
  className?: string
}

export function Progress({ value, label, className }: ProgressProps) {
  const normalized = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <div className="flex justify-between gap-4 text-xs font-medium">
          <span className="text-muted-foreground">{label}</span>
          <span>{normalized}%</span>
        </div>
      ) : null}
      <div
        className="bg-surface-muted h-2.5 overflow-hidden rounded-[var(--radius-full)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalized}
        aria-label={label}
      >
        <div
          className="bg-primary h-full rounded-[var(--radius-full)] transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-enter)]"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  )
}
