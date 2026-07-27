import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = 'Pilih opsi',
  ariaLabel,
  disabled,
  invalid,
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          'interactive-surface border-border-strong bg-surface text-foreground hover:border-border-hover focus:border-border-selected data-[placeholder]:text-muted-foreground disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-disabled-foreground flex h-[var(--control-md)] w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border px-3.5 text-sm shadow-[var(--shadow-xs)] outline-none focus:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed',
          invalid && 'border-danger hover:border-danger focus:border-danger',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="text-muted-foreground size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="border-border bg-surface enter-animation z-[var(--z-dropdown)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[var(--radius-md)] border p-1.5 shadow-[var(--shadow-md)]"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="interactive-surface data-[highlighted]:bg-surface-hover data-[state=checked]:bg-surface-selected data-[state=checked]:text-primary-pressed data-[disabled]:text-disabled-foreground relative flex cursor-pointer items-center rounded-[var(--radius-sm)] py-2.5 pr-9 pl-3 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[state=checked]:font-semibold"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3">
                  <Check className="size-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
