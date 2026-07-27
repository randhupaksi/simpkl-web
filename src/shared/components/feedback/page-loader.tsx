export function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status">
      <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
        <span className="border-border-strong border-t-primary size-5 animate-spin rounded-[var(--radius-full)] border-2" />
        Memuat halaman...
      </div>
    </div>
  )
}
