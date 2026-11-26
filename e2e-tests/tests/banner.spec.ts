import { test, expect, type APIRequestContext, type BrowserContext, type Page } from '@playwright/test'
import { API_BASE, dangNhap } from './support/auth'
import { dangNhapApi } from './support/api'

interface BannerDto {
  id: string
  title: string
  isActive: boolean
}

/**
 * Trang quản trị banner phải đọc danh sách quản trị (`GET /api/v1/banners`, gồm
 * cả banner đang tắt) chứ không dùng endpoint công khai, và phải bật/tắt được
 * hiển thị của từng banner. Mỗi test tự tạo banner rồi xoá ở cuối (xoá mềm).
 */
test.describe('web-admin - banner trang chủ', () => {
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

  async function taoBanner(request: APIRequestContext, headers: object, isActive: boolean) {
    const res = await request.post(`${API_BASE}/api/v1/banners`, {
      headers,
      data: {
        title: `E2E Banner ${Date.now().toString().slice(-6)}`,
        imageUrl: 'https://example.com/e2e-banner.jpg',
        linkUrl: null,
        orderIndex: 99,
        isActive
      }
    })
    expect(res.status(), 'tạo banner cho test').toBe(200)
    return (await res.json()) as BannerDto
  }

  async function xoaBanner(request: APIRequestContext, headers: object, id: string) {
    const res = await request.delete(`${API_BASE}/api/v1/banners/${id}`, { headers })
    expect(res.status(), 'dọn banner test').toBe(200)

    const conLai = (await (await request.get(`${API_BASE}/api/v1/banners`, { headers })).json()) as BannerDto[]
    expect(conLai.some(b => b.id === id), 'banner test không còn trong danh sách').toBe(false)
  }

  /** Mở trang quản trị và chờ đúng phản hồi của danh sách quản trị. */
  async function moTrangBanner() {
    const choDanhSach = page.waitForResponse(
      r => r.request().method() === 'GET' && r.url().endsWith('/api/v1/banners'),
      { timeout: 60_000 }
    )
    await page.goto('/admin/banner')
    expect((await choDanhSach).status(), 'API danh sách quản trị phải trả 200').toBe(200)
  }

  /** Mở modal sửa của banner theo tiêu đề, trả về ô "Kích hoạt hiển thị". */
  async function moModalSua(tieuDe: string) {
    const theBanner = page.locator('div.group', { hasText: tieuDe })
    await expect(theBanner).toBeVisible({ timeout: 30_000 })
    await theBanner.getByRole('button', { name: 'Sửa banner' }).click()

    const oKichHoat = page.locator('#bannerActiveCheck')
    await expect(oKichHoat).toBeVisible()
    return { theBanner, oKichHoat }
  }

  /** Bấm "Cập nhật" và chờ đúng phản hồi PUT của banner. */
  async function luuBanner(id: string) {
    const choLuu = page.waitForResponse(
      r => r.request().method() === 'PUT' && r.url().endsWith(`/api/v1/banners/${id}`),
      { timeout: 60_000 }
    )
    await page.getByRole('button', { name: 'Cập nhật' }).click()
    expect((await choLuu).status(), 'API phải lưu được thay đổi').toBe(200)
  }

  async function danhSachCongKhai(request: APIRequestContext) {
    return (await (await request.get(`${API_BASE}/api/v1/public/banners`)).json()) as BannerDto[]
  }

  test('danh sách lấy từ API quản trị và bật lại được banner đang tắt', async ({ request }) => {
    const headers = { Authorization: `Bearer ${await dangNhapApi(request)}` }
    const banner = await taoBanner(request, headers, false)

    try {
      // Ghi lại đường dẫn API banner mà trang gọi, để chắc không quay lại endpoint công khai.
      const daGoi = new Set<string>()
      page.on('request', (r) => {
        const duongDan = new URL(r.url()).pathname
        if (duongDan.includes('/banners')) daGoi.add(duongDan)
      })

      await moTrangBanner()

      const { theBanner, oKichHoat } = await moModalSua(banner.title)
      await expect(theBanner).toContainText('Tạm ẩn')
      expect(
        [...daGoi],
        'trang phải dùng API quản trị, không gọi endpoint công khai'
      ).not.toContain('/api/v1/public/banners')

      await expect(oKichHoat).not.toBeChecked()
      await oKichHoat.check()
      await luuBanner(banner.id)

      await expect(page.locator('div.group', { hasText: banner.title })).toContainText('Hiển thị', { timeout: 30_000 })

      // Bật xong thì banner phải xuất hiện ở danh sách công khai.
      const congKhai = await danhSachCongKhai(request)
      expect(congKhai.some(b => b.id === banner.id), 'banner đã bật phải có trong danh sách công khai').toBe(true)
    } finally {
      await xoaBanner(request, headers, banner.id)
    }
  })

  test('tắt hiển thị: banner đang bật biến khỏi danh sách công khai', async ({ request }) => {
    const headers = { Authorization: `Bearer ${await dangNhapApi(request)}` }
    const banner = await taoBanner(request, headers, true)

    try {
      await moTrangBanner()

      const { theBanner, oKichHoat } = await moModalSua(banner.title)
      await expect(theBanner).toContainText('Hiển thị')
      await expect(oKichHoat).toBeChecked()

      await oKichHoat.uncheck()
      await luuBanner(banner.id)

      await expect(page.locator('div.group', { hasText: banner.title })).toContainText('Tạm ẩn', { timeout: 30_000 })

      const congKhai = await danhSachCongKhai(request)
      expect(congKhai.some(b => b.id === banner.id), 'banner đã tắt không còn trong danh sách công khai').toBe(false)
    } finally {
      await xoaBanner(request, headers, banner.id)
    }
  })
})
