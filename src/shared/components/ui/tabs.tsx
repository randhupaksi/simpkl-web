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
      'border-border bg-surface-muted inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-md)] border p-1',
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
      'interactive-surface pressed-feedback text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-pressed data-[state=active]:bg-surface data-[state=active]:text-foreground disabled:text-disabled-foreground min-h-9 rounded-[var(--radius-sm)] px-3 text-sm font-medium outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none data-[state=active]:shadow-[var(--shadow-xs)]',
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
