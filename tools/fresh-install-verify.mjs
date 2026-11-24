// Kiểm chứng cài mới trọn vẹn trên một database rỗng:
//   seed (admin + 4 ngành) -> đổi mật khẩu lần đầu -> tạo ngành -> cấp lớp
//   -> niên khóa -> lớp -> kích hoạt niên khóa -> tạo đoàn sinh -> xếp lớp.
// Chỉ gọi API thật; in ra mã trạng thái + id của từng bước.
//   node tools/fresh-install-verify.mjs
// Biến môi trường:
//   BASE_URL (mặc định http://localhost:5100)
//   ADMIN_INITIAL_PASSWORD, ADMIN_NEW_PASSWORD — bắt buộc, không hard-code mật khẩu trong repo.

const BASE = process.env.BASE_URL ?? 'http://localhost:5100';
const INITIAL_PASSWORD = required('ADMIN_INITIAL_PASSWORD');
const NEW_PASSWORD = required('ADMIN_NEW_PASSWORD');

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Thiếu biến môi trường ${name}.`);
    process.exit(1);
  }
  return value;
}

let failures = 0;
const log = (step, detail) => console.log(`${step}: ${detail}`);

async function call(method, path, { token, body } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  return { status: res.status, ok: res.ok, data };
}

function expect(label, result, allowed) {
  const pass = allowed.includes(result.status);
  if (!pass) {
    failures++;
    log(label, `THẤT BẠI (HTTP ${result.status}) ${JSON.stringify(result.data)}`);
  }
  return pass;
}

async function login(password) {
  return call('POST', '/api/v1/auth/login', { body: { username: 'admin', password } });
}

async function main() {
  // 0. Seed của một cài mới
  const branches = await call('GET', '/api/v1/branches');
  expect('0a. Seed ngành', branches, [401, 200]); // chưa đăng nhập -> 401 là đúng
  log('0a. GET /branches (chưa đăng nhập)', `HTTP ${branches.status}`);

  // 1. Đăng nhập lần đầu bằng mật khẩu khởi tạo
  const firstLogin = await login(INITIAL_PASSWORD);
  expect('1a. Đăng nhập admin (mật khẩu khởi tạo)', firstLogin, [200]);
  if (!firstLogin.ok) return finish();
  const firstToken = firstLogin.data.accessToken;
  log('1a. Đăng nhập admin', `HTTP ${firstLogin.status}, mustChangePassword=${firstLogin.data.user?.mustChangePassword}`);

  // 2. Bắt buộc đổi mật khẩu lần đầu
  const gated = await call('GET', '/api/v1/class-levels', { token: firstToken });
  expect('2a. Chặn khi chưa đổi mật khẩu', gated, [403]);
  log('2a. GET /class-levels trước khi đổi mật khẩu', `HTTP ${gated.status} (mong đợi 403)`);

  const change = await call('POST', '/api/v1/auth/change-password', {
    token: firstToken,
    body: { currentPassword: INITIAL_PASSWORD, newPassword: NEW_PASSWORD }
  });
  expect('2b. Đổi mật khẩu lần đầu', change, [204, 200]);
  log('2b. POST /auth/change-password', `HTTP ${change.status}`);

  // 3. Đăng nhập lại bằng mật khẩu mới
  const relogin = await login(NEW_PASSWORD);
  expect('3. Đăng nhập bằng mật khẩu mới', relogin, [200]);
  if (!relogin.ok) return finish();
  const token = relogin.data.accessToken;
  log('3. Đăng nhập lại', `HTTP ${relogin.status}, role=${relogin.data.user?.roleCode}`);

  // 4. Danh mục ngành sau seed
  const branchList = await call('GET', '/api/v1/branches', { token });
  expect('4. Danh sách ngành đã seed', branchList, [200]);
  log('4. GET /branches', `HTTP ${branchList.status}, soLuong=${Array.isArray(branchList.data) ? branchList.data.length : '?'}`);

  // 5. Tạo ngành mới
  const branchCode = 'TSTV';
  const branch = await call('POST', '/api/v1/branches', {
    token,
    body: { code: branchCode, name: 'Ngành Kiểm Thử', minAge: 6, maxAge: 18, sortOrder: 99 }
  });
  expect('5. Tạo ngành', branch, [200, 201]);
  const branchId = branch.data?.id;
  log('5. POST /branches', `HTTP ${branch.status}, id=${branchId}, code=${branch.data?.code}`);

  // 6. Tạo cấp lớp thuộc ngành
  const level = await call('POST', '/api/v1/class-levels', {
    token,
    body: { branchId, code: 'TSTV-C1', name: 'Kiểm Thử 1', levelKey: 90, nextLevelId: null, sortOrder: 90 }
  });
  expect('6. Tạo cấp lớp', level, [200, 201]);
  const classLevelId = level.data?.id;
  log('6. POST /class-levels', `HTTP ${level.status}, id=${classLevelId}, name=${level.data?.name}`);

  // 7. Tạo niên khóa (Planned)
  const year = await call('POST', '/api/v1/academic-years', {
    token,
    body: { name: 'NK Kiểm Thử 2026-2027', startDate: '2026-09-01', endDate: '2027-05-31' }
  });
  expect('7. Tạo niên khóa', year, [200, 201]);
  const yearId = year.data?.id;
  log('7. POST /academic-years', `HTTP ${year.status}, id=${yearId}, status=${year.data?.status}`);

  // 8. Tạo lớp trong niên khóa
  const classRoom = await call('POST', `/api/v1/academic-years/${yearId}/classrooms`, {
    token,
    body: { classLevelId, section: 'A', roomName: 'P.101' }
  });
  expect('8. Tạo lớp học', classRoom, [200, 201]);
  const classRoomId = classRoom.data?.id;
  log('8. POST /academic-years/{id}/classrooms', `HTTP ${classRoom.status}, id=${classRoomId}, ten=${classRoom.data?.className}`);

  // 8b. Cài mới đã seed sẵn một niên khóa đang hoạt động, mà hệ thống chỉ cho phép
  // một niên khóa hoạt động tại một thời điểm — phải chốt niên khóa cũ trước.
  const active = await call('GET', '/api/v1/academic-years/active', { token });
  if (active.ok && active.data?.id) {
    const closed = await call('POST', `/api/v1/academic-years/${active.data.id}/close`, { token });
    expect('8b. Chốt niên khóa đang hoạt động', closed, [200]);
    log('8b. POST /academic-years/{id}/close', `HTTP ${closed.status}, id=${active.data.id}`);
  }

  // 9. Kích hoạt niên khóa (yêu cầu đã có lớp)
  const activate = await call('POST', `/api/v1/academic-years/${yearId}/activate`, { token });
  expect('9. Kích hoạt niên khóa', activate, [200]);
  log('9. POST /academic-years/{id}/activate', `HTTP ${activate.status}, status=${activate.data?.status}`);

  // 10. Tạo đoàn sinh mới (chưa xếp lớp)
  const student = await call('POST', '/api/v1/students', {
    token,
    body: {
      holyName: 'Giuse',
      fullName: 'Nguyễn Văn Kiểm Thử',
      birthDate: '2012-05-20',
      gender: 'Nam',
      branchId,
      area: 'Giáo xứ Kiểm Thử',
      address: '123 Đường Kiểm Thử',
      hasPhotoConsent: false,
      classRoomId: null,
      guardians: [],
      confirmWarning: true
    }
  });
  expect('10. Tạo đoàn sinh', student, [200, 201]);
  const studentId = student.data?.id;
  log('10. POST /students', `HTTP ${student.status}, id=${studentId}, code=${student.data?.code}, status=${student.data?.status}`);

  // 11. Xếp lớp cho đoàn sinh
  const enroll = await call('POST', `/api/v1/classrooms/${classRoomId}/enrollments`, {
    token,
    body: { studentIds: [studentId], note: 'Kiểm chứng cài mới' }
  });
  expect('11. Xếp lớp', enroll, [200, 201]);
  log('11. POST /classrooms/{id}/enrollments', `HTTP ${enroll.status}, soGhiDanh=${Array.isArray(enroll.data) ? enroll.data.length : '?'}`);

  // 12. Kiểm chứng đọc lại: sổ lớp
  const roster = await call('GET', `/api/v1/classrooms/${classRoomId}/roster`, { token });
  expect('12. Sổ lớp', roster, [200]);
  const rosterNames = (roster.data?.students ?? []).map(s => s.fullName);
  const rosterOk = rosterNames.includes('Nguyễn Văn Kiểm Thử');
  if (!rosterOk) failures++;
  log('12. GET /classrooms/{id}/roster', `HTTP ${roster.status}, hocSinh=${JSON.stringify(rosterNames)}`);

  // 13. Kiểm chứng đọc lại: ghi danh của đoàn sinh
  const studentEnrollments = await call('GET', `/api/v1/students/${studentId}/enrollments`, { token });
  expect('13. Ghi danh của đoàn sinh', studentEnrollments, [200]);
  const enrolled = (studentEnrollments.data ?? []).find(e => e.classRoomId === classRoomId && e.academicYearId === yearId);
  if (!enrolled) failures++;
  log('13. GET /students/{id}/enrollments', `HTTP ${studentEnrollments.status}, soLuong=${Array.isArray(studentEnrollments.data) ? studentEnrollments.data.length : '?'}, trangThai=${enrolled?.status}`);

  // 14. Kiểm chứng đọc lại: danh sách lớp trong niên khóa
  const classList = await call('GET', `/api/v1/academic-years/${yearId}/classrooms`, { token });
  expect('14. Danh sách lớp của niên khóa', classList, [200]);
  const foundClass = (classList.data ?? []).find(c => c.id === classRoomId);
  if (!foundClass) failures++;
  log('14. GET /academic-years/{id}/classrooms', `HTTP ${classList.status}, siSo=${foundClass?.studentCount}`);

  finish();
}

function finish() {
  console.log(failures === 0 ? '\nKẾT QUẢ: PASS — toàn bộ chuỗi cài mới chạy đúng.' : `\nKẾT QUẢ: FAIL — ${failures} bước không đạt.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main().catch(err => {
  console.error('Lỗi không mong đợi:', err);
  process.exitCode = 1;
});
