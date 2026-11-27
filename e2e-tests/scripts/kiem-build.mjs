#!/usr/bin/env node
/**
 * Chốt chặn cho trang chủ web-portal: KHÔNG được prerender.
 *
 * Vì sao cần: banner lấy từ DB lúc render. Nếu ai đó thêm lại
 * `'/': { prerender: true }` vào web-portal/nuxt.config.ts thì `nuxt build` sẽ sinh
 * `.output/public/index.html` — trang chủ đóng băng, banner bật/tắt trong quản trị
 * chỉ hiện sau khi build lại, mà dev thì không hề lộ (dev bỏ qua prerender).
 *
 * Cách dùng (phải TẮT `pnpm run dev` của web-portal trước — build dùng chung thư mục
 * .nuxt):
 *   cd e2e-tests
 *   pnpm run kiem-build            # hoặc: node scripts/kiem-build.mjs
 *
 * Cần API dev đang chạy và mật khẩu admin đã chốt ở playwright/.auth/password.txt
 * (chạy `npx playwright test --project=setup` một lần nếu chưa có).
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { choSanSang, dangChay, dungCay, log, moServerBuild } from './support.mjs'

const E2E_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORTAL_DIR = path.resolve(E2E_DIR, '..', 'web-portal')
const API = process.env.E2E_API_URL ?? 'http://localhost:5000'
const PORT = Number(process.env.E2E_BUILD_PORT ?? 3999)
const BASE = `http://localhost:${PORT}`
const mk = path.join(PORTAL_DIR, '.output', 'public')

const hong = []
function dat(ten, ok, chiTiet = '') {
  log(ok, ten, chiTiet)
  if (!ok) hong.push(ten)
  return ok
}

// 1. Dev server phải tắt: cùng thư mục .nuxt, build chồng lên dev dễ hỏng cả hai.
if (await dangChay('http://localhost:3001/')) {
  console.error('❌ web-portal dev đang chạy ở cổng 3001. Tắt `pnpm run dev` rồi chạy lại.')
  process.exit(1)
}

// 2. Build
console.log('\n▶ pnpm run build (web-portal)')
const build = spawnSync('pnpm', ['run', 'build'], { cwd: PORTAL_DIR, stdio: 'inherit', shell: true })
if (!dat('nuxt build thoát không lỗi', build.status === 0, `exit=${build.status}`)) process.exit(1)

// 3. Không còn dấu vết prerender của trang chủ
dat('không có .output/public/index.html', !existsSync(path.join(mk, 'index.html')))
dat('không có .output/public/_payload.json', !existsSync(path.join(mk, '_payload.json')))

// 4. Banner tạo qua API phải hiện ngay trên bản build, không cần build lại
let child
let headers
let bannerId = null
try {
  child = moServerBuild(PORTAL_DIR, PORT)

  if (!dat(`bản build trả lời ở ${BASE}`, await choSanSang(`${BASE}/`, 90_000))) {
    throw new Error('server không lên')
  }

  const tepMatKhau = path.join(E2E_DIR, 'playwright', '.auth', 'password.txt')
  if (!existsSync(tepMatKhau)) {
    throw new Error('thiếu playwright/.auth/password.txt — chạy `npx playwright test --project=setup` trước')
  }
  const password = readFileSync(tepMatKhau, 'utf8').trim()
  const dangNhap = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: process.env.E2E_USERNAME ?? 'admin', password })
  })
  if (!dat('đăng nhập API', dangNhap.ok, `HTTP ${dangNhap.status}`)) throw new Error('không đăng nhập được')
  headers = {
    Authorization: `Bearer ${(await dangNhap.json()).accessToken}`,
    'content-type': 'application/json'
  }

  const tieuDe = `E2E Kiem Build ${Date.now().toString().slice(-6)}`
  const tao = await fetch(`${API}/api/v1/banners`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: tieuDe,
      imageUrl: 'https://example.com/e2e-kiem-build.jpg',
      linkUrl: 'https://example.com/kiem-build',
      orderIndex: 7,
      isActive: true
    })
  })
  if (!dat('tạo banner qua API', tao.status === 200, `HTTP ${tao.status}`)) throw new Error('không tạo được banner')
  bannerId = (await tao.json()).id

  const htmlMoi = await (await fetch(`${BASE}/`)).text()
  dat('HTML bản build có banner vừa tạo (không build lại)', htmlMoi.includes(tieuDe))
  dat('HTML có link của banner', htmlMoi.includes('https://example.com/kiem-build'))

  const xoa = await fetch(`${API}/api/v1/banners/${bannerId}`, { method: 'DELETE', headers })
  dat('xoá banner qua API', xoa.status === 200, `HTTP ${xoa.status}`)
  if (xoa.status === 200) bannerId = null

  const htmlSau = await (await fetch(`${BASE}/`)).text()
  dat('sau khi xoá, HTML không còn banner đó', !htmlSau.includes(tieuDe))
} catch (e) {
  hong.push(String(e.message ?? e))
} finally {
  dungCay(child)
  // Kiểm tra hỏng giữa đường thì banner còn sót lại trong DB dev — dọn nốt.
  if (bannerId && headers) {
    const don = await fetch(`${API}/api/v1/banners/${bannerId}`, { method: 'DELETE', headers })
    console.log(`↩ dọn banner còn sót — HTTP ${don.status}`)
  }
}

if (hong.length) {
  console.error(`\n❌ Chốt chặn thất bại (${hong.length} mục):\n- ${hong.join('\n- ')}`)
  process.exit(1)
}
console.log('\n✅ Chốt chặn đạt: trang chủ không prerender và banner hiện ngay trên bản build.')
