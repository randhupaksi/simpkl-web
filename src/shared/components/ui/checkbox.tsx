import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'interactive-surface pressed-feedback border-border-strong bg-surface text-primary-foreground hover:border-border-hover focus-visible:border-border-selected data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary-hover disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-disabled-foreground grid size-5 shrink-0 place-items-center rounded-[var(--radius-xs)] border shadow-[var(--shadow-xs)] outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="size-3.5 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))

Checkbox.displayName = 'Checkbox'
