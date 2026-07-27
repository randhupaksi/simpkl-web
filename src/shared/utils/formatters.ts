import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

export function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = dayjs(value)
  return date.isValid() ? date.format('DD MMM YYYY') : '—'
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function compactId(value?: string) {
  if (!value) return '—'
  return value.length > 12 ? `${value.slice(0, 8)}…` : value
}
