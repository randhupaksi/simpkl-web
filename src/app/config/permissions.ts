export const PERMISSIONS = {
  period: {
    view: 'period.view',
    create: 'period.create',
    update: 'period.update',
    delete: 'period.delete',
    archive: 'period.archive',
  },
  major: {
    view: 'major.view',
    create: 'major.create',
    update: 'major.update',
    delete: 'major.delete',
  },
  class: {
    view: 'class.view',
    create: 'class.create',
    update: 'class.update',
    delete: 'class.delete',
  },
  student: {
    view: 'student.view',
    create: 'student.create',
    update: 'student.update',
    delete: 'student.delete',
    import: 'student.import',
  },
  company: {
    view: 'company.view',
    create: 'company.create',
    update: 'company.update',
    delete: 'company.delete',
  },
  supervisor: {
    view: 'supervisor.view',
    create: 'supervisor.create',
    update: 'supervisor.update',
    delete: 'supervisor.delete',
  },
  placement: {
    view: 'placement.view',
    create: 'placement.create',
    update: 'placement.update',
    delete: 'placement.delete',
    transfer: 'placement.transfer',
  },
  document: {
    view: 'document.view',
    upload: 'document.upload',
    verify: 'document.verify',
    download: 'document.download',
    delete: 'document.delete',
  },
  readiness: {
    view: 'readiness.view',
    update: 'readiness.update',
    override: 'readiness.override',
  },
  report: { view: 'report.view' },
  archive: { view: 'archive.view' },
  user: {
    view: 'user.view',
    create: 'user.create',
    update: 'user.update',
    delete: 'user.delete',
    manage: 'user.manage',
  },
  role: {
    view: 'role.view',
    create: 'role.create',
    update: 'role.update',
    delete: 'role.delete',
    manage: 'role.manage',
  },
  permission: {
    view: 'permission.view',
    create: 'permission.create',
    update: 'permission.update',
    delete: 'permission.delete',
  },
  automation: {
    view: 'automation.view',
    generate: 'automation.generate',
    download: 'automation.download',
    manage: 'automation.manage',
  },
} as const

export function hasPermission(
  granted: string[],
  required?: string | readonly string[],
) {
  if (!required || granted.includes('*')) return true
  const permissions = typeof required === 'string' ? [required] : required

  return permissions.some((permission) => {
    if (granted.includes(permission)) return true
    const [namespace] = permission.split('.')
    return granted.includes(`${namespace}.*`)
  })
}
