import {
  CircleAlert,
  Inbox,
  LoaderCircle,
  LockKeyhole,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

type StatePanelProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function StatePanel({
  icon: Icon,
  title,
  description,
  action,
  compact,
  className,
}: StatePanelProps) {
  return (
    <section
      className={cn(
        'border-border-strong bg-surface-subtle grid place-items-center rounded-[var(--radius-lg)] border border-dashed px-6 text-center',
        compact ? 'min-h-48 py-8' : 'min-h-80 py-12',
        className,
      )}
    >
      <div className="max-w-md">
        <span className="border-border bg-surface text-muted-foreground mx-auto grid size-12 place-items-center rounded-[var(--radius-md)] border shadow-[var(--shadow-sm)]">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <Typography as="h2" variant="sectionTitle" className="mt-4">
          {title}
        </Typography>
        <Typography variant="muted" className="mt-1.5">
          {description}
        </Typography>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </section>
  )
}

type EmptyStateProps = {
  title?: string
  description?: string
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function EmptyState({
  title = 'Belum ada data',
  description = 'Data akan tampil di sini setelah tersedia.',
  action,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <StatePanel
      icon={Inbox}
      title={title}
      description={description}
      action={action}
      compact={compact}
      className={className}
    />
  )
}

export function ErrorState({
  message,
  onRetry,
  compact,
}: {
  message?: string
  onRetry?: () => void
  compact?: boolean
}) {
  return (
    <StatePanel
      icon={CircleAlert}
      title="Data gagal dimuat"
      description={
        message ?? 'Terjadi kendala saat mengambil data. Silakan coba lagi.'
      }
      compact={compact}
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Coba lagi
          </Button>
        ) : undefined
      }
    />
  )
}

export function LoadingState({ label = 'Memuat data…' }: { label?: string }) {
  return (
    <div
      className="text-muted-foreground flex min-h-48 items-center justify-center gap-2 text-sm font-medium"
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}

export function PermissionState() {
  return (
    <StatePanel
      icon={LockKeyhole}
      title="Akses dibatasi"
      description="Akun Anda tidak memiliki permission untuk melihat atau mengubah data pada bagian ini."
    />
  )
}

export function UnavailableState({ feature }: { feature: string }) {
  return (
    <StatePanel
      icon={CircleAlert}
      title={`${feature} belum tersedia`}
      description="Kontrak endpoint untuk fitur ini belum tersedia di OpenAPI backend. Tampilan telah disiapkan tanpa membuat endpoint sementara di aplikasi produksi."
    />
  )
}
