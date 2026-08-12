import type { ZodType } from 'zod'

import type { BaseEntity } from '@/shared/types'

export type ResourceValue =
  string | number | boolean | null | undefined | string[]

export type ResourceValues = Record<string, ResourceValue>

export type ResourceField = {
  key: string
  label: string
  section?: {
    title: string
    description?: string
  }
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select'
    | 'switch'
  placeholder?: string
  hint?: string
  required?: boolean
  options?: { value: string; label: string }[]
  optionsEndpoint?: string
  dependentOn?: string
  optionsParams?: (values: ResourceValues) => Record<string, string | number | undefined>
  optionLabelKey?: string
  optionValueKey?: string
  hidden?: boolean
  createOnly?: boolean
  defaultValue?: ResourceValue
  className?: string
}

export type ResourceTableField = {
  key: string
  label: string
  format?: 'status' | 'date' | 'boolean' | 'number'
}

export type ResourceConfig<T extends BaseEntity> = {
  name: string
  namePlural: string
  endpoint: string
  queryKey: string
  description: string
  searchPlaceholder: string
  emptyDescription: string
  schema: ZodType<ResourceValues, ResourceValues>
  createSchema?: ZodType<ResourceValues, ResourceValues>
  editSchema?: ZodType<ResourceValues, ResourceValues>
  fields: ResourceField[]
  tableFields: ResourceTableField[]
  getDisplayName: (item: T) => string
  normalizeInput?: (values: ResourceValues) => ResourceValues
  normalizeEntity?: (item: T) => ResourceValues
}
