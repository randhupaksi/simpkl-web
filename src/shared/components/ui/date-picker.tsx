import { CalendarDays } from 'lucide-react'

import { Input, type InputProps } from './input'

export function DatePicker(props: Omit<InputProps, 'type' | 'startIcon'>) {
  return <Input type="date" startIcon={<CalendarDays />} {...props} />
}

type DateRangePickerProps = {
  startProps: Omit<InputProps, 'type' | 'startIcon'>
  endProps: Omit<InputProps, 'type' | 'startIcon'>
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
