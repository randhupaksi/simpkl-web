import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'border-border bg-surface-muted scrollbar-subtle flex min-h-12 w-full min-w-0 items-center gap-1 overflow-x-auto rounded-[var(--radius-md)] border p-1.5',
      className,
    )}
    {...props}
  />
))

TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'interactive-surface pressed-feedback text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-pressed disabled:text-disabled-foreground flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-transparent px-4 text-sm font-semibold outline-none transition-colors focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[var(--shadow-sm)]',
      className,
    )}
    {...props}
  />
))

TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-5 outline-none focus-visible:rounded-[var(--radius-md)] focus-visible:shadow-[var(--shadow-focus)]',
      className,
    )}
    {...props}
  />
))

TabsContent.displayName = 'TabsContent'
