import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Columns3,
  Search,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { EmptyState } from '@/shared/components/feedback'
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Input,
  Skeleton,
  Select,
} from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageCount?: number
  totalItems?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  toolbar?: ReactNode
  rowId?: (row: TData) => string
  className?: string
}

export function DataTable<TData>({
  columns,
  data,
  pageCount = 1,
  totalItems,
  pagination = { pageIndex: 0, pageSize: 20 },
  onPaginationChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Cari data…',
  isLoading,
  emptyTitle,
  emptyDescription,
  toolbar,
  rowId,
  className,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowId: rowId,
    manualPagination: true,
    pageCount,
    onPaginationChange,
    onColumnVisibilityChange: setColumnVisibility,
    state: { pagination, columnVisibility },
  })
  const isPaginated = Boolean(onPaginationChange)
  const currentPage = pagination.pageIndex + 1
  const resolvedTotalItems = totalItems ?? data.length
  const rangeStart =
    resolvedTotalItems === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const rangeEnd = Math.min(
    currentPage * pagination.pageSize,
    resolvedTotalItems,
  )

  return (
    <div
      className={cn(
        'border-border bg-surface overflow-hidden rounded-[var(--radius-lg)] border shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {onSearchChange ? (
            <Input
              value={search ?? ''}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              startIcon={<Search />}
              aria-label={searchPlaceholder}
              className="sm:max-w-sm"
            />
          ) : null}
          {toolbar}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              startIcon={<Columns3 />}
              className="hover:border-border-form-hover data-[state=open]:border-border-selected data-[state=open]:shadow-[var(--shadow-focus)]"
            >
              Kolom
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tampilkan kolom</DropdownMenuLabel>
            {table
              .getAllLeafColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(Boolean(checked))
                  }
                  onSelect={(event) => event.preventDefault()}
                >
                  {typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="scrollbar-subtle overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <thead className="bg-surface-subtle">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={cn(
                      'border-border text-muted-foreground border-b px-4 py-3 text-xs font-bold tracking-wide uppercase',
                      header.column.id === 'actions' && 'text-center',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }, (_, index) => (
                  <tr key={index}>
                    {columns.map((_, columnIndex) => (
                      <td
                        key={columnIndex}
                        className="border-border border-b px-4 py-[var(--table-cell-padding-y,1rem)]"
                      >
                        <Skeleton className="h-4 w-full max-w-40" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="interactive-surface hover:bg-surface-hover data-[selected=true]:bg-surface-selected"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          'border-border border-b px-4 py-[var(--table-cell-padding-y,0.875rem)] align-middle',
                          cell.column.id === 'actions' ? 'text-center' : 'last:text-right',
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data.length === 0 ? (
        <div className="p-4">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            compact
          />
        </div>
      ) : !isLoading ? (
        <div className="border-border bg-surface-subtle flex flex-col gap-3 border-t px-4 py-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            {isPaginated ? (
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground text-[0.625rem] font-bold tracking-[0.14em] uppercase">
                  Baris
                </span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value))
                    table.setPageIndex(0)
                  }}
                  ariaLabel="Jumlah baris per halaman"
                  options={[10, 20, 50, 100].map((size) => ({
                    value: String(size),
                    label: String(size),
                  }))}
                  className="border-border-strong bg-surface h-9 w-[4.5rem] min-w-[4.5rem] rounded-[var(--radius-sm)] border px-2.5 text-sm font-bold shadow-[var(--shadow-xs)] hover:border-border-form-hover focus-visible:border-border-selected data-[state=open]:border-border-selected"
                />
              </div>
            ) : null}
            <div className="border-border bg-surface flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2 shadow-[var(--shadow-xs)]">
              <div>
                <p className="text-muted-foreground text-[0.625rem] font-bold tracking-[0.14em] uppercase">
                  Menampilkan
                </p>
                <p className="text-foreground mt-0.5 text-sm font-bold">
                  {rangeStart}–{rangeEnd}
                </p>
              </div>
              <span className="bg-border h-7 w-px" />
              <div>
                <p className="text-muted-foreground text-[0.625rem] font-bold tracking-[0.14em] uppercase">
                  Total data
                </p>
                <p className="text-primary mt-0.5 text-sm font-bold">
                  {resolvedTotalItems}
                </p>
              </div>
            </div>
          </div>

          {isPaginated ? (
            <div className="flex w-full items-center gap-3 sm:w-auto">
              <Typography variant="caption" className="hidden whitespace-nowrap sm:block">
                Halaman <strong className="text-foreground">{currentPage}</strong>{' '}
                dari <strong className="text-foreground">{Math.max(pageCount, 1)}</strong>
              </Typography>
              <div className="border-border bg-surface flex w-full items-center justify-between gap-1 rounded-[var(--radius-md)] border p-1 shadow-[var(--shadow-xs)] sm:w-auto sm:justify-start">
                <PaginationButton
                  ariaLabel="Halaman pertama"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.setPageIndex(0)}
                >
                  <ChevronsLeft />
                </PaginationButton>
                <PaginationButton
                  ariaLabel="Halaman sebelumnya"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <ChevronLeft />
                </PaginationButton>
                <span className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-sm font-bold shadow-[var(--shadow-xs)]">
                  {currentPage}
                </span>
                <PaginationButton
                  ariaLabel="Halaman berikutnya"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  <ChevronRight />
                </PaginationButton>
                <PaginationButton
                  ariaLabel="Halaman terakhir"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
                >
                  <ChevronsRight />
                </PaginationButton>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function PaginationButton({
  children,
  ariaLabel,
  disabled,
  onClick,
}: {
  children: ReactNode
  ariaLabel: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="text-primary hover:bg-primary-subtle hover:text-primary active:bg-primary-subtle-hover size-9 rounded-[var(--radius-sm)] disabled:bg-transparent"
    >
      {children}
    </Button>
  )
}
