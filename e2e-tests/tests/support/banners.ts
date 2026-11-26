import { expect, type APIRequestContext } from '@playwright/test'
import { API_BASE } from './auth'

export interface BannerDto {
  id: string
  title: string
  isActive: boolean
}

// Tiêu đề duy nhất trong lượt chạy: cùng một mili giây vẫn không trùng nhờ bộ đếm.
let dem = 0

/** Tạo banner qua API quản trị; `dangBat` = false để thử luồng bật lại. */
export async function taoBanner(
  request: APIRequestContext,
  headers: Record<string, string>,
  dangBat: boolean,
  tienTo = 'E2E Banner',
  lienKet: string | null = null
): Promise<BannerDto> {
  const res = await request.post(`${API_BASE}/api/v1/banners`, {
    headers,
    data: {
      title: `${tienTo} ${Date.now().toString().slice(-6)}${++dem}`,
      imageUrl: 'https://example.com/e2e-banner.jpg',
      linkUrl: lienKet,
      orderIndex: 99,
      isActive: dangBat
    }
  })
  expect(res.status(), 'tạo banner cho test').toBe(200)
  return (await res.json()) as BannerDto
}

/** Xoá mềm banner và đòi nó không còn trong danh sách quản trị. */
export async function xoaBanner(
  request: APIRequestContext,
  headers: Record<string, string>,
  id: string
) {
  const res = await request.delete(`${API_BASE}/api/v1/banners/${id}`, { headers })
  // 404 khi chính test đã xoá banner trước đó rồi.
  expect([200, 404], 'dọn banner test').toContain(res.status())

  const conLai = (await (await request.get(`${API_BASE}/api/v1/banners`, { headers })).json()) as BannerDto[]
  expect(conLai.some(b => b.id === id), 'banner test không còn trong danh sách').toBe(false)
}
