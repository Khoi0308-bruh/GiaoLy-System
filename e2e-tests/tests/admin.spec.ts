import { test, expect, type Page } from '@playwright/test'

/**
 * Smoke test cho web-admin, chạy được cả trên máy dev lẫn CI (job e2e):
 *  - CI dựng DB trống, seeder tạo tài khoản admin với mật khẩu tạm và bật
 *    mustChangePassword → lần đăng nhập đầu bị đẩy sang /doi-mat-khau-lan-dau.
 *  - Lần chạy thứ hai (hoặc máy dev đã đổi mật khẩu) thì dùng mật khẩu mới.
 * Vì vậy hàm đăng nhập thử lần lượt E2E_PASSWORD rồi E2E_NEW_PASSWORD.
 */

const USERNAME = process.env.E2E_USERNAME ?? 'admin'
const NEW_PASSWORD = process.env.E2E_NEW_PASSWORD ?? 'GiaoLy@CI2026New!'
const PASSWORDS = [process.env.E2E_PASSWORD, NEW_PASSWORD].filter((p): p is string => !!p)

const MAIN_PAGES: Array<[string, RegExp]> = [
  ['/admin/doan-sinh', /đoàn sinh/i],
  ['/admin/lop', /lớp/i],
  ['/admin/nien-khoa', /niên khóa/i],
]

async function dangNhapVoi(page: Page, password: string) {
  await page.goto('/dang-nhap')
  const usernameInput = page.locator('input[autocomplete="username"]')
  await expect(usernameInput).toBeVisible({ timeout: 20_000 })
  await usernameInput.fill(USERNAME)
  await page.locator('input[autocomplete="current-password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  // Thành công thì đổi URL; sai mật khẩu thì hiện banner lỗi — dừng ngay khi
  // một trong hai xảy ra thay vì chờ hết timeout.
  const ketQua = await Promise.race([
    page.waitForURL(/\/(admin|doi-mat-khau-lan-dau)/, { timeout: 20_000 }).then(() => 'vao' as const).catch(() => 'khong' as const),
    page
      .getByText(/chưa đúng|không chính xác/i)
      .first()
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => 'sai-mat-khau' as const)
      .catch(() => 'khong' as const),
  ])
  return ketQua === 'vao'
}

async function dangNhap(page: Page) {
  for (const password of PASSWORDS) {
    if (await dangNhapVoi(page, password)) return password
  }
  throw new Error('Không đăng nhập được bằng E2E_PASSWORD hoặc E2E_NEW_PASSWORD')
}

async function doiMatKhauLanDau(page: Page, currentPassword: string) {
  await page.locator('input[autocomplete="current-password"]').fill(currentPassword)
  const newPasswordInputs = page.locator('input[autocomplete="new-password"]')
  await newPasswordInputs.nth(0).fill(NEW_PASSWORD)
  await newPasswordInputs.nth(1).fill(NEW_PASSWORD)
  await page.locator('button[type="submit"]').click()
  // Đổi mật khẩu thu hồi phiên nên app đưa về trang đăng nhập.
  await page.waitForURL(/dang-nhap/, { timeout: 30_000 })
}

test.describe('web-admin - smoke', () => {
  // Lần chạy đầu phải qua luồng đổi mật khẩu + vài lần điều hướng, dev server
  // biên dịch lần đầu có thể chậm hơn 30s mặc định của Playwright.
  test.describe.configure({ timeout: 120_000 })

  test('đăng nhập và mở được các trang chính', async ({ page }) => {
    const passwordDaDung = await dangNhap(page)

    if (page.url().includes('doi-mat-khau-lan-dau')) {
      await doiMatKhauLanDau(page, passwordDaDung)
      const dangNhapLai = await dangNhapVoi(page, NEW_PASSWORD)
      expect(dangNhapLai, 'Đăng nhập lại bằng mật khẩu mới sau khi đổi phải thành công').toBe(true)
    }

    await expect(page).toHaveURL(/\/admin/, { timeout: 30_000 })
    await expect(page.locator('h1').first()).toBeVisible()

    for (const [path, heading] of MAIN_PAGES) {
      await page.goto(path)
      await expect(page.locator('h1').first()).toContainText(heading, { timeout: 20_000 })
      // Không lọt banner lỗi/quyền; dùng toBeHidden để bỏ qua toast đã ẩn của lần trước.
      await expect(page.getByText(/không có quyền truy cập|đã xảy ra lỗi/i).first()).toBeHidden()
    }
  })
})
