import { test, expect, type Page } from '@playwright/test'

/**
 * Chờ Nuxt mount xong (SSR chỉ trả HTML tĩnh, submit form trước khi hydrate sẽ
 * thành GET native thay vì gọi handler của Vue).
 */
async function choHydration(page: Page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('#__nuxt') as (HTMLElement & { __vue_app__?: unknown }) | null
    return Boolean(el && el.__vue_app__)
  }, undefined, { timeout: 30_000 })
}

/** Các trang công khai của web-portal: tiêu đề phải render được. */
const TRANG_CONG_KHAI: Array<[string, RegExp]> = [
  ['/news', /Tin Tức Công Giáo/],
  ['/library', /Thư Viện Tài Liệu/],
  ['/liturgical', /Lịch Phụng Vụ/],
  ['/leadership', /Sơ Đồ Tổ Chức/]
]

test.describe('web-portal', () => {
  test.describe.configure({ timeout: 120_000 })

  test('trang chủ hiển thị khối tra cứu học vụ', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Tra Cứu Điểm & Hồ Sơ Nhanh' })
    ).toBeVisible({ timeout: 30_000 })
  })

  test('mở được các trang công khai chính', async ({ page }) => {
    for (const [path, heading] of TRANG_CONG_KHAI) {
      await page.goto(path)
      await expect(page.locator('h1').first()).toContainText(heading, { timeout: 30_000 })
    }
  })

  test('tra cứu công khai báo không tìm thấy và nhắc nhập ngày sinh', async ({ page }) => {
    await page.goto('/verify')
    await expect(page.locator('h1').first()).toContainText('Tra Cứu Điểm Giáo Lý')
    await choHydration(page)

    const oTimKiem = page.getByPlaceholder('Mã đoàn sinh (VD: TN260001) hoặc họ tên đầy đủ...')
    const nutTimKiem = page.getByRole('button', { name: 'Tìm kiếm' })

    // Mã đúng định dạng nhưng chắc chắn không tồn tại. Nếu cú bấm rơi đúng lúc
    // trang chưa gắn handler (submit native thành GET) thì nạp lại và thử lại.
    const thongBaoKhongThay = page.getByText('Không tìm thấy hồ sơ đoàn sinh phù hợp.')
    await expect(async () => {
      if (page.url().includes('?')) await page.goto('/verify')
      await oTimKiem.fill('TN999999')
      await nutTimKiem.click()
      await expect(thongBaoKhongThay).toBeVisible({ timeout: 10_000 })
    }).toPass({ timeout: 60_000 })

    // Tra theo họ tên bắt buộc có ngày sinh.
    await oTimKiem.fill('Nguyễn Văn Không Tồn Tại')
    await nutTimKiem.click()
    await expect(
      page.getByText('Vui lòng nhập ngày sinh khi tra cứu theo họ tên.')
    ).toBeVisible({ timeout: 30_000 })
  })
})
