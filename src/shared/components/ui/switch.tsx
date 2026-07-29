import * as SwitchPrimitive from '@radix-ui/react-switch'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'interactive-surface pressed-feedback border-border-strong bg-surface-muted hover:border-border-form-hover data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary-hover disabled:border-border-disabled disabled:bg-surface-disabled relative h-6 w-11 rounded-[var(--radius-full)] border outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="bg-surface block size-5 translate-x-0 rounded-[var(--radius-full)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)] data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
))

Switch.displayName = 'Switch'
