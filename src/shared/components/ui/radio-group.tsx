import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('grid gap-3', className)}
    {...props}
  />
))

RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'interactive-surface pressed-feedback border-border-strong bg-surface hover:border-border-hover focus-visible:border-border-selected data-[state=checked]:border-primary disabled:border-border-disabled disabled:bg-surface-disabled grid size-5 place-items-center rounded-[var(--radius-full)] border outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator>
      <Circle className="fill-primary text-primary size-2.5" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))

RadioGroupItem.displayName = 'RadioGroupItem'
