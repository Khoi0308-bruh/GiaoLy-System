import type { Page } from '@playwright/test'

/**
 * Lỗi của chính cú điều hướng khi dev server còn biên dịch nguội route.
 *
 * Không phải lỗi nội dung trang: `page.goto` hết giờ (mặc định 30s) hoặc bị huỷ vì
 * Nuxt/ Vite đang biên dịch, hoặc context cũ bị huỷ do lượt điều hướng trước.
 */
export function laLoiBienDichNguoi(loi: unknown): boolean {
  if (!(loi instanceof Error)) return false
  return /page\.goto: (Timeout|net::ERR_ABORTED)|Navigation .*interrupted|Execution context was destroyed/i
    .test(loi.message)
}

/**
 * Mở `path`, chịu được lượt truy cập nguội của dev server.
 *
 * Chỉ vòng lặp quanh `page.goto` và chỉ thử lại khi `laLoiBienDichNguoi` đúng — nếu
 * trang mở được mà nội dung sai (503/404/heading) thì lỗi văng thẳng ra cho khẳng
 * định bên ngoài, không bị lượt thử lại che mất.
 */
export async function moTrangChiuNguoi(page: Page, path: string, timeout = 120_000) {
  const han = Date.now() + timeout

  for (let lan = 1; ; lan++) {
    try {
      await page.goto(path)
      return
    } catch (loi) {
      if (!laLoiBienDichNguoi(loi) || Date.now() >= han) throw loi
      // Biên dịch nguội có thể lâu hơn 30s của page.goto; lượt sau dùng bản đã biên dịch.
      console.log(`[e2e] ${path} chưa mở được (lượt ${lan}): ${(loi as Error).message.split('\n')[0]}`)
      await page.waitForTimeout(1_000)
    }
  }
}
