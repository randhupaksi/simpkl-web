import type { ButtonProps } from './button'
import { Button } from './button'
import { cn } from '@/shared/lib/utils'

type IconButtonProps = Omit<ButtonProps, 'size'> & {
  'aria-label': string
  size?: 'sm' | 'md'
  tone?: 'neutral' | 'view' | 'edit' | 'delete'
}

const toneClasses = {
  neutral: 'border-border-strong text-muted-foreground hover:border-border-hover hover:bg-surface-hover active:bg-surface-pressed',
  view: 'border-info-border bg-info-subtle text-info hover:border-info hover:bg-info-subtle hover:text-info-hover active:border-info active:bg-info-border focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--info)_24%,transparent)]',
  edit: 'border-warning-border bg-warning-subtle text-warning hover:border-warning hover:bg-warning-subtle hover:text-warning-hover active:border-warning active:bg-warning-border focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--warning)_24%,transparent)]',
  delete: 'border-danger-border bg-danger-subtle text-danger hover:border-danger hover:bg-danger-subtle hover:text-danger-hover active:border-danger active:bg-danger-border focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_24%,transparent)]',
} as const

export function IconButton({
  size = 'md',
  tone,
  variant,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      size="icon"
      variant={tone ? 'ghost' : variant}
      className={cn(
        tone && 'border',
        tone && toneClasses[tone],
        size === 'sm' && 'size-9',
        className,
      )}
      {...props}
    />
  )
}
