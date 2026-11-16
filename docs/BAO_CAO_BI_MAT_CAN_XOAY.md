# Báo cáo bí mật còn sót trong mã nguồn — 15/11/2026

Phạm vi: **500 file đang được git track** (`git ls-files`) trên nhánh `feature/ui-polish`.
Cách quét: `node tools/secret-scan.mjs` (quét mẫu + loại trừ placeholder; giá trị in ra đã được che).
Kiểm chứng "còn hiệu lực hay không" bằng cách gọi thật vào API đang chạy ở `http://localhost:5000`.

## 1. Kết quả: 14 chỗ chứa giá trị nhạy cảm, 6 giá trị khác nhau

| # | File : dòng | Loại | Giá trị (đã che) | Còn hiệu lực? |
|---|---|---|---|---|
| 1 | `docs/KE_HOACH_SUA_LOI_TOAN_DIEN.md:602` | Mật khẩu dev `thuky` | `ThuK…26!` (14) | **CÓ — login 200** |
| 2 | `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.md:408` | Mật khẩu trong E2E copy từ dự án khác | `AnhE…r1@` (12) | Không với GiaoLy (401) |
| 3 | `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.md:610` | Khoá ký JWT dev cũ | `Giao…OD!` (60) | Không (401) |
| 4 | `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.html:1164` | (trùng #3, bản HTML) | `Giao…OD!` | Không (401) |
| 5 | `full_project_source_code.html:5154` | (trùng #3, bản HTML) | `Giao…OD!` | Không (401) |
| 6 | `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.md:613` | Mật khẩu mặc định dev cũ | `Dev_…26!` (29) | Không (401) |
| 7 | `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.html:1167` | (trùng #6) | `Dev_…26!` | Không (401) |
| 8 | `full_project_source_code.html:5159` | (trùng #6) | `Dev_…26!` | Không (401) |
| 9 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.md:579` | Khoá JWT mẫu trong báo cáo | `Giao…ng!` (60) | Không (401) |
| 10 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.html:767` | (trùng #9) | `Giao…ng!` | Không (401) |
| 11 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.md:592` | Mật khẩu admin mẫu | `Admi…26!` (24) | Không (401) |
| 12 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.html:780` | (trùng #11) | `Admi…26!` | Không (401) |
| 13 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.md:576` | Mật khẩu `sa` trong chuỗi kết nối mẫu | `Your…23!` (22) | Mẫu, không phải mật khẩu thật |
| 14 | `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.html:764` | (trùng #13) | `Your…23!` | Mẫu |

Ghi chú: #3–#8 và #9–#12 là **cùng một giá trị lặp lại** ở bản `.md` và `.html` của hai tài liệu dump source code.

## 2. Danh sách cần xoay vòng (theo thứ tự ưu tiên)

### P1 — Xoay ngay: mật khẩu tài khoản `thuky` (đang dùng được)
- Bằng chứng: `POST /api/v1/auth/login` với `thuky` + giá trị trong tài liệu → **200**.
- Giá trị nằm trong `docs/KE_HOACH_SUA_LOI_TOAN_DIEN.md:602`, một file đã commit và sẽ còn trong lịch sử git.
- Việc cần làm:
  1. Đặt lại mật khẩu `thuky` (qua `PUT /api/v1/users/{id}/reset-password` hoặc SQL `PasswordHash`), mật khẩu mới **không** được ghi vào tài liệu.
  2. Thay dòng 602 bằng mô tả không chứa giá trị (ví dụ: "mật khẩu dev của `thuky` đã được đặt lại khi kiểm thử 403").
  3. Vì giá trị đã nằm trong commit, coi như đã lộ vĩnh viễn — chỉ xoay mới vô hiệu hoá được.

### P2 — Xoay ở hệ thống khác: mật khẩu admin dự án AnhEmMotor
- `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.md:408` chứa mật khẩu viết cứng trong một E2E test copy từ dự án `AnhEmMotor-Store`.
- Với GiaoLy giá trị này **không** đăng nhập được (401), nhưng trên hệ thống AnhEmMotor thì đây là mật khẩu thật → phải đổi ở đó nếu hệ thống còn chạy.
- Đồng thời xoá/che dòng này trong file dump và trong `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.html` (khoảng dòng 932).

### P3 — Khoá JWT dev cũ và mật khẩu mặc định cũ trong bản dump source
- `Giao…OD!` (khoá JWT) và `Dev_…26!` (mật khẩu mặc định) nằm trong `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.{md,html}` và `full_project_source_code.html`.
- Kiểm chứng: token tự ký bằng khoá này gọi `GET /api/v1/auth/me` → **401**, và mật khẩu này đăng nhập admin → **401**. Nghĩa là **cấu hình hiện tại không còn dùng chúng**.
- Vẫn phải xoay **nếu** khoá/mật khẩu này từng được dùng ở môi trường còn sống (staging/production cũ). Nếu chưa từng deploy với cấu hình đó thì chỉ cần xoá khỏi tài liệu.
- Cấu hình đang chạy lấy khoá từ biến môi trường (`Jwt__Key`), không hard-code — đúng như G0 đã sửa.

### P4 — Giá trị mẫu trong báo cáo tổng hợp
- `Your…23!` (`sa`), `Giao…ng!` (JWT), `Admi…26!` (admin) chỉ là ví dụ trong `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.{md,html}`.
- Không giá trị nào đăng nhập/ký token được (401 đã đo) → **không cần xoay**, nhưng nên thay bằng `REPLACE_WITH_…` để người sau không copy nhầm vào cấu hình thật.

## 3. Đã kiểm và KHÔNG phải bí mật (không cần xoay)

| Vị trí | Lý do |
|---|---|
| `GiaoLy.API/appsettings.json:12,19` | chỉ là `PLACEHOLDER_SET_IN_ENVIRONMENT_OR_DEVELOPMENT_JSON` |
| `GiaoLy.API/appsettings.Production.json:14,39,42,3` | `REPLACE_WITH_…` — cố ý để trống, validator bắt buộc khi chạy Production |
| `GiaoLy.API/appsettings.json:3`, `AppDbContextFactory.cs:17`, `tools/SchemaRef/Program.cs:17` | `Trusted_Connection=True` (Windows auth, không có mật khẩu) |
| `docs/RUNBOOK.md:51,54,67` | `${DB_PASSWORD}`, `${ADMIN_PASSWORD}` — biến môi trường, đúng cách |
| `e2e-tests/tests/admin.spec.ts` | đọc `E2E_USERNAME`/`E2E_PASSWORD` từ env, không hard-code |
| `GiaoLy.API/Controllers/JobsController.cs:55-62` | không có khoá mặc định; thiếu `App:ServiceKey` → **503 fail-closed** |
| `GiaoLy.API/Services/DbSeeder.cs` | lấy mật khẩu qua `FirstUsableSecret(...)`, không còn fallback `"123456789"` như bản dump cũ |
| Toàn repo | không có file `.env`, không có khoá riêng tư (`BEGIN PRIVATE KEY`), không có khoá AWS/OpenAI/Google/GitHub, không có JWT thật bị dán vào file |

## 4. Giới hạn của lần quét

- Quét **theo mẫu** trên nội dung text của file đang track; không phát hiện được bí mật bị mã hoá/obfuscate, không quét binary (ảnh, pdf, xlsx), không quét giá trị nằm trong database hay biến môi trường của máy.
- Lịch sử git **có** chứa các giá trị trên (kể cả trước commit dọn repo). Xoá khỏi file hiện tại không gỡ được khỏi lịch sử; muốn gỡ phải rewrite history (chưa làm, cần bạn duyệt).
- Các file dump `TOAN_BO_SOURCE_CODE_DU_AN_GIAOLY.*`, `full_project_source_code.html`, `BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.*` hiện vẫn được track; cân nhắc bỏ track các bản dump này vì chúng chứa toàn bộ source và cấu hình cũ.
