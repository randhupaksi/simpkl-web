import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/utils'

type DescriptionItem = {
  label: string
  value: ReactNode
}

type DescriptionListProps = {
  items: DescriptionItem[]
  columns?: 1 | 2 | 3
  className?: string
}

export function DescriptionList({
  items,
  columns = 2,
  className,
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        'grid gap-x-8 gap-y-5',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {item.label}
          </dt>
          <dd className="text-foreground mt-1.5 text-sm font-medium">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
