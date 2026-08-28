import { defineStore } from 'pinia'

interface UserState {
  name: string
  username?: string
  fullName?: string
  avatarPath?: string
  email?: string
  phoneNumber?: string
  role: string | number
  branch: number
  userId: string // Giai đoạn 3A — Cần cho ABAC: so sánh với ClassRoom.LeaderId
  permissions: string[]
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Bản vá: Ép thời gian sống 7 ngày để không mất phiên khi đóng trình duyệt
    const token = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
    const user = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
    return {
      token: token.value || null,
      user: user.value || null
    }
  },
  actions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAuth(data: any) {
      const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })

      // Bóc tách userId từ JWT Token nếu Backend trả về trong response
      // (AuthController login trả về field "userId" sau khi thêm Claim vào JWT)
      const parsedUser: UserState = {
        name: data.fullName || data.name || data.username || '',
        username: data.username || '',
        fullName: data.fullName || data.name || '',
        avatarPath: data.avatarPath || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        role: isNaN(Number(data.role)) ? data.role : Number(data.role),
        branch: data.branch !== null && data.branch !== undefined ? Number(data.branch) : 0,
        userId: data.userId || '', // Giai đoạn 5D — Lưu userId để dùng cho ABAC check phía FE
        permissions: data.permissions || []
      }

      tokenCookie.value = data.token
      userCookie.value = parsedUser

      this.token = data.token
      this.user = parsedUser
    },
    logout() {
      const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })

      tokenCookie.value = null
      userCookie.value = null

      this.token = null
      this.user = null
      navigateTo('/login')
    },
    updateProfile(data: Partial<UserState>) {
      if (!this.user) return
      this.user = { ...this.user, ...data }
      const userCookie = useCookie<UserState | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
      userCookie.value = this.user
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    isAdmin: state => state.user?.role === 1 || state.user?.role === 'Admin',
    isSecretary: state => state.user?.role === 2 || state.user?.role === 'Secretary',
    isMod: state => state.user?.role === 3 || state.user?.role === 'Moderator',
    hasPermission: state => (code: string) => state.user?.role === 1 || state.user?.role === 'Admin' || (state.user?.permissions?.includes(code) ?? false),
    // Getter mới: Kiểm tra xem user hiện tại có phải là GLV của lớp này không
    // Dùng trên UI để ẩn/hiện nút "Sửa điểm" mà không cần gọi API
    isLeaderOf: state => (leaderId: string | null | undefined) => {
      if (!leaderId || !state.user?.userId) return false
      return state.user.userId === leaderId
    }
  }
})
