export interface PlacementReportRow {
  nis: string
  student_name: string
  class_name: string
  major_name: string
  company_name: string
  supervisor_name: string
  start_date: string
  end_date: string
  status: string
}

export type PlacementReportFilters = {
  period_id?: string
  major_id?: string
  class_id?: string
  company_id?: string
  supervisor_id?: string
  status?: string
}
