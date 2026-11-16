# Ma trận phân quyền endpoint (G1-1 / G1-2 hỗ trợ kiểm chứng)

Bộ công cụ đọc mã nguồn controller, lập danh sách endpoint có `[RequirePermission]`,
rồi gọi thật từng endpoint với token của từng vai trò để tìm endpoint **bị khoá nhầm**
hoặc **hở quyền**.

## Cách chạy

```bash
# 1. API đang chạy ở localhost:5000 (ReverseProxy mặc định tin loopback)
# 2. Quét controller -> endpoints.json
node tools/authz-matrix/scan-endpoints.mjs

# 3. Lấy quyền của từng vai trò từ DB (mỗi dòng: Code|RoleId|PermissionCode)
sqlcmd -S . -E -d GiaoLyDB_Vision2 -h -1 -W -s"|" -Q "SET NOCOUNT ON; \
  SELECT r.Code, CONVERT(varchar(36), r.Id), ISNULL(p.Code,'') FROM Roles r \
  LEFT JOIN RolePermissions rp ON rp.RoleId=r.Id \
  LEFT JOIN Permissions p ON p.Id=rp.PermissionId ORDER BY r.Code" > tools/authz-matrix/roles.tsv

# 4. Chạy ma trận (cần khoá JWT dev + id/stamp của một user đang hoạt động)
export ADMIN_ID=<guid user>; export ADMIN_STAMP=<guid security stamp>
export JWT_KEY="<Jwt:Key của môi trường dev>"
node tools/authz-matrix/run-matrix.mjs   # -> results.json
node tools/authz-matrix/analyze.mjs      # -> báo cáo
```

Mỗi request gửi kèm `X-Forwarded-For` riêng nên không dính rate limit
(loopback là proxy tin cậy theo cấu hình `ReverseProxy` mặc định).

## Cách đọc kết quả

| Status | Ý nghĩa |
|---|---|
| 403 | Bị từ chối — có thể do **thiếu quyền** hoặc do **scope lớp/ngành** |
| 415 / 401 | Bị chặn **trước** lớp phân quyền (content-type / token) → không kết luận được về quyền |
| khác | Đã đi qua lớp phân quyền (kể cả 400/404 do dữ liệu test) |

`analyze.mjs` loại trừ endpoint mà **chính SystemAdmin cũng bị 403** — đó là chặn ở lớp
scope, không phải phân quyền.

## Kết quả lần chạy 15/11/2026

- 393 endpoint có route; **314** endpoint có `RequirePermission`; 83 mã quyền khác nhau;
  không endpoint nào yêu cầu nhiều hơn 1 quyền.
- 6 vai trò × 314 endpoint = 1.884 lượt gọi thật.
- **0 endpoint bị khoá nhầm ở lớp quyền**, **0 endpoint hở quyền**.
- 6 endpoint luôn trả 403 cho mọi vai trò (kể cả SystemAdmin) vì kiểm tra scope
  `CanAccessClassRoomAsync` — DB hiện **không có lớp học nào**, nên chưa kết luận được:
  - `GET /api/v1/classrooms/{id}/bouquets`, `POST …/bouquets`, `GET …/bouquets/leaderboard`
  - `GET /api/SpiritualBouquet/classroom/{id}`
  - `GET /api/v1/duty-assignments/classroom/{id}`, `GET /api/DutyAssignment/classroom/{id}`
- 13 lượt gọi nhận **415** (import Excel / upload ảnh) — 415 xuất hiện **trước** xác thực
  (gọi ẩn danh cũng 415). Gửi lại bằng `multipart/form-data`: Catechist → **403**,
  ẩn danh → **401**, tức lớp phân quyền vẫn đúng.
- Ngoài phạm vi nhưng phát hiện khi kiểm: `GET /swagger/v1/swagger.json` trả **500** do
  trùng `schemaId` `IssueCertificateRequest` giữa `GiaoLy.API.Controllers` và
  `GiaoLy.Application.Certificates.Dtos`. **Đã xử lý 16/11/2026:** lớp trùng trong
  `GiaoLy.API.Controllers` bị xoá cùng controller legacy (G2-2); lỗi 500 còn lại của Swagger
  là `DocumentsController.UploadDocument` dùng `[FromForm] IFormFile` — đã gom vào form model
  `UploadDocumentForm`. `GET /swagger/v1/swagger.json` hiện trả **200** (148 path, 72 schema).
