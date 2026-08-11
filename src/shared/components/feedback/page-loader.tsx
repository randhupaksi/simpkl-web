import { Skeleton } from '@/shared/components/ui/skeleton'

export function PageLoader() {
  return (
    <div className="enter-animation space-y-6" role="status" aria-label="Memuat halaman">
      <header className="border-border flex flex-col gap-4 border-b pb-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </header>
      <div className="border-border bg-surface overflow-hidden rounded-[var(--radius-lg)] border shadow-[var(--shadow-sm)]">
        <div className="border-border flex items-center justify-between border-b p-5 sm:p-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <Skeleton className="hidden h-10 w-28 sm:block" />
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-[var(--radius-md)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
