import { Braces, ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { findNavigationItem } from '@/app/config/navigation'
import { ROUTE_PATHS } from '@/app/router'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  buttonVariants,
} from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { cn } from '@/shared/lib/utils'

const routeLabels: Record<string, string> = {
  majors: 'Jurusan',
  classes: 'Kelas',
  supervisors: 'Guru Pembimbing',
  'administrative-readiness': 'Kesiapan Administrasi',
  archives: 'Arsip',
  users: 'Pengguna',
  roles: 'Role & Permission',
  permissions: 'Permission',
  settings: 'Pengaturan',
  import: 'Import Siswa',
  transfer: 'Transfer Penempatan',
}

export function ContractPage() {
  const { pathname } = useLocation()
  const item = findNavigationItem(pathname)
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments.at(-1) ?? ''
  const rootSegment = segments[0] ?? ''
  const isCreate = lastSegment === 'new'
  const isEdit = lastSegment === 'edit'
  const isTransfer = lastSegment === 'transfer'
  const isImport = lastSegment === 'import'
  const isDetail =
    segments.length > 1 && !isCreate && !isEdit && !isTransfer && !isImport
  const baseLabel =
    item?.label ??
    routeLabels[rootSegment] ??
    routeLabels[lastSegment] ??
    'Fitur'
  const action = isCreate
    ? 'Tambah'
    : isEdit
      ? 'Edit'
      : isTransfer
        ? 'Transfer'
        : isImport
          ? 'Import'
          : isDetail
            ? 'Detail'
            : undefined
  const title = action ? `${action} ${baseLabel}` : baseLabel
  const backTo = segments.length > 1 ? `/${rootSegment}` : ROUTE_PATHS.dashboard

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Kontrak belum tersedia"
        title={title}
        description="Struktur route dan permission telah disiapkan, tetapi frontend tidak membuat integrasi yang belum didefinisikan oleh OpenAPI."
        backTo={segments.length > 1 ? backTo : undefined}
      />
      <Alert tone="info">
        <Braces />
        <div>
          <AlertTitle>Menunggu kontrak backend</AlertTitle>
          <AlertDescription>
            Endpoint, payload, response, pagination, atau aturan otorisasi untuk
            halaman ini belum cukup lengkap pada{' '}
            <code className="bg-info-subtle rounded-[var(--radius-xs)] px-1.5 py-0.5 font-mono text-xs">
              docs/openapi.yaml
            </code>
            . Tidak ada mock produksi atau URL endpoint rekaan yang digunakan.
          </AlertDescription>
        </div>
      </Alert>
      <section className="border-border-strong bg-surface-subtle grid min-h-72 place-items-center rounded-[var(--radius-lg)] border border-dashed p-8 text-center">
        <div className="max-w-md">
          <span className="bg-primary-subtle text-primary mx-auto grid size-12 place-items-center rounded-[var(--radius-md)]">
            <ExternalLink className="size-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">
            Halaman siap dihubungkan
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Setelah endpoint didokumentasikan, tambahkan service dan query key
            pada feature terkait tanpa mengubah design system atau layout.
          </p>
          <Link
            to={backTo}
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-5')}
          >
            Kembali
          </Link>
        </div>
      </section>
    </div>
  )
}
