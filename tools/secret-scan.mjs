// Quét những file ĐANG ĐƯỢC TRACK trong git để tìm bí mật còn sót.
// Chỉ đọc, không sửa gì. Giá trị bí mật luôn được che bớt khi in ra.
//   node tools/secret-scan.mjs            -> báo cáo dạng text
//   node tools/secret-scan.mjs --json     -> JSON cho tooling
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)

const BINARY = new Set([
  'png', 'jpg', 'jpeg', 'webm', 'mp4', 'woff', 'woff2', 'ttf', 'ico', 'gif',
  'zip', 'dll', 'exe', 'xlsx', 'pdf', 'snk', 'pdb', 'wasm', 'bin', 'svg'
])

// Chuỗi mẫu/placeholder thì không tính là bí mật.
const isPlaceholder = value => /^(?:REPLACE_WITH|PLACEHOLDER|CHANGE_?ME|YOUR_|<|\$\{|x{4,}|\*{4,})/i.test(value)

const RULES = [
  {
    id: 'jwt-key',
    label: 'Khoá ký JWT',
    severity: 'critical',
    re: /(?:&quot;|")Key(?:&quot;|")\s*:\s*(?:&quot;|")([^"&]{16,})/g
  },
  {
    id: 'conn-password',
    label: 'Mật khẩu trong chuỗi kết nối',
    severity: 'critical',
    re: /(?:Password|Pwd)=([^;"'&\s]{6,})/gi
  },
  {
    id: 'default-password',
    label: 'Mật khẩu mặc định / khoá dịch vụ trong cấu hình',
    severity: 'critical',
    re: /(?:&quot;|")(?:DefaultPassword|InitialPassword|ServiceKey|ApiKey)(?:&quot;|")\s*:\s*(?:&quot;|")([^"&]{6,})/g
  },
  {
    id: 'test-credential',
    label: 'Mật khẩu viết cứng trong test/kịch bản',
    severity: 'high',
    re: /(?:password|passwordInput|passwd)[^\n]{0,20}\.fill\(\s*['"]([^'"]{6,})['"]/gi
  },
  {
    id: 'prose-credential',
    label: 'Mật khẩu dev viết trong tài liệu/ghi chú',
    severity: 'high',
    re: /\b([A-Za-z][A-Za-z0-9_]{2,}@[A-Za-z][A-Za-z0-9_]{2,}[!#$%^&*][A-Za-z0-9!@#$%^&*_.]{0,40})/g,
    filter: value => !/@[a-z0-9-]+\.(?:com|vn|org|net|io|edu)\b/i.test(value)
  },
  {
    id: 'bearer-token',
    label: 'JWT thật bị dán vào file',
    severity: 'critical',
    re: /(eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,})/g
  },
  {
    id: 'private-key',
    label: 'Khoá riêng tư',
    severity: 'critical',
    re: /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----)/g
  },
  {
    id: 'cloud-key',
    label: 'Khoá dịch vụ đám mây (AWS/OpenAI/Google/GitHub)',
    severity: 'critical',
    re: /(AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|ghp_[A-Za-z0-9]{20,})/g
  }
]

const mask = value => {
  if (value.length <= 8) return '*'.repeat(value.length)
  return `${value.slice(0, 4)}…${value.slice(-3)} (${value.length} ký tự)`
}

const hits = []
for (const file of files) {
  const ext = (file.split('.').pop() ?? '').toLowerCase()
  if (BINARY.has(ext)) continue

  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  if (text.length > 8_000_000) text = text.slice(0, 8_000_000)

  text.split(/\r?\n/).forEach((line, index) => {
    for (const rule of RULES) {
      rule.re.lastIndex = 0
      let m
      while ((m = rule.re.exec(line)) !== null) {
        const value = m[1] ?? m[0]
        if (isPlaceholder(value.trim())) continue
        if (rule.filter && !rule.filter(value)) continue
        hits.push({
          rule: rule.id,
          label: rule.label,
          severity: rule.severity,
          file,
          line: index + 1,
          masked: mask(value)
        })
      }
    }
  })
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(hits, null, 2))
} else {
  const byRule = {}
  for (const h of hits) byRule[h.rule] = (byRule[h.rule] ?? 0) + 1
  console.log(`File đang track: ${files.length}`)
  console.log(`Chỗ nghi chứa bí mật: ${hits.length}`)
  console.log('Theo loại:', byRule)
  const order = { critical: 0, high: 1 }
  for (const h of hits.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line)) {
    console.log(`${h.severity.toUpperCase().padEnd(8)} ${h.rule.padEnd(16)} ${h.file}:${h.line}  ${h.masked}  — ${h.label}`)
  }
}
