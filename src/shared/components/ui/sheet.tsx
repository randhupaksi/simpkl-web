import type { ComponentPropsWithoutRef } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { cn } from '@/shared/lib/utils'

type SheetContentProps = ComponentPropsWithoutRef<typeof DialogContent> & {
  side?: 'left' | 'right' | 'bottom'
}

export function SheetContent({
  side = 'right',
  className,
  ...props
}: SheetContentProps) {
  return (
    <DialogContent
      className={cn(
        'max-h-none rounded-none',
        side === 'right' &&
          'top-0 right-0 bottom-0 left-auto h-full w-[min(26rem,90vw)] max-w-none translate-x-0 translate-y-0 rounded-l-[var(--radius-xl)]',
        side === 'left' &&
          'top-0 bottom-0 left-0 h-full w-[min(26rem,90vw)] max-w-none translate-x-0 translate-y-0 rounded-r-[var(--radius-xl)]',
        side === 'bottom' &&
          'top-auto right-0 bottom-0 left-0 max-h-[85vh] w-full max-w-none translate-x-0 translate-y-0 rounded-t-[var(--radius-xl)]',
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog as Sheet,
  DialogClose as SheetClose,
  DialogDescription as SheetDescription,
  DialogFooter as SheetFooter,
  DialogHeader as SheetHeader,
  DialogTitle as SheetTitle,
  DialogTrigger as SheetTrigger,
}
