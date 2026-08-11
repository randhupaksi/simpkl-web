import { DayPicker } from 'react-day-picker'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/shared/lib/utils'

export type DatePickerProps = {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
  'aria-describedby'?: string
  'aria-label'?: string
}

const calendarClassNames = {
  root: 'w-full',
  months: 'flex w-full flex-col',
  month: 'space-y-4',
  month_caption: 'flex items-center justify-between px-1',
  caption_label: 'text-sm font-semibold capitalize text-foreground',
  nav: 'flex items-center gap-1',
  button_previous:
    'inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-primary-subtle-hover hover:text-primary disabled:opacity-50',
  button_next:
    'inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-primary-subtle-hover hover:text-primary disabled:opacity-50',
  chevron: 'size-4',
  month_grid: 'w-full border-collapse',
  weekdays: 'grid grid-cols-7',
  weekday: 'py-2 text-center text-xs font-medium text-muted-foreground',
  weeks: 'grid gap-1',
  week: 'grid grid-cols-7',
  day: 'grid place-items-center',
  day_button:
    'inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-sm text-foreground outline-none transition-colors hover:bg-primary-subtle-hover hover:text-primary focus-visible:ring-2 focus-visible:ring-[var(--border-selected)]',
  selected:
    'rounded-[var(--radius-sm)] bg-primary-subtle-hover text-primary hover:bg-primary-subtle-hover hover:text-primary',
  today: 'font-bold text-primary',
  outside: 'text-muted-foreground/40',
  disabled: 'pointer-events-none text-disabled-foreground opacity-50',
  hidden: 'invisible',
}

function parseDateValue(value?: string) {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function formatDateValue(date?: Date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateLabel(date?: Date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = 'Pilih tanggal',
  disabled,
  invalid,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const selected = parseDateValue(value)
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(selected ?? new Date())

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && selected) setMonth(selected)
        setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            'w-full justify-between text-left font-normal hover:border-border-form-hover focus-visible:border-border-selected data-[state=open]:border-border-selected data-[state=open]:shadow-[var(--shadow-focus)]',
            !selected && 'text-muted-foreground',
            invalid && 'border-danger focus-visible:ring-danger',
            className,
          )}
          startIcon={<CalendarDays className="text-primary" />}
        >
          <span className="min-w-0 flex-1 truncate">
            {formatDateLabel(selected) || placeholder}
          </span>
          <ChevronDown className="text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[19rem] p-3">
        <DayPicker
          mode="single"
          selected={selected}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            onChange?.(formatDateValue(date))
            setOpen(false)
          }}
          showOutsideDays
          classNames={calendarClassNames}
        />
      </PopoverContent>
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
    </Popover>
  )
}

type DateRangePickerProps = {
  startProps: DatePickerProps
  endProps: DatePickerProps
}

export function DateRangePicker({
  startProps,
  endProps,
}: DateRangePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <DatePicker aria-label="Tanggal mulai" {...startProps} />
      <DatePicker aria-label="Tanggal selesai" {...endProps} />
    </div>
  )
}
