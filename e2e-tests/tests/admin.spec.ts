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
  return page
    .waitForURL(/\/(admin|doi-mat-khau-lan-dau)/, { timeout: 20_000 })
    .then(() => true)
    .catch(() => false)
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
  test('đăng nhập và mở được các trang chính', async ({ page }) => {
    const passwordDaDung = await dangNhap(page)

    if (page.url().includes('doi-mat-khau-lan-dau')) {
      await doiMatKhauLanDau(page, passwordDaDung)
      await expect(await dangNhapVoi(page, NEW_PASSWORD)).toBe(true)
    }

    await expect(page).toHaveURL(/\/admin/, { timeout: 30_000 })
    await expect(page.locator('h1').first()).toBeVisible()

    for (const [path, heading] of MAIN_PAGES) {
      await page.goto(path)
      await expect(page.locator('h1').first()).toHaveText(heading, { timeout: 20_000 })
      await expect(page.getByText(/không có quyền truy cập|đã xảy ra lỗi/i)).toHaveCount(0)
    }
  })
})
