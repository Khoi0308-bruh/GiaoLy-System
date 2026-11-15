// Phân tích kết quả ma trận phân quyền (tools/authz-matrix/results.json).
// Quy ước:
//  - 403  = bị từ chối (có thể do permission HOẶC do scope lớp/ngành)
//  - 415  = bị chặn TRƯỚC xác thực (content-type), không kết luận được về quyền
//  - 401  = token không hợp lệ (lỗi harness)
//  - khác = đã qua lớp phân quyền
import { readFileSync } from 'node:fs'

const results = JSON.parse(readFileSync('tools/authz-matrix/results.json', 'utf8'))
const decisionOf = r => (r.status === 403 ? 'deny'
  : r.status === 401 ? 'unauth'
  : r.status === 415 ? 'preauth'
  : 'allow')

// Endpoint mà chính SystemAdmin cũng bị 403 → chặn ở lớp scope, không phải permission.
const scopeDenied = new Set()
for (const { role, rows } of results) {
  if (role !== 'SystemAdmin') continue
  for (const r of rows) if (decisionOf(r) === 'deny') scopeDenied.add(`${r.method} ${r.path}`)
}

const buckets = { permissionLock: [], scopeDeny: [], leak: [], preauth: [], unauth: [] }
const seen = new Set()

for (const { role, rows } of results) {
  for (const r of rows) {
    const key = `${role}|${r.method} ${r.path}`
    const decision = decisionOf(r)
    const expected = r.expected
    const scopeKey = `${r.method} ${r.path}`

    if (decision === 'unauth') { buckets.unauth.push({ role, ...r }); continue }
    if (decision === 'preauth') {
      if (!expected && !seen.has(key)) { buckets.preauth.push({ role, ...r }); seen.add(key) }
      continue
    }
    if (decision === 'deny' && expected) {
      if (scopeDenied.has(scopeKey)) buckets.scopeDeny.push({ role, ...r })
      else buckets.permissionLock.push({ role, ...r })
      continue
    }
    if (decision === 'allow' && !expected) buckets.leak.push({ role, ...r })
  }
}

const fmt = x => `${x.role.padEnd(19)} ${(x.method + ' ' + x.path).padEnd(72)} cần ${x.permissions.join('+')} → ${x.status}`

console.log(`Endpoint bị scope chặn cho mọi vai trò (kể cả SystemAdmin): ${scopeDenied.size}`)
for (const e of scopeDenied) console.log('  ' + e)

console.log(`\n=== KHÓA NHẦM Ở LỚP QUYỀN (${buckets.permissionLock.length}) ===`)
for (const x of buckets.permissionLock) console.log('  ' + fmt(x))

console.log(`\n=== HỞ QUYỀN (${buckets.leak.length}) ===`)
for (const x of buckets.leak) console.log('  ' + fmt(x))

console.log(`\n=== 415 chặn trước xác thực — cần kiểm riêng (${buckets.preauth.length}) ===`)
for (const x of buckets.preauth) console.log('  ' + fmt(x))

if (buckets.unauth.length) {
  console.log(`\n=== LỖI TOKEN (${buckets.unauth.length}) ===`)
  for (const x of buckets.unauth) console.log('  ' + fmt(x))
}

// Bảng tổng hợp theo vai trò
console.log('\n=== TỔNG HỢP ===')
for (const { role, rows } of results) {
  const count = s => rows.filter(r => decisionOf(r) === s).length
  const wrong = rows.filter(r => r.expected && decisionOf(r) === 'deny').length
  const leak = rows.filter(r => !r.expected && decisionOf(r) === 'allow').length
  console.log(`${role.padEnd(19)} kiểm=${rows.length} cho phép=${count('allow')} từ chối=${count('deny')} preauth=${count('preauth')} | 403-dù-có-quyền=${wrong} hở=${leak}`)
}
