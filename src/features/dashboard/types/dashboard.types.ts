export interface DashboardSummary {
  period: DashboardPeriod
  total_students: number
  placed_students: number
  unplaced_students: number
  active_placements: number
  active_companies: number
  incomplete_documents: number
  starting_soon: number
  ending_soon: number
  placement_statuses: DashboardBreakdown[]
  major_progress: DashboardMajorProgress[]
  readiness: DashboardReadiness
  company_capacity: DashboardCapacity
  priorities: DashboardPriority[]
  agenda: DashboardAgendaItem[]
  recent_activities: DashboardActivity[]
}

export interface DashboardPeriod {
  id: string
  name: string
  academic_year: string
  semester: string
  status: string
  start_date: string
  end_date: string
}

export interface DashboardBreakdown {
  key: string
  label: string
  value: number
}

export interface DashboardMajorProgress {
  major_id: string
  major_code: string
  major_name: string
  total_students: number
  placed_students: number
  active_students: number
}

export interface DashboardReadiness {
  total: number
  ready: number
  attention: number
  incomplete: number
  average: number
}

export interface DashboardCapacity {
  total: number
  used: number
}

export interface DashboardPriority {
  key: string
  title: string
  description: string
  value: number
  tone: 'info' | 'warning' | 'danger'
  path: string
}

export interface DashboardAgendaItem {
  id: string
  type: 'placement_start' | 'placement_end' | 'company_expiration'
  title: string
  description: string
  date: string
  days_left: number
  tone: 'info' | 'warning' | 'danger'
  path: string
}

export interface DashboardActivity {
  id: string
  action: string
  resource: string
  actor_name: string
  created_at: string
}
