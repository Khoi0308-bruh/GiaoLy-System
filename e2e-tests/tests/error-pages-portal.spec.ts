import { test } from '@playwright/test'
import { boChanApi, chanApi, moTrangLoi503 } from './support/error-page'

/**
 * Trang 503 của web-portal — dùng chung `error.vue` và bộ kiểm tra với web-admin.
 *
 * Hồi quy cần khoá: lỗi tạm thời khi đọc phiên từng bị hiểu nhầm là "chưa đăng
 * nhập", đá phụ huynh về /dang-nhap; nay phải hiện 503 và giữ nguyên địa chỉ.
 * Test không cần đăng nhập: lỗi mạng ở bước đọc phiên đã thuộc loại tạm thời.
 */
test.describe('web-portal - trang lỗi', () => {
  // Đủ chỗ cho lần biên dịch nguội route `/phu-huynh` (xem `moTrangLoi503`).
  test.describe.configure({ timeout: 240_000 })

  test('API không phản hồi thì hiện 503, không đá về trang đăng nhập', async ({ page }) => {
    await chanApi(page)
    try {
      await moTrangLoi503(page, '/phu-huynh')
    } finally {
      await boChanApi(page)
    }
  })
})
