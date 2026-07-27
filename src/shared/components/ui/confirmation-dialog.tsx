import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from './button'

type ConfirmationDialogProps = {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  destructive,
  isLoading,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <AlertDialogPrimitive.Root>
      <AlertDialogPrimitive.Trigger asChild>
        {trigger}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="bg-surface-overlay fixed inset-0 z-[var(--z-overlay)]" />
        <AlertDialogPrimitive.Content className="border-border bg-surface enter-animation fixed top-1/2 left-1/2 z-[var(--z-dialog)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-lg)]">
          <span className="bg-warning-subtle text-warning mb-4 grid size-11 place-items-center rounded-[var(--radius-md)]">
            <TriangleAlert className="size-5" />
          </span>
          <AlertDialogPrimitive.Title className="text-lg font-semibold">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="text-muted-foreground mt-2 text-sm leading-6">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline">{cancelLabel}</Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                variant={destructive ? 'danger' : 'primary'}
                isLoading={isLoading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
