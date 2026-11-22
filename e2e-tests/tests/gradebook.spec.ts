import { test, expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'
import { taoLopCoGhiDanh, dangNhapApi } from './support/api'
import { API_BASE, dangNhap } from './support/auth'

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

  async function diemMiengDaLuu(request: APIRequestContext, token: string, roomId: string) {
    const res = await request.get(`${API_BASE}/api/v1/classrooms/${roomId}/grades`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const body = (await res.json()) as { grades: Array<{ oral: number | null }> }
    return body.grades[0]?.oral ?? null
  }

  test('nhập điểm và lưu vào sổ điểm lớp', async ({ request }) => {
    const token = await dangNhapApi(request)
    const { roomId, studentName } = await taoLopCoGhiDanh(request, token)

    await page.goto(`/admin/lop/${roomId}/diem-so`)
    await expect(page.locator('h1').first()).toContainText('Sổ điểm lớp', { timeout: 30_000 })

    const oDiemMieng = page.getByLabel(`Miệng của ${studentName}`)
    await expect(oDiemMieng).toBeEnabled({ timeout: 30_000 })
    await oDiemMieng.fill('8.5')

    // Toast thành công tự ẩn khá nhanh nên xác nhận bằng dữ liệu server: bấm Lưu
    // (bấm lại nếu cú bấm đầu rơi vào lúc nút còn xử lý) rồi đợi API trả về 8.5.
    const nutLuu = page.getByRole('button', { name: 'Lưu sổ điểm' })
    await expect(async () => {
      if ((await diemMiengDaLuu(request, token, roomId)) !== 8.5) await nutLuu.click()
      expect(await diemMiengDaLuu(request, token, roomId)).toBe(8.5)
    }).toPass({ timeout: 45_000 })

    // Tải lại để chắc giao diện đọc lại điểm từ server chứ không chỉ giữ trong form.
    await page.reload()
    await expect(page.getByLabel(`Miệng của ${studentName}`)).toHaveValue('8.5', { timeout: 30_000 })
  })
})
