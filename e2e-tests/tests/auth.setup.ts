import { test as setup, expect } from '@playwright/test'
import { NEW_PASSWORD, dangNhap, dangNhapBang, doiMatKhauLanDau, USERNAME } from './support/auth'

/**
 * Đăng nhập một lần trước các project khác:
 *  - lần chạy đầu trên database trống phải đổi mật khẩu tạm rồi đăng nhập lại;
 *  - các lần chạy sau chỉ cần đăng nhập bằng mật khẩu đã đổi.
 *
 * Không lưu storageState: refresh token được xoay sau mỗi lần làm mới phiên nên
 * cookie lưu lại sẽ bị thu hồi ngay khi test khác dùng nó. Mỗi test tự đăng nhập
 * lại (chưa tới 5s nhờ dev server đã biên dịch sẵn).
 */
setup('đăng nhập và đổi mật khẩu lần đầu nếu cần', async ({ page }) => {
  setup.setTimeout(180_000)

  const passwordDaDung = await dangNhap(page)

  if (page.url().includes('doi-mat-khau-lan-dau')) {
    await doiMatKhauLanDau(page, passwordDaDung)
    const dangNhapLai = await dangNhapBang(page, USERNAME, NEW_PASSWORD)
    expect(dangNhapLai, 'Đăng nhập lại bằng mật khẩu mới sau khi đổi phải thành công').toBe('vao')
  }

  await expect(page).toHaveURL(/\/admin/, { timeout: 30_000 })
  await expect(page.locator('h1').first()).toContainText('Bảng điều khiển Trung tâm')
})
