import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'bg-surface-inverse text-inverse-foreground enter-animation z-[var(--z-dropdown)] max-w-xs rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs shadow-[var(--shadow-md)]',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))

TooltipContent.displayName = 'TooltipContent'
