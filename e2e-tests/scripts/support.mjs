/**
 * Phần dùng chung của hai script e2e cần tự dựng server: `kiem-build.mjs` (chốt chặn
 * prerender, chỉ build web-portal) và `test-build.mjs` (chạy cả bộ test trên bản build).
 *
 * Cả hai đều: kiểm tra cổng đã trống, chạy `.output/server/index.mjs`, chờ trả lời 200,
 * rồi dừng cả cây tiến trình. Để một chỗ để sửa (nhất là cách kill trên Windows).
 */
import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'

export const ngu = ms => new Promise(r => setTimeout(r, ms))

/** In một dòng kết quả ✅/❌ thống nhất cho cả hai script. */
export function log(ok, ten, chiTiet = '') {
  console.log(`${ok ? '✅' : '❌'} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`)
}

/** Dừng cả cây tiến trình (Windows: taskkill /T, nền khác: SIGTERM). */
export function dungCay(child) {
  if (!child || child.exitCode !== null) return
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    child.kill('SIGTERM')
  }
}

/** Chạy server của bản build đã có sẵn trong `<thuMuc>/.output` ở cổng `cong`. */
export function moServerBuild(thuMuc, cong) {
  return spawn(process.execPath, [path.join('.output', 'server', 'index.mjs')], {
    cwd: thuMuc,
    env: { ...process.env, PORT: String(cong), HOST: '127.0.0.1' },
    stdio: 'inherit'
  })
}

/** Có gì đó đang trả lời ở `url` không (dùng để chặn khi dev server còn chạy). */
export async function dangChay(url) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(3000) })
    return true
  } catch {
    return false
  }
}

/** Chờ `url` trả 200, tối đa `han` ms. */
export async function choSanSang(url, han = 60_000) {
  const het = Date.now() + han
  while (Date.now() < het) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
      if (res.status === 200) return true
    } catch { /* chưa lên */ }
    await ngu(400)
  }
  return false
}
