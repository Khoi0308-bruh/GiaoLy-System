#!/usr/bin/env node
/**
 * Chạy 20 test e2e trên BẢN BUILD production của cả hai app, bằng một lệnh.
 *
 * Vì sao cần: bộ test mặc định chạy trên dev server — nơi Nuxt bỏ qua prerender, tự
 * biên dịch lại client bundle và không phục vụ đúng `.output/public`. Có những lỗi chỉ
 * hiện trên bản build (trang chủ bị prerender, bundle cũ, asset thiếu), nên thỉnh
 * thoảng phải chạy cả bộ trên `.output`.
 *
 * Cách dùng (phải TẮT dev server 3000/3001 trước — build dùng chung thư mục .nuxt):
 *   cd e2e-tests
 *   pnpm run test-build          # hoặc: node scripts/test-build.mjs
 *
 * Cần API dev đang chạy ở cổng 5000 và mật khẩu admin đã chốt ở
 * playwright/.auth/password.txt (chạy `npx playwright test --project=setup` nếu chưa có).
 *
 * Script tự: build cả hai app → chạy `.output` ở 3000/3001 → chạy Playwright →
 * dừng server và xoá `.output` (kể cả khi test đỏ hoặc bị Ctrl+C).
 */
import { spawnSync } from 'node:child_process'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { choSanSang, dangChay, dungCay, log, moServerBuild } from './support.mjs'

const E2E_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const GOC = path.resolve(E2E_DIR, '..')

const APP = [
  {
    ten: 'web-admin',
    thuMuc: path.join(GOC, 'web-admin'),
    cong: Number(process.env.E2E_BUILD_ADMIN_PORT ?? 3000),
    // web-admin dựng ở client nên trang này luôn trả 200 khi server đã lên.
    kiemTra: '/dang-nhap',
    bien: 'E2E_BASE_URL'
  },
  {
    ten: 'web-portal',
    thuMuc: path.join(GOC, 'web-portal'),
    cong: Number(process.env.E2E_BUILD_PORTAL_PORT ?? 3001),
    kiemTra: '/',
    bien: 'E2E_PORTAL_BASE_URL'
  }
]

// Phải là `localhost`, không phải `127.0.0.1`: API chỉ cho CORS origin
// http://localhost:3000 / :3001 (appsettings.Development.json); origin dạng IP bị chặn
// nên trang đăng nhập báo lỗi chung mà không nói rõ nguyên nhân.
const base = app => `http://localhost:${app.cong}`

const dangChayServer = []
let maThoat = 1

try {
  // 1. Cổng phải trống: dev server dùng chung .nuxt, server cũ chiếm cổng thì script
  //    sẽ test nhầm bản đang chạy. Không tự tắt hộ — người dùng có thể đang cần nó.
  for (const app of APP) {
    if (await dangChay(base(app) + app.kiemTra)) {
      console.error(`❌ ${app.ten} đang chạy ở cổng ${app.cong}. Tắt nó rồi chạy lại script.`)
      process.exit(1)
    }
  }

  // 2. Build lần lượt từng app
  for (const app of APP) {
    console.log(`\n▶ pnpm run build (${app.ten})`)
    const build = spawnSync('pnpm', ['run', 'build'], { cwd: app.thuMuc, stdio: 'inherit', shell: true })
    if (build.status !== 0) {
      log(false, `${app.ten}: nuxt build`, `exit=${build.status}`)
      throw new Error('build hỏng')
    }
    log(true, `${app.ten}: nuxt build`)
  }

  // 3. Chạy bản build
  for (const app of APP) {
    console.log(`\n▶ ${app.ten} .output ở cổng ${app.cong}`)
    dangChayServer.push(moServerBuild(app.thuMuc, app.cong))
  }
  for (const app of APP) {
    if (!(await choSanSang(base(app) + app.kiemTra))) {
      log(false, `${app.ten}: bản build trả lời ở ${base(app)}`)
      throw new Error('server không lên')
    }
    log(true, `${app.ten}: bản build trả lời ở ${base(app)}`)
  }

  // 4. Chạy cả bộ e2e trỏ vào bản build
  console.log('\n▶ npx playwright test (bản build)\n')
  const env = { ...process.env }
  for (const app of APP) env[app.bien] = base(app)
  const test = spawnSync('npx', ['playwright', 'test'], { cwd: E2E_DIR, stdio: 'inherit', shell: true, env })
  maThoat = test.status ?? 1
  log(maThoat === 0, 'toàn bộ e2e trên bản build', `exit=${maThoat}`)
} catch (e) {
  console.error(`\n❌ ${e.message ?? e}`)
} finally {
  // 5. Luôn dừng server rồi dọn .output để lượt sau build lại từ đầu, không test nhầm bản cũ.
  for (const child of dangChayServer) dungCay(child)
  for (const app of APP) {
    await rm(path.join(app.thuMuc, '.output'), { recursive: true, force: true }).catch(() => {})
  }
  console.log('\n↩ đã dừng server bản build và xoá .output của hai app')
}

if (maThoat !== 0) {
  console.error('\n❌ Bộ e2e trên bản build thất bại.')
  process.exit(maThoat)
}
console.log('\n✅ Bộ e2e trên bản build đạt.')
