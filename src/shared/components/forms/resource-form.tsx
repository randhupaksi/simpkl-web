import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import type { ZodType } from 'zod'

import { ResourceSelectField } from './resource-select-field'
import type { ResourceField, ResourceValues } from './resource-form.types'
import { DatePicker, Input, Select, Switch, Textarea } from '@/shared/components/ui'
import { FormField } from '@/shared/design-system/form'

type ResourceFormProps = {
  id: string
  fields: ResourceField[]
  schema: ZodType<ResourceValues, ResourceValues>
  defaultValues?: ResourceValues
  isCreate?: boolean
  apiErrors?: Record<string, string[]>
  onInvalid?: () => void
  onSubmit: (values: ResourceValues) => void
}

export function ResourceForm({
  id,
  fields,
  schema,
  defaultValues,
  isCreate,
  apiErrors,
  onInvalid,
  onSubmit,
}: ResourceFormProps) {
  const form = useForm<ResourceValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const formMessage = apiErrors?.form?.[0] ?? apiErrors?.request?.[0]
  const values = useWatch({ control: form.control })
  const previousCompanyId = useRef<string | undefined>(undefined)
  const visibleFields = fields.filter(
    (field) => !field.hidden && (isCreate || !field.createOnly),
  )
  const fieldSections = visibleFields.reduce<Array<{ section?: ResourceField['section']; fields: ResourceField[] }>>(
    (sections, field) => {
      const previousSection = sections.at(-1)
      const isSameSection =
        previousSection?.section?.title === field.section?.title &&
        previousSection?.section?.description === field.section?.description

      if (previousSection && isSameSection) {
        previousSection.fields.push(field)
      } else {
        sections.push({ section: field.section, fields: [field] })
      }
      return sections
    },
    [],
  )

  useEffect(() => {
    const companyId = typeof values.company_id === 'string' ? values.company_id : ''
    if (previousCompanyId.current !== undefined && previousCompanyId.current !== companyId) {
      form.setValue('company_contact_id', '')
    }
    previousCompanyId.current = companyId
  }, [form, values.company_id])

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
      onSubmit={form.handleSubmit(onSubmit, () => {
        onInvalid?.()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })}
      onKeyDown={(event) => {
        if (
          event.key !== 'Enter' ||
          event.defaultPrevented ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLButtonElement
        ) {
          return
        }

        event.preventDefault()
        event.currentTarget.requestSubmit()
      }}
      className="space-y-8"
      noValidate
    >
      {formMessage ? (
        <p
          className="text-danger sm:col-span-2 text-sm leading-5"
          role="alert"
        >
          {formMessage}
        </p>
      ) : null}
      {fieldSections.map(({ section, fields: sectionFields }) => (
        <section key={section?.title ?? sectionFields[0].key} className="space-y-5">
          {section ? (
            <div className="border-border border-b pb-4">
              <p className="text-foreground text-sm font-semibold">{section.title}</p>
              {section.description ? (
                <p className="text-muted-foreground mt-1 text-sm leading-5">
                  {section.description}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="grid gap-5 sm:grid-cols-2">
            {sectionFields.map((field) => {
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
                          values,
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
          </div>
        </section>
      ))}
    </form>
  )
}

function renderControl(
  field: ResourceField,
  values: ResourceValues,
  id: string,
  value: ResourceValues[string],
  onChange: (value: ResourceValueForControl) => void,
  describedBy: string | undefined,
  invalid: boolean,
) {
  if (field.optionsEndpoint) {
    const dependentValue = field.dependentOn ? values[field.dependentOn] : undefined
    const normalizedDependentValue =
      typeof dependentValue === 'string' ||
      typeof dependentValue === 'number' ||
      typeof dependentValue === 'boolean'
        ? dependentValue
        : undefined

    return (
      <ResourceSelectField
        endpoint={field.optionsEndpoint}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        dependentValue={normalizedDependentValue}
        queryParams={field.optionsParams?.(values)}
        labelKey={field.optionLabelKey}
        valueKey={field.optionValueKey}
        placeholder={
          field.dependentOn && !values[field.dependentOn]
            ? `Pilih ${field.dependentOn.replace('_id', '').replaceAll('_', ' ')} terlebih dahulu`
            : field.placeholder ?? getDefaultPlaceholder(field)
        }
        disabled={Boolean(field.dependentOn && !values[field.dependentOn])}
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
        placeholder={field.placeholder ?? getDefaultPlaceholder(field)}
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

  if (field.type === 'date') {
    return (
      <DatePicker
        id={id}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        placeholder={field.placeholder ?? getDefaultPlaceholder(field)}
        aria-describedby={describedBy}
        invalid={invalid}
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
      placeholder={field.placeholder ?? getDefaultPlaceholder(field)}
      aria-describedby={describedBy}
      invalid={invalid}
    />
  )
}

type ResourceValueForControl = string | number | boolean

function getDefaultPlaceholder(field: ResourceField) {
  const label = field.label.toLocaleLowerCase('id')

  if (field.type === 'date') return `Pilih ${label}`
  if (field.type === 'number') return `Masukkan ${label}`
  if (field.type === 'select' || field.optionsEndpoint) return `Pilih ${label}`
  if (field.type === 'textarea') return `Tulis ${label}…`
  return `Masukkan ${label}`
}
