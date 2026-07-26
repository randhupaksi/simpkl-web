export function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center" role="status">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
        Memuat halaman...
      </div>
    </div>
  )
}
