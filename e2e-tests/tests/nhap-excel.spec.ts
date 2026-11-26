import path from 'node:path'
import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import { dangNhap } from './support/auth'

/**
 * Fixture `docs/fixtures/nhap-doan-sinh-co-loi.xlsx` có 5 dòng dữ liệu: dòng Excel
 * 2–5 sai (thiếu họ tên, thiếu ngày sinh, ngày sinh ở tương lai, mã cấp lớp không
 * tồn tại) và dòng 6 hợp lệ. Test chỉ chạy bước xem trước (POST /imports/students),
 * không bấm "Xác nhận lưu" nên không ghi đoàn sinh nào vào database.
 */
const FILE_LOI = path.resolve(__dirname, '../../docs/fixtures/nhap-doan-sinh-co-loi.xlsx')

/** Số dòng Excel và thông điệp lỗi API trả về cho từng dòng sai. */
const DONG_LOI: Array<[number, string]> = [
  [2, 'Họ và tên bắt buộc phải có.'],
  [3, 'Ngày sinh bắt buộc phải có và phải đúng định dạng ngày (dd/MM/yyyy).'],
  [4, 'Ngày sinh (01/01/2035) không thể ở tương lai.'],
  [5, "Mã cấp lớp 'KHONGCO' không tồn tại trong danh mục hệ thống."]
]

test.describe('web-admin - nhập đoàn sinh từ Excel', () => {
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

  test('tệp có lỗi: bảng và thẻ mobile hiện đủ 4 dòng lỗi', async () => {
    await page.goto('/admin/doan-sinh/nhap-excel')
    await expect(page.locator('h1').first()).toContainText('Nhập đoàn sinh từ Excel', { timeout: 30_000 })

    await page.locator('input[type="file"]').setInputFiles(FILE_LOI)
    await expect(page.getByText(path.basename(FILE_LOI))).toBeVisible()

    // Chờ đúng phản hồi của lần xem trước thay vì hỏi lại API: API giới hạn
    // 120 request/phút mỗi IP.
    const phanHoiXemTruoc = page.waitForResponse(
      r => r.request().method() === 'POST' && r.url().endsWith('/imports/students'),
      { timeout: 60_000 }
    )
    await page.getByRole('button', { name: 'Kiểm tra dữ liệu (Xem trước)' }).click()
    expect((await phanHoiXemTruoc).status(), 'API phải nhận tệp và trả báo cáo xem trước').toBe(200)

    await expect(page.getByText('Chi tiết các dòng bị lỗi (4 lỗi):')).toBeVisible({ timeout: 30_000 })

    // Bảng (từ md trở lên): đúng 2 cột và đủ 4 dòng lỗi kèm số dòng Excel.
    const bang = page.locator('table')
    await expect(bang).toHaveCount(1)
    await expect(bang.locator('thead th')).toHaveCount(2)
    await expect(bang.locator('thead')).toContainText('Mô tả lỗi')

    const dongBang = bang.locator('tbody tr')
    await expect(dongBang).toHaveCount(DONG_LOI.length)
    for (const [dong, loi] of DONG_LOI) {
      const tr = dongBang.filter({ hasText: loi })
      await expect(tr, `bảng phải có lỗi của dòng ${dong}`).toHaveCount(1)
      await expect(tr).toContainText(`#${dong}`)
    }

    // Dưới md bảng ẩn, cùng 4 lỗi hiện thành thẻ "Dòng #N" + mô tả.
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(bang).toBeHidden()

    // Regex khớp nguyên nội dung thẻ (không trim như chuỗi), nên cho phép khoảng trắng thụt lề.
    const theLoi = page.getByText(/^\s*Dòng #\d+\s*$/)
    await expect(theLoi).toHaveCount(DONG_LOI.length)
    for (const [dong, loi] of DONG_LOI) {
      const the = theLoi.filter({ hasText: `Dòng #${dong}` })
      await expect(the, `thẻ mobile phải có lỗi của dòng ${dong}`).toHaveCount(1)
      // Mô tả lỗi nằm ngay trong thẻ của dòng đó, không phải chỉ ở bảng đang ẩn.
      await expect(the.locator('xpath=..')).toContainText(loi)
    }
  })
})
