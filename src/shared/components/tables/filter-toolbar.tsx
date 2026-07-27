import type { ReactNode } from 'react'

type FilterToolbarProps = {
  children: ReactNode
}

export function FilterToolbar({ children }: FilterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filter data">
      {children}
    </div>
  )
}
