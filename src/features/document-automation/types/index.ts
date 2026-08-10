import type { BaseEntity } from '@/shared/types/domain'

export interface SchoolProfile extends BaseEntity {
  institution_name: string
  institution_type: string
  npsn: string
  address: string
  village: string
  district: string
  city: string
  province: string
  postal_code: string
  phone: string
  email: string
  website: string
  letterhead_tagline: string
  timezone: string
}

export interface Signatory extends BaseEntity {
  name: string
  title: string
  employee_number: string
  role_code: string
  is_default: boolean
  status: 'active' | 'inactive'
}

export interface DocumentTemplate extends BaseEntity {
  code: string
  name: string
  category: 'letter' | 'spreadsheet'
  subject_template: string
  body_template: string
  number_pattern: string
  version: number
  is_active: boolean
}

export interface AutomationFilters {
  period_id?: string
  class_id?: string
  major_id?: string
  company_id?: string
  supervisor_id?: string
  placement_ids?: string[]
}

export interface PlacementPreview {
  placement_id: string
  student_id: string
  student_nis: string
  student_name: string
  class_name: string
  major_name: string
  company_name: string
  supervisor_name: string
  period_name: string
  placement_start: string
  placement_end: string
}

export interface ValidationIssue {
  placement_id?: string
  student_name?: string
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface AutomationPreview {
  placement_count: number
  document_count: number
  ready: boolean
  issues: ValidationIssue[]
  placements: PlacementPreview[]
}

export interface GenerationBatch extends BaseEntity {
  period_id: string | null
  requested_by: string | null
  name: string
  status: 'processing' | 'completed' | 'completed_with_errors' | 'failed'
  requested_count: number
  generated_count: number
  failed_count: number
  archive_name: string
  archive_size: number
  completed_at: string | null
}

export interface GeneratedDocument extends BaseEntity {
  batch_id: string | null
  template_code: string
  template_version: number
  student_id: string | null
  student_name?: string
  period_name?: string
  document_number: string
  title: string
  format: 'docx' | 'pdf' | 'xlsx'
  original_name: string
  mime_type: string
  size: number
  status: string
  checksum_sha256: string
  generated_at: string
}

export interface GenerateInput {
  name: string
  filters: AutomationFilters
  template_codes: string[]
  formats: string[]
  signatory_id: string
  letter_date: string
}
