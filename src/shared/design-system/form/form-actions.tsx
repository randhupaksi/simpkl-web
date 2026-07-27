import type { ReactNode } from 'react'

type FormActionsProps = {
  children: ReactNode
}

export function FormActions({ children }: FormActionsProps) {
  return (
    <div className="border-border bg-surface/95 sticky bottom-4 z-[var(--z-raised)] flex flex-wrap justify-end gap-2 rounded-[var(--radius-lg)] border p-3 shadow-[var(--shadow-md)] backdrop-blur">
      {children}
    </div>
  )
}
