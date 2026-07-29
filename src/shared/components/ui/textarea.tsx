import { forwardRef, type TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/utils'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'interactive-surface border-border-strong bg-surface text-foreground placeholder:text-muted-foreground hover:border-border-form-hover focus:border-border-selected disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-disabled-foreground min-h-28 w-full resize-none rounded-[var(--radius-md)] border px-3.5 py-3 text-sm shadow-[var(--shadow-xs)] outline-none focus:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  />
))

Textarea.displayName = 'Textarea'
