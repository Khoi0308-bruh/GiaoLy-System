import { defineConfig, devices } from '@playwright/test'

/**
 * Bộ e2e cho web-admin (mặc định :3000) và web-portal (:3001).
 *
 * - Project `setup` đăng nhập một lần và xử lý luồng đổi mật khẩu lần đầu, để các
 *   project sau chỉ còn phải đăng nhập bằng mật khẩu đã biết.
 * - Project `admin` chạy các luồng quản trị trên web-admin (gồm nhập Excel).
 * - Project `permission` đăng nhập bằng một vai trò hạn chế và kiểm tra bị chặn.
 * - Project `portal` chạy trên web-portal, các trang công khai.
 */
const ADMIN_BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const PORTAL_BASE = process.env.E2E_PORTAL_BASE_URL ?? 'http://localhost:3001'

export default defineConfig({
  testDir: './tests',
  // Các test dùng chung một tài khoản, cùng database và đều gọi /auth/login:
  // API giới hạn 10 lần đăng nhập/phút mỗi IP, nên chạy tuần tự để không tự bắn
  // vào giới hạn đó và không tạo hai lượt đăng nhập đồng thời cho cùng tài khoản.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_BASE }
    },
    {
      name: 'admin',
      testMatch: /(admin|banner|gradebook|nhap-excel|error-pages)\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_BASE }
    },
    {
      name: 'permission',
      testMatch: /permission\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: ADMIN_BASE }
    },
    {
      name: 'auth',
      testMatch: /auth-concurrent\.spec\.ts/,
      dependencies: ['setup'],
      use: { baseURL: ADMIN_BASE }
    },
    {
      name: 'portal',
      testMatch: /(portal|error-pages-portal)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: PORTAL_BASE }
    }
  ]
})
