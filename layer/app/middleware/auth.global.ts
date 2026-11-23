import type { PermissionCode } from '../shared/permissions'

export default defineNuxtRouteMiddleware(async (to) => {
  const session = useSessionStore()
  if (!session.ready) await session.bootstrap()

  // Nếu đã đăng nhập mà truy cập trang đăng nhập -> chuyển thẳng vào /admin
  if (session.me && to.path === '/dang-nhap') {
    return navigateTo(session.homePath)
  }

  // Nếu không cần đổi mật khẩu mà vào /doi-mat-khau-lan-dau -> chuyển vào /admin
  if (session.me && !session.me.mustChangePassword && to.path === '/doi-mat-khau-lan-dau') {
    return navigateTo(session.homePath)
  }

  // Route không khớp trang nào: để Nuxt tự trả 404 (kèm mã trạng thái 404)
  // thay vì kéo người dùng về trang đăng nhập như một trang bảo vệ.
  if (to.matched.length === 0) return

  if (to.meta.public) return

  if (!session.me) {
    // Refresh token còn nhưng server chưa trả được hồ sơ (429/5xx/mạng): đây là sự
    // cố tạm thời chứ không phải "chưa đăng nhập", nên đừng đá người dùng về trang
    // đăng nhập rồi bắt họ nhập lại mật khẩu.
    if (session.unavailable) {
      throw createError({
        statusCode: 503,
        message: 'Không kết nối được máy chủ. Vui lòng thử lại sau ít phút.'
      })
    }
    return navigateTo({ path: '/dang-nhap', query: { quay_lai: to.fullPath } })
  }

  if (session.me.mustChangePassword && to.path !== '/doi-mat-khau-lan-dau') {
    return navigateTo('/doi-mat-khau-lan-dau')
  }

  const needed = to.meta.permission as PermissionCode | undefined
  if (needed && !session.can(needed)) {
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Bạn chưa có quyền truy cập trang này' }))
  }
})
