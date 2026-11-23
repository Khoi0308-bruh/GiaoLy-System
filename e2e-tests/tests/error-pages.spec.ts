import { test, expect, type Page } from '@playwright/test'
import { dangNhap } from './support/auth'

/**
 * Trang lỗi tự viết (`layer/app/error.vue`) thay cho trang mặc định của Nuxt.
 *
 * Hai hồi quy cần khoá lại:
 *  - 429/5xx/mất mạng khi mở trang từng bị hiểu nhầm là "chưa đăng nhập" nên đá
 *    người dùng về /dang-nhap và bắt nhập lại mật khẩu; nay phải hiện 503 và giữ
 *    nguyên địa chỉ trang.
 *  - route không tồn tại phải là 404 thật, không bị kéo về trang đăng nhập.
 *
 * web-admin chạy `ssr: false` nên mọi lời gọi API đều phát từ trình duyệt: chặn
 * request ở đây tương đương với việc API sập dưới mắt người dùng.
 */
test.describe('web-admin - trang lỗi', () => {
  test.describe.configure({ timeout: 120_000, mode: 'serial' })

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

  // Overlay lỗi của Nuxt dev cũng in mã 503/404 kèm đoạn source, nên chỉ tìm trong
  // vùng do app render để test chạy được ở cả dev server lẫn bản production.
  const trangLoi = () => page.locator('#__nuxt')

  test('API không phản hồi thì hiện 503 và giữ nguyên trang, không đá về đăng nhập', async () => {
    const tieuDe503 = trangLoi().getByRole('heading', { name: 'Máy chủ đang tạm gián đoạn' })

    await page.route('**/api/v1/**', route => route.abort())
    try {
      await page.goto('/admin/lop')

      await expect(tieuDe503).toBeVisible({ timeout: 30_000 })
      await expect(trangLoi().getByText('503', { exact: true })).toBeVisible()
      await expect(page).toHaveURL(/\/admin\/lop$/)
      // Lời hứa với người dùng: còn phiên thì không phải đăng nhập lại.
      await expect(trangLoi().getByRole('button', { name: 'Thử lại' })).toBeVisible()

      // F5 vẫn là trang 503, không nhảy sang /dang-nhap.
      await page.reload()
      await expect(tieuDe503).toBeVisible({ timeout: 30_000 })
      await expect(page).toHaveURL(/\/admin\/lop$/)
    } finally {
      await page.unroute('**/api/v1/**')
    }
  })

  test('đường dẫn không tồn tại trả 404, không đá về đăng nhập', async () => {
    await page.goto('/admin/khong-ton-tai')

    await expect(trangLoi().getByRole('heading', { name: 'Không tìm thấy trang' })).toBeVisible({
      timeout: 30_000
    })
    await expect(trangLoi().getByText('404', { exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/khong-ton-tai$/)
  })
})
