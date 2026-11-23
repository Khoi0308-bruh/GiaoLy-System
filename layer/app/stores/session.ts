// defineStore được @pinia/nuxt auto-import để file trong layer không phải tự resolve package.
import type { PermissionCode } from '../shared/permissions'

export interface Me {
  id: string
  userName: string
  fullName: string
  mustChangePassword: boolean
  role: { code: string, name: string, scopeType: 'All' | 'Branch' | 'Classroom' | 'Guardian' }
  permissions: string[]
  branch?: { id: number, name: string } | null
  classRooms?: { id: string, name: string }[]
  email?: string | null
  phoneNumber?: string | null
  avatarPath?: string | null
  avatarUrl?: string | null
}

/**
 * BE trả hồ sơ dạng phẳng (username, roleCode, scopeType, branchId…),
 * store và các trang lại dùng cấu trúc lồng (role.scopeType, userName…).
 * Chuẩn hoá ngay tại biên để chỉ có một hình dạng dữ liệu trong toàn bộ app.
 */
interface MeRaw {
  id: string
  username?: string
  userName?: string
  fullName: string
  mustChangePassword?: boolean
  role?: Me['role']
  roleCode?: string
  roleName?: string | null
  scopeType?: string
  permissions?: string[]
  branch?: Me['branch']
  classRooms?: Me['classRooms']
  email?: string | null
  phoneNumber?: string | null
  avatarPath?: string | null
  avatarUrl?: string | null
}

function normalize(raw: MeRaw): Me {
  const scopeType = (raw.scopeType ?? raw.role?.scopeType ?? 'All') as Me['role']['scopeType']

  return {
    id: raw.id,
    userName: raw.userName ?? raw.username ?? '',
    fullName: raw.fullName,
    mustChangePassword: raw.mustChangePassword ?? false,
    role: raw.role ?? {
      code: raw.roleCode ?? '',
      name: raw.roleName ?? raw.roleCode ?? '',
      scopeType
    },
    permissions: raw.permissions ?? [],
    branch: raw.branch ?? null,
    classRooms: raw.classRooms ?? [],
    email: raw.email ?? null,
    phoneNumber: raw.phoneNumber ?? null,
    avatarPath: raw.avatarPath ?? null,
    avatarUrl: raw.avatarUrl ?? null
  }
}

function statusOf(error: unknown): number | undefined {
  const e = error as { status?: number, statusCode?: number, data?: { status?: number } } | null
  return e?.status ?? e?.statusCode ?? e?.data?.status
}

/** Lỗi mạng, 429 hay 5xx là tạm thời: chưa thể kết luận người dùng đã mất phiên. */
function laLoiTamThoi(error: unknown): boolean {
  const status = statusOf(error)
  return status === undefined || status === 429 || status >= 500
}

export const useSessionStore = defineStore('session', () => {
  const config = useRuntimeConfig()
  const accessToken = ref<string | null>(null)
  const me = ref<Me | null>(null)
  const ready = ref(false)
  /** Đã có refresh token nhưng chưa đọc được hồ sơ vì lỗi tạm thời. */
  const unavailable = ref(false)
  let refreshing: Promise<boolean> | null = null

  const permissions = computed(() => new Set(me.value?.permissions ?? []))
  const can = (code: PermissionCode | string) => permissions.value.has(code)
  const canAny = (codes: (PermissionCode | string)[]) => codes.some(c => permissions.value.has(c))
  /** Trang đích mặc định theo vai trò: phụ huynh vào cổng phụ huynh, các vai trò khác vào trang quản trị. */
  const homePath = computed(() => me.value?.role.scopeType === 'Guardian' ? '/phu-huynh' : '/admin')

  async function refresh(): Promise<boolean> {
    if (refreshing) return refreshing
    refreshing = (async () => {
      try {
        const res = await $fetch<{ accessToken: string }>('/api/v1/auth/refresh', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include'
        })
        accessToken.value = res.accessToken
        return true
      } catch (e) {
        // Chỉ 401 mới là mất phiên thật. 429 (rate limit), 5xx hay lỗi mạng là
        // tạm thời — xoá phiên ở đây sẽ đá người dùng về trang đăng nhập oan.
        if (statusOf(e) === 401) {
          accessToken.value = null
          return false
        }
        throw e
      } finally {
        refreshing = null
      }
    })()
    return refreshing
  }

  async function loadMe() {
    const raw = await $fetch<MeRaw>('/api/v1/auth/me', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    me.value = normalize(raw)
  }

  async function bootstrap() {
    unavailable.value = false
    try {
      if (await refresh()) {
        try {
          await loadMe()
        } catch (e) {
          // Đọc hồ sơ hỏng vì lý do tạm thời: giữ nguyên phiên và báo "tạm thời
          // không kết nối được" thay vì coi như chưa đăng nhập.
          if (laLoiTamThoi(e)) {
            unavailable.value = true
            return
          }
          me.value = null
        }
      }
    } catch (e) {
      // Lỗi tạm thời khi refresh: giữ nguyên phiên đang có trong bộ nhớ.
      if (laLoiTamThoi(e)) unavailable.value = true
    } finally {
      ready.value = true
    }
  }

  async function login(username: string, password: string) {
    const res = await $fetch<{ accessToken: string }>('/api/v1/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      credentials: 'include',
      body: { username, password }
    })
    accessToken.value = res.accessToken
    await loadMe()
    ready.value = true
  }

  async function logout() {
    try {
      await $fetch('/api/v1/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
    } finally {
      clear()
    }
  }

  function clear() {
    accessToken.value = null
    me.value = null
  }

  return { accessToken, me, ready, unavailable, permissions, can, canAny, homePath, refresh, loadMe, bootstrap, login, logout, clear }
})
