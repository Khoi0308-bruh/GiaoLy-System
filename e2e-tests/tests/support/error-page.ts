import { expect, type Page } from '@playwright/test'

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

/** API sống lại. */
export async function boChanApi(page: Page) {
  await page.unroute(API_PATTERN)
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

/** Mở `path` khi API đang sập và chờ trang 503. */
export async function moTrangLoi503(page: Page, path: string) {
  await page.goto(path)
  await choTrangLoi503(page, path)
}
