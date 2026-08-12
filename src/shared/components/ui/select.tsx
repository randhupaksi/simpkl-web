import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
  const viewportRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [scrollbar, setScrollbar] = useState({
    visible: false,
    height: 0,
    top: 0,
  })
  const normalizedValue = value || undefined
  const normalizedDefaultValue = defaultValue || undefined

  useEffect(() => {
    if (!open) return

    const viewport = viewportRef.current
    if (!viewport) return

    const updateScrollbar = () => {
      const hasOverflow = viewport.scrollHeight > viewport.clientHeight + 1
      if (!hasOverflow || viewport.clientHeight === 0) {
        setScrollbar({ visible: false, height: 0, top: 0 })
        return
      }

      const height = Math.max(
        32,
        (viewport.clientHeight / viewport.scrollHeight) * viewport.clientHeight,
      )
      const maxTop = viewport.clientHeight - height
      const maxScrollTop = viewport.scrollHeight - viewport.clientHeight

      setScrollbar({
        visible: true,
        height,
        top: maxScrollTop > 0
          ? (viewport.scrollTop / maxScrollTop) * maxTop
          : 0,
      })
    }

    const frame = requestAnimationFrame(updateScrollbar)
    viewport.addEventListener('scroll', updateScrollbar, { passive: true })
    const observer = new ResizeObserver(updateScrollbar)
    observer.observe(viewport)

    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', updateScrollbar)
      observer.disconnect()
    }
  }, [open, options.length])

  return (
    <SelectPrimitive.Root
      value={normalizedValue}
      defaultValue={normalizedDefaultValue}
      onValueChange={onValueChange}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={cn(
          'interactive-surface border-border-strong bg-surface text-foreground hover:border-border-form-hover focus-visible:border-border-selected data-[state=open]:border-border-selected data-[placeholder]:text-muted-foreground disabled:border-border-disabled disabled:bg-surface-disabled disabled:text-disabled-foreground flex h-[var(--control-md)] w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border px-3.5 text-sm shadow-[var(--shadow-xs)] outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:cursor-not-allowed data-[state=open]:shadow-[var(--shadow-focus)]',
          invalid &&
            'border-danger hover:border-danger focus-visible:border-danger data-[state=open]:border-danger data-[state=open]:shadow-[0_0_0_3px_color-mix(in_srgb,var(--danger)_18%,transparent)]',
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder || 'Pilih opsi'} />
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
          <div className="relative">
            <SelectPrimitive.Viewport
              ref={viewportRef}
              className="dropdown-scroll-area max-h-[min(18rem,var(--radix-select-content-available-height))] overflow-y-auto pr-2"
            >
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="interactive-surface data-[highlighted]:border-primary-subtle-hover data-[highlighted]:bg-primary-subtle data-[state=checked]:border-primary-subtle-hover data-[state=checked]:bg-primary-subtle data-[state=checked]:text-primary data-[disabled]:text-disabled-foreground relative flex cursor-pointer items-center rounded-[var(--radius-sm)] border border-transparent py-2.5 pr-9 pl-3 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[state=checked]:font-semibold"
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
            {scrollbar.visible ? (
              <div
                aria-hidden="true"
                className="bg-border-strong pointer-events-none absolute top-0 right-0 bottom-0 w-1.5 rounded-full"
              >
                <span
                  className="bg-primary pointer-events-none absolute right-0 left-0 rounded-full"
                  style={{ height: scrollbar.height, transform: `translateY(${scrollbar.top}px)` }}
                />
              </div>
            ) : null}
          </div>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
