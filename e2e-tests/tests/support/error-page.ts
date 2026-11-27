import { expect, type Page } from '@playwright/test'
import { moTrangChiuNguoi } from './navigation'

/**
 * Trang 503 dùng chung của hai app (`layer/app/error.vue`).
 *
 * Overlay lỗi của Nuxt dev cũng in mã 503/404 kèm đoạn source, nên locator phải
 * scope vào vùng do app render (`#__nuxt`) để test chạy được ở cả dev lẫn bản build.
 */
export const trangLoi = (page: Page) => page.locator('#__nuxt')

const API_PATTERN = '**/api/v1/**'

/** Cả hai app dựng khu vực cần đăng nhập ở client, nên chặn API = API sập. */
export async function chanApi(page: Page) {
  await page.route(API_PATTERN, route => route.abort())
}

/**
 * API sống lại. Page/context có thể đã đóng (test trước đỏ, hết giờ) — khi đó không còn
 * route để gỡ, và lỗi `page.unroute` chỉ che mất lỗi thật trong log, nên bỏ qua.
 */
export async function boChanApi(page: Page) {
  if (page.isClosed()) return
  await page.unroute(API_PATTERN).catch(() => undefined)
}

/** Đang hiện đúng trang 503, còn nút "Thử lại" và vẫn ở nguyên địa chỉ `path`. */
export async function choTrangLoi503(page: Page, path: string) {
  const loi = trangLoi(page)
  await expect(loi.getByRole('heading', { name: 'Máy chủ đang tạm gián đoạn' })).toBeVisible({
    timeout: 30_000
  })
  await expect(loi.getByText('503', { exact: true })).toBeVisible()
  await expect(loi.getByRole('button', { name: 'Thử lại' })).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`${path}$`))
}

/**
 * Mở `path` khi API đang sập và chờ trang 503.
 *
 * Phần điều hướng dùng `moTrangChiuNguoi` (chỉ thử lại khi dev server biên dịch nguội);
 * các khẳng định về trang 503 nằm NGOÀI vòng thử lại, nên trang 503 hỏng thật vẫn đỏ ngay
 * chứ không bị lượt thử lại che mất.
 */
export async function moTrangLoi503(page: Page, path: string, timeout = 120_000) {
  await moTrangChiuNguoi(page, path, timeout)
  await choTrangLoi503(page, path)
}
