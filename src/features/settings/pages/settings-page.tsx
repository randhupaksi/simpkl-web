import { Accessibility, Database, Palette } from 'lucide-react'

import { useTheme } from '@/app/providers/theme-provider'
import { env } from '@/app/config/env'
import {
  Card,
  CardContent,
  CardHeader,
  Select,
  Switch,
} from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { SectionTitle, Typography } from '@/shared/design-system/typography'

export function SettingsPage() {
  const { density, reducedMotion, setDensity, setReducedMotion } = useTheme()

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Sistem"
        title="Pengaturan"
        description="Preferensi tampilan disimpan pada perangkat ini dan tidak mengubah data SIMPKL di server."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <span className="bg-primary-subtle text-primary grid size-10 place-items-center rounded-[var(--radius-md)]">
              <Palette className="size-5" />
            </span>
            <div>
              <SectionTitle>Kepadatan antarmuka</SectionTitle>
              <Typography variant="caption">
                Sesuaikan ruang vertikal untuk pola kerja Anda.
              </Typography>
            </div>
          </CardHeader>
          <CardContent>
            <Select
              value={density}
              onValueChange={(value) =>
                setDensity(value as 'comfortable' | 'compact')
              }
              ariaLabel="Kepadatan antarmuka"
              options={[
                { value: 'comfortable', label: 'Nyaman' },
                { value: 'compact', label: 'Ringkas' },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <span className="bg-info-subtle text-info grid size-10 place-items-center rounded-[var(--radius-md)]">
              <Accessibility className="size-5" />
            </span>
            <div>
              <SectionTitle>Aksesibilitas gerakan</SectionTitle>
              <Typography variant="caption">
                Kurangi transisi dan animasi non-esensial.
              </Typography>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Kurangi gerakan</p>
              <Typography variant="caption">
                Direkomendasikan jika animasi mengganggu kenyamanan.
              </Typography>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              aria-label="Kurangi gerakan"
            />
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3">
            <span className="bg-success-subtle text-success grid size-10 place-items-center rounded-[var(--radius-md)]">
              <Database className="size-5" />
            </span>
            <div>
              <SectionTitle>Konfigurasi koneksi</SectionTitle>
              <Typography variant="caption">
                Informasi read-only dari environment build frontend.
              </Typography>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs font-semibold uppercase">
                  API base URL
                </dt>
                <dd className="mt-1 font-mono text-sm break-all">
                  {env.apiBaseUrl}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-semibold uppercase">
                  Mode tampilan
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  Tema terang enterprise
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
