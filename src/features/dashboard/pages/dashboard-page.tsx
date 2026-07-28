import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CircleCheckBig,
  FileWarning,
  MapPin,
  Timer,
  UserRoundX,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from 'recharts'

import { useDashboardQuery } from '@/features/dashboard/api'
import {
  ErrorState,
  LoadingState,
  UnavailableState,
} from '@/shared/components/feedback'
import { StatCard } from '@/shared/components/data-display'
import { Badge, Card, CardContent, CardHeader } from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { SectionTitle, Typography } from '@/shared/design-system/typography'

const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-4)',
] as const

export function DashboardPage() {
  const query = useDashboardQuery()

  if (query.isPending) return <LoadingState label="Memuat ringkasan PKL…" />
  if (query.isError) {
    return (
      <ErrorState
        message="Ringkasan dashboard tidak dapat dimuat."
        onRetry={() => void query.refetch()}
      />
    )
  }

  const summary = query.data
  const placementChart = [
    { name: 'Sudah ditempatkan', value: summary.placed_students },
    { name: 'Belum ditempatkan', value: summary.unplaced_students },
    { name: 'Sedang PKL', value: summary.active_placements },
  ]
  const actions = [
    {
      label: 'Siswa belum ditempatkan',
      value: summary.unplaced_students,
      path: '/students',
      icon: UserRoundX,
      tone: 'warning' as const,
    },
    {
      label: 'Dokumen belum lengkap',
      value: summary.incomplete_documents,
      path: '/documents',
      icon: FileWarning,
      tone: 'danger' as const,
    },
    {
      label: 'PKL segera dimulai',
      value: summary.starting_soon,
      path: '/periods',
      icon: CalendarClock,
      tone: 'info' as const,
    },
    {
      label: 'PKL segera berakhir',
      value: summary.ending_soon,
      path: '/placements',
      icon: Timer,
      tone: 'warning' as const,
    },
  ].filter((item) => item.value > 0)

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Ringkasan operasional"
        title="Dashboard PKL"
        description="Pantau penempatan, kesiapan administrasi, dan agenda penting berdasarkan data backend terbaru."
      />

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Statistik utama"
      >
        <StatCard
          label="Total peserta PKL"
          value={summary.total_students}
          icon={Users}
          tone="primary"
        />
        <StatCard
          label="Sudah ditempatkan"
          value={summary.placed_students}
          icon={MapPin}
          tone="info"
          description={
            summary.total_students > 0
              ? `${Math.round((summary.placed_students / summary.total_students) * 100)}% dari peserta`
              : 'Belum ada peserta'
          }
        />
        <StatCard
          label="Sedang PKL"
          value={summary.active_placements}
          icon={CircleCheckBig}
          tone="success"
        />
        <StatCard
          label="Perusahaan aktif"
          value={summary.active_companies}
          icon={Building2}
          tone="neutral"
        />
        <StatCard
          label="Belum ditempatkan"
          value={summary.unplaced_students}
          icon={UserRoundX}
          tone="warning"
        />
        <StatCard
          label="Dokumen belum lengkap"
          value={summary.incomplete_documents}
          icon={FileWarning}
          tone="danger"
        />
        <StatCard
          label="Segera dimulai"
          value={summary.starting_soon}
          icon={CalendarClock}
          tone="info"
        />
        <StatCard
          label="Segera berakhir"
          value={summary.ending_soon}
          icon={Timer}
          tone="warning"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <Card>
          <CardHeader>
            <SectionTitle>Status penempatan</SectionTitle>
            <Typography variant="muted" className="mt-1">
              Distribusi peserta berdasarkan ringkasan penempatan.
            </Typography>
          </CardHeader>
          <CardContent className="h-80">
            {summary.total_students === 0 ? (
              <UnavailableState feature="Grafik status penempatan" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={3}
                    stroke="var(--surface)"
                    strokeWidth={3}
                  >
                    {placementChart.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    contentStyle={{
                      borderRadius: 'var(--radius-md)',
                      borderColor: 'var(--border)',
                      background: 'var(--surface)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <SectionTitle>Perlu tindakan</SectionTitle>
              <Typography variant="muted" className="mt-1">
                Prioritas administrasi saat ini.
              </Typography>
            </div>
            <Badge tone={actions.length > 0 ? 'danger' : 'success'}>
              {actions.length} prioritas
            </Badge>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <div className="grid min-h-56 place-items-center text-center">
                <div>
                  <CircleCheckBig className="text-success mx-auto size-9" />
                  <p className="mt-3 text-sm font-semibold">
                    Tidak ada tindakan mendesak
                  </p>
                  <Typography variant="caption" className="mt-1">
                    Semua indikator prioritas berada dalam kondisi baik.
                  </Typography>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.label}
                      to={action.path}
                      className="interactive-surface pressed-feedback border-border hover:border-border-hover hover:bg-surface-hover active:bg-surface-pressed flex items-center gap-3 rounded-[var(--radius-md)] border p-3.5"
                    >
                      <span className="bg-warning-subtle text-warning grid size-9 place-items-center rounded-[var(--radius-sm)]">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium">
                        {action.label}
                      </span>
                      <Badge tone={action.tone}>{action.value}</Badge>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card variant="subtle">
        <CardContent className="flex items-start gap-3">
          <AlertTriangle className="text-info mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              Grafik siswa per jurusan dan aktivitas terbaru
            </p>
            <Typography variant="caption" className="mt-1">
              Belum ditampilkan karena kontrak OpenAPI belum menyediakan
              breakdown per jurusan maupun endpoint aktivitas.
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
