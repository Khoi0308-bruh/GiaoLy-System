import { expect, type APIRequestContext, type APIResponse } from '@playwright/test'
import { API_BASE, USERNAME, cacMatKhaUThu, luuMatKhauDaDung } from './auth'

/**
 * Dữ liệu dựng sẵn cho các test cần một lớp đã có đoàn sinh ghi danh
 * (sổ điểm). CI chạy trên database trống nên không thể dựa vào dữ liệu mẫu;
 * các bước dưới đây dùng đúng API của hệ thống, sau đó test mới thao tác trên UI.
 */

export interface LopCoGhiDanh {
  roomId: string
  className: string
  studentId: string
  enrollmentId: string
  studentName: string
}

export interface TaiKhoanHanChe {
  id: string
  username: string
  tempPassword: string
}

async function docJson<T>(res: APIResponse, moTa: string): Promise<T> {
  if (!res.ok()) {
    throw new Error(`${moTa} thất bại (HTTP ${res.status()}): ${await res.text()}`)
  }
  return (await res.json()) as T
}

// API giới hạn 10 lượt đăng nhập/phút mỗi IP và bộ e2e chạy workers: 1, nên giữ
// token trong tiến trình worker để các test sau dùng lại thay vì đăng nhập lại.
let tokenTrongWorker: string | null = null

async function tokenConHieuLuc(request: APIRequestContext, token: string): Promise<boolean> {
  const res = await request.get(`${API_BASE}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.ok()
}

/** Đăng nhập qua API và trả access token (chờ qua cửa sổ giới hạn 10 lần/phút nếu cần). */
export async function dangNhapApi(request: APIRequestContext): Promise<string> {
  if (tokenTrongWorker && await tokenConHieuLuc(request, tokenTrongWorker)) return tokenTrongWorker

  for (const password of cacMatKhaUThu()) {
    for (let lan = 0; lan < 4; lan++) {
      const res = await request.post(`${API_BASE}/api/v1/auth/login`, {
        data: { username: USERNAME, password }
      })
      if (res.ok()) {
        luuMatKhauDaDung(password)
        const token = ((await res.json()) as { accessToken: string }).accessToken
        tokenTrongWorker = token
        return token
      }
      if (res.status() !== 429) break
      await new Promise(resolve => setTimeout(resolve, 20_000))
    }
  }
  throw new Error('Không đăng nhập được API để tạo dữ liệu test')
}

export async function taoLopCoGhiDanh(
  request: APIRequestContext,
  token: string
): Promise<LopCoGhiDanh> {
  const headers = { Authorization: `Bearer ${token}` }
  const stamp = Date.now().toString().slice(-6)

  let levels = await docJson<Array<{ id: number }>>(
    await request.get(`${API_BASE}/api/v1/class-levels`, { headers }),
    'Lấy danh mục cấp lớp'
  )

  if (levels.length === 0) {
    // Database trống: tạo một cấp lớp tối thiểu (LevelKey phải là duy nhất).
    await request.post(`${API_BASE}/api/v1/class-levels`, {
      headers,
      data: { branchId: 1, code: 'E2E01', name: 'E2E Cấp 1', levelKey: 1 }
    })
    levels = await docJson<Array<{ id: number }>>(
      await request.get(`${API_BASE}/api/v1/class-levels`, { headers }),
      'Đọc lại danh mục cấp lớp'
    )
    if (levels.length === 0) throw new Error('Không tạo được cấp lớp cho dữ liệu test')
  }

  const year = await docJson<{ id: string }>(
    await request.get(`${API_BASE}/api/v1/academic-years/active`, { headers }),
    'Lấy niên khóa đang hoạt động'
  )

  const room = await docJson<{ id: string, className: string }>(
    await request.post(`${API_BASE}/api/v1/academic-years/${year.id}/classrooms`, {
      headers,
      data: { classLevelId: levels[0].id, section: `E2E ${stamp}`, roomName: `P.E2E ${stamp}` }
    }),
    'Tạo lớp học test'
  )

  const studentName = `E2E Kiểm Thử ${stamp}`
  const student = await docJson<{ id: string }>(
    await request.post(`${API_BASE}/api/v1/students`, {
      headers,
      data: { fullName: studentName, birthDate: '2015-05-05', gender: 'Male' }
    }),
    'Tạo đoàn sinh test'
  )

  const ghiDanh = await docJson<Array<{ id: string, studentId: string }>>(
    await request.post(`${API_BASE}/api/v1/classrooms/${room.id}/enrollments`, {
      headers,
      data: { studentIds: [student.id] }
    }),
    'Ghi danh đoàn sinh test vào lớp'
  )
  const cuaBan = ghiDanh.find(g => g.studentId === student.id)
  if (!cuaBan) throw new Error('Không đọc được ghi danh vừa tạo cho đoàn sinh test')

  return { roomId: room.id, className: room.className, studentId: student.id, enrollmentId: cuaBan.id, studentName }
}

/**
 * Dọn lớp test đã dựng bằng `taoLopCoGhiDanh`, dùng đúng API như cách dọn banner
 * (mọi thứ là xoá mềm): rút ghi danh → xoá đoàn sinh → xoá lớp.
 *
 * Phải rút ghi danh trước: `ClassRoomService.DeleteClassRoomAsync` chặn xoá lớp còn
 * ghi danh Active của đoàn sinh còn hồ sơ.
 */
export async function donLopCoGhiDanh(
  request: APIRequestContext,
  token: string,
  fixture: LopCoGhiDanh
) {
  const headers = { Authorization: `Bearer ${token}` }

  const rut = await request.post(`${API_BASE}/api/v1/enrollments/${fixture.enrollmentId}/withdraw`, {
    headers,
    data: { reason: 'Dọn dữ liệu e2e' }
  })
  // 400 khi ghi danh đã bị rút từ trước (test chạy lại sau lỗi giữa đường).
  expect([200, 400, 404], 'rút ghi danh test').toContain(rut.status())

  const xoa = await request.delete(`${API_BASE}/api/v1/students/${fixture.studentId}`, { headers })
  expect([200, 404], 'xoá đoàn sinh test').toContain(xoa.status())

  const xoaLop = await request.delete(`${API_BASE}/api/v1/classrooms/${fixture.roomId}`, { headers })
  expect([200, 404], 'xoá lớp test').toContain(xoaLop.status())
}

/**
 * Tạo một tài khoản vai trò "Thư ký và thủ quỹ" (không có quyền roles.view) để
 * kiểm tra chặn 403. Dùng API của chính hệ thống nên không phụ thuộc tài khoản
 * mẫu của môi trường nào.
 */
export async function taoTaiKhoanHanChe(
  request: APIRequestContext,
  token: string
): Promise<TaiKhoanHanChe> {
  const headers = { Authorization: `Bearer ${token}` }
  const stamp = Date.now().toString().slice(-6)

  const roles = await docJson<Array<{ id: string, code: string }>>(
    await request.get(`${API_BASE}/api/v1/roles`, { headers }),
    'Lấy danh sách vai trò'
  )
  const vaiTro = roles.find(r => r.code === 'SecretaryTreasurer')
  if (!vaiTro) throw new Error('Không tìm thấy vai trò SecretaryTreasurer')

  const username = `e2e_hanche_${stamp}`
  const created = await docJson<{ user: { id: string }, temporaryPassword: string }>(
    await request.post(`${API_BASE}/api/v1/users`, {
      headers,
      data: {
        username,
        fullName: `E2E Vai trò hạn chế ${stamp}`,
        christianName: null,
        email: null,
        phoneNumber: null,
        dateOfBirth: null,
        address: null,
        roleId: vaiTro.id,
        branchId: null
      }
    }),
    'Tạo tài khoản vai trò hạn chế'
  )

  return { id: created.user.id, username, tempPassword: created.temporaryPassword }
}

/**
 * Dọn tài khoản hạn chế của test. API chưa có xoá người dùng, chỉ có vô hiệu hoá
 * (`POST /users/{id}/deactivate`), nên dùng đúng đường đó.
 */
export async function donTaiKhoanHanChe(
  request: APIRequestContext,
  token: string,
  taiKhoan: TaiKhoanHanChe
) {
  const res = await request.post(`${API_BASE}/api/v1/users/${taiKhoan.id}/deactivate`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  expect([200, 404], 'vô hiệu hoá tài khoản hạn chế của test').toContain(res.status())
}
