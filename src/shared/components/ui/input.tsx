import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: ReactNode
  endAdornment?: ReactNode
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, startIcon, endAdornment, invalid, ...props }, ref) => (
    <span className="relative block">
      {startIcon ? (
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 [&_svg]:size-4">
          {startIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'interactive-surface border-border-strong bg-surface text-foreground placeholder:text-muted-foreground hover:border-border-hover focus:border-border-selected disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-disabled-foreground h-[var(--control-md)] w-full rounded-[var(--radius-md)] border px-3.5 text-sm shadow-[var(--shadow-xs)] outline-none focus:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
          startIcon && 'pl-10',
          endAdornment && 'pr-11',
          invalid &&
            'border-danger hover:border-danger focus:border-danger focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_18%,transparent)]',
          className,
        )}
        {...props}
      />
      {endAdornment ? (
        <span className="absolute top-1/2 right-1.5 -translate-y-1/2">
          {endAdornment}
        </span>
      ) : null}
    </span>
  ),
)

Input.displayName = 'Input'
