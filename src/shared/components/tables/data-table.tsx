import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type VisibilityState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, Columns3, Search } from 'lucide-react'
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
} from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  pageCount?: number
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
                    className="border-border text-muted-foreground border-b px-4 py-3 text-xs font-bold tracking-wide uppercase"
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
                        className="border-border border-b px-4 py-[var(--table-cell-padding-y,0.875rem)] align-middle last:text-right"
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
      ) : (
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Typography variant="caption">
            Halaman {pagination.pageIndex + 1} dari {Math.max(pageCount, 1)}
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              aria-label="Halaman berikutnya"
            >
              Berikutnya
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
