import { test, expect, type Page } from '@playwright/test'
import { dangNhapApi } from './support/api'
import { taoBanner, xoaBanner } from './support/banners'

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

/**
 * Các trang công khai của web-portal: tiêu đề phải render được.
 * Dùng đường dẫn hợp nhất (/tin-tuc, /thu-vien, /lich-phung-vu, /ban-huynh-truong);
 * các đường dẫn cũ /news, /library… chỉ còn là chuyển hướng.
 */
const TRANG_CONG_KHAI: Array<[string, RegExp]> = [
  ['/tin-tuc', /Tin Tức Giáo Hội/],
  ['/thong-bao', /Thông Báo Giáo Xứ/],
  ['/thu-vien', /Thư Viện Tài Liệu/],
  ['/lich-phung-vu', /Lịch Phụng Vụ/],
  ['/ban-huynh-truong', /Ban Huynh Trưởng/]
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
      // Dev server vẫn biên dịch lại client bundle sau khi báo "Ready", nên lần mở
      // đầu có thể bị huỷ navigation (ERR_ABORTED). Nạp lại là xong, không phải lỗi app.
      await expect(async () => {
        await page.goto(path)
        await expect(page.locator('h1').first()).toContainText(heading, { timeout: 20_000 })
      }).toPass({ timeout: 120_000 })
    }
  })

  test('trang chủ chỉ hiện banner đang bật', async ({ page, request }) => {
    const headers = { Authorization: `Bearer ${await dangNhapApi(request)}` }
    const lienKet = 'https://example.com/lien-ket-e2e'
    const dangBat = await taoBanner(request, headers, true, 'E2E Portal Bật', lienKet)
    const dangTat = await taoBanner(request, headers, false, 'E2E Portal Tắt')

    try {
      // Trang chủ fetch banner khi render ở server; nạp lại nếu dev server huỷ navigation lần đầu.
      await expect(async () => {
        await page.goto('/')
        await expect(page.getByRole('heading', { name: dangBat.title }).first()).toBeVisible({ timeout: 20_000 })
      }).toPass({ timeout: 120_000 })

      await expect(
        page.getByRole('heading', { name: dangTat.title }),
        'banner đang tắt không được lên trang chủ'
      ).toHaveCount(0)

      // Banner có "Liên kết" phải hiện nút CTA trỏ đúng linkUrl của API.
      await expect(
        page.locator(`a[href="${lienKet}"]`).first(),
        'nút "Xem Chi Tiết" phải trỏ đúng linkUrl của banner'
      ).toContainText('Xem Chi Tiết')
    } finally {
      await xoaBanner(request, headers, dangBat.id)
      await xoaBanner(request, headers, dangTat.id)
    }
  })

  test('chỉ banner đang hiển thị nằm trong cây trợ năng', async ({ page, request }) => {
    const headers = { Authorization: `Bearer ${await dangNhapApi(request)}` }
    // Hai banner cùng bật: cả hai slide đều nằm trong DOM, chỉ một được phơi ra cho
    // trình đọc màn hình (slide còn lại có aria-hidden + inert).
    const mot = await taoBanner(request, headers, true, 'E2E Tro Nang Mot')
    const hai = await taoBanner(request, headers, true, 'E2E Tro Nang Hai')

    // Đếm qua getByRole: Playwright chỉ thấy phần tử nằm trong cây trợ năng.
    const demTieuDe = async () =>
      (await page.getByRole('heading', { name: mot.title }).count()) +
      (await page.getByRole('heading', { name: hai.title }).count())

    try {
      // Trang chủ fetch banner khi render ở server; nạp lại nếu dev server huỷ navigation lần đầu.
      await expect(async () => {
        await page.goto('/')
        // Cả hai slide phải có mặt trong DOM, nếu không phép đếm dưới đây đúng một cách vô nghĩa.
        await expect(page.locator('h2', { hasText: mot.title }), 'slide 1 có trong DOM').toHaveCount(1, { timeout: 20_000 })
        await expect(page.locator('h2', { hasText: hai.title }), 'slide 2 có trong DOM').toHaveCount(1, { timeout: 20_000 })
      }).toPass({ timeout: 120_000 })

      // Carousel tự chuyển slide nên chờ tới lúc cây trợ năng ổn định thay vì đọc một lần;
      // nếu cả hai tiêu đề cùng lộ ra thì vòng này hết giờ và test đỏ.
      await expect.poll(demTieuDe, {
        message: 'mỗi thời điểm chỉ một tiêu đề banner trong cây trợ năng',
        timeout: 20_000
      }).toBe(1)

      await expect(
        page.locator('[aria-roledescription="carousel"] [inert]'),
        'đúng một slide bị ẩn khỏi cây trợ năng'
      ).toHaveCount(1)
    } finally {
      await xoaBanner(request, headers, mot.id)
      await xoaBanner(request, headers, hai.id)
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
