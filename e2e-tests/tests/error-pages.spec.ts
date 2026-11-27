import { test, expect, type Page } from '@playwright/test'
import { dangNhap } from './support/auth'
import { boChanApi, chanApi, choTrangLoi503, moTrangLoi503, trangLoi } from './support/error-page'
import { moTrangChiuNguoi } from './support/navigation'

/**
 * Trang lỗi tự viết (`layer/app/error.vue`) thay cho trang mặc định của Nuxt.
 *
 * Hai hồi quy cần khoá lại:
 *  - 429/5xx/mất mạng khi mở trang từng bị hiểu nhầm là "chưa đăng nhập" nên đá
 *    người dùng về /dang-nhap và bắt nhập lại mật khẩu; nay phải hiện 503 và giữ
 *    nguyên địa chỉ trang.
 *  - route không tồn tại phải là 404 thật, không bị kéo về trang đăng nhập.
 */
test.describe('web-admin - trang lỗi', () => {
  // Đủ chỗ cho lần biên dịch nguội route (xem `moTrangLoi503`).
  test.describe.configure({ timeout: 180_000, mode: 'serial' })

  // Dùng chung một phiên: API chỉ cho 10 lần đăng nhập/phút mỗi IP.
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await dangNhap(page)
    await expect(page).toHaveURL(/\/admin/)
  })

  test.afterAll(async () => {
    await page.context().close()
  })

  test('API không phản hồi thì hiện 503 và giữ nguyên trang, không đá về đăng nhập', async () => {
    await chanApi(page)
    try {
      await moTrangLoi503(page, '/admin/lop')

      // F5 vẫn là trang 503, không nhảy sang /dang-nhap.
      await page.reload()
      await choTrangLoi503(page, '/admin/lop')
    } finally {
      await boChanApi(page)
    }
  })

  test('bấm "Thử lại" sau khi API sống lại thì vào đúng trang, vẫn còn phiên', async () => {
    await chanApi(page)
    await moTrangLoi503(page, '/admin/lop')

    // API sống lại: bỏ chặn rồi bấm "Thử lại" (nút tải lại, giữ nguyên địa chỉ).
    await boChanApi(page)
    await trangLoi(page).getByRole('button', { name: 'Thử lại' }).click()

    await expect(page.locator('h1').first()).toContainText('Danh sách Lớp học', {
      timeout: 30_000
    })
    await expect(page).toHaveURL(/\/admin\/lop$/)
  })

  test('đường dẫn không tồn tại trả 404, không đá về đăng nhập', async () => {
    await moTrangChiuNguoi(page, '/admin/khong-ton-tai')

    await expect(trangLoi(page).getByRole('heading', { name: 'Không tìm thấy trang' })).toBeVisible({
      timeout: 30_000
    })
    await expect(trangLoi(page).getByText('404', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/khong-ton-tai$/)
  })
})
