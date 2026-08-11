import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/shared/lib/utils'

export const buttonVariants = cva(
  'interactive-surface pressed-feedback inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-[color:color-mix(in_srgb,var(--focus-ring)_24%,transparent)] disabled:pointer-events-none disabled:border-border-disabled disabled:bg-interactive-disabled disabled:text-interactive-disabled-foreground [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border border-primary bg-primary text-primary-foreground shadow-[var(--shadow-xs)] hover:border-primary-hover hover:bg-primary-hover active:border-primary-pressed active:bg-primary-pressed',
        secondary:
          'border border-secondary bg-secondary text-secondary-foreground shadow-[var(--shadow-xs)] hover:border-secondary-hover hover:bg-secondary-hover active:border-secondary-pressed active:bg-secondary-pressed',
        outline:
          'border border-border-strong bg-surface text-foreground shadow-[var(--shadow-xs)] hover:border-border-hover hover:bg-surface-hover active:bg-surface-pressed',
        ghost:
          'border border-transparent text-foreground hover:bg-surface-hover active:bg-surface-pressed',
        danger:
          'border border-danger bg-danger text-inverse-foreground hover:border-danger-hover hover:bg-danger-hover active:border-danger-hover active:bg-danger-hover',
        link: 'h-auto border-0 bg-transparent p-0 text-link underline-offset-4 hover:text-link-hover hover:underline active:text-link-hover disabled:bg-transparent',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-[var(--control-md)] px-4',
        lg: 'h-12 px-5 text-[0.9375rem]',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  startIcon?: ReactNode
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      isLoading,
      loadingText,
      startIcon,
      asChild = false,
      type = 'button',
      variant,
      size,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-disabled={disabled || isLoading ? true : undefined}
          aria-busy={isLoading || undefined}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          startIcon
        )}
        {isLoading && loadingText ? loadingText : children}
      </button>
    )
  },
)

Button.displayName = 'Button'
