import fs from 'node:fs'
import { expect, type Page } from '@playwright/test'
import { moTrangChiuNguoi } from './navigation'

/**
 * Thông tin đăng nhập lấy từ biến môi trường, không hard-code trong mã.
 *
 * CI dựng database trống nên seeder tạo tài khoản admin với mật khẩu tạm và bật
 * mustChangePassword → lần đăng nhập đầu bị đẩy sang /doi-mat-khau-lan-dau; sau khi
 * đổi thì chỉ mật khẩu mới còn hiệu lực. Project `setup` chạy trước và ghi lại
 * mật khẩu đang dùng vào playwright/.auth/password.txt (đã gitignore) để các
 * project khác không phải thử sai — API giới hạn 10 lần đăng nhập/phút mỗi IP.
 */
export const USERNAME = process.env.E2E_USERNAME ?? 'admin'
export const NEW_PASSWORD = process.env.E2E_NEW_PASSWORD ?? 'GiaoLy@CI2026New!'
export const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:5000'

const CACHE_FILE = 'playwright/.auth/password.txt'

function docMatKhauDaLuu(): string | null {
  try {
    const value = fs.readFileSync(CACHE_FILE, 'utf8').trim()
    return value || null
  } catch {
    return null
  }
}

/** Mật khẩu đã dùng được (nếu có) rồi tới các biến môi trường, không trùng lặp. */
export function cacMatKhaUThu(): string[] {
  const danhSach: string[] = []
  for (const value of [docMatKhauDaLuu(), process.env.E2E_PASSWORD, NEW_PASSWORD]) {
    if (value && !danhSach.includes(value)) danhSach.push(value)
  }
  return danhSach
}

export function luuMatKhauDaDung(password: string) {
  fs.mkdirSync('playwright/.auth', { recursive: true })
  fs.writeFileSync(CACHE_FILE, password)
}

export type KetQuaDangNhap = 'vao' | 'sai-mat-khau' | 'bi-gioi-han' | 'khong-phan-hoi'

const cho = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Điền form đăng nhập; trả về ngay khi vào được app hoặc khi thấy banner sai mật khẩu. */
export async function dangNhapBang(
  page: Page,
  username: string,
  password: string
): Promise<KetQuaDangNhap> {
  // Lượt điều hướng đầu tiên của cả lượt chạy nên phải chịu được biên dịch nguội.
  await moTrangChiuNguoi(page, '/dang-nhap')
  const usernameInput = page.locator('input[autocomplete="username"]')
  // Dev server (và CI) biên dịch lần đầu nên trang có thể trắng vài chục giây.
  await expect(usernameInput).toBeVisible({ timeout: 60_000 })
  await usernameInput.fill(username)
  await page.locator('input[autocomplete="current-password"]').fill(password)
  await page.locator('button[type="submit"]').click()

  return Promise.race([
    page
      .waitForURL(/\/(admin|doi-mat-khau-lan-dau)/, { timeout: 20_000 })
      .then(() => 'vao' as const)
      .catch(() => 'khong-phan-hoi' as const),
    page
      .getByText(/chưa đúng|không chính xác/i)
      .first()
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => 'sai-mat-khau' as const)
      .catch(() => 'khong-phan-hoi' as const),
    // API giới hạn 10 lần đăng nhập/phút mỗi IP: báo rõ để helper chờ rồi thử lại.
    // Câu hiển thị lấy từ ErrorCodes.RATE_LIMITED ở backend.
    page
      .getByText(/quá nhiều yêu cầu|thao tác quá nhanh/i)
      .first()
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => 'bi-gioi-han' as const)
      .catch(() => 'khong-phan-hoi' as const)
  ])
}

/** Đăng nhập bằng tài khoản quản trị; ghi lại mật khẩu thắng để lần sau khỏi thử lại. */
export async function dangNhap(page: Page, username = USERNAME): Promise<string> {
  for (const password of cacMatKhaUThu()) {
    for (let lan = 0; lan < 4; lan++) {
      const ketQua = await dangNhapBang(page, username, password)
      if (ketQua === 'vao') {
        if (username === USERNAME) luuMatKhauDaDung(password)
        return password
      }
      if (ketQua !== 'bi-gioi-han') break
      await cho(20_000)
    }
  }
  throw new Error('Không đăng nhập được bằng E2E_PASSWORD hoặc E2E_NEW_PASSWORD')
}

/** Đổi mật khẩu ở trang bắt buộc đổi lần đầu (thu hồi phiên → quay về trang đăng nhập). */
export async function doiMatKhauLanDau(page: Page, currentPassword: string, newPassword = NEW_PASSWORD) {
  await page.locator('input[autocomplete="current-password"]').fill(currentPassword)
  const newPasswordInputs = page.locator('input[autocomplete="new-password"]')
  await newPasswordInputs.nth(0).fill(newPassword)
  await newPasswordInputs.nth(1).fill(newPassword)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/dang-nhap/, { timeout: 30_000 })
}
