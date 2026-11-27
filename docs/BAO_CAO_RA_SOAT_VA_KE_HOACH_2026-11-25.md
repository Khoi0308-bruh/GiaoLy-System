# BÁO CÁO RÀ SOÁT & KẾ HOẠCH SỬA CHỮA — HỆ SINH THÁI GIAOLY

**Ngày:** 25/11/2026 · **Phạm vi:** `GiaoLy.API` (.NET 10), `web-admin` (Nuxt 4, :3000), `web-portal` (Nuxt 4, :3001), `layer` (dùng chung), SQL Server `GiaoLyDB_Vision2`
**Trạng thái:** ĐÃ RÀ SOÁT — CHƯA SỬA CODE (theo yêu cầu dừng ở Giai đoạn 4)

---

## 0. CÁCH KIỂM CHỨNG (bằng chứng thực tế)

| Hạng mục | Lệnh / công cụ | Kết quả |
|---|---|---|
| API khởi động | `dotnet run` (Development, `Jwt__Key` env) | 200 `/health`, `{"database":"Connected"}` |
| API build | `dotnet build GiaoLySystem.slnx -c Release` | **0 warning, 0 error** |
| Unit test backend | `dotnet test GiaoLy.Tests` | **75/75 pass** (3s) |
| web-admin build | `pnpm run build` | **thành công**, 2m07s, 2.39 MB (576 kB gzip) |
| web-portal build | `pnpm run build` | **thành công**, 3m14s, 22.7 MB (5.33 MB gzip) |
| Type-check | `pnpm run typecheck` (2 app) | **0 lỗi** |
| Lint | `pnpm run lint` (2 app) | **0 error**, 6 warning (admin) / 4 warning (portal) — `vue/max-attributes-per-line` |
| API smoke 43 endpoint | script `tmp-review/smoke-get.mjs` | tất cả **200**, chậm nhất **140 ms** |
| API nghiệp vụ + bảo mật | `tmp-review/api-audit.mjs` | **33/35 pass** (2 "fail" là do test kỳ vọng sai, xem §4) |
| Đồng bộ admin ↔ portal | `tmp-review/sync-audit.mjs` | **25/25 pass** |
| Giao diện tự động | Playwright 1440×900, 1366×768, 1920×1080, 1024×700, 375×812, 390×844 | 13 trang admin + 8 trang portal, có ảnh tại `docs/screenshots/audit/` |
| Quét lỗ hổng | `pnpm audit --prod`, `dotnet list package --vulnerable` | xem §2 |

> Lưu ý minh bạch: `api-audit.mjs` báo "FAIL" ở 2 mục **"Tìm kiếm chống SQL injection"** (trả 3 kết quả) và **"Tin tức công khai"** (404). Kiểm tra lại: (a) truy vấn dùng LINQ tham số hoá, `total=3 ≠ 104` nên **không có injection** — chỉ là test kỳ vọng `≤1` quá chặt; (b) đường dẫn đúng là `/api/v1/public/news` (200) chứ không phải `/api/v1/news` — test gọi sai route. **Không phải lỗi sản phẩm.**

---

## 1. TỔNG QUAN HIỆN TRẠNG

### Điểm mạnh (đã kiểm chứng)
1. **Kiến trúc backend rất tốt**: Clean Architecture, `RequirePermission` theo DB, `SessionValidationMiddleware` đối chiếu `SecurityStamp` (cache 60s), refresh token lưu **hash** + rotation + thu hồi toàn bộ khi phát hiện dùng lại.
2. **Bảo mật nền tảng đúng**: BCrypt cost 12, khoá tài khoản sau 5 lần sai/15 phút, refresh cookie `HttpOnly + SameSite=Strict + Secure khi HTTPS`, CORS whitelist, security headers (CSP, XFO=DENY, nosniff), rate limit theo policy (login 10/phút, refresh 60/phút, export 10/giờ, upload 20/giờ), CSP chặn origin lạ (đã test).
3. **Đồng bộ admin → portal chính xác**: sửa họ tên ở admin → portal đổi ngay; tạo thông báo `Guardians` → portal nhận; **IDOR bị chặn 404** khi phụ huynh truy cập trẻ không liên kết; portal **không trả** `StudentNotes`/sức khoẻ nội bộ.
4. **Phân quyền chặt**: phụ huynh gọi `/students`, `/users` → **403**; tài khoản `MustChangePassword` bị chặn toàn bộ API nghiệp vụ (**403**) đúng thiết kế.
5. **Hiệu năng API tốt**: 43 endpoint, p95 < 150 ms trên DB 183 đoàn sinh; không có N+1 rõ rệt ở danh sách (một truy vấn chiếu thẳng DTO).
6. **Giao diện portal chuyên nghiệp**, đồng nhất; trang phụ huynh hiển thị đúng dữ liệu con, thông báo, breadcrumb, dark mode.

### Điểm yếu (mức độ nghiêm trọng)
| # | Vấn đề | Mức độ |
|---|---|---|
| 1 | Cơ sở dữ liệu dev bị **ô nhiễm dữ liệu test** (96/183 đoàn sinh, 48/56 tài khoản, 61 lớp tên "(E2E)", thông báo "Test") | **Nghiêm trọng (vận hành)** |
| 2 | Sidebar **che mất 6 mục điều hướng** (nav 1106 px trong khung cuộn 900 px) | **Cao** |
| 3 | Trang danh sách đoàn sinh gây **cuộn ngang toàn trang** (doc 840 px / viewport 375 px) | **Cao** |
| 4 | 59 lỗ hổng npm (1 critical) + 1 lỗ hổng NuGet trung bình | **Cao** |
| 5 | Bảng đoàn sinh thiếu header cố định, phân trang chỉ prev/next, mobile phải cuộn ngang | **Trung bình** |
| 6 | 99/104 đoàn sinh không có phụ huynh/liên hệ → cột "Phụ huynh" trống trơn | **Trung bình** (dữ liệu) |
| 7 | 63 enrollment niên khóa hiện tại nhưng chỉ 5 ở trạng thái `Active`; 58 `Promoted` | **Trung bình** (dữ liệu) |
| 8 | Dashboard "Huynh trưởng & GLV" = 0, 61 lớp chưa có GLV chủ nhiệm | **Trung bình** (dữ liệu) |
| 9 | Mỗi trang portal công khai bắn `/auth/refresh` → **1 lỗi 401 trong console** | **Thấp** |
| 10 | Badge "Hệ thống" ở trang Vai trò bị xuống 2 dòng; tiêu đề `/admin/trai` tràn ngang ở ≤1024 px | **Thấp** |

---

## 2. BẢNG LỖI CHI TIẾT

| ID | Chức năng | Mô tả | Vị trí file (dòng) | Mức độ | Nguyên nhân gốc |
|---|---|---|---|---|---|
| **UI-01** | Khung quản trị (mọi trang admin) | Thanh điều hướng dài 1106 px nằm trong khung cao 100 vh có `overflow-y-auto` → các mục cuối ("Lịch phụng vụ", "Báo cáo", "Người dùng", "Vai trò", "Nhật ký", "Cấu hình", "Tác vụ nền") **không hiển thị**, phải cuộn riêng trong sidebar; ở 1366×768 chỉ thấy 11/27 mục. Không có bóng/scrollbar gợi ý nên nhìn như "sidebar bị hụt / thừa khoảng trống". | `layer/app/components/AppShell.vue:30`, `:60`, `:81-...` | **Cao** | Dùng `lg:h-screen` + `overflow-y-auto` trên `<aside>` thay vì tách header cố định và vùng nav cuộn riêng; nav 27 mục/7 nhóm không vừa 1 màn hình. |
| **UI-02** | Danh sách đoàn sinh | **Cuộn ngang toàn trang**: `document.scrollWidth = 840 px` khi viewport 375 px (cuộn được 465 px), `1108 px` khi viewport 1024 px. Ảnh hưởng trực tiếp cảm giác "thanh điều hướng thừa khoảng trống" khi người dùng kéo ngang. Đã xác định thủ phạm: ẩn `<table>`/khối `.overflow-x-auto` → `scrollWidth` về đúng 375. | `layer/app/pages/admin/doan-sinh/index.vue:299-300` | **Cao** | `table.min-w-[860px]` nằm trong `div.overflow-x-auto` lồng trong grid `260px 1fr`; Chromium vẫn đưa phần tràn vào vùng cuộn của document (không có `overflow-hidden`/`max-w-full` chặn ở khối cha). |
| **UI-03** | Danh sách đoàn sinh | `thead` là `position: static` → cuộn xuống mất tiêu đề cột (yêu cầu "header cố định"). | `.../doan-sinh/index.vue:301-311` | **Trung bình** | Thiếu `sticky top-0 z-10` + nền đục cho `thead`. |
| **UI-04** | Danh sách đoàn sinh | Phân trang chỉ có ←/→ và chữ "Trang 1/6"; không có số trang, không chọn pageSize, không nút "Xoá bộ lọc", không tổng kết bộ lọc. | `.../doan-sinh/index.vue:390-410` | **Trung bình** | Thiết kế tối giản; API đã hỗ trợ `page/pageSize/sortBy/sortOrder`. |
| **UI-05** | Danh sách đoàn sinh (mobile) | Bảng 860 px phải cuộn ngang trong khung 343 px, scrollbar ẩn trên mobile → người dùng không biết còn cột; nút Xuất/Nhập Excel chiếm 2 dòng; 4 thẻ số liệu đẩy bảng xuống dưới màn hình đầu. | `.../doan-sinh/index.vue:299`, `:243-258` | **Trung bình** | Chưa có chế độ card cho `<md`; toolbar chưa sticky. |
| **UI-06** | Danh sách đoàn sinh | Cột "Phụ huynh" hiển thị "–" cho 99/104 dòng; nhiều dòng "Mã" = "–"; 1 dòng "(Chưa có tên)" với avatar "?". Nhìn "rỗng và thiếu chuyên nghiệp". | `.../doan-sinh/index.vue:328-360`; dữ liệu DB | **Trung bình** | Dữ liệu thiếu (không phải lỗi component) + UI không phân biệt "chưa cập nhật" với "trống". |
| **UI-07** | Danh sách đoàn sinh | Khai báo `bloodType`, `allergies` trong `StudentRow` nhưng API không trả → code chết. | `.../doan-sinh/index.vue:19-20` | **Thấp** | DTO frontend lệch `StudentSummaryResponse`. |
| **UI-08** | Vai trò & phân quyền | Badge "Hệ thống" xuống 2 dòng ("Hệ / thống") ở các dòng SystemAdmin/SecretaryTreasurer/DivisionLeader → chiều cao hàng so le. | `layer/app/pages/admin/vai-tro/index.vue` (badge trong bảng) | **Thấp** | Thiếu `whitespace-nowrap` trên badge. |
| **UI-09** | Sự kiện & trại (`/admin/trai`) | Tràn ngang nhẹ: 394/375 px, 775/768 px, 1032/1024 px do tiêu đề `text-4xl` không wrap. | `layer/app/pages/admin/trai/index.vue` (`.font-display text-4xl`) | **Thấp** | Thiếu `break-words`/`text-3xl` ở mobile. |
| **UI-10** | Portal công khai (mọi trang) | Mỗi lần mở trang khách chưa đăng nhập đều gọi `POST /auth/refresh` → **401**, trình duyệt ghi 1 lỗi console "Failed to load resource". Vi phạm tiêu chí "console không còn lỗi". | `layer/app/stores/session.ts:113-137`; `layer/app/middleware/auth.global.ts:4-5` | **Thấp** | `bootstrap()` chạy vô điều kiện; API trả 401 khi không có cookie thay vì 204. |
| **DATA-01** | Toàn hệ thống | DB dev: **183** đoàn sinh (79 đã xoá mềm), **96** bản ghi tên `E2E…/QA…`; **56** user, **48** user test (`e2e_*`, `ph_*`, `scopetest*`, `qa.*`); **61** lớp tên "Ấu Nhi 1 (E2E) – E2E 032290"; thông báo tiêu đề "Test". | DB `GiaoLyDB_Vision2` | **Nghiêm trọng (vận hành)** | E2E test chạy trực tiếp trên DB dev và **không dọn dẹp**; seeder tạo lớp mẫu theo test. |
| **DATA-02** | Hồ sơ đoàn sinh | 99/104 đoàn sinh đang học **không có người giám hộ**; 1 đoàn sinh **trống họ tên** và không có mã. | DB | **Trung bình** | Seed/import thiếu dữ liệu liên hệ; ràng buộc `FullName` chỉ ở tầng tạo mới, dữ liệu cũ lọt vào. |
| **DATA-03** | Lớp học / Niên khóa | 63 enrollment thuộc niên khóa 2026-2027 nhưng chỉ **5** bản ghi `Active`, **58** bản ghi `Promoted` → lớp hiện hành chứa học viên "đã lên lớp", số "Chưa xếp lớp 99" xung đột cảm nhận với "63 đoàn sinh" ở trang lớp. | DB; `StudentService.GetUnassignedStudentsAsync:880-918` (logic đúng) | **Trung bình** | Dữ liệu seed đặt sai trạng thái enrollment. |
| **DATA-04** | Dashboard / Lớp học | "Huynh trưởng & GLV = 0"; 61/61 lớp "Chưa có GLV chủ nhiệm". | DB (`Leaders`, `ClassRoomTeachers`) | **Trung bình** | Chưa seed/ chưa phân công giáo lý viên. |
| **SEC-01** | Phụ thuộc npm | web-admin: **59** lỗ hổng (1 critical `shell-quote`, 23 high: `node-forge`, `undici`, `vite`, `brace-expansion`, `source-map-js`, `tiptap/prosemirror` XSS…). web-portal: **50** (1 critical, 23 high). Phần lớn nằm trong toolchain Nuxt/Nitro (build + runtime server) và editor của Nuxt UI. | `web-admin/pnpm-lock.yaml`, `web-portal/pnpm-lock.yaml` | **Cao** | Phiên bản Nuxt/Nitro phụ thuộc chưa được nâng; chưa có `pnpm.overrides`. |
| **SEC-02** | Phụ thuộc NuGet | `AngleSharp 0.17.1` (transitive của `HtmlSanitizer 9.0.967`) — mức **Moderate**. | `GiaoLy.API/GiaoLy.API.csproj:21` | **Trung bình** | Ghim HtmlSanitizer cũ. |
| **SEC-03** | Vận hành | `.env` của 2 app **không** bị git theo dõi (tốt), nhưng mật khẩu `admin` dev đang lưu trong `e2e-tests/playwright/.auth/password.txt` (đã gitignore) và DB dev chứa 48 tài khoản test đang bật. | `e2e-tests/playwright/.auth/password.txt` | **Trung bình** | Quy trình test chưa tách DB. |
| **PERF-01** | Danh sách đoàn sinh | Tab "Chưa xếp lớp" tải **toàn bộ** mảng (99 dòng) rồi tự cắt trang ở client; `loadStats()` cũng tải toàn bộ danh sách chỉ để đếm. | `.../doan-sinh/index.vue:79-110` | **Thấp** | Endpoint `/students/unassigned` không phân trang. |
| **PERF-02** | Tin tức portal | `/tin-tuc` mất **4.4 s** (lần đầu, ảnh qua proxy), 15 KB JSON; có lúc `networkidle` không đạt trong 30 s. | `GiaoLy.Infrastructure/Services/News/NewsCrawler.cs`, `web-portal` route `/tin-tuc` | **Thấp** | Ảnh proxy không cache; nhiều ảnh ngoài. |
| **DB-01** | Truy vấn | `Students` không có index cho `(Status, DeletedAt)` dù mọi truy vấn danh sách đều lọc 2 cột này. | `AppDbContext` / migrations | **Thấp** | Chưa thêm index tổng hợp. |

---

## 3. KẾT QUẢ KIỂM THỬ CHỨC NĂNG (GIAI ĐOẠN 2)

Ký hiệu: ✅ Đạt · ⚠️ Đạt một phần · ❌ Lỗi · ⛔ Chưa kiểm chứng được

### 3.1 web-admin
| # | Chức năng | Giao diện | Luồng chính | Biên/lỗi | API + DB | Đồng bộ | Bảo mật | Kết quả |
|---|---|---|---|---|---|---|---|---|
| 1 | Đăng nhập / đăng xuất | ✅ | ✅ | ✅ sai mật khẩu, khoá 5 lần | ✅ | — | ✅ | ✅ |
| 2 | Đổi mật khẩu lần đầu (bắt buộc) | ✅ | ✅ | ✅ API khác bị 403 | ✅ | — | ✅ | ✅ |
| 3 | Phân quyền route + menu theo permission | ✅ | ✅ | ✅ 403 đúng | ✅ | — | ✅ | ✅ |
| 4 | Dashboard (số liệu, niên khóa, thông báo, phụng vụ) | ✅ | ✅ | ⚠️ GLV = 0 do dữ liệu | ✅ 73 ms | — | ✅ | ⚠️ |
| 5 | Danh sách đoàn sinh – tìm kiếm/lọc/trạng thái | ⚠️ UI-02…07 | ✅ | ✅ pageSize 9999→100, page âm→1, status lạ→0 | ✅ 55 ms | ✅ | ✅ | ⚠️ |
| 6 | Danh sách đoàn sinh – phân trang | ⚠️ UI-04 | ✅ không lặp dòng | ⚠️ pageSize cố định 20 | ✅ | — | ✅ | ⚠️ |
| 7 | Thêm đoàn sinh | ⛔ | ✅ tạo 200 | ✅ validate 400, trùng 400 | ✅ | — | ✅ | ✅ |
| 8 | Sửa đoàn sinh (PATCH) | ⛔ | ✅ lưu đúng | ✅ | ✅ | ✅ portal nhận ngay | ✅ | ✅ |
| 9 | Xoá / khôi phục (soft delete) | ⛔ | ✅ 404 sau xoá, restore 200 | ✅ | ✅ | — | ✅ | ✅ |
| 10 | Ẩn SĐT theo quyền (`ViewContact`) | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 11 | Trang chi tiết đoàn sinh | ⛔ | ⛔ | — | ✅ 200 | — | ✅ | ⛔ |
| 12 | Nhập Excel / xuất Excel | ⛔ | ⛔ | — | ✅ route 200 | — | ✅ rate limit 10/giờ | ⛔ |
| 13 | Niên khóa / Lớp học / Ngành & cấp lớp | ✅ | ✅ | ⚠️ dữ liệu E2E | ✅ | — | ✅ | ⚠️ |
| 14 | Người dùng & tài khoản | ✅ | ✅ | ✅ | ✅ 10 KB | — | ✅ | ✅ (48 tài khoản rác) |
| 15 | Vai trò & ma trận quyền | ⚠️ UI-08 | ✅ | ✅ | ✅ 7 KB | — | ✅ | ⚠️ |
| 16 | Nhật ký kiểm toán | ✅ | ✅ | — | ✅ 12 KB | — | ✅ | ✅ |
| 17 | Báo cáo & thống kê | ✅ | ✅ 4 endpoint | — | ✅ 140 ms | — | ✅ | ✅ |
| 18 | Thông báo (CRUD + audience) | ✅ | ✅ tạo/xoá | — | ✅ | ✅ portal nhận | ✅ | ✅ |
| 19 | Tin tức / Tài liệu / Banner / Ban huynh trưởng | ✅ | ✅ 200 | ⚠️ Banner rỗng | ✅ | — | ✅ | ✅ |
| 20 | Lịch phụng vụ | ⛔ | ✅ 200 | — | ✅ | — | ✅ | ✅ (dữ liệu) |
| 21 | Sự kiện & trại | ⚠️ UI-09 | ✅ 200 | — | ✅ | — | ✅ | ⚠️ |
| 22 | Trực lớp / Giáo án / Lên lớp | ⛔ | ✅ 200 | — | ✅ | — | ✅ | ⛔ (UI chưa thao tác) |
| 23 | Hồ sơ cá nhân | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 24 | Cấu hình / Tác vụ nền | ⛔ | ✅ 200 | — | ✅ | — | ✅ | ⛔ |

### 3.2 web-portal
| # | Chức năng | Giao diện | Luồng chính | Biên/lỗi | API | Đồng bộ | Bảo mật | Kết quả |
|---|---|---|---|---|---|---|---|---|
| 25 | Trang chủ công khai | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 26 | Tin tức | ✅ | ✅ | ⚠️ 4.4 s lần đầu | ✅ | — | ✅ | ⚠️ |
| 27 | Thông báo công khai | ✅ | ✅ | — | ✅ | ✅ admin→portal | ✅ | ✅ |
| 28 | Thư viện tài liệu | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 29 | Lịch phụng vụ | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 30 | Ban huynh trưởng | ✅ | ✅ | — | ✅ | — | ✅ | ✅ |
| 31 | Xác thực chứng chỉ (QR) | ✅ | ⛔ chưa nhập mã thật | — | ✅ verify 10/phút | — | ✅ che tên | ⛔ |
| 32 | Đăng nhập phụ huynh | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| 33 | Cổng phụ huynh – danh sách con | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| 34 | Chi tiết con (bí tích, sức khoẻ) | ⛔ | ✅ API | — | ✅ | ✅ | ✅ không lộ notes | ✅ |
| 35 | Bảng điểm con | ⛔ | ⛔ không có dữ liệu điểm | — | ✅ | — | ✅ | ⛔ |
| 36 | Chứng chỉ con + tải PDF | ⛔ | ⛔ | — | ✅ route | — | ✅ | ⛔ |
| 37 | Chặn truy cập hồ sơ trẻ khác (IDOR) | — | ✅ **404** | ✅ | ✅ | — | ✅ | ✅ |
| 38 | Đăng xuất | ✅ | ✅ thu hồi refresh | ✅ | ✅ | — | ✅ | ✅ |

---

## 4. KẾ HOẠCH SỬA CHỮA

### P0 — Bảo mật & dữ liệu (làm trước, có backup)

**P0-1. Xử lý lỗ hổng phụ thuộc**
- Việc làm: nâng Nuxt/Nitro/Vite lên bản vá mới nhất trong dải 4.x; thêm `pnpm.overrides` cho `node-forge ≥1.4.3`, `undici ≥7.29.1`, `shell-quote ≥1.11.0`, `source-map-js ≥1.2.2`, `nanoid ≥3.3.18`, `brace-expansion ≥5.0.11`; nâng `HtmlSanitizer` (kéo `AngleSharp ≥1.1`) và thêm `PackageReference AngleSharp` trực tiếp nếu cần.
- File: 2 `package.json`, 2 `pnpm-lock.yaml`, `GiaoLy.API/GiaoLy.API.csproj`.
- Rủi ro: Nuxt UI/tiptap có thể vỡ API; phải chạy lại build + typecheck + smoke 43 endpoint.
- Kiểm thử: `pnpm audit --prod` (kỳ vọng 0 critical/high), build 2 app, `dotnet build`, chạy lại bộ API smoke.
- Độ phức tạp: **Trung bình** (0.5–1 ngày, chủ yếu chờ build).

**P0-2. Tách & làm sạch dữ liệu test (có backup)**
- Việc làm: (1) backup `.bak` trước khi đụng; (2) tạo script SQL idempotent `database/cleanup/2026-11-25_purge_e2e_data.sql` xoá mềm đoàn sinh có tên `E2E…/QA…`, vô hiệu hoá user `e2e_*`, `ph_test_*`, `scopetest*`, `qa.*`, xoá lớp/section mang nhãn `(E2E)`, thông báo tiêu đề `Test`; (3) đổi `e2e-tests/playwright.config.ts` + CI để e2e chạy trên DB riêng `GiaoLyDB_E2E`.
- File: `database/`, `e2e-tests/playwright.config.ts`, `.github/workflows/ci.yml`.
- Rủi ro: xoá nhầm dữ liệu thật → chỉ xoá theo mẫu tên đã xác nhận + chạy `SELECT` đếm trước, có script rollback (restore .bak).
- Kiểm thử: đếm trước/sau, mở lại danh sách đoàn sinh, xác nhận 104 → số thật.
- Độ phức tạp: **Thấp–Trung bình**.

**P0-3. Làm sạch dữ liệu hiển thị**
- Việc làm: bổ sung người giám hộ/liên hệ cho các hồ sơ thiếu (theo danh sách xuất Excel), sửa 1 hồ sơ trống tên, gán GLV chủ nhiệm cho lớp, chuẩn hoá trạng thái enrollment niên khóa hiện tại (`Promoted` → `Active` nếu đúng nghiệp vụ).
- File: script SQL/Excel import, không sửa code.
- Kiểm thử: Dashboard (GLV > 0, lớp có GVCN), danh sách đoàn sinh (cột phụ huynh), trang lớp.
- Độ phức tạp: **Trung bình** (phụ thuộc dữ liệu người dùng cung cấp).

### P1 — Lỗi giao diện nghiêm trọng

**P1-1. Sửa triệt để sidebar (UI-01)**
- Cách sửa tại `layer/app/components/AppShell.vue`:
  - Đổi khung: `<div class="flex min-h-dvh flex-col lg:flex-row">`, sidebar `lg:sticky lg:top-0 lg:h-dvh lg:flex lg:flex-col` (bỏ `h-screen` + `overflow-y-auto` trên thẻ `<aside>`).
  - Logo header cố định trong sidebar, **chỉ vùng `<nav>` cuộn**: `flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-gutter: stable`, kèm gradient mờ ở mép dưới để gợi ý còn mục.
  - Thu gọn chiều cao: `py-1` cho mục, gộp nhóm "Hệ thống" thành nhóm có thể thu/mở (mặc định mở) → toàn bộ 27 mục vừa 1 màn hình 768 px, không cần cuộn ẩn.
  - Giữ `lg:grid-cols-[260px_1fr]` tương thích bằng `flex` thay grid.
- Kiểm thử: đo `nav.scrollHeight ≤ nav.clientHeight` ở 1366×768; ảnh chụp 4 kích thước; kiểm tra menu mobile vẫn mở/đóng; `document.scrollWidth == innerWidth`.
- Độ phức tạp: **Trung bình** (0.5 ngày, rủi ro thấp nhưng ảnh hưởng mọi trang admin).

**P1-2. Chặn cuộn ngang toàn trang (UI-02)**
- Cách sửa: bọc `<div class="overflow-hidden rounded-xl border ...">` quanh `<div class="w-full max-w-full overflow-x-auto">`; thêm `min-w-0 max-w-full` cho khối trang; kiểm tra tương tự các trang khác có bảng rộng.
- Kiểm thử: `document.documentElement.scrollWidth === window.innerWidth` tại 375/768/1024 cho **16 trang admin** (script đã có: `tmp-overflow-audit.mjs`).
- Độ phức tạp: **Thấp**.

**P1-3. Thiết kế lại danh sách đoàn sinh (UI-03…07)**
- Cách sửa tại `layer/app/pages/admin/doan-sinh/index.vue`:
  - **Desktop**: `thead sticky top-0 z-10` nền đục; hàng xen kẽ (`even:bg-stone-50/60`) + hover; cột căn theo kiểu dữ liệu; avatar tròn (ưu tiên `photoUrl`, fallback chữ cái đầu); badge trạng thái có chấm màu; cột phụ huynh hiển thị "Chưa cập nhật" thay "–"; thao tác gộp vào menu "⋯" (Xem/Sửa/Xoá) có tooltip + xác nhận xoá.
  - **Toolbar sticky** dưới topbar: ô tìm kiếm, lọc ngành/trạng thái, nút "Xoá bộ lọc", tổng kết "104 kết quả".
  - **Phân trang chuẩn**: số trang có rút gọn (1 … 4 5 6 … 6), chọn 20/50/100, hiển thị "21–40 / 104".
  - **Mobile (<md)**: chuyển sang danh sách thẻ (avatar, tên + tên thánh, mã, lớp/ngành, badge trạng thái, nút xem); ẩn bảng.
  - **Trạng thái**: skeleton 8 dòng khi tải; empty state có nút "Xoá bộ lọc"; error state giữ nguyên.
  - Bỏ 2 trường chết `bloodType/allergies`.
- Kiểm thử: ảnh chụp 1440/1024/375; thao tác tìm/lọc/đổi trang; kiểm tra `sticky` header khi cuộn; so sánh số liệu thẻ thống kê với API.
- Độ phức tạp: **Cao** (1–1.5 ngày).

**P1-4. Các lỗi giao diện nhỏ (UI-08, UI-09)**
- `whitespace-nowrap` cho badge vai trò; `break-words text-3xl sm:text-4xl` cho tiêu đề trang trại.
- Kiểm thử: ảnh chụp 2 trang ở 3 kích thước. Độ phức tạp: **Thấp**.

### P2 — Đồng bộ & chất lượng dữ liệu
**P2-1. Giảm nhiễu console portal (UI-10)**
- Cách sửa: `AuthController.Refresh` trả **204 No Content** khi không có cookie refresh (thay vì 401); `session.refresh()` coi 204 là "chưa đăng nhập" (không log lỗi). Giữ 401 cho token sai/hết hạn thật.
- File: `GiaoLy.API/Controllers/AuthController.cs:41-56`, `layer/app/stores/session.ts:110-140`.
- Rủi ro: middleware dựa vào 401 để `clear()`; phải cập nhật cả hai nhánh + test.
- Kiểm thử: mở 8 trang portal khi chưa đăng nhập → 0 lỗi console; đăng nhập/refresh/logout vẫn đúng.
- Độ phức tạp: **Thấp**.

**P2-2. Đồng bộ số liệu giữa các màn hình**
- Việc làm: thống nhất định nghĩa "Tổng đoàn sinh" (đang học vs tất cả), "Chưa xếp lớp" (theo niên khóa hiện tại); hiển thị cùng một nguồn ở Dashboard, danh sách, lớp, báo cáo; thêm tooltip giải thích.
- File: `layer/app/pages/admin/index.vue`, `doan-sinh/index.vue`, `lop/index.vue`, `GiaoLy.Infrastructure/Services/Stats/PublicStatsService.cs`.
- Kiểm thử: so số giữa 4 màn hình + SQL.
- Độ phức tạp: **Trung bình**.

### P3 — Hiệu năng & tối ưu
| Việc | File | Cách làm | Lợi ích | Phức tạp |
|---|---|---|---|---|
| Phân trang `/students/unassigned` + endpoint count | `StudentService.cs:880`, controller | trả `PagedList` + `?page&pageSize`, thêm `/students/unassigned/count` | bỏ tải 99 dòng mỗi lần mở trang | Thấp |
| Index `Students(Status, DeletedAt)` + `Students(FullNameNormalized)` filtered | migration mới | `CREATE INDEX ... INCLUDE (BranchId)` | giảm scan khi lọc trạng thái | Thấp |
| Cache ảnh proxy tin tức | `NewsCrawler`, `ImageProxy` | `IMemoryCache` 10 phút + `Cache-Control` | `/tin-tuc` nhanh hơn | Trung bình |
| Sticky toolbar + lazy ảnh avatar | `doan-sinh/index.vue` | `loading="lazy"`, `decoding="async"` | giảm LCP | Thấp |
| Rà bundle portal (22.7 MB output) | `web-portal/nuxt.config.ts` | kiểm tra chunk lớn, bật `experimental.payloadExtraction`, nén ảnh | tải nhanh hơn | Trung bình |

### P4 — Kiểm thử lại toàn bộ (sau khi sửa)
1. `dotnet build` + `dotnet test` (75 test) + `pnpm typecheck/lint/build` cả 2 app.
2. Chạy lại `tmp-review/api-audit.mjs`, `sync-audit.mjs`, `smoke-get.mjs`, `tmp-overflow-audit.mjs`.
3. Chạy e2e Playwright hiện có (`e2e-tests`) trên DB riêng, bổ sung test: cuộn sidebar, sticky header, phân trang, mobile card.
4. Kiểm tra console 0 error trên 13 trang admin + 8 trang portal.
5. Chụp ảnh 4 kích thước cho các trang đã sửa.

---

## 5. THỨ TỰ ƯU TIÊN

1. **P0-1** lỗ hổng phụ thuộc (security) — không phụ thuộc dữ liệu.
2. **P0-2 + P0-3** dữ liệu test/rác (làm sạch có backup) — cần bạn xác nhận trước khi xoá.
3. **P1-1 + P1-2** sidebar & cuộn ngang — đúng 2 lỗi bạn báo.
4. **P1-3** thiết kế lại danh sách đoàn sinh + **P1-4** lỗi nhỏ.
5. **P2** đồng bộ số liệu, console.
6. **P3** tối ưu.
7. **P4** kiểm thử lại & báo cáo cuối.

---

## 6. RỦI RO & ĐIỀU KIỆN

- **Không thể** kiểm chứng: giao diện trên Safari/Firefox thật, hành vi máy in/PDF, luồng nhập Excel với file thật, chứng chỉ QR với mã thật, bảng điểm (DB chưa có dữ liệu điểm), các trang không có dữ liệu (banner, trực lớp).
- DB hiện có **thay đổi chưa commit** từ trước phiên này (`StudentService.cs`, `ImportExportService.cs`, `StudentBirthDateRules.cs`) — sẽ **không** đụng tới nếu không liên quan.
- Mọi thay đổi DB sẽ kèm backup `.bak` + script rollback; mọi thay đổi UI sẽ kèm ảnh trước/sau.

---

## 7. GIAI ĐOẠN 5 — ĐỢT 1 ĐÃ SỬA (UI-01, UI-02, UI-08, UI-09)

### 7.1 Thay đổi

| ID | File | Nội dung sửa | Lý do |
|---|---|---|---|
| UI-01 | `layer/app/components/AppShell.vue` | Đổi khung `grid min-h-screen` → `flex min-h-dvh flex-col lg:flex-row`; `<aside>` thành `flex flex-col` cao `lg:h-dvh` (bỏ `overflow-y-auto` + `lg:h-screen` trên aside); **chỉ `<nav>` cuộn** (`min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]`); thêm nút thu/mở từng nhóm (mặc định mở hết, nhóm chứa trang hiện tại tự mở lại khi điều hướng); nav có scrollbar 15 px luôn hiển thị. | Trước đây 25 mục/1050 px nằm trong khung 799 px với `overflow-y-auto` không có dấu hiệu → mục cuối bị che, nhìn như sidebar hụt. |
| UI-02 | `layer/app/pages/admin/doan-sinh/index.vue` | Bản vá tạm: bọc bảng trong khung `overflow-hidden … [contain:paint]` + lớp trong `overflow-x-auto`. **Đã được thay bằng thiết kế lại bảng ở mục 8** (bỏ `min-width`, bỏ `contain:paint`). | Chromium vẫn đẩy bề rộng `min-w-[860px]` của bảng vào vùng cuộn của document dù có `overflow-x:auto`; `contain:paint` chặn được nhưng để lại rủi ro cắt popup (xem 8.2). |
| UI-08 | `layer/app/pages/admin/vai-tro/index.vue` | Thêm `whitespace-nowrap` cho badge “Hệ thống”. | Badge bị xuống 2 dòng, hàng so le. |
| UI-09 | `layer/app/components/StatCard.vue` | `text-3xl sm:text-4xl` → `text-2xl sm:text-4xl`, thêm `min-w-0 break-words tabular-nums`, cho phép co. | Số tiền dài (“360.000 đ”) làm tràn ngang trang Sự kiện & Trại ở 375/768/1024 px. |

### 7.2 Đo lại sau khi sửa (48 phép đo: 16 trang × 375/768/1024)

| Trước | Sau |
|---|---|
| `/admin/doan-sinh`: 840/375 px (+465), 848/768 px (+80), 1108/1024 px (+84) | **0 px ở cả 3 kích thước** |
| `/admin/trai`: 394/375 (+19), 775/768 (+7), 1032/1024 (+8) | **0 px** |
| 14 trang còn lại: 0 px (không đổi) | **0 px** |
| Sidebar: nav 1106 px trong khung 900 px, không scrollbar-gutter | nav 1050 px, khung 799 px, **scrollbar 15 px hiển thị**, 25/25 mục mở mặc định, mục cuối “Tác vụ nền” cuộn tới được, thu/mở nhóm 25→19→25 |
| Badge “Hệ thống”: cao 28 px (2 dòng) | cao **14 px** (1 dòng), `white-space: nowrap` |

Ảnh bằng chứng: `docs/screenshots/audit/responsive/{375,768,1024}/<trang>.png` (48 ảnh) và
`docs/screenshots/audit/responsive/sidebar/` (sidebar 6 kích thước, trạng thái đầu/cuộn hết, ảnh crop).

### 7.3 Kiểm tra hồi quy sau sửa
- `pnpm run typecheck` web-admin + web-portal: **0 lỗi**.
- `pnpm run lint`: **0 error**, 6 + 4 warning style có từ trước.
- Đăng nhập, điều hướng 16 trang, thu/mở nhóm, mở menu mobile: không lỗi console mới.

### 7.4 Còn tồn (thuộc đợt sau)
- Bảng trang **Vai trò** ở 1024 px bị bó cột mô tả (chữ dọc, hàng cao) — cùng nhóm thiết kế lại bảng.
- Bảng đoàn sinh (header sticky, phân trang số, card mobile): **đã làm xong ở mục 8**.

---

## 8. GIAI ĐOẠN 5 — ĐỢT 2: RÀ SOÁT LẠI + P1-3

### 8.1 Rà soát lại thay đổi đợt 1 (tìm ra 2 lỗi thật)

| Vấn đề | Phát hiện | Sửa |
|---|---|---|
| Header sticky không dính | Khung bảng có `overflow-hidden` nên nó trở thành **vùng cuộn** của `position: sticky`; đo được `th.top = -47px` @768 và `-104px` @1024 (header trôi khỏi màn hình). | Bỏ `overflow-hidden` ở khung; bo góc bằng `[&_thead_th:first-child]:rounded-tl-xl` / `last-child:rounded-tr-xl` và 2 ô cuối của hàng cuối. Đo lại: `th.top = 0` ở cả 768 và 1024. |
| Class trùng/lặp trong sidebar | `<aside>` có `lg:w-[260px]` hai lần và `lg:translate-x-0` vừa ở class tĩnh vừa ở class động; tiêu đề nhóm dùng `mx-2 w-[calc(100%-1rem)]` để bù lề. | Bỏ bản trùng; tiêu đề nhóm thành `w-full px-2` (bỏ `calc`), nhãn nhóm 1 mục cũng `px-2`. Không đổi hành vi. |

### 8.2 `contain:paint` có cắt menu thao tác trong bảng không?
Đã dựng thử một `UDropdownMenu` trong ô thao tác của bảng rồi kiểm tra DOM (Playwright, 768 và 1024 px):
- Menu render trong `<div data-reka-popper-content-wrapper>` với **`parentElement` là `BODY`**, `card.contains(menu) === false` → nội dung menu được **teleport ra `<body>`**, không nằm trong cây của bảng.
- `elementFromPoint` tại tâm menu trả về chính menu (không bị che/cắt), `scrollWidth === clientWidth` (không clipping).
- Vùng cắt duy nhất là khung cuộn của chính menu (`max-height` theo không gian còn lại).
→ Kết luận: `contain:paint`/`overflow-hidden` ở khung bảng **không** cắt menu của Nuxt UI; nhưng vì nó phá sticky (8.1) và không còn cần thiết, đã **bỏ hẳn**. Đã ghi chú ngay trong `doan-sinh/index.vue`: menu trong hàng phải `@click.stop` trên chính nút mở (nếu không sự kiện nổi bọt lên `<tr>` và trang điều hướng mất — đã gặp đúng lỗi này khi thử).
Bản thử đã gỡ; ô thao tác trở lại nút mở hồ sơ.

### 8.3 P1-3 — thiết kế lại bảng danh sách đoàn sinh
`layer/app/pages/admin/doan-sinh/index.vue`
- **Bảng ≥768 px**: 5 cột (Đoàn sinh · Ngành › Lớp · Phụ huynh · Trạng thái · mở hồ sơ), `table-fixed` với bề rộng % nên **không còn `min-width`** → không bao giờ tràn ngang; mã hồ sơ + tuổi gộp vào dòng phụ dưới tên; tên/phụ huynh `truncate`.
- **Header cố định**: `[&_thead_th]:sticky top-0 z-10` + nền đục, dính theo cuộn trang (không tạo vùng cuộn lồng).
- **<768 px**: danh sách dạng **thẻ** (`NuxtLink`): avatar, tên thánh, họ tên, mã · tuổi, ngành › lớp, phụ huynh + SĐT đã che, trạng thái, mũi tên — không phải cuộn ngang.
- **Phân trang số trang**: 1 … 4 [5] 6 … 12 (tối đa 7 nút, có `…`), nút trước/sau, `aria-current="page"`, dòng “Hiển thị 1–20 / 104 đoàn sinh”.

### 8.4 Kiểm chứng lại (sau khi sửa)
| Hạng mục | Kết quả đo |
|---|---|
| Tràn ngang 25 route × 3 kích thước (375/768/1024) | **75/75 phép đo = 0 px tràn** |
| Header sticky @768 / @1024 | `position: sticky`, `top = 0`, `z-index = 10` sau khi cuộn 700 px |
| Bảng/thẻ theo breakpoint | 375: bảng ẩn, 20 thẻ; 768 và 1024: bảng hiện |
| Phân trang | “1 2 3 4 5 6” (6 trang / 104 hồ sơ); bấm trang 2 và trang 4 → `aria-current` đổi, nội dung hàng đầu đổi |
| Typecheck / lint | 0 lỗi TS; lint 0 error, 6 warning style cũ |
Ảnh: `docs/screenshots/audit/p1-3/doan-sinh-<375|768|1024>-{top,list,sticky|cards,page4}.png`;
`docs/screenshots/audit/responsive/<W>/doan-sinh.png` đã cập nhật theo giao diện mới.

---

## 9. GIAI ĐOẠN 5 — ĐỢT 3: RÀ SOÁT TIẾP + BẢNG VAI TRÒ

### 9.1 Dọn lại phần đã sửa

| File | Trước | Sau |
|---|---|---|
| `layer/app/shared/table.ts` (mới) | Chuỗi 12 lớp “header dính + bo góc” nằm trong template `doan-sinh` | Hằng số `STICKY_HEAD_CLASS` dùng chung cho mọi bảng danh sách (kèm ghi chú: khung ngoài không được `overflow-hidden`) |
| `layer/app/components/AppShell.vue` | Điều kiện `group.items.length > 1` lặp 4 lần (nút, `aria-expanded`, icon, div nhãn) | Computed trả thêm `collapsible`, template dùng `group.collapsible` |
| `layer/app/components/StatCard.vue` | `transition-shadow` áp cho cả thẻ không phải link | Chỉ bật `transition-shadow hover:shadow-md` khi có `to` |
| `layer/app/pages/admin/doan-sinh/index.vue` | Thẻ mobile gọi `ageOf()` 2 lần + tách 2 span mã/tuổi | Một span `subLine(row)` (mã · tuổi) |

### 9.2 Bảng Vai trò (`layer/app/pages/admin/vai-tro/index.vue`) — cùng hướng với bảng đoàn sinh
- Bỏ `overflow-x-auto` + 6 cột tự động → **`table-fixed` 5 cột %** (Vai trò 32 · Phạm vi 17 · Quyền 9 · Mô tả 22 · Thao tác 20): gộp “Mã vai trò” vào dòng phụ dưới tên, mô tả `line-clamp-2` kèm `title`.
- **Header dính** dùng `STICKY_HEAD_CLASS`; bỏ khung `overflow-hidden`.
- **Nhãn phạm vi tiếng Việt**: All → Toàn hệ thống, Global → Toàn xứ, Branch → Theo ngành, Class/Classroom → Theo lớp, Guardian → Theo phụ huynh (giá trị lạ giữ nguyên), chip `whitespace-nowrap` nên không còn xuống 2 dòng.
- **Thao tác**: “Phân quyền” thu về icon (nhãn hiện từ `xl`), kèm `aria-label`/`title`; Sửa/Xóa là nút icon có `aria-label`; Xóa bị khóa với vai trò hệ thống. Trước đây cột này rộng quá nên mới cắt chữ header “THAO TÁC”.
- **<768px**: thẻ vai trò (tên + badge Hệ thống + mã, chip phạm vi, mô tả, “N quyền” và nút **có chữ** Phân quyền/Sửa/Xóa).
- Thêm trạng thái rỗng (`EmptyState`) cho cả bảng và thẻ.

### 9.3 Đo lại
| Hạng mục | Kết quả |
|---|---|
| Tràn ngang 6 trang trọng tâm × 3 cỡ (admin, doan-sinh, vai-tro, lop, trai, tai-khoan) | **18/18 = 0 px tràn** |
| Header Vai trò có bị cắt? | `scrollWidth − clientWidth = 0` cho **cả 5 `th`**; mép phải `th` cuối 743/744 @768 và 999/1000 @1024 (nằm trong thẻ) |
| Header dính của Vai trò | Khi có chỗ cuộn (ép trang cao): `position: sticky`, `th.top = 0` @768 và @1024 |
| Hồi quy header đoàn sinh sau khi tách hằng số | `position: sticky`, `top = 0`, nền `oklch(0.985 …)` — lớp trong `shared/table.ts` vẫn được Tailwind sinh đúng |
| Nút thao tác sau thiết kế lại | Bấm “Phân quyền” @1024 và @375 đều mở modal đúng tiêu đề “Thiết lập quyền cho vai trò: Ban điều hành”; 16 `aria-label` Sửa/Xóa có mặt |
| Typecheck / lint | 0 lỗi TS; lint **0 error**, 6 warning style cũ |
Ảnh: `docs/screenshots/audit/p1-3/vai-tro-<W>.png`, `vai-tro-<W>-sticky-proof.png`, và `docs/screenshots/audit/responsive/<W>/vai-tro.png` (đã cập nhật).

### 9.4 Chưa kiểm chứng
- Chỉ Chromium; Safari/Firefox chưa thử.
- Trang Vai trò API trả toàn bộ 8 vai trò nên chưa cần phân trang (không thêm).
- Chế độ tối của bảng mới chỉ kiểm bằng lớp `dark:` có sẵn, chưa chụp ảnh dark mode.
- Nút thao tác icon-only ở 768/1024 dựa vào `aria-label` + `title`; chưa thử với trình đọc màn hình thực.

---

## 10. GIAI ĐOẠN 5 — ĐỢT 4: TÁC VỤ NỀN & NHẬT KÝ

### 10.1 Sửa chữ lỗi
- Mục 9.1: sửa ký tự bị sai mã hoá thành **“Hằng số”** (hằng số `STICKY_HEAD_CLASS`).

### 10.2 Áp cùng kiểu bảng cho hai trang
Cả hai dùng `STICKY_HEAD_CLASS`, khung `rounded-xl … shadow-xs` không `overflow-hidden`, bỏ `overflow-x-auto`, `table-fixed` theo %.

**`layer/app/pages/admin/tac-vu/index.vue`** — 7 cột → **5 cột** (Tác vụ 30 · Thời gian 22 · Trạng thái 16 · Nguồn 13 · Thông điệp 19):
- Gộp “Bắt đầu / Kết thúc / Thời lượng” thành ô **Thời gian** 2 dòng: `25/11/2026` + `13:32:10 · 77 ms`; giờ bắt đầu→kết thúc đầy đủ vẫn còn trong `title` của ô.
- Chip trạng thái bỏ chấm tròn, `px-1.5` để không tràn cột; cột Nguồn `text-[11px]` + `truncate`.
- Thêm trạng thái rỗng (`EmptyState`), phân trang có `aria-label`, `<md` dùng **thẻ**: tên tác vụ + jobName, chip trạng thái, giờ bắt đầu → kết thúc · thời lượng, nguồn kích hoạt, thông điệp (2 dòng).

**`layer/app/pages/admin/nhat-ky/index.vue`** — 6 cột giữ nguyên nhưng chia bề rộng (Thời gian 21 · Người thực hiện 19 · Thao tác 13 · Đối tượng 23 · IP 13 · Chi tiết 11):
- Cột Thời gian tách **ngày / giờ** 2 dòng (helper `logTime`) thay vì chuỗi `toLocaleString` bị cắt; Đối tượng tách `entityType` và `#id`; IP `truncate` + `title`.
- Nút “Xem Diff” thu về icon ở `md/lg`, hiện nhãn từ `xl` (cột chỉ 79 px ở 768).
- `<md` dùng **thẻ**: người thực hiện, thời gian đầy đủ, badge thao tác, đối tượng + `#id` + IP, nút “Xem Diff” có chữ.

### 10.3 Đo lại (375/768/1024)
| Hạng mục | Kết quả |
|---|---|
| Tràn ngang 5 trang × 3 cỡ (admin, tac-vu, nhat-ky, doan-sinh, vai-tro) | **15/15 = 0 px tràn** |
| Header có bị cắt? | `scrollWidth − clientWidth = 0` cho **mọi `th`** ở cả hai bảng; mép phải `th` cuối 743/744 @768 và 999/1000 @1024 |
| Header dính | Ép trang cao để cuộn qua mép bảng: `position: sticky`, `th.top = 0` @768 và @1024 cho cả hai trang |
| Bảng/thẻ | 375: bảng ẩn, **20 thẻ** hiện cho mỗi trang; 768/1024: bảng rộng 718/714 px, nằm gọn trong thẻ 744/1000 px |
| Nút “Xem Diff” sau khi thu về icon | @768 và @375 đều mở modal “Chi tiết thay đổi #12986 (Update User)” |
| Phân trang Tác vụ nền | “Trang 1 / 12” → bấm trang sau → “Trang 2 / 12”, nội dung hàng đầu đổi |
| Typecheck / lint | 0 lỗi TS; lint **0 error**, 6 warning style cũ |
Ảnh: `docs/screenshots/audit/p1-3/{tac-vu,nhat-ky}-<W>-{list,sticky}.png` + bản đầu trang `-<W>.png`; `docs/screenshots/audit/responsive/<W>/{tac-vu,nhat-ky}.png` cập nhật.

### 10.4 Chưa kiểm chứng
- Chỉ Chromium; Safari/Firefox chưa thử; dark mode chưa chụp ảnh.
- Ở bảng Tác vụ nền, giờ kết thúc chỉ còn trong tooltip (ô thời gian 2 dòng) — nếu cần hiện trực tiếp thì phải nới cột hoặc bỏ bớt cột khác.
- API local từng tắt giữa phiên (login E2E timeout) và đã khởi động lại trước khi đo; số đo trên là với API đang chạy.

---

## 11. GIAI ĐOẠN 5 — ĐỢT 5: GOM KHUNG BẢNG THÀNH MỘT COMPONENT

### 11.1 Rà lại hai bảng mới (Tác vụ nền, Nhật ký)

| Vấn đề | Sửa |
|---|---|
| Khối “đang tải”, “rỗng”, khung bảng và khung thẻ bị lặp ở **4 trang** | Gom vào `ListTable` (11.2) |
| Tác vụ nền: bảng nằm chung thẻ với tiêu đề + bộ lọc → khi gom sẽ thành “thẻ trong thẻ” | Tách tiêu đề + bộ lọc thành thẻ riêng phía trên, bảng nằm trong `ListTable` |
| Nhật ký: `entityId.substring(0, 8)` lặp 2 lần, chuỗi ngày-giờ dựng khác nhau giữa bảng và thẻ | Thêm `shortId()` và `logStamp()` dùng chung |
| Bốn trang có 2 bản mô tả “rỗng” khác nhau (bảng vs thẻ) | Chỉ còn một prop `empty-description` |

### 11.2 `layer/app/components/ListTable.vue` (mới, 88 dòng)
- Props: `columns` (cho `colspan`), `loading`, `empty`, `loading-text`, `empty-title`, `empty-description`, `footer`.
- Slots: `#head` (các `th`), `#rows` (các `tr`), `#cards` (thẻ mobile), `#footer` (phân trang; tự bọc thanh chân bảng, tắt được bằng `:footer`).
- Bên trong: khung `rounded-xl` **không** `overflow-hidden`, `table-fixed` **không** `min-width`, `thead th` sticky + bo góc, `tbody` divide-y; `<md` đổi sang khung thẻ. Ghi chú về `overflow-hidden`/sticky và `@click.stop` cho menu trong hàng nằm ngay trong component/trang.
- `layer/app/shared/table.ts` (thêm ở đợt 4) **đã xoá**: hằng số `STICKY_HEAD_CLASS` chuyển vào trong `ListTable`; mục 9.1 vì thế chỉ còn giá trị lịch sử.

### 11.3 Kiểm chứng
| Hạng mục | Kết quả |
|---|---|
| 4 trang × 3 cỡ | **12/12 lượt render** đúng: 0 px tràn (`docScroll == innerWidth`), `th` không cắt chữ (`scrollWidth − clientWidth = 0` cho mọi cột), mép phải `th` cuối 743/744 @768 và 999/1000 @1024 |
| Header dính | `th.top = 0` sau khi cuộn qua mép bảng — đủ 4 trang, cả 3 cỡ |
| Thẻ mobile | 375px: bảng ẩn, thẻ hiện đủ (20 / 20 / 20 / 8 dòng cho đoàn sinh, tác vụ, nhật ký, vai trò) |
| Phân trang | Footer hiện ở đoàn sinh, tác vụ, nhật ký; vai trò không có (API trả hết 8 vai trò) |
| Console | Không có lỗi mới; chỉ còn 401 có sẵn ở trang đăng nhập (UI-10) |
| Typecheck / lint | **0 lỗi TS**; lint **0 error**, 6 warning style cũ |

Template sau khi gom: đoàn sinh 520→486, vai trò 537→515, tác vụ 501→493, nhật ký 372→357 dòng (cộng `ListTable` 88 dòng).
Ảnh cập nhật: `docs/screenshots/audit/p1-3/<trang>-<W>-list.png` và `docs/screenshots/audit/responsive/<W>/<trang>.png`.

### 11.4 Chưa kiểm chứng
- Chỉ Chromium; chưa chụp dark mode cho component mới.
- Chưa thử bàn phím/screen-reader cho danh sách thẻ (chỉ có `aria-label` sẵn có trên nút).
- `ListTable` mới dùng ở 4 trang này; các bảng khác (`lop`, `trai`, ...) vẫn giữ markup cũ.

---

## 12. GIAI ĐOẠN 5 — ĐỢT 6: HAI ĐƯỜNG CHƯA THỬ + MỞ RỘNG `ListTable`

### 12.1 Trạng thái rỗng (kiểm bằng bộ lọc thật, không mock)
| Trang | Cách tạo rỗng | @768 (bảng) | @375 (thẻ) |
|---|---|---|---|
| Hồ sơ đoàn sinh | gõ `zzzqqqkhongco` vào ô tìm | `EmptyState` nằm **trong `tbody`**, 1 dòng `colspan=5` | `EmptyState` nằm **trong khung thẻ**, không còn thẻ dữ liệu |
| Nhật ký | đặt “Từ ngày” = 01/01/2030 | “Không có bản ghi nào” trong bảng | cùng nội dung trong khung thẻ |
| Tác vụ nền | chọn tác vụ `TokenCleanup` (chưa từng chạy) | “Chưa có lượt chạy nào” trong bảng | cùng nội dung trong khung thẻ |
Vai trò không có bộ lọc nào để tạo rỗng (API luôn trả 8 vai trò) nên nhánh rỗng của trang này **chưa được chạy thực tế**; nhánh đó dùng chung code với 3 trang trên.

### 12.2 Phân trang
| Trang | Trước | Sau khi bấm | Nội dung hàng đầu |
|---|---|---|---|
| Đoàn sinh | “Hiển thị 1–20 / 104” | bấm số **3** → “Hiển thị 41–60 / 104” | đổi |
| Tác vụ nền | “Trang 1 / 12” | nút trang sau → “Trang 2 / 12” | đổi |
| Nhật ký | “Trang 1 / 496” | nút trang sau → “Trang 2 / 496” | đổi |
Cả ba đúng ở 375px và 768px; footer tự ẩn khi `total <= pageSize` (vai trò).

### 12.3 Áp `ListTable` cho 5 bảng danh sách nữa
| Trang | Cột sau thiết kế lại | Thẻ mobile |
|---|---|---|
| `nguoi-dung` | 6 cột: Người dùng 22 · Liên hệ 16 · Vai trò 14 · Trạng thái 13 · Đăng nhập cuối 17 · Thao tác 18 | avatar, tên + @username, chip trạng thái, vai trò/phạm vi/email/SĐT, đăng nhập cuối, 4 nút icon |
| `truc-lop` | 5–6 cột: Ngày trực 15 · Giáo lý viên 26 · Lớp 20 · Nhiệm vụ 22 · Ghi chú 17 | tên + ngày, chip nhiệm vụ, lớp, ghi chú, nút sửa/xóa |
| `cau-hinh` | 4–5 cột: Tham số 26 · Giá trị 16 · Mô tả 28 · Cập nhật 16 · Thao tác 14 | key + giá trị, mô tả, ngày, nút “Sửa giá trị” |
| `thong-bao` | 7 cột: Tiêu đề 28 · Loại 11 · Phạm vi 16 · Người đăng 15 · Ngày 12 · Hạn 12 | tiêu đề + badge loại, phạm vi + người đăng, ngày/hạn, 3 nút |
| `tai-lieu` | 7 cột: Tên 30 · Chuyên mục 13 · Dung lượng 11 · Quyền 11 · Người tải 15 · Ngày 12 | icon + tên file, chuyên mục · dung lượng, badge quyền, tags, người tải · ngày, 3 nút |

### 12.4 Đo lại 5 trang × 3 cỡ
| Hạng mục | Kết quả |
|---|---|
| Tràn ngang | **15/15 lượt = 0 px** (`docScroll == innerWidth`) |
| Header cắt chữ | tất cả `th` có `scrollWidth − clientWidth = 0`; mép phải `th` cuối 743/744 @768, 999/1000 @1024 |
| Header dính | `th.top = 0` tại 375/768/1024 cho cả 5 trang |
| Thẻ mobile | 375px hiện đủ thẻ (56 người dùng, 1 trực lớp, 17 cấu hình, 5 thông báo, 6 tài liệu) |
| Typecheck / lint | 0 lỗi TS; lint 0 error, 6 warning style cũ |
Ảnh: `docs/screenshots/audit/p1-3/<trang>-<W>-list.png` và `docs/screenshots/audit/responsive/<W>/<trang>.png`.

### 12.5 Bảng admin còn ở markup cũ (chưa chuyển) — **đã xử lý ở mục 13**
`len-lop` (đợt xét, 9 cột), `tin-tuc` (tab nguồn RSS), `to-chuc` (cấp lớp), `yeu-cau-bi-tich`, `lop/[id]`, `lop/[id]/hoa-thieng` (2 bảng), `lop/[id]/diem-so`, `trai/[id]`, `len-lop/[id]`, `doan-sinh/[id]` (bí tích), `bao-cao` (4 bảng báo cáo), `doan-sinh/nhap-excel` (bảng lỗi import).
Lý do: phần lớn nằm trong trang chi tiết hoặc báo cáo, mỗi bảng cần bố cục thẻ riêng (và một số có cột động như `diem-so` với `min-w-[900px]`), nên chưa gộp trong đợt này.

---

## 13. GIAI ĐOẠN 5 — ĐỢT 7: NỐT CÁC BẢNG ADMIN CÒN LẠI

### 13.1 Đã chuyển sang `ListTable` (15 bảng)

| # | Trang | Bảng | Cột | Thẻ mobile |
|---|---|---|---|---|
| 1 | `/admin/len-lop` | Danh sách đợt xét | 9 | niên khóa nguồn→đích, tiến độ dạng chip, người tạo, nút mở |
| 2 | `/admin/tin-tuc` (tab *Quản lý nguồn RSS*) | Nguồn RSS | 6 | tên + trạng thái, URL (cắt), số bài · ngày, 2 nút |
| 3 | `/admin/to-chuc` (tab *Cấp lớp*) | Cấp lớp | 6 | tên + mã + #, badge ngành, cấp kế tiếp, nút sửa |
| 4 | `/admin/doan-sinh/yeu-cau-bi-tich` | Yêu cầu bí tích | 6 | tên + mã + #, badge bí tích, mô tả, tính chất, nút sửa |
| 5 | `/admin/doan-sinh/[id]` (tab *Lịch sử học tập*) | Ghi danh | 4 | lớp + niên khóa, chip trạng thái, ghi chú |
| 6 | `/admin/lop/[id]` | Đoàn sinh ghi danh | 7 | tên + mã + ngày, chip trạng thái, ghi chú, nút chuyển/rút lớp |
| 7 | `/admin/lop/[id]/hoa-thieng` (tab *Bảng xếp hạng*) | Xếp hạng hoa thiêng | 6 | hạng, tên + mã, điểm + số bông, chip chi tiết |
| 8 | `/admin/lop/[id]/hoa-thieng` (tab *Nhật ký*) | Nhật ký hoa thiêng | 7 | ngày · người ghi, điểm, loại hoa, ghi chú, nút đảo |
| 9 | `/admin/trai/[id]` | Đăng ký sự kiện | 10 | tên + mã + lớp + tổ, chip trạng thái, phí/đã thu/thiếu, 4 nút |
| 10 | `/admin/len-lop/[id]` | Đề xuất lên lớp | 9 | tên + mã + lớp hiện tại, chip ĐTB/CC/đề xuất, lớp đích, duyệt/từ chối |
| 11 | `/admin/bao-cao` (tab *Theo ngành*) | Lớp trong từng ngành | 5 | tên lớp (lien kết), cấp, tổng + nam/nữ |
| 12 | `/admin/bao-cao` (tab *Điểm số*) | Đoàn sinh dưới ngưỡng | 8 | tên + mã + lớp, chip trạng thái, HK1/HK2/Thi/TB |
| 13 | `/admin/bao-cao` (tab *Lên lớp*) | Tổng hợp theo lớp | 6 | tên lớp + tổng, chip lên lớp/ở lại/tốt nghiệp/chờ |
| 14 | `/admin/bao-cao` (tab *Thiếu hồ sơ*) | Hồ sơ thiếu | 5 | tên + mã + ngành-lớp, chip lý do thiếu, nút bổ sung |
| 15 | `/admin/doan-sinh/nhap-excel` | Dòng lỗi import | 3 | “Dòng #n · cột” + mô tả lỗi |

### 13.2 Thay đổi kèm theo
- `ListTable` thêm prop **`flat`**: bỏ viền/nền/bo góc khi bảng nằm trong thẻ đã có tiêu đề riêng (dùng ở `len-lop`, `lop/[id]`, 2 bảng `bao-cao`) — tránh hai lớp viền lồng nhau.
- `hoa-thieng`: thay cặp `v-if/v-else` ở hai khung bảng bằng `v-if="activeTab === 'leaderboard'"` / `v-if="activeTab === 'history'"` (bản sửa trung gian để `v-else` không còn khung cha đã gây **lỗi biên dịch** “v-else/v-else-if has no adjacent v-if” làm trắng toàn bộ app).
- `bao-cao`: bỏ `overflow-hidden` ở thẻ ngành — lớp này biến thẻ thành vùng cuộn và làm header dính trôi khỏi màn hình (đúng lỗi đã gặp ở đợt 5).
- `len-lop/[id]`: ô “Trạng thái đợt” đang dùng `StatCard` nên chữ “Đã áp dụng” bị bẻ dọc từng ký tự ở 768px → đổi sang thẻ nhỏ chứa `StatusChip`.
- Header `STT` (29–31px) bị tràn 4–6px trong cột 4% → đổi thành `#` với `px-2`; header “ĐTB / Vắng”→“ĐTB/CC”, “Đã đóng”→“Đã thu”, “Còn thiếu”→“Thiếu” để không xuống dòng trong cột hẹp.

### 13.3 Đo lại ở 375 / 768 / 1024
| Trang | 375 | 768 | 1024 |
|---|---|---|---|
| len-lop | 1 thẻ | 1 hàng | 1 hàng |
| tin-tuc (RSS) | 5 thẻ | 5 hàng | 5 hàng |
| to-chuc (cấp lớp) | 2 thẻ | 2 hàng | 2 hàng |
| yeu-cau-bi-tich | 1 thẻ | 1 hàng | 1 hàng |
| len-lop/[id] | 4 thẻ | 4 hàng | 4 hàng |
| lop/[id] | 4 thẻ | 4 hàng | 4 hàng |
| hoa-thieng (xếp hạng) | 4 thẻ | 4 hàng | 4 hàng |
| hoa-thieng (nhật ký) | trạng thái rỗng | trạng thái rỗng | trạng thái rỗng |
| bao-cao 1/2/3/4 | 1 / 1 / 1 / 5 thẻ | 4 / 1 / 1 / 5 hàng | 4 / 1 / 1 / 5 hàng |
| trai/[id] | trạng thái rỗng | trạng thái rỗng | trạng thái rỗng |
| doan-sinh/[id] (ghi danh) | trạng thái rỗng | trạng thái rỗng | trạng thái rỗng |

- **Tràn ngang: 0 px ở mọi lượt** (`document.scrollWidth == innerWidth` tại 375/768/1024).
- **Header cắt chữ: 0 px** trên tất cả bảng đã chuyển; mép phải `th` cuối 743/744 @768 và 999/1000 @1024.
- Typecheck 0 lỗi TS; lint 0 error (6 warning style cũ).
- Ảnh: `docs/screenshots/audit/p1-4/<trang>-<W>.png` + `docs/screenshots/audit/responsive/<W>/<trang>.png`.

### 13.4 Một bảng cố ý KHÔNG chuyển: `/admin/lop/[id]/diem-so`
Bảng điểm là **ma trận nhập điểm có cột động** (mỗi đầu điểm/bài kiểm là một cột, `min-w-[900px]`, ô nhập inline). Chuyển sang thẻ sẽ phá cấu trúc hàng-cột vốn là ý đồ của màn hình nhập liệu, nên giữ nguyên; đã đo: ở 375 bảng nằm trong khung cuộn riêng, **trang không tràn ngang** (`scrollWidth = 375`).

### 13.5 Chưa kiểm chứng được (thiếu dữ liệu mẫu)
- `trai/[id]`: 2 sự kiện hiện có đều **0 đăng ký** → chỉ thấy trạng thái rỗng; bảng 10 cột chưa render với dữ liệu thật.
- `doan-sinh/[id]` tab ghi danh: 8 đoàn sinh đã mở đều **0 ghi danh** → chỉ thấy trạng thái rỗng.
- `hoa-thieng` nhật ký: lớp đã mở có **0 bông hoa** → chỉ thấy trạng thái rỗng.
- `nhap-excel`: bảng lỗi chỉ hiện sau khi tải file Excel lỗi → chưa chạy được bước upload.
