import type { PermissionCode } from '../shared/permissions'

export function usePermissions() {
  const session = useSessionStore()
  return {
    can: (code: PermissionCode | string) => session.can(code),
    canAny: (codes: (PermissionCode | string)[]) => session.canAny(codes),
    scope: computed(() => session.me?.role.scopeType ?? 'All')
  }
}
