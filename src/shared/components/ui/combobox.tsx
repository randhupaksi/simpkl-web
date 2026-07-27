import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from './button'
import { Input } from './input'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import type { SelectOption } from './select'
import { cn } from '@/shared/lib/utils'

type ComboboxProps = {
  options: SelectOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyLabel?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Pilih data',
  searchPlaceholder = 'Cari…',
  emptyLabel = 'Data tidak ditemukan.',
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selected = options.find((option) => option.value === value)
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label
          .toLocaleLowerCase('id')
          .includes(search.toLocaleLowerCase('id')),
      ),
    [options, search],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span
            className={cn('truncate', !selected && 'text-muted-foreground')}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-2"
      >
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          startIcon={<Search />}
          placeholder={searchPlaceholder}
          className="mb-2"
          autoFocus
        />
        <div
          className="scrollbar-subtle max-h-64 space-y-1 overflow-y-auto"
          role="listbox"
        >
          {filteredOptions.length === 0 ? (
            <p className="text-muted-foreground p-3 text-center text-sm">
              {emptyLabel}
            </p>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                className="interactive-surface hover:bg-surface-hover active:bg-surface-pressed aria-selected:bg-surface-selected aria-selected:text-primary-pressed disabled:text-disabled-foreground flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm aria-selected:font-semibold"
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'size-4',
                    option.value !== value && 'invisible',
                  )}
                />
                {option.label}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

type MultiSelectProps = Omit<ComboboxProps, 'value' | 'onValueChange'> & {
  value: string[]
  onValueChange: (value: string[]) => void
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Pilih satu atau beberapa',
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          disabled={disabled}
          aria-expanded={open}
        >
          <span
            className={cn(
              'truncate',
              selectedLabels.length === 0 && 'text-muted-foreground',
            )}
          >
            {selectedLabels.length > 0
              ? selectedLabels.join(', ')
              : placeholder}
          </span>
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-2"
      >
        <div className="scrollbar-subtle max-h-72 space-y-1 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                disabled={option.disabled}
                className="interactive-surface hover:bg-surface-hover active:bg-surface-pressed aria-pressed:bg-surface-selected aria-pressed:text-primary-pressed disabled:text-disabled-foreground flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm aria-pressed:font-semibold"
                onClick={() =>
                  onValueChange(
                    isSelected
                      ? value.filter((item) => item !== option.value)
                      : [...value, option.value],
                  )
                }
              >
                <span
                  className={cn(
                    'grid size-4 place-items-center rounded-[var(--radius-xs)] border',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border-strong',
                  )}
                >
                  {isSelected ? <Check className="size-3" /> : null}
                </span>
                {option.label}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
