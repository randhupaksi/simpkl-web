export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (periodId?: string) =>
    [...dashboardKeys.all, 'summary', periodId] as const,
}
