import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { forwardRef } from 'react'
import type * as React from 'react'

import { cn } from '@/shared/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'bg-surface-overlay fixed inset-0 z-[var(--z-overlay)] data-[state=open]:animate-[fade-in_var(--duration-normal)_var(--ease-enter)]',
      className,
    )}
    {...props}
  />
))

DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      tabIndex={-1}
      onOpenAutoFocus={(event) => {
        event.preventDefault()
        const content = event.currentTarget as HTMLElement
        content.focus({ preventScroll: true })
      }}
      className={cn(
        'border-border bg-surface enter-animation fixed top-1/2 left-1/2 z-[var(--z-dialog)] grid max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 overflow-y-auto rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-lg)] outline-none',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="interactive-surface pressed-feedback text-muted-foreground hover:bg-surface-hover hover:text-foreground active:bg-surface-pressed absolute top-4 right-4 grid size-9 place-items-center rounded-[var(--radius-sm)] focus-visible:shadow-[var(--shadow-focus)]">
        <X className="size-4" />
        <span className="sr-only">Tutup dialog</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))

DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-1.5 pr-8', className)} {...props} />
)

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold tracking-tight', className)}
    {...props}
  />
))

DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm leading-6', className)}
    {...props}
  />
))

DialogDescription.displayName = 'DialogDescription'

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
      className,
    )}
    {...props}
  />
)
