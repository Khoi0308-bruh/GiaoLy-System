// Quét controller của GiaoLy.API để lập danh sách endpoint + quyền yêu cầu.
// Chỉ đọc mã nguồn, không gọi mạng. Kết quả: tools/authz-matrix/endpoints.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'C:/GiaoLy'
const CONTROLLER_DIR = join(ROOT, 'GiaoLy.API/Controllers')
const PERMISSIONS_FILE = join(ROOT, 'GiaoLy.Domain/Constants/Permissions.cs')

// ── 1. Permissions.X.Y -> "x.y"
function loadPermissionMap() {
  const lines = readFileSync(PERMISSIONS_FILE, 'utf8').split(/\r?\n/)
  const map = new Map()
  const stack = []
  for (const line of lines) {
    const cls = line.match(/public static class (\w+)/)
    if (cls) { stack.push(cls[1]); continue }
    if (/^\s*}/.test(line) && stack.length > 1) { stack.pop(); continue }
    const c = line.match(/public const string (\w+)\s*=\s*"([^"]+)"/)
    if (c) map.set(`${stack[stack.length - 1]}.${c[1]}`, c[2])
  }
  return map
}

const permissionMap = loadPermissionMap()

// ── 2. Endpoint từ mỗi controller
const GUID = '00000000-0000-0000-0000-000000000001'

function fillPath(template) {
  return template.replace(/\{([^}]+)\}/g, (_, raw) => {
    const [name, ...constraints] = raw.split(':')
    const type = constraints.join(':').toLowerCase()
    if (type.includes('guid')) return GUID
    if (type.includes('int') || type.includes('long')) return '1'
    if (name.toLowerCase().includes('id')) return GUID
    return 'test'
  })
}

const endpoints = []

for (const file of readdirSync(CONTROLLER_DIR).filter(f => f.endsWith('.cs'))) {
  const text = readFileSync(join(CONTROLLER_DIR, file), 'utf8')
  const className = text.match(/public (?:sealed )?class (\w+Controller)/)?.[1]
  if (!className) continue
  const controller = className.replace(/Controller$/, '')
  const classRoute = text.match(/\[Route\("([^"]+)"\)\]/)?.[1] ?? ''

  const lines = text.split(/\r?\n/)
  let pending = []

  for (const line of lines) {
    const t = line.trim()
    if (t.startsWith('[')) { pending.push(t); continue }
    if (t === '' || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) continue

    const method = t.match(/^public\s+(?:async\s+)?[\w<>,\[\]?.\s]+\s+(\w+)\s*\(/)
    if (!method) { if (!t.startsWith(')') && !t.startsWith('{')) pending = []; continue }

    const attrs = pending
    pending = []

    const verbs = []
    for (const a of attrs) {
      const m = a.match(/\[Http(Get|Post|Put|Delete|Patch)(?:\("([^"]*)"\))?/)
      if (m) verbs.push({ method: m[1].toUpperCase(), template: m[2] ?? '' })
    }
    if (verbs.length === 0) continue

    const perms = []
    for (const a of attrs) {
      const m = a.match(/RequirePermission\(Permissions\.([\w.]+)\)/)
      if (m) perms.push(permissionMap.get(m[1]) ?? `UNKNOWN:${m[1]}`)
      const lit = a.match(/RequirePermission\("([^"]+)"\)/)
      if (lit) perms.push(lit[1])
    }

    const allowAnonymous = attrs.some(a => a.includes('[AllowAnonymous'))
    const base = classRoute.replace('[controller]', controller).replace(/\/+$/, '')

    for (const v of verbs) {
      const path = ('/' + [base, v.template].filter(Boolean).join('/')).replace(/\/+/g, '/')
      endpoints.push({
        controller,
        action: method[1],
        file,
        method: v.method,
        path: fillPath(path),
        permissions: perms,
        allowAnonymous
      })
    }
  }
}

const unique = [...new Map(endpoints.map(e => [`${e.method} ${e.path} ${e.permissions.join('|')}`, e])).values()]
writeFileSync(join(ROOT, 'tools/authz-matrix/endpoints.json'), JSON.stringify(unique, null, 2))

const protectedCount = unique.filter(e => e.permissions.length > 0).length
console.log('Tổng endpoint có route:', unique.length)
console.log('Có RequirePermission:', protectedCount)
console.log('Không có quyền (anonymous/auth thường):', unique.length - protectedCount)
console.log('Quyền không map được:', unique.filter(e => e.permissions.some(p => p.startsWith('UNKNOWN'))).length)
