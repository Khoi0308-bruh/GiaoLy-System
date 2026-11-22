import { test, expect } from '@playwright/test'
import { dangNhapApi } from './support/api'
import { API_BASE, cacMatKhaUThu, USERNAME } from './support/auth'

/**
 * Hồi quy: hai lượt đăng nhập song song cùng một tài khoản từng làm lượt sau vấp
 * `DbUpdateConcurrencyException` ở dòng Users (RowVersion) và trả 500, dù mật khẩu
 * đúng. Nay các lượt đăng nhập đồng thời đều phải thành công và mỗi lượt phải nhận
 * được access token dùng được.
 */
const SO_LUOT_SONG_SONG = 3

async function dangNhapSongSong(
  request: Parameters<typeof dangNhapApi>[0],
  password: string
) {
  return Promise.all(
    Array.from({ length: SO_LUOT_SONG_SONG }, () =>
      request.post(`${API_BASE}/api/v1/auth/login`, {
        data: { username: USERNAME, password }
      })
    )
  )
}

test.describe('API - đăng nhập song song cùng một tài khoản', () => {
  test.describe.configure({ timeout: 180_000 })

  test('mọi lượt đăng nhập đồng thời đều thành công', async ({ request }) => {
    // Xác định mật khẩu đang dùng; helper ghi lại mật khẩu thắng vào
    // playwright/.auth/password.txt nên không phải thử sai nhiều lần.
    await dangNhapApi(request)
    const password = cacMatKhaUThu()[0]

    let phanHoi = await dangNhapSongSong(request, password)
    // API giới hạn 10 lần đăng nhập/phút mỗi IP: nếu chạm hạn mức thì chờ cửa sổ
    // kế tiếp rồi thử lại một lần thay vì báo hỏng sai.
    if (phanHoi.some(res => res.status() === 429)) {
      await new Promise(resolve => setTimeout(resolve, 61_000))
      phanHoi = await dangNhapSongSong(request, password)
    }

    const maTrangThai = phanHoi.map(res => res.status())
    expect(maTrangThai, 'Không lượt nào được lỗi 5xx hoặc bị chặn').toEqual(
      Array(SO_LUOT_SONG_SONG).fill(200)
    )

    for (const res of phanHoi) {
      const body = (await res.json()) as { accessToken: string }
      const me = await request.get(`${API_BASE}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${body.accessToken}` }
      })
      expect(me.status(), 'Access token của mỗi lượt phải dùng được').toBe(200)
    }
  })
})
