import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

const cardVariants = cva(
  'rounded-[var(--radius-lg)] border bg-surface shadow-[var(--shadow-sm)]',
  {
    variants: {
      variant: {
        default: 'border-border',
        raised: 'border-border-subtle shadow-[var(--shadow-md)]',
        subtle: 'border-border bg-surface-subtle shadow-none',
        interactive:
          'interactive-surface pressed-feedback cursor-pointer border-border hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[var(--shadow-md)] active:translate-y-0 active:border-border-selected active:bg-surface-pressed',
        selected:
          'border-border-selected bg-surface-selected shadow-[var(--shadow-xs)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-border-subtle border-b px-5 py-4 sm:px-6',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 sm:p-6', className)} {...props} />
}
