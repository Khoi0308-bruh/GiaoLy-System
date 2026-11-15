// Chạy ma trận phân quyền: mỗi endpoint có RequirePermission × mỗi vai trò → status.
// Token được ký bằng khoá dev, mang role_id/role của vai trò cần kiểm (quyền thực tế
// do PermissionAuthorizationHandler đọc từ DB theo role_id, giống hệt một user thật).
import { readFileSync, writeFileSync } from 'node:fs'
import crypto from 'node:crypto'

const API = process.env.API_BASE ?? 'http://localhost:5000'
const KEY = process.env.JWT_KEY
const ISSUER = 'GiaoLySystem'
const AUDIENCE = 'GiaoLyUsers'
const ADMIN_ID = process.env.ADMIN_ID
const ADMIN_STAMP = process.env.ADMIN_STAMP
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 8)

const CLAIM_NAME_ID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

const b64u = buf => Buffer.from(buf).toString('base64url')

function mint(roleCode, roleId) {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: ADMIN_ID,
    [CLAIM_NAME_ID]: ADMIN_ID,
    [CLAIM_NAME]: 'admin',
    name: 'admin',
    [CLAIM_ROLE]: roleCode,
    role_id: roleId,
    scope_type: 'All',
    security_stamp: ADMIN_STAMP,
    must_change_password: 'false',
    iss: ISSUER,
    aud: AUDIENCE,
    iat: now,
    nbf: now - 5,
    exp: now + 3600
  }
  const body = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(payload))}`
  const sig = crypto.createHmac('sha256', KEY).update(body).digest('base64url')
  return `${body}.${sig}`
}

const endpoints = JSON.parse(readFileSync('tools/authz-matrix/endpoints.json', 'utf8'))
  .filter(e => e.permissions.length > 0)

// roles.tsv: Code|RoleId|PermissionCode (mỗi dòng một quyền)
const roleRows = readFileSync('tools/authz-matrix/roles.tsv', 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean)
  .map(l => l.split('|'))

const byRole = new Map()
for (const [code, id, perm] of roleRows) {
  if (!byRole.has(code)) byRole.set(code, { code, id, permissions: new Set() })
  if (perm) byRole.get(code).permissions.add(perm.trim())
}
const rolesInfo = [...byRole.values()]

let counter = 0
async function call(ep, token) {
  const i = ++counter
  const headers = {
    Authorization: `Bearer ${token}`,
    // Mỗi request một IP riêng qua proxy tin cậy (loopback) để không dính rate limit.
    'X-Forwarded-For': `10.${(i >> 16) & 255}.${(i >> 8) & 255}.${i & 255}`
  }
  const init = { method: ep.method, headers, redirect: 'manual' }
  if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
    headers['Content-Type'] = 'application/json'
    init.body = '{}'
  }
  try {
    const res = await fetch(API + ep.path, init)
    return res.status
  } catch (e) {
    return -1
  }
}

async function runPool(items, worker, size) {
  const out = new Array(items.length)
  let idx = 0
  await Promise.all(Array.from({ length: size }, async () => {
    while (idx < items.length) {
      const my = idx++
      out[my] = await worker(items[my], my)
    }
  }))
  return out
}

const results = []
for (const role of rolesInfo) {
  const token = mint(role.code, role.id)
  const statuses = await runPool(endpoints, ep => call(ep, token), CONCURRENCY)
  const rows = endpoints.map((ep, i) => {
    const status = statuses[i]
    const decision = status === 403 ? 'deny' : status === 401 ? 'unauth' : status === -1 ? 'error' : 'allow'
    const expected = role.code === 'SystemAdmin' || ep.permissions.every(p => role.permissions.has(p))
    return { ...ep, status, decision, expected }
  })
  results.push({ role: role.code, rows })
  const count = s => rows.filter(r => r.decision === s).length
  console.log(`${role.code.padEnd(20)} allow=${count('allow')} deny=${count('deny')} unauth=${count('unauth')} error=${count('error')}`)
}

writeFileSync('tools/authz-matrix/results.json', JSON.stringify(results, null, 2))

console.log('\n=== KHÓA NHẦM (có quyền nhưng bị 403) ===')
let wrongly = 0
for (const { role, rows } of results) {
  const bad = rows.filter(r => r.expected && r.decision === 'deny')
  wrongly += bad.length
  for (const b of bad) console.log(`${role} | ${b.method} ${b.path} | cần ${b.permissions.join('+')} | 403`)
}
console.log(`Tổng: ${wrongly}`)

console.log('\n=== HỞ QUYỀN (thiếu quyền nhưng không bị 403) ===')
let leaks = 0
for (const { role, rows } of results) {
  const bad = rows.filter(r => !r.expected && r.decision === 'allow')
  leaks += bad.length
  for (const b of bad) console.log(`${role} | ${b.method} ${b.path} | cần ${b.permissions.join('+')} | ${b.status}`)
}
console.log(`Tổng: ${leaks}`)

console.log('\n=== 401/ERROR bất thường ===')
for (const { role, rows } of results) {
  for (const r of rows.filter(r => r.decision === 'unauth' || r.decision === 'error')) {
    console.log(`${role} | ${r.method} ${r.path} | ${r.status}`)
  }
}
