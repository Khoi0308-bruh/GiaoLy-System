# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin Workspace - Core Automated Tests >> DB_UI_01: Verify Dashboard UI components
- Location: tests\admin.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text="Tổng quan kinh doanh"')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text="Tổng quan kinh doanh"')

```

```yaml
- img
- heading "Chào mừng trở lại" [level=2]
- paragraph: Vui lòng đăng nhập vào hệ thống!
- img
- textbox "Tên đăng nhập hoặc Email"
- img
- textbox "Mật khẩu"
- checkbox "Ghi nhớ đăng nhập"
- text: Ghi nhớ đăng nhập Quên mật khẩu?
- button "Đăng nhập hệ thống"
- text: Hoặc tiếp tục với
- button "Google":
  - img
  - text: Google
- iframe
- button "Facebook":
  - img
  - text: Facebook
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Workspace - Core Automated Tests', () => {
  4  |   // Test case: Đăng nhập
  5  |   test('Login_01: Should login successfully as superadmin', async ({ page }) => {
  6  |     await page.goto('/login');
  7  |     
  8  |     // Giả lập nhập thông tin dựa trên thông tin đã cấp
  9  |     // Chú ý: Ở đây ta dùng placeholder nếu chưa có form login thật trên URL (vì trình duyệt báo bị chặn)
  10 |     // Thực tế sẽ tìm bằng locator của input
  11 |     const emailInput = page.getByPlaceholder(/email/i).or(page.locator('input[type="email"]'));
  12 |     const passwordInput = page.getByPlaceholder(/password/i).or(page.locator('input[type="password"]'));
  13 |     const loginBtn = page.getByRole('button', { name: /đăng nhập/i }).or(page.locator('button[type="submit"]'));
  14 | 
  15 |     if (await emailInput.count() > 0) {
  16 |       await emailInput.fill('nguyentrinhanhkhoi0308@gmail.com');
  17 |       await passwordInput.fill('AnhEmMotor1@');
  18 |       await loginBtn.click();
  19 |     }
  20 |     
  21 |     // Chờ chuyển hướng đến trang chọn workspace
  22 |     await expect(page).toHaveURL(/workspace|dashboard/i, { timeout: 10000 });
  23 |   });
  24 | 
  25 |   // Test case: Bảng Tổng Quan
  26 |   test('DB_UI_01: Verify Dashboard UI components', async ({ page }) => {
  27 |     await page.goto('/workspace');
  28 |     
  29 |     // Click vào phân hệ Admin nếu có
  30 |     const adminWorkspaceBtn = page.locator('text="Ban Điều Hành & Chủ Showroom"').or(page.locator('text="EXECUTIVE OVERVIEW"'));
  31 |     if (await adminWorkspaceBtn.count() > 0) {
  32 |       await adminWorkspaceBtn.click();
  33 |     }
  34 |     
  35 |     // Kiểm tra UI Dashboard
> 36 |     await expect(page.locator('text="Tổng quan kinh doanh"')).toBeVisible({ timeout: 10000 });
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  37 |   });
  38 | 
  39 |   // Các test case khác sẽ được sinh tự động theo mẫu này (hàng trăm test).
  40 |   // Vì lý do an toàn dữ liệu trên môi trường live, bản run demo này chỉ kiểm tra Read-only UI
  41 | });
  42 | 
```