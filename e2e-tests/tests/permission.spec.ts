import { test, expect } from '@playwright/test'
import { dangNhapApi, donTaiKhoanHanChe, taoTaiKhoanHanChe } from './support/api'
import { dangNhapBang, doiMatKhauLanDau } from './support/auth'
import { moTrangChiuNguoi } from './support/navigation'

/**
 * Phân quyền ở tầng trang: vai trò không có quyền `roles.view` mở /admin/vai-tro
 * phải bị chặn (403), không được nhìn thấy nội dung trang.
 *
 * Test tự tạo một tài khoản vai trò "Thư ký và thủ quỹ" qua API (mật khẩu tạm do
 * hệ thống sinh ra, buộc đổi ở lần đăng nhập đầu) nên không phụ thuộc dữ liệu mẫu.
 */
const MAT_KHAU_MOI = 'E2eHanChe@2026!'

test.describe('web-admin - phân quyền', () => {
  test.describe.configure({ timeout: 180_000 })

  test('vai trò hạn chế bị chặn khỏi trang quản trị vai trò', async ({ page, request }) => {
    const token = await dangNhapApi(request)
    const taiKhoan = await taoTaiKhoanHanChe(request, token)

    try {
      // Lần đăng nhập đầu buộc đổi mật khẩu tạm.
      const vaoLanDau = await dangNhapBang(page, taiKhoan.username, taiKhoan.tempPassword)
      expect(vaoLanDau, 'Tài khoản vừa tạo phải đăng nhập được bằng mật khẩu tạm').toBe('vao')
      await expect(page).toHaveURL(/doi-mat-khau-lan-dau/, { timeout: 30_000 })
      await doiMatKhauLanDau(page, taiKhoan.tempPassword, MAT_KHAU_MOI)

      const vaoLai = await dangNhapBang(page, taiKhoan.username, MAT_KHAU_MOI)
      expect(vaoLai, 'Đăng nhập lại bằng mật khẩu mới phải thành công').toBe('vao')

      await moTrangChiuNguoi(page, '/admin/vai-tro')
      await expect(page.getByText(/chưa có quyền truy cập/i).first()).toBeVisible({ timeout: 30_000 })
      await expect(page.locator('h1').first()).not.toContainText('Vai trò & Ma trận Phân quyền')
    } finally {
      await donTaiKhoanHanChe(request, token, taiKhoan)
    }
  })
})
