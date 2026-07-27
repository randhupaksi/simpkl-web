import type { ReactNode } from 'react'

import { Typography } from '@/shared/design-system/typography'

type FormFieldProps = {
  id: string
  label: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
}

export function FormField({
  id,
  label,
  children,
  error,
  hint,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-danger ml-1" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <Typography
          id={`${id}-error`}
          variant="caption"
          className="text-danger"
          role="alert"
        >
          {error}
        </Typography>
      ) : hint ? (
        <Typography id={`${id}-hint`} variant="caption">
          {hint}
        </Typography>
      ) : null}
    </div>
  )
}
