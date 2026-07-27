export interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface Period extends BaseEntity {
  name: string
  academic_year: string
  semester: 'odd' | 'even'
  start_date: string
  end_date: string
  cohort: number
  status: 'draft' | 'preparation' | 'active' | 'completed' | 'archived'
  notes: string
}

export interface Student extends BaseEntity {
  nis: string
  nisn: string
  name: string
  nickname: string
  gender: 'male' | 'female' | ''
  class_id: string
  major_id: string
  cohort: number
  phone: string
  email: string
  address: string
  parent_name: string
  parent_phone: string
  status: string
  pkl_status: string
  notes: string
}

export interface Company extends BaseEntity {
  name: string
  business_type: string
  industry: string
  description: string
  address: string
  district: string
  city: string
  province: string
  postal_code: string
  phone: string
  email: string
  website: string
  maps_url: string
  status: string
  capacity: number
  cooperation_start: string | null
  cooperation_end: string | null
  notes: string
}

export interface Placement extends BaseEntity {
  period_id: string
  student_id: string
  company_id: string
  company_contact_id: string
  supervisor_id: string
  previous_placement_id: string
  division: string
  position: string
  work_system: string
  address: string
  start_date: string
  end_date: string
  status: string
  source: string
  override_reason: string
  transfer_reason: string
  notes: string
}

export interface DocumentMetadata extends BaseEntity {
  document_type_id: string
  owner_type: 'student' | 'company' | 'placement' | 'period'
  owner_id: string
  period_id: string
  placement_id: string
  number: string
  original_name: string
  mime_type: string
  size: number
  issued_at: string | null
  valid_from: string | null
  valid_until: string | null
  status: string
  version: number
  verified_by: string
  verified_at: string | null
  notes: string
}

export interface Major extends BaseEntity {
  code: string
  name: string
  abbreviation: string
  head_name: string
  status: 'active' | 'inactive'
  description: string
}

export interface SchoolClass extends BaseEntity {
  name: string
  level: number
  major_id: string
  homeroom_teacher: string
  academic_year: string
  status: 'active' | 'inactive'
}

export interface Supervisor extends BaseEntity {
  employee_number: string
  name: string
  phone: string
  email: string
  major_id: string
  position: string
  status: 'active' | 'inactive'
  max_students: number
}

export interface CompanyContact extends BaseEntity {
  company_id: string
  name: string
  position: string
  division: string
  phone: string
  email: string
  is_primary: boolean
  notes: string
}

export interface Readiness extends BaseEntity {
  student_id: string
  period_id: string
  placement_id: string
  data_complete: boolean
  company_assigned: boolean
  contact_available: boolean
  supervisor_assigned: boolean
  dates_set: boolean
  acceptance_letter_valid: boolean
  parent_permission_valid: boolean
  introduction_letter_valid: boolean
  required_count: number
  completed_count: number
  percentage: number
  status: 'incomplete' | 'attention' | 'ready' | 'started' | 'completed'
  override_reason: string
}

export interface Archive extends BaseEntity {
  period_id: string
  archived_by: string
  archived_at: string
  reason: string
  snapshot: string
}

export interface UserAccount extends BaseEntity {
  name: string
  email: string
  username: string
  password?: string
  major_id: string
  class_id: string
  status: 'active' | 'inactive' | 'locked'
  last_login_at: string | null
  role_ids: string[]
  roles?: string[]
  permissions?: string[]
}

export interface Role extends BaseEntity {
  code: string
  name: string
  description: string
  is_system: boolean
  status: 'active' | 'inactive'
  permission_ids: string[]
}

export interface Permission extends BaseEntity {
  code: string
  name: string
  module: string
  description: string
}
