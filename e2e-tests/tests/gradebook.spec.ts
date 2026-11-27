import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { taoLopCoGhiDanh, dangNhapApi, donLopCoGhiDanh } from './support/api'
import { dangNhap } from './support/auth'

/**
 * Nhập điểm qua UI trên một lớp do test tự dựng (API fixtures) nên chạy được cả
 * trên database trống của CI.
 */
test.describe('web-admin - sổ điểm', () => {
  test.describe.configure({ timeout: 150_000, mode: 'serial' })

  let context: BrowserContext
  let page: Page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
    await dangNhap(page)
    await expect(page).toHaveURL(/\/admin/)
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('nhập điểm và lưu vào sổ điểm lớp', async ({ request }) => {
    const token = await dangNhapApi(request)
    const lop = await taoLopCoGhiDanh(request, token)

    try {
      await page.goto(`/admin/lop/${lop.roomId}/diem-so`)
      await expect(page.locator('h1').first()).toContainText('Sổ điểm lớp', { timeout: 30_000 })

      const oDiemMieng = page.getByLabel(`Miệng của ${lop.studentName}`)
      await expect(oDiemMieng).toBeEnabled({ timeout: 30_000 })
      await oDiemMieng.fill('8.5')

      // Chờ đúng phản hồi của lần lưu thay vì hỏi lại API theo vòng lặp: API giới hạn
      // 120 request/phút mỗi IP, hỏi dồn dập sẽ tự bắn vào hạn mức đó (429) và làm
      // trang sổ điểm không tải được.
      const phanHoiLuu = page.waitForResponse(
        r => r.request().method() === 'PUT' && r.url().endsWith(`/classrooms/${lop.roomId}/grades`),
        { timeout: 60_000 }
      )
      await page.getByRole('button', { name: 'Lưu sổ điểm' }).click()
      expect((await phanHoiLuu).status(), 'API lưu sổ điểm phải trả về 200').toBe(200)

      // Tải lại để chắc giao diện đọc lại điểm từ server chứ không chỉ giữ trong form.
      await page.reload()
      await expect(page.getByLabel(`Miệng của ${lop.studentName}`)).toHaveValue('8.5', { timeout: 60_000 })
    } finally {
      await donLopCoGhiDanh(request, token, lop)
    }
  })
})
