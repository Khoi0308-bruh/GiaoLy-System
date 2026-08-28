export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Các trang công khai không cần đăng nhập
  const isPublicRoute
    = to.path === '/login'
      || to.path === '/'
      || to.path === '/public-leadership'
      || to.path === '/announcements'
      || to.path === '/library'
      || to.path === '/verify'
      || to.path.startsWith('/verify/')

  if (!authStore.isLoggedIn && !isPublicRoute) {
    return navigateTo('/login')
  }

  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/admin/dashboard')
  }

  if (to.path.startsWith('/admin')) {
    const role = authStore.user?.role
    // Nếu không có role (hoặc lỗi), đá ra login
    if (!role) return navigateTo('/login')

    // Role 1 (Admin) được truy cập mọi nơi
    if (authStore.isAdmin) return

    // Các Route yêu cầu quyền cụ thể (RBAC)
    if (to.path.startsWith('/admin/users') && !authStore.hasPermission('users.view')) {
      return abortNavigation('Bạn không có quyền truy cập quản lý người dùng')
    }
    
    if (to.path.startsWith('/admin/roles') && !authStore.hasPermission('roles.view')) {
      return abortNavigation('Bạn không có quyền truy cập phân quyền hệ thống')
    }

    // (Tuỳ chọn) Nếu là Role 4 (GLV), có thể chặn thêm các route quản lý tổng, chỉ cho vào Dashboard và Lớp của mình
    const glvRestrictedRoutes = ['/admin/leaders']
    if (role === 4 && glvRestrictedRoutes.some(r => to.path.startsWith(r))) {
      return abortNavigation('Giáo lý viên không có quyền truy cập khu vực này')
    }
  }
})
