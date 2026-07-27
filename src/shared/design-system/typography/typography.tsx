import { cva, type VariantProps } from 'class-variance-authority'
import { createElement, type HTMLAttributes, type ElementType } from 'react'

import { cn } from '@/shared/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      pageTitle:
        'text-2xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-[1.75rem]',
      heading:
        'text-xl font-semibold leading-tight tracking-[-0.015em] text-foreground',
      sectionTitle: 'text-base font-semibold leading-6 text-foreground',
      body: 'text-sm leading-6 text-foreground',
      muted: 'text-sm leading-6 text-muted-foreground',
      caption: 'text-xs leading-5 text-muted-foreground',
      label: 'text-sm font-medium leading-5 text-foreground',
      overline: 'text-xs font-bold tracking-[0.12em] text-primary uppercase',
    },
  },
  defaultVariants: { variant: 'body' },
})

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: ElementType
}

export function Typography({
  as = 'p',
  variant,
  className,
  ...props
}: TypographyProps) {
  return createElement(as, {
    className: cn(typographyVariants({ variant }), className),
    ...props,
  })
}

export function PageTitle(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography as="h1" variant="pageTitle" {...props} />
}

export function SectionTitle(props: Omit<TypographyProps, 'variant'>) {
  return <Typography as="h2" variant="sectionTitle" {...props} />
}
