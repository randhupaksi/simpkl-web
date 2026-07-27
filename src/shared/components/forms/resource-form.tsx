import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { ZodType } from 'zod'

import { ResourceSelectField } from './resource-select-field'
import type { ResourceField, ResourceValues } from './resource-form.types'
import { Input, Select, Switch, Textarea } from '@/shared/components/ui'
import { FormField } from '@/shared/design-system/form'

type ResourceFormProps = {
  id: string
  fields: ResourceField[]
  schema: ZodType<ResourceValues, ResourceValues>
  defaultValues?: ResourceValues
  isCreate?: boolean
  apiErrors?: Record<string, string[]>
  onSubmit: (values: ResourceValues) => void
}

export function ResourceForm({
  id,
  fields,
  schema,
  defaultValues,
  isCreate,
  apiErrors,
  onSubmit,
}: ResourceFormProps) {
  const form = useForm<ResourceValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    Object.entries(apiErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field, { message: messages[0] })
    })
  }, [apiErrors, form])

  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || form.formState.isSubmitSuccessful) return
      event.preventDefault()
    }
    window.addEventListener('beforeunload', guard)
    return () => window.removeEventListener('beforeunload', guard)
  }, [form.formState.isDirty, form.formState.isSubmitSuccessful])

  return (
    <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-5 sm:grid-cols-2"
      noValidate
    >
      {fields
        .filter((field) => isCreate || !field.createOnly)
        .map((field) => {
          const fieldId = `${id}-${field.key}`
          const error = form.formState.errors[field.key]?.message
          const describedBy = error
            ? `${fieldId}-error`
            : field.hint
              ? `${fieldId}-hint`
              : undefined

          return (
            <div
              key={field.key}
              className={
                field.className ??
                (field.type === 'textarea' || field.type === 'switch'
                  ? 'sm:col-span-2'
                  : undefined)
              }
            >
              <Controller
                control={form.control}
                name={field.key}
                render={({ field: controlled }) => (
                  <FormField
                    id={fieldId}
                    label={field.label}
                    error={typeof error === 'string' ? error : undefined}
                    hint={field.hint}
                    required={field.required}
                  >
                    {renderControl(
                      field,
                      fieldId,
                      controlled.value,
                      controlled.onChange,
                      describedBy,
                      Boolean(error),
                    )}
                  </FormField>
                )}
              />
            </div>
          )
        })}
    </form>
  )
}

function renderControl(
  field: ResourceField,
  id: string,
  value: ResourceValues[string],
  onChange: (value: ResourceValueForControl) => void,
  describedBy: string | undefined,
  invalid: boolean,
) {
  if (field.optionsEndpoint) {
    return (
      <ResourceSelectField
        endpoint={field.optionsEndpoint}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        labelKey={field.optionLabelKey}
        valueKey={field.optionValueKey}
        placeholder={field.placeholder}
        invalid={invalid}
      />
    )
  }

  if (field.type === 'select') {
    return (
      <Select
        value={typeof value === 'string' ? value : ''}
        onValueChange={onChange}
        options={field.options ?? []}
        placeholder={field.placeholder}
        invalid={invalid}
      />
    )
  }

  if (field.type === 'switch') {
    return (
      <div className="border-border bg-surface-subtle flex min-h-11 items-center justify-between rounded-[var(--radius-md)] border px-3.5">
        <span className="text-muted-foreground text-sm">
          {value ? 'Aktif' : 'Tidak aktif'}
        </span>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        id={id}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
      />
    )
  }

  return (
    <Input
      id={id}
      type={field.type ?? 'text'}
      value={
        typeof value === 'string' || typeof value === 'number' ? value : ''
      }
      onChange={(event) =>
        onChange(
          field.type === 'number'
            ? event.target.valueAsNumber
            : event.target.value,
        )
      }
      placeholder={field.placeholder}
      aria-describedby={describedBy}
      invalid={invalid}
    />
  )
}

type ResourceValueForControl = string | number | boolean
