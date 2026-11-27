import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { API_BASE, dangNhap } from './support/auth'
import { dangNhapApi } from './support/api'

/**
 * Các trang quản trị tĩnh: tiêu đề phải đúng, không lọt banner lỗi/quyền.
 * Bỏ qua trang cần tham số (:id) và trang dev (/admin/dev/*).
 */
const TRANG_CHINH: Array<[string, RegExp]> = [
  ['/admin', /Bảng điều khiển Trung tâm/],
  ['/admin/doan-sinh', /Danh sách đoàn sinh/],
  ['/admin/doan-sinh/them', /Thêm đoàn sinh mới/],
  ['/admin/doan-sinh/nhap-excel', /Nhập đoàn sinh từ Excel/],
  ['/admin/doan-sinh/yeu-cau-bi-tich', /Yêu cầu chuẩn bị Bí tích/],
  ['/admin/lop', /Danh sách Lớp học/],
  ['/admin/nien-khoa', /Niên khóa/],
  ['/admin/len-lop', /Đợt xét Lên lớp/],
  ['/admin/vai-tro', /Vai trò & Ma trận Phân quyền/],
  ['/admin/nguoi-dung', /Quản trị Người dùng & Tài khoản/],
  ['/admin/tai-khoan', /Hồ sơ cá nhân/],
  ['/admin/banner', /Banner Trang chủ/],
  ['/admin/thong-bao', /Bản tin & Thông báo/],
  ['/admin/tin-tuc', /Tin tức & Dòng sự kiện/],
  ['/admin/giao-an', /Kho Giáo án & Bài giảng/],
  ['/admin/tai-lieu', /Kho Tài liệu & Biểu mẫu/],
  ['/admin/huynh-truong', /Ban Huynh Trưởng/],
  ['/admin/gia-dinh', /Gia đình thiếu nhi/],
  ['/admin/to-chuc', /Ngành & Cấp lớp/],
  ['/admin/truc-lop', /Phân công Trực lớp/],
  ['/admin/trai', /Sự kiện & Hội trại/],
  ['/admin/lich-phung-vu', /Lịch Phụng Vụ Giáo Xứ/],
  ['/admin/bao-cao', /Trung Tâm Báo Cáo/],
  ['/admin/cau-hinh', /Cấu hình Nghiệp vụ Hệ thống/],
  ['/admin/nhat-ky', /Nhật Ký Kiểm Toán Hệ Thống/],
  ['/admin/tac-vu', /Tác Vụ Nền/]
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
      // Tách từng trang thành một step để báo lỗi nêu đúng đường dẫn.
      await test.step(path, async () => {
        await page.goto(path)
        await expect(page.locator('h1').first()).toContainText(heading, { timeout: 30_000 })
        await khongCoLoiTrenTrang(page)
      })
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

  test('tạo đoàn sinh mới', async ({ request }) => {
    const ten = `E2E Tạo Mới ${Date.now().toString().slice(-6)}`

    try {
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
    } finally {
      // Dọn đoàn sinh vừa tạo qua API (xoá mềm, như cách dọn banner).
      const idDoanSinh = page.url().match(/\/admin\/doan-sinh\/([0-9a-f-]{36})/)?.[1]
      if (idDoanSinh) {
        const token = await dangNhapApi(request)
        const xoa = await request.delete(`${API_BASE}/api/v1/students/${idDoanSinh}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        expect([200, 404], 'dọn đoàn sinh vừa tạo').toContain(xoa.status())
      }
    }
  })
})
