import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  CalendarClock,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardCheck,
  FileOutput,
  FileWarning,
  MapPin,
  Plus,
  Sparkles,
  Timer,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PERMISSIONS, hasPermission } from '@/app/config/permissions'
import { ROUTE_PATHS } from '@/app/router/route-paths'
import { useDashboardQuery } from '@/features/dashboard/api'
import { useAuthStore } from '@/features/auth/hooks/use-auth-store'
import { usePeriodsQuery } from '@/features/periods/api'
import {
  ErrorState,
  LoadingState,
} from '@/shared/components/feedback'
import { Badge, Button, Card, CardContent, CardHeader, Select } from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

const statusColors = {
  unplaced: 'var(--warning)',
  ready: 'var(--info)',
  active: 'var(--primary)',
  completed: 'var(--success)',
} as const

const activityLabels: Record<string, string> = {
  create: 'menambahkan data',
  update: 'memperbarui data',
  delete: 'menghapus data',
  verify: 'memverifikasi dokumen',
  generate: 'membuat dokumen otomatis',
  archive: 'mengarsipkan periode',
}

const resourceLabels: Record<string, string> = {
  student: 'siswa',
  students: 'data siswa',
  placement: 'penempatan PKL',
  placements: 'penempatan PKL',
  document: 'dokumen',
  documents: 'dokumen',
  readiness: 'kesiapan administrasi',
  company: 'perusahaan',
  companies: 'perusahaan',
  period: 'periode PKL',
}

type QuickAction = {
  title: string
  description: string
  path: string
  icon: LucideIcon
  permission: string
  tone: 'primary' | 'info' | 'warning' | 'success'
}

const quickActions: QuickAction[] = [
  {
    title: 'Atur penempatan',
    description: 'Tempatkan peserta ke perusahaan PKL.',
    path: `${ROUTE_PATHS.placements}/new`,
    icon: MapPin,
    permission: PERMISSIONS.placement.create,
    tone: 'primary',
  },
  {
    title: 'Buat dokumen',
    description: 'Siapkan surat dan dokumen PKL otomatis.',
    path: ROUTE_PATHS.documentAutomation,
    icon: FileOutput,
    permission: PERMISSIONS.automation.generate,
    tone: 'info',
  },
  {
    title: 'Cek kesiapan',
    description: 'Tinjau persyaratan sebelum peserta berangkat.',
    path: ROUTE_PATHS.readiness,
    icon: ClipboardCheck,
    permission: PERMISSIONS.readiness.view,
    tone: 'warning',
  },
  {
    title: 'Lihat rekap',
    description: 'Buka laporan penempatan dan ekspor data.',
    path: ROUTE_PATHS.reports,
    icon: ChartNoAxesCombined,
    permission: PERMISSIONS.report.view,
    tone: 'success',
  },
]

const quickActionTones = {
  primary: 'bg-primary-subtle text-primary group-hover:bg-primary group-hover:text-primary-foreground',
  info: 'bg-info-subtle text-info group-hover:bg-info group-hover:text-inverse-foreground',
  warning:
    'bg-warning-subtle text-warning group-hover:bg-warning group-hover:text-inverse-foreground',
  success:
    'bg-success-subtle text-success group-hover:bg-success group-hover:text-inverse-foreground',
} as const

const quickActionCardHoverTones = {
  primary: 'hover:border-primary',
  info: 'hover:border-info',
  warning: 'hover:border-warning',
  success: 'hover:border-success',
} as const

export function DashboardPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>()
  const user = useAuthStore((state) => state.user)
  const permissions = user?.permissions ?? []
  const dashboardQuery = useDashboardQuery(selectedPeriodId)
  const periodsQuery = usePeriodsQuery({ page: 1, per_page: 100 })

  if (dashboardQuery.isPending) {
    return <LoadingState label="Menyiapkan pusat operasional PKL…" />
  }
  if (dashboardQuery.isError) {
    return (
      <ErrorState
        message="Pusat operasional PKL tidak dapat dimuat."
        onRetry={() => void dashboardQuery.refetch()}
      />
    )
  }

  const summary = dashboardQuery.data
  const activePeriodId = selectedPeriodId ?? summary.period.id
  const placementProgress = percentage(
    summary.placed_students,
    summary.total_students,
  )
  const capacityProgress = percentage(
    summary.company_capacity.used,
    summary.company_capacity.total,
  )
  const availableActions = quickActions.filter((action) =>
    hasPermission(permissions, action.permission),
  )

  return (
    <div className="enter-animation space-y-6 pb-2">
      <section className="border-border-subtle relative overflow-hidden rounded-[var(--radius-xl)] border bg-surface px-5 py-6 shadow-[var(--shadow-sm)] sm:px-7 sm:py-7">
        <div className="bg-primary-subtle pointer-events-none absolute -top-28 -right-20 size-72 rounded-full blur-3xl" />
        <div className="bg-info-subtle pointer-events-none absolute -bottom-36 right-1/3 size-64 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="text-primary mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase">
              <Sparkles className="size-4" />
              Pusat operasional PKL
            </div>
            <h1 className="text-foreground text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Selamat datang, {firstName(user?.name)}
            </h1>
            <Typography variant="muted" className="mt-3 max-w-2xl text-[0.9375rem] leading-6">
              Pantau prioritas, kesiapan administrasi, dan perkembangan
              penempatan PKL dari satu tempat.
            </Typography>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-64">
              <span className="text-muted-foreground mb-1.5 block text-[0.625rem] font-bold tracking-[0.14em] uppercase">
                Periode yang ditinjau
              </span>
              <Select
                value={activePeriodId}
                onValueChange={setSelectedPeriodId}
                ariaLabel="Pilih periode dashboard"
                options={(periodsQuery.data?.data ?? []).map((period) => ({
                  value: period.id,
                  label: period.name,
                }))}
                placeholder={summary.period.name || 'Belum ada periode'}
                className="bg-surface/90"
              />
            </div>
            {hasPermission(permissions, PERMISSIONS.placement.create) ? (
              <Button asChild size="lg" className="mt-auto shrink-0">
                <Link to={`${ROUTE_PATHS.placements}/new`}>
                  <Plus />
                  Atur penempatan
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="border-border-subtle relative mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">
          <HeroMetric
            label="Peserta PKL"
            value={summary.total_students}
            detail="Peserta dalam periode terpilih"
          />
          <HeroMetric
            label="Progres penempatan"
            value={`${placementProgress}%`}
            detail={`${summary.placed_students} peserta telah memiliki penempatan`}
            progress={placementProgress}
          />
          <HeroMetric
            label="Kesiapan administrasi"
            value={`${Math.round(summary.readiness.average)}%`}
            detail={`${summary.readiness.ready} peserta siap berangkat`}
            progress={summary.readiness.average}
          />
        </div>
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan utama">
        <OperationalMetric
          label="Sedang menjalani PKL"
          value={summary.active_placements}
          description="Peserta aktif di perusahaan"
          icon={CalendarCheck2}
          tone="primary"
        />
        <OperationalMetric
          label="Perlu dilengkapi"
          value={summary.incomplete_documents}
          description="Administrasi perlu ditinjau"
          icon={FileWarning}
          tone="warning"
          path={ROUTE_PATHS.readiness}
        />
        <OperationalMetric
          label="Agenda 14 hari"
          value={summary.starting_soon + summary.ending_soon}
          description={`${summary.starting_soon} mulai · ${summary.ending_soon} berakhir`}
          icon={CalendarClock}
          tone="info"
          path={ROUTE_PATHS.placements}
        />
        <OperationalMetric
          label="Kapasitas perusahaan"
          value={`${summary.company_capacity.used}/${summary.company_capacity.total}`}
          description={`${summary.active_companies} perusahaan aktif`}
          icon={Building2}
          tone="success"
          progress={capacityProgress}
          path={ROUTE_PATHS.companies}
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-foreground text-base font-bold">Prioritas hari ini</p>
              <Typography variant="muted" className="mt-1">
                Selesaikan hal yang paling memengaruhi kelancaran PKL.
              </Typography>
            </div>
            <Badge tone={summary.priorities.length > 0 ? 'danger' : 'success'}>
              {summary.priorities.length > 0
                ? `${summary.priorities.length} perlu ditinjau`
                : 'Terkendali'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {summary.priorities.length ? (
              summary.priorities.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className="interactive-surface pressed-feedback border-border group flex items-center gap-3 rounded-[var(--radius-md)] border p-3.5 hover:border-border-hover hover:bg-surface-hover"
                >
                  <PriorityIcon tone={item.tone} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-5">{item.description}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <Badge tone={item.tone}>{item.value}</Badge>
                    <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))
            ) : (
              <div className="grid min-h-48 place-items-center rounded-[var(--radius-md)] bg-success-subtle px-5 text-center">
                <div>
                  <CircleCheckBig className="text-success mx-auto size-9" />
                  <p className="mt-3 text-sm font-semibold">Semua prioritas terkendali</p>
                  <Typography variant="caption" className="mt-1">Tidak ada tindakan administratif yang mendesak saat ini.</Typography>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AgendaCard items={summary.agenda} />
      </section>

      {availableActions.length ? (
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-foreground text-base font-bold">Aksi cepat</p>
              <Typography variant="muted" className="mt-1">Masuk langsung ke pekerjaan utama tanpa mencari menu.</Typography>
            </div>
          </div>
          <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {availableActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} to={action.path} className={cn('interactive-surface pressed-feedback border-border group rounded-[var(--radius-lg)] border bg-surface p-4 shadow-[var(--shadow-xs)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]', quickActionCardHoverTones[action.tone])}>
                  <span className={cn('grid size-10 place-items-center rounded-[var(--radius-md)] transition-colors', quickActionTones[action.tone])}>
                    <Icon className="size-5" />
                  </span>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">{action.title}</p>
                    <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-5">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </section>
      ) : null}

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card>
          <CardHeader>
            <p className="text-foreground text-base font-bold">Progres penempatan per jurusan</p>
            <Typography variant="muted" className="mt-1">Bandingkan kesiapan penempatan antarjurusan pada periode ini.</Typography>
          </CardHeader>
          <CardContent className="h-80">
            {summary.major_progress.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.major_progress} margin={{ top: 12, right: 8, left: -20, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="major_code" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <ChartTooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--surface-hover)' }} />
                  <Bar dataKey="total_students" name="Total peserta" fill="var(--surface-muted)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="placed_students" name="Sudah ditempatkan" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartEmptyState label="Belum ada peserta untuk ditampilkan pada periode ini." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <p className="text-foreground text-base font-bold">Kondisi peserta</p>
            <Typography variant="muted" className="mt-1">Status peserta saat ini dalam alur PKL.</Typography>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[10rem_1fr]">
            <div className="h-44">
              {summary.total_students ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={summary.placement_statuses} dataKey="value" nameKey="label" innerRadius={45} outerRadius={66} paddingAngle={3} stroke="var(--surface)" strokeWidth={3}>
                      {summary.placement_statuses.map((item) => <Cell key={item.key} fill={statusColors[item.key as keyof typeof statusColors] ?? 'var(--muted-foreground)'} />)}
                    </Pie>
                    <ChartTooltip contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <ChartEmptyState label="Belum ada peserta pada periode ini." compact />}
            </div>
            <div className="space-y-2.5">
              {summary.placement_statuses.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2.5 rounded-full" style={{ backgroundColor: statusColors[item.key as keyof typeof statusColors] ?? 'var(--muted-foreground)' }} />{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <ReadinessCard ready={summary.readiness.ready} attention={summary.readiness.attention} incomplete={summary.readiness.incomplete} total={summary.readiness.total} average={summary.readiness.average} />
        <ActivityCard activities={summary.recent_activities} />
      </section>
    </div>
  )
}

function HeroMetric({ label, value, detail, progress }: { label: string; value: string | number; detail: string; progress?: number }) {
  return <div><p className="text-muted-foreground text-[0.625rem] font-bold tracking-[0.14em] uppercase">{label}</p><p className="mt-1 text-2xl font-bold tracking-[-0.035em]">{value}</p><p className="text-muted-foreground mt-1 text-xs">{detail}</p>{progress !== undefined ? <div className="bg-surface-muted mt-3 h-1.5 overflow-hidden rounded-full"><div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} /></div> : null}</div>
}

function OperationalMetric({ label, value, description, icon: Icon, tone, path, progress }: { label: string; value: string | number; description: string; icon: LucideIcon; tone: 'primary' | 'info' | 'warning' | 'success'; path?: string; progress?: number }) {
  const content = <><div className="flex items-start justify-between gap-4"><span className={cn('grid size-10 place-items-center rounded-[var(--radius-md)]', quickActionTones[tone].split(' group-hover')[0])}><Icon className="size-5" /></span>{path ? <ArrowRight className="text-muted-foreground size-4" /> : null}</div><p className="text-muted-foreground mt-5 text-xs font-medium">{label}</p><p className="mt-1 text-2xl font-bold tracking-[-0.035em]">{value}</p><p className="text-muted-foreground mt-1 text-xs">{description}</p>{progress !== undefined ? <div className="bg-surface-muted mt-3 h-1.5 overflow-hidden rounded-full"><div className="bg-success h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} /></div> : null}</>
  return path ? <Link to={path} className={cn('interactive-surface pressed-feedback border-border rounded-[var(--radius-lg)] border bg-surface p-5 shadow-[var(--shadow-xs)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]', quickActionCardHoverTones[tone])}>{content}</Link> : <Card className="p-5">{content}</Card>
}

function PriorityIcon({ tone }: { tone: 'info' | 'warning' | 'danger' }) { const Icon = tone === 'danger' ? FileWarning : tone === 'warning' ? UsersRound : Timer; return <span className={cn('grid size-10 shrink-0 place-items-center rounded-[var(--radius-md)]', tone === 'danger' ? 'bg-danger-subtle text-danger' : tone === 'warning' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info')}><Icon className="size-5" /></span> }

function AgendaCard({ items }: { items: { id: string; title: string; description: string; date: string; days_left: number; tone: 'info' | 'warning' | 'danger'; path: string }[] }) { return <Card><CardHeader><p className="text-foreground text-base font-bold">Agenda & tenggat</p><Typography variant="muted" className="mt-1">Jadwal PKL dan kerja sama yang perlu dipantau.</Typography></CardHeader><CardContent className="space-y-3">{items.length ? items.map((item) => <Link key={item.id} to={item.path} className="interactive-surface pressed-feedback border-border group flex gap-3 rounded-[var(--radius-md)] border p-3 hover:border-border-hover hover:bg-surface-hover"><span className={cn('grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-xs font-bold', item.tone === 'danger' ? 'bg-danger-subtle text-danger' : item.tone === 'warning' ? 'bg-warning-subtle text-warning' : 'bg-info-subtle text-info')}>{item.days_left <= 0 ? 'Hari ini' : item.days_left}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.title}</span><span className="text-muted-foreground mt-0.5 block truncate text-xs">{item.description}</span></span><span className="text-muted-foreground shrink-0 text-xs">{formatShortDate(item.date)}</span></Link>) : <div className="grid min-h-48 place-items-center rounded-[var(--radius-md)] bg-surface-subtle px-5 text-center"><div><CalendarCheck2 className="text-success mx-auto size-8" /><p className="mt-3 text-sm font-semibold">Belum ada agenda mendatang</p><Typography variant="caption" className="mt-1">Jadwal dan tenggat akan muncul di sini.</Typography></div></div>}</CardContent></Card> }

function ReadinessCard({ ready, attention, incomplete, total, average }: { ready: number; attention: number; incomplete: number; total: number; average: number }) { return <Card><CardHeader className="flex flex-row items-start justify-between gap-4"><div><p className="text-foreground text-base font-bold">Kesiapan administrasi</p><Typography variant="muted" className="mt-1">Pastikan semua syarat PKL selesai sebelum berangkat.</Typography></div><Badge tone={average >= 80 ? 'success' : average >= 60 ? 'warning' : 'danger'}>{Math.round(average)}%</Badge></CardHeader><CardContent className="grid gap-6 sm:grid-cols-[8rem_1fr] sm:items-center"><div className="relative mx-auto grid size-28 place-items-center"><svg className="size-28 -rotate-90"><circle className="text-surface-muted" cx="56" cy="56" r="46" fill="none" stroke="currentColor" strokeWidth="10" /><circle className="text-primary" cx="56" cy="56" r="46" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" pathLength="100" strokeDasharray={`${Math.min(average, 100)} 100`} /></svg><span className="absolute text-lg font-bold">{Math.round(average)}%</span></div><div className="space-y-3"><ReadinessRow label="Siap berangkat" value={ready} total={total} tone="success" /><ReadinessRow label="Perlu perhatian" value={attention} total={total} tone="warning" /><ReadinessRow label="Belum lengkap" value={incomplete} total={total} tone="danger" /><Link to={ROUTE_PATHS.readiness} className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-primary-hover">Tinjau kesiapan administrasi <ArrowRight className="size-4" /></Link></div></CardContent></Card> }

function ReadinessRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'success' | 'warning' | 'danger' }) { return <div><div className="mb-1.5 flex justify-between gap-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value} peserta</span></div><div className="bg-surface-muted h-1.5 overflow-hidden rounded-full"><div className={cn('h-full rounded-full', tone === 'success' ? 'bg-success' : tone === 'warning' ? 'bg-warning' : 'bg-danger')} style={{ width: `${percentage(value, total)}%` }} /></div></div> }

function ActivityCard({ activities }: { activities: { id: string; action: string; resource: string; actor_name: string; created_at: string }[] }) { return <Card><CardHeader><p className="text-foreground text-base font-bold">Aktivitas terbaru</p><Typography variant="muted" className="mt-1">Perubahan penting yang terekam pada sistem.</Typography></CardHeader><CardContent>{activities.length ? <div className="space-y-0">{activities.map((activity, index) => <div key={activity.id} className="relative flex gap-3 pb-5 last:pb-0"><span className="bg-primary-subtle text-primary grid size-8 shrink-0 place-items-center rounded-full"><span className="bg-primary size-2 rounded-full" /></span>{index < activities.length - 1 ? <span className="bg-border-subtle absolute top-8 left-4 h-[calc(100%-1.5rem)] w-px" /> : null}<div className="min-w-0 pt-0.5"><p className="text-sm leading-5"><span className="font-semibold">{activity.actor_name}</span> <span className="text-muted-foreground">{activityLabels[activity.action] ?? activity.action} {resourceLabels[activity.resource] ?? activity.resource}</span></p><p className="text-muted-foreground mt-1 text-xs">{formatActivityDate(activity.created_at)}</p></div></div>)}</div> : <div className="grid min-h-48 place-items-center rounded-[var(--radius-md)] bg-surface-subtle px-5 text-center"><div><ClipboardCheck className="text-info mx-auto size-8" /><p className="mt-3 text-sm font-semibold">Belum ada aktivitas tercatat</p><Typography variant="caption" className="mt-1">Aktivitas operasional akan muncul setelah data dikelola.</Typography></div></div>}</CardContent></Card> }

function ChartEmptyState({ label, compact = false }: { label: string; compact?: boolean }) { return <div className={cn('grid place-items-center rounded-[var(--radius-md)] bg-surface-subtle px-5 text-center', compact ? 'h-full' : 'h-full')}><p className="text-muted-foreground text-sm">{label}</p></div> }

const chartTooltipStyle = { borderRadius: 'var(--radius-md)', borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--shadow-md)', fontSize: 12 }
function percentage(value: number, total: number) { return total > 0 ? Math.round((value / total) * 100) : 0 }
function firstName(name?: string) { return name?.trim().split(/\s+/)[0] || 'Pengguna' }
function formatShortDate(value: string) { if (!value) return '—'; return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(`${value}T00:00:00`)) }
function formatActivityDate(value: string) { if (!value) return 'Baru saja'; return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) }
