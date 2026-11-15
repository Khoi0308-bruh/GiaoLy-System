const fs = require('fs');
const path = require('path');

function parseCsv(content) {
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  
  function parseLine(line) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        res.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    res.push(cur.trim());
    return res;
  }

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] || '';
    });
    rows.push(obj);
  }
  return rows;
}

function norm(p) {
  return p.replace(/\{[^}]+\}/g, '{}').replace(/\/+$/, '').toLowerCase();
}

const apiCatalogPath = path.resolve(__dirname, 'api-catalog.csv');
const permMatrixPath = path.resolve(__dirname, 'permission-matrix.csv');
const screensJsonPath = path.resolve(__dirname, '../layer/screens.json');

const catRows = parseCsv(fs.readFileSync(apiCatalogPath, 'utf8'));
const C = {};
catRows.forEach(r => {
  const method = (r['Phương thức'] || '').toUpperCase();
  const rawPath = (r['Đường dẫn'] || '').replace(/^\/api\/v1/, '');
  C[`${method} ${norm(rawPath)}`] = r;
});

const permRows = parseCsv(fs.readFileSync(permMatrixPath, 'utf8'));
const perms = new Set(permRows.map(r => r['Quyền']).filter(Boolean));

const screens = JSON.parse(fs.readFileSync(screensJsonPath, 'utf8'));

const INTERNAL = [
  'GET /health',
  'GET /health/ready'
];
const internalSet = new Set(INTERNAL.map(s => {
  const [m, p] = s.split(' ');
  return `${m.toUpperCase()} ${norm(p)}`;
}));

const errs = [];
const warns = [];
const covered = {};

screens.forEach(s => {
  const eps = s.endpoints || [];
  eps.forEach(epStr => {
    const [m, ...pParts] = epStr.split(' ');
    const p = pParts.join(' ');
    const k = `${m.toUpperCase()} ${norm(p)}`;
    if (!C[k]) {
      errs.push(`${s.route}: endpoint không có trong danh mục backend: ${m} ${p}`);
    } else {
      if (!covered[k]) covered[k] = [];
      covered[k].push(s.route);
    }
  });

  if (!perms.has(s.perm) && s.perm !== 'PUBLIC' && s.perm !== 'AUTHED') {
    errs.push(`${s.route}: quyền xem màn hình không có: ${s.perm}`);
  }

  (s.actions || []).forEach(act => {
    const pm = act.permission || act.perm;
    if (pm && !perms.has(pm) && pm !== 'PUBLIC' && pm !== 'AUTHED') {
      errs.push(`${s.route}: nút '${act.label}' dùng quyền không có: ${pm}`);
    }
  });

  if (s.perm !== 'PUBLIC' && s.perm !== 'AUTHED' && eps.length > 0) {
    const [m, ...pParts] = eps[0].split(' ');
    const first = C[`${m.toUpperCase()} ${norm(pParts.join(' '))}`];
    if (first && first['Quyền'] !== s.perm && first['Quyền'] !== 'AUTHED' && first['Quyền'] !== 'PUBLIC') {
      warns.push(`${s.route}: quyền xem (${s.perm}) khác quyền endpoint chính (${first['Quyền']})`);
    }
  }
});

Object.keys(C).forEach(k => {
  if (!covered[k] && !internalSet.has(k)) {
    errs.push(`Endpoint chưa có màn hình nào dùng: ${k} (${C[k]['Đường dẫn']} - ${C[k]['Quyền']})`);
  }
});

const used = new Set();
screens.forEach(s => {
  if (s.perm !== 'PUBLIC' && s.perm !== 'AUTHED') used.add(s.perm);
  (s.actions || []).forEach(act => {
    const pm = act.permission || act.perm;
    if (pm && pm !== 'PUBLIC' && pm !== 'AUTHED') used.add(pm);
  });
});

const unused = [...perms].filter(p => !used.has(p)).sort();
unused.forEach(u => warns.push(`Quyền chưa có nút hay màn hình nào dùng: ${u}`));

screens.forEach(s => {
  const have = new Set((s.actions || []).map(a => a.permission || a.perm).filter(Boolean));
  if (s.perm) have.add(s.perm);

  (s.endpoints || []).forEach(epStr => {
    const [m, ...pParts] = epStr.split(' ');
    const r = C[`${m.toUpperCase()} ${norm(pParts.join(' '))}`];
    if (r && r['Quyền'] !== 'PUBLIC' && r['Quyền'] !== 'AUTHED' && !have.has(r['Quyền'])) {
      errs.push(`${s.route}: endpoint ${m} ${pParts.join(' ')} cần quyền ${r['Quyền']} nhưng màn hình không có nút hoặc quyền xem tương ứng`);
    }
  });
});

console.log(`Màn hình: ${screens.length} | Endpoint backend: ${Object.keys(C).length} | Có màn hình: ${Object.keys(covered).length} | Giao diện không dùng (giám sát): ${internalSet.size}`);
console.log(`LỖI (${errs.length}):`);
errs.forEach(e => console.log(' -', e));
console.log(`CẢNH BÁO (${warns.length}):`);
warns.forEach(w => console.log(' -', w));

if (errs.length > 0) {
  process.exit(1);
} else {
  console.log('✅ FE LINT PASS: 100% endpoint coverage, không có lỗi phân quyền!');
}
