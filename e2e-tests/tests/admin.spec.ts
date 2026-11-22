import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { dangNhap } from './support/auth'

/** Các trang quản trị chính: tiêu đề phải đúng, không lọt banner lỗi/quyền. */
const TRANG_CHINH: Array<[string, RegExp]> = [
  ['/admin', /Bảng điều khiển Trung tâm/],
  ['/admin/doan-sinh', /Danh sách đoàn sinh/],
  ['/admin/lop', /Danh sách Lớp học/],
  ['/admin/nien-khoa', /Niên khóa/],
  ['/admin/vai-tro', /Vai trò & Ma trận Phân quyền/],
  ['/admin/nguoi-dung', /Quản trị Người dùng & Tài khoản/]
]

async function khongCoLoiTrenTrang(page: Page) {
  await expect(page.getByText(/không có quyền truy cập|đã xảy ra lỗi/i).first()).toBeHidden()
}

test.describe('web-admin', () => {
  // Dev server biên dịch lần đầu có thể chậm hơn 30s mặc định của Playwright.
  test.describe.configure({ timeout: 120_000, mode: 'serial' })

  // Dùng chung một phiên cho cả file: API chỉ cho 10 lần đăng nhập/phút mỗi IP.
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

  test('mở được các trang quản trị chính', async () => {
    for (const [path, heading] of TRANG_CHINH) {
      await page.goto(path)
      await expect(page.locator('h1').first()).toContainText(heading, { timeout: 30_000 })
      await khongCoLoiTrenTrang(page)
    }
  })

  test('xem danh sách đoàn sinh', async () => {
    await page.goto('/admin/doan-sinh')
    await expect(page.locator('h1').first()).toContainText('Danh sách đoàn sinh')
    await khongCoLoiTrenTrang(page)

    // Database trống thì phải hiện trạng thái rỗng, có dữ liệu thì phải có dòng.
    const trangThaiRong = page.getByText('Không tìm thấy đoàn sinh nào')
    await expect(async () => {
      const coTrangThaiRong = await trangThaiRong.first().isVisible().catch(() => false)
      expect(coTrangThaiRong || !/Đang tải danh sách đoàn sinh/.test(await page.locator('body').innerText())).toBe(true)
    }).toPass({ timeout: 30_000 })
    await expect(page.locator('table')).toBeVisible()
  })

  test('tạo đoàn sinh mới', async () => {
    const ten = `E2E Tạo Mới ${Date.now().toString().slice(-6)}`

    await page.goto('/admin/doan-sinh/them')
    await expect(page.locator('h1').first()).toContainText('Thêm đoàn sinh mới')

    await page.getByPlaceholder('Nhập họ và tên khai sinh...').fill(ten)
    await page.locator('input[type="date"]').first().fill('2015-04-12')

    // Nút bị khóa trong lúc kiểm tra trùng lặp, nên bấm lại nếu chỉ mất một nhịp.
    const nutLuu = page.getByRole('button', { name: 'Lưu hồ sơ đoàn sinh' })
    await expect(async () => {
      if (/\/admin\/doan-sinh\/them$/.test(page.url())) await nutLuu.click()
      // Tạo xong app chuyển sang trang hồ sơ chi tiết của đoàn sinh vừa tạo.
      await expect(page).toHaveURL(/\/admin\/doan-sinh\/[0-9a-f-]{36}/, { timeout: 10_000 })
    }).toPass({ timeout: 60_000 })

    await expect(page.locator('h1').first()).toContainText(ten, { timeout: 30_000 })
    await expect(page.getByText(/Mã đoàn sinh: TN\d+/).first()).toBeVisible()
  })
})
