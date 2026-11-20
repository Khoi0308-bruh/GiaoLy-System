# Báo cáo bí mật còn sót trong mã nguồn — 15/11/2026

> **Cập nhật 20/11/2026 — đã xử lý hết.** Các bản dump source tự sinh (bản `.md`/`.html` chứa toàn bộ mã nguồn cũ) và bản `.html` trùng của báo cáo tổng hợp đã được xoá khỏi repo ở commit `0cc7ae6f`; 3 giá trị mẫu còn lại trong tài liệu đã thay bằng `REPLACE_WITH_…` ở commit `e6e97b56`. Quét lại bằng `node tools/secret-scan.mjs`: **485 file đang track, 0 chỗ nghi chứa bí mật**.

Phạm vi lần quét gốc: **500 file đang được git track** (`git ls-files`) trên nhánh `feature/ui-polish`.
Cách quét: `node tools/secret-scan.mjs` (quét mẫu + loại trừ placeholder; giá trị in ra đã được che).
Kiểm chứng “còn hiệu lực hay không” bằng cách gọi thật vào API đang chạy ở `http://localhost:5000`.

## 1. Trạng thái hiện tại: 14 chỗ ban đầu → 0 chỗ

Lần quét 15/11/2026 (500 file track) tìm ra 14 chỗ chứa 6 giá trị nhạy cảm. Sau khi xoá các bản dump, xoay mật khẩu `thuky` và thay 3 giá trị mẫu bằng placeholder, quét lại ngày 20/11/2026 (485 file track):

```
File đang track: 485
Chỗ nghi chứa bí mật: 0
Theo loại: {}
```

Cả 14 chỗ đều đã xử lý — chi tiết theo mục 2.

## 2. Đã xử lý

### 2.1. Đã xoay vòng: mật khẩu tài khoản `thuky` (xử lý 16/11/2026)
- Trước khi xoay: `POST /api/v1/auth/login` với giá trị cũ → **200**.
- Đã đặt lại mật khẩu qua `POST /api/v1/users/{id}/reset-password` (thu hồi refresh token, bật `MustChangePassword`), giá trị cũ không còn dùng được → **401**.
- Giá trị cũ đã bị xoá khỏi tài liệu; không ghi mật khẩu tạm/mới vào bất kỳ file nào.

### 2.2. Đã gỡ khỏi repo: các bản dump source tự sinh (xử lý 20/11/2026)
10 chỗ chứa giá trị nhạy cảm nằm trong các bản dump source tự sinh (bản `.md` và `.html` chứa toàn bộ mã nguồn cũ) và bản `.html` trùng của báo cáo tổng hợp:

| Nhóm giá trị | Số chỗ | Còn hiệu lực? | Cách xử lý |
|---|---|---|---|
| Mật khẩu E2E copy từ dự án `AnhEmMotor-Store` | 1 | Không với GiaoLy (401) | Đã xoá cùng file dump — xem 2.3 |
| Khoá ký JWT dev cũ | 3 | Không (401 khi tự ký token) | Đã xoá cùng file dump — xem 2.3 |
| Mật khẩu mặc định dev cũ | 3 | Không (401 khi đăng nhập admin) | Đã xoá cùng file dump — xem 2.3 |
| Khoá JWT mẫu / mật khẩu admin mẫu / mật khẩu `sa` mẫu (bản HTML trùng) | 3 | Mẫu, không dùng được (401) | Đã xoá cùng file dump — xem 2.3 |

Cấu hình đang chạy lấy khoá từ biến môi trường (`Jwt__Key`), không hard-code — đúng như G0 đã sửa.

### 2.3. Dọn file
- Các bản dump source tự sinh và bản `.html` trùng của báo cáo tổng hợp đã bị xoá khỏi repo cùng script sinh dump ở commit `0cc7ae6f` (nhánh `feature/ui-polish`), nên nội dung cũ không còn được track và không còn xuất hiện khi quét lại.
- Bản `.md` của báo cáo tổng hợp vẫn giữ (đã chuyển vào `docs/`) vì là tài liệu do người viết; 3 giá trị mẫu trong đó đã thay bằng placeholder ở commit `e6e97b56` — xem mục 3.
- Nếu cần đối chiếu lại nội dung cũ, lấy từ lịch sử git tại commit trước `0cc7ae6f` — không khôi phục lại vào working tree.

### 2.4. Việc còn lại ở hệ thống khác: mật khẩu admin dự án AnhEmMotor
- Giá trị này nằm trong một E2E test copy từ dự án `AnhEmMotor-Store`; với GiaoLy **không** đăng nhập được (401), nhưng trên hệ thống AnhEmMotor thì đây là mật khẩu thật → phải đổi ở đó nếu hệ thống còn chạy.
- Việc xoá khỏi repo GiaoLy đã xong (2.3); đổi mật khẩu bên AnhEmMotor nằm ngoài phạm vi repo này.

## 3. Đã thay placeholder: 3 giá trị mẫu trong báo cáo tổng hợp (xử lý 20/11/2026)

Ba ví dụ trong `docs/BAO_CAO_TONG_HOP_TOAN_DIEN_DU_AN_GIAOLY.md` đã được thay ở commit `e6e97b56`:

| Dòng | Trước | Sau |
|---|---|---|
| 576 | mật khẩu `sa` mẫu (`Your…23!`) | `REPLACE_WITH_DB_PASSWORD` |
| 579 | khoá JWT mẫu (`Giao…ng!`) | `REPLACE_WITH_JWT_SIGNING_KEY_AT_LEAST_32_BYTES` |
| 592 | mật khẩu admin mẫu (`Admi…26!`) | `REPLACE_WITH_ADMIN_PASSWORD` |

Các giá trị cũ không đăng nhập/ký token được (401 đã đo) nên **không cần xoay vòng**; việc thay placeholder chỉ để người sau không copy nhầm vào cấu hình thật.

## 4. Đã kiểm và KHÔNG phải bí mật (không cần xoay)

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

## 5. Giới hạn của lần quét

- Quét **theo mẫu** trên nội dung text của file đang track; không phát hiện được bí mật bị mã hoá/obfuscate, không quét binary (ảnh, pdf, xlsx), không quét giá trị nằm trong database hay biến môi trường của máy.
- Lịch sử git **vẫn chứa** các giá trị đã nêu, kể cả sau khi xoá file. Xoá khỏi working tree không gỡ được khỏi lịch sử: mọi giá trị từng được track phải coi như **đã lộ vĩnh viễn**, biện pháp duy nhất là xoay vòng (P1 đã làm; các khoá/mật khẩu dev cũ không còn hiệu lực). Muốn gỡ hẳn khỏi lịch sử phải rewrite history (`git filter-repo`/BFG) rồi force-push — chưa làm, cần bạn duyệt vì sẽ đổi toàn bộ commit hash.
