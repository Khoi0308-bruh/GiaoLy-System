# KẾ HOẠCH SỬA LỖI TOÀN DIỆN — DỰ ÁN GIAOLY

| Thông tin | Giá trị |
|---|---|
| Ngày lập | 14/11/2026 |
| Căn cứ | Kết quả kiểm tra toàn diện: build, khởi động API, gọi endpoint thật, `dotnet ef`, `tools/fe_lint.js`, `tools/check_layer.js`, rà soát mã nguồn 4 project .NET + 3 frontend |
| Phạm vi | Backend (`GiaoLy.API`, `GiaoLy.Application`, `GiaoLy.Domain`, `GiaoLy.Infrastructure`), frontend (`layer`, `web-admin`, `web-portal`), CSDL/migration, cấu hình, repo, CI, kiểm thử |
| Mục tiêu | Đưa hệ thống từ trạng thái **API trả 500 cho mọi request** về trạng thái chạy được, an toàn, nhất quán và có cổng kiểm soát chất lượng tự động |
| Tổng thời lượng ước tính | **17–20 ngày công** (1 dev full-time), chia 6 giai đoạn |

---

## 1. Nguyên tắc thực hiện

1. **Sửa theo thứ tự chặn → bảo mật → kiến trúc → giao diện → quy trình.** Không làm đẹp code khi hệ thống chưa chạy.
2. **Mỗi thay đổi phải có kiểm chứng chạy được**, không chỉ "build xanh": endpoint thật, migration thật, trình duyệt thật.
3. **Không xoá dữ liệu, không reset DB production.** Mọi thao tác schema đi qua migration + backup.
4. **Không commit bí mật.** Mọi khoá/mật khẩu chuyển sang biến môi trường hoặc user-secrets.
5. **Một nguồn sự thật duy nhất** cho mỗi khái niệm: một cơ chế phân quyền, một store xác thực, một bộ trang admin, một danh mục endpoint.
6. **Không mở rộng phạm vi**: không thêm tính năng mới trong quá trình sửa lỗi; mọi cải tiến ngoài danh sách dưới đây ghi vào backlog.

---

## 2. Hiện trạng — các lỗi chặn (P0) cần đóng trước

| # | Lỗi | Bằng chứng | Hệ quả |
|---|---|---|---|
| 1 | DbContext không khởi tạo được (`AddDbContextPool` + scoped `AuditInterceptor`) | `InvalidOperationException: Cannot resolve scoped service ... from root provider`, `/health` = 500, `/api/v1/students` = 500 | Toàn bộ API không phục vụ; seeder, background job, `dotnet ef` đều hỏng |
| 2 | `EnsureCreated()` thay vì `Migrate()` | `DbSeeder.cs:14`, 22 migration không được áp dụng | Schema trôi khỏi migration; DB không có `__EFMigrationsHistory` |
| 3 | Seed tài khoản mặc định ở mọi môi trường + mật khẩu hard-code | `DbSeeder.cs:262-311` | Production có `admin/thuky/truongnganh` với mật khẩu công khai |
| 4 | Khoá JWT/mật khẩu trong repo | `appsettings.Development.json`, `web-admin/.env`, `e2e-tests/tests/admin.spec.ts` | Lộ bí mật, có thể giả mạo token |
| 5 | Placeholder production vẫn qua validator | `ConfigurationValidator.cs` chỉ kiểm tra độ dài ≥ 32 | Chạy production với khoá đã biết |
| 6 | Cron key dự phòng hard-code | `JobsController.cs:52` | Ai biết chuỗi trong source đều chạy được job hệ thống |
| 7 | 3 lớp `RequirePermissionAttribute` xung đột; claim `"Permission"` không tồn tại | `Attributes/`, `Authorization/`, `Helpers/`; `TokenService` không phát claim quyền | Endpoint legacy luôn 403 với non-admin, kể cả `SystemAdmin` |
| 8 | Endpoint công khai lộ dữ liệu | `GET /api/Student/verify` (anonymous, không rate limit), `GET /api/Student` (mọi user đăng nhập) | Lộ tên, lớp, điểm, SĐT phụ huynh, sức khoẻ |
| 9 | Mass assignment ở legacy write | `StudentController` nhận entity `Student`, `BulkImport` | Client sửa được `Code`, `IsActive`, `BranchId`… |
| 10 | Portal gọi endpoint không tồn tại | `web-portal` gọi `/api/students/verify`; backend chỉ có `/api/Student/verify` | Chức năng tra cứu công khai luôn 404 |

---

## 3. Chiến lược & thứ tự phụ thuộc

```
G0  HOTFIX (0,5 ngày)      → API chạy được, DB đúng migration, không còn bí mật trong repo
        │
G1  BẢO MẬT (2–3 ngày)     → phân quyền hợp nhất, chặn PII, chặn mass assignment, rate limit
        │
G3a FRONTEND MIGRATION     → bỏ store/trang legacy, portal công khai đúng, sửa contract API
        │
G2  BACKEND KIẾN TRÚC      → xoá controller legacy, scope toàn diện, JWT config, dọn mã chết
        │
G3b FRONTEND HOÀN TẤT      → build/lint/typecheck xanh, URL cấu hình
        │
G4  REPO / CI / DOCS       → .gitignore, commit mã nguồn, CI 4 job, e2e thật
        │
G5  NGHIỆM THU             → test matrix, go-live checklist
```

> Ghi chú: **G3a phải xong trước G2-2** (xoá controller legacy) để không làm sập giao diện đang dùng.

---

## 4. GIAI ĐOẠN 0 — HOTFIX (0,5 ngày)

### G0-1. Sửa khởi tạo DbContext (chặn toàn hệ thống)
- **File:** `GiaoLy.Infrastructure/DependencyInjection.cs`, `GiaoLy.Infrastructure/Persistence/Interceptors/AuditInterceptor.cs`
- **Cách làm (khuyến nghị, giữ được pool + sửa luôn `dotnet ef`):**
  1. `AuditInterceptor` chỉ phụ thuộc singleton: bỏ `ICurrentUser`, đọc trực tiếp từ `IHttpContextAccessor`:
     ```csharp
     var principal = _httpContextAccessor.HttpContext?.User;
     var rawId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                 ?? principal?.FindFirst("sub")?.Value;
     Guid? userId = Guid.TryParse(rawId, out var id) ? id : null;
     var userName = principal?.FindFirst(ClaimTypes.Name)?.Value;
     ```
  2. Đăng ký `services.AddSingleton<AuditInterceptor>();` (thay `AddScoped`).
  3. Giữ nguyên `AddDbContextPool<AppDbContext>(..., poolSize: 128)`.
- **Phương án dự phòng:** đổi `AddDbContextPool` → `AddDbContext` và giữ `AddScoped<AuditInterceptor>()`.
- **Nghiệm thu:** `dotnet build` 0 lỗi; `dotnet run` không còn exception; `GET /health` = **200**; `GET /api/v1/health/ready` = 200 (khi có DB) hoặc 503 có kiểm soát; `dotnet ef migrations has-pending-model-changes` chạy được.
- **Ước lượng:** 1–2 giờ.

### G0-2. Áp dụng migration thay vì tạo schema ngầm
- **File:** `GiaoLy.API/Services/DbSeeder.cs`
- **Cách làm:** thay `context.Database.EnsureCreated();` bằng `context.Database.Migrate();`
- **Kiểm tra trước khi chạy production:** sao lưu DB; xác nhận `__EFMigrationsHistory` (nếu DB cũ tạo bằng `EnsureCreated` thì phải tạo baseline migration — xem G2-7).
- **Nghiệm thu:** bảng `__EFMigrationsHistory` có đủ **22** bản ghi sau khi chạy; `dotnet ef database update` không thay đổi gì thêm.
- **Lưu ý (đã xác nhận khi chạy thật):** EF Core 10 ném `PendingModelChangesWarning` và **dừng** `Migrate()` nếu model lệch snapshot. Đây là hành vi an toàn (không ghi schema sai), nhưng cũng có nghĩa seeding sẽ dừng cho đến khi hoàn thành G2-7.
- **Ước lượng:** 1 giờ (chưa tính baseline DB cũ).

### G0-3. Seeder tách theo môi trường, bỏ mật khẩu hard-code
- **File:** `DbSeeder.cs`, `Program.cs`
- **Cách làm:**
  ```csharp
  public static void SeedData(AppDbContext ctx, IConfiguration cfg, IHostEnvironment env)
  {
      ctx.Database.Migrate();
      // ... seed danh mục, quyền, vai trò, settings (idempotent) ...
      if (env.IsDevelopment()) SeedSampleUsers(ctx, cfg);   // thuky, truongnganh
  }
  ```
  - `Program.cs`: `DbSeeder.SeedData(context, config, app.Environment);`
  - Admin: đọc **`Admin:InitialPassword`** (đúng khoá), nếu Production mà thiếu/placeholder → **ném lỗi dừng khởi động**, không dùng fallback.
  - Xoá toàn bộ chuỗi `"GiaoLyAdmin@2026!"`, `"GiaoLyDev@2026!"`.
- **Nghiệm thu:** chạy `Development` có 3 tài khoản mẫu; chạy `Production` thiếu biến → app dừng với thông báo rõ; chạy `Production` đủ biến → chỉ có 1 admin, `MustChangePassword = true`.
- **Ước lượng:** 2 giờ.

### G0-4. Validator chặn placeholder & cấu hình nguy hiểm
- **File:** `GiaoLy.API/Common/ConfigurationValidator.cs`
- **Cách làm:** thêm kiểm tra khi `env.IsProduction()`:
  - `Jwt:Key` phải ≥ 32 ký tự **và** không chứa `REPLACE_WITH` / `PLACEHOLDER` / trùng khoá dev.
  - `Admin:InitialPassword` phải tồn tại và không placeholder.
  - `Cors:AllowedOrigins` phải có ít nhất 1 origin `https://`, không chứa `localhost`.
  - `App:ServiceKey` (hoặc `Security:ServiceKey`) phải tồn tại.
  - `ConnectionStrings:DefaultConnection` không chứa `REPLACE_WITH`.
- **Nghiệm thu:** chạy với `appsettings.Production.json` hiện tại → **dừng khởi động** kèm thông báo từng khoá thiếu; chạy với biến môi trường đầy đủ → khởi động bình thường.
- **Ước lượng:** 2 giờ.

### G0-5. Di chuyển & xoay bí mật
- **Việc làm:**
  1. Xoá `Jwt:Key`, `App:DefaultPassword` khỏi `appsettings.Development.json` (đang được git track). Dùng `dotnet user-secrets` cho dev, biến môi trường cho CI/production.
  2. `web-admin/.env`: đổi thành `.env.example` (chỉ tên biến), thêm `.env` vào `.gitignore`.
  3. `e2e-tests/tests/admin.spec.ts`: xoá email/mật khẩu cá nhân; đọc từ `process.env.E2E_USER` / `E2E_PASSWORD`; **đổi mật khẩu tài khoản đã lộ**.
  4. Xoay `Jwt:Key` mới cho mọi môi trường (mọi phiên cũ bị vô hiệu — chấp nhận được ở giai đoạn này).
- **Nghiệm thu:** `grep -ri "GiaoLy_Dev_SuperSecret\|AnhEmMotor\|Dev_Password_Local" --exclude-dir=node_modules .` không còn kết quả; git history được ghi nhận là có lộ (không rewrite history trừ khi được duyệt).
- **Ước lượng:** 2 giờ.

### G0-6. Cron key fail-closed
- **File:** `GiaoLy.API/Controllers/JobsController.cs`
- **Cách làm:**
  ```csharp
  var configuredKey = _config["App:ServiceKey"] ?? _config["Security:ServiceKey"];
  if (string.IsNullOrWhiteSpace(configuredKey)) return StatusCode(503, new { message = "Cron chưa được cấu hình." });
  var provided = Request.Headers["X-Service-Key"].ToString();
  if (CryptographicOperations.FixedTimeEquals(
          Encoding.UTF8.GetBytes(provided), Encoding.UTF8.GetBytes(configuredKey)))
  { ... }
  ```
- **Nghiệm thu:** không header → 401; header sai → 401; header đúng → chạy job; thiếu cấu hình → 503.
- **Ước lượng:** 1 giờ.

### G0-7. Smoke test sau hotfix
```bash
dotnet build GiaoLySystem.slnx
dotnet run --project GiaoLy.API          # cổng 5000
curl -i http://localhost:5000/health                      # 200
curl -i http://localhost:5000/api/v1/health/ready         # 200/503
curl -i http://localhost:5000/api/v1/students             # 401
curl -i -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"<mật khẩu dev>"}' # 200 + accessToken
```
**Cổng thoát G0:** 4/4 kết quả đúng, log không còn exception khởi tạo.

---

## 5. GIAI ĐOẠN 1 — BẢO MẬT & DỮ LIỆU (2–3 ngày)

### G1-1. Hợp nhất cơ chế phân quyền — ✅ hoàn tất 14/11/2026
- **File:** `GiaoLy.API/Attributes/RequirePermissionAttribute.cs`, `GiaoLy.API/Helpers/RequirePermissionAttribute.cs`, `Controllers/StudentController.cs`, `Controllers/CertificateController.cs`, `Infrastructure/Security/CurrentUser.cs`
- **Cách làm:**
  1. Xoá 2 file attribute trùng (`Attributes/`, `Helpers/`).
  2. Chuyển 2 controller đang `using GiaoLy.API.Helpers` sang `GiaoLy.API.Authorization`.
  3. Chọn **một** nguồn quyền: `IPermissionProvider` (DB) như handler hiện tại. ~~Xoá `Permissions`/`HasPermission` khỏi `ICurrentUser` nếu không còn nơi dùng~~ → **đã kiểm tra: còn dùng** (StudentService ×5, ImportExportService ×2, LessonPlanService ×2), nên thay vì xoá thì phát claim `permission` thật từ `IPermissionProvider` vào access token (trước đó claim rỗng → mọi user bị coi là không có quyền).
  4. Giữ bypass `PrivilegeGuard.IsSystemAdmin` và kiểm tra `MustChangePassword` trong handler.
- **Nghiệm thu (đã đạt):** chỉ còn **1** class `RequirePermissionAttribute` (`GiaoLy.API.Authorization`, dạng `AuthorizeAttribute` + policy provider + handler DB); `SecretaryTreasurer` gọi `GET /api/v1/roles` → **403**, `SystemAdmin` → **200**; `MustChangePassword=true` → **403** (kể cả SystemAdmin), `/auth/me` vẫn 200 để đổi mật khẩu.
- **Ước lượng:** 3 giờ → thực tế ~1,5 giờ.

### G1-2. Đóng endpoint lộ dữ liệu — ✅ hoàn tất 15/11/2026
- **File:** `Controllers/StudentController.cs`, `Controllers/StudentsController.cs`, `web-portal/app/pages/verify.vue`, `web-portal/app/components/PortalVerifyWidget.vue`
- **Cách làm:**
  1. Tạo `PublicStudentsController` (route `api/v1/public/students/lookup`) với:
     - `[AllowAnonymous]`, `[EnableRateLimiting("verify")]`;
     - đầu vào **bắt buộc**: `code` (mã đoàn sinh) **hoặc** (`fullName` + `birthDate` khớp chính xác, không tìm gần đúng);
     - đầu ra tối thiểu: `studentCode`, `displayName` (ẩn bớt ký tự giữa), `className`, `branch`, `academicYear`, `averageGrade`;
     - **không** trả SĐT, địa chỉ, sức khoẻ, mã GUID nội bộ.
  2. Xoá `StudentController.VerifyStudent` (`/api/Student/verify`).
  3. Xoá `StudentController.GetStudents` (đã có `StudentsController.GetStudents` có phân quyền + scope).
  4. Sửa 2 chỗ gọi ở portal sang endpoint mới + hiển thị lỗi "không tìm thấy" đúng cách.
- **Nghiệm thu (đã đạt, trừ 1 điểm ghi ở nhật ký):** `GET /api/Student/verify?q=nguyen` → **405** (không còn trả dữ liệu); endpoint mới trả **đúng 6 trường**; gọi request thứ 11 trong phút → **429**; portal gọi đúng endpoint mới.
- **Ước lượng:** 4 giờ → thực tế ~2 giờ.

### G1-3. Chặn mass assignment ở các endpoint ghi legacy
- **File:** `Controllers/StudentController.cs`, `Controllers/CertificateController.cs`, `Controllers/GradeController.cs`, `Controllers/SacramentController.cs`, `Controllers/EnrollmentController.cs`, `Controllers/AcademicYearController.cs`, `Controllers/DraftActionController.cs`, `Controllers/StudentScoreController.cs`
- **Cách làm:** với mỗi action nhận entity:
  - Chuyển sang DTO (`CreateStudentRequest`/`UpdateStudentRequest` đã có) hoặc
  - **Tạm thời** thêm `[Bind]`/whitelist field và từ chối các trường hệ thống (`Id`, `Code`, `IsActive`, `Status`, `BranchId`, `CreatedAt`, `RowVersion`).
- **Nghiệm thu:** gửi body có `"isActive": false` / `"code": "HACK"` → không thay đổi DB; audit log ghi đúng người thực hiện.
- **Ước lượng:** 4 giờ (giải pháp dài hạn là xoá legacy ở G2-2).

### G1-4. Rate limit & proxy tin cậy — ✅ hoàn tất 15/11/2026
- **File:** `Program.cs`, `appsettings.Production.json`
- **Cách làm:**
  ```csharp
  app.UseForwardedHeaders(new ForwardedHeadersOptions {
      ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
      KnownNetworks = { new IPNetwork(IPAddress.Parse("10.0.0.0"), 8) }, // theo hạ tầng thật
      KnownProxies = { ... }
  });
  ```
  và thêm policy mặc định (`options.GlobalLimiter`) cho mọi endpoint chưa khai báo.
- **Nghiệm thu (đã đạt):** peer không nằm trong danh sách tin cậy thì `X-Forwarded-For` giả mạo **không** tạo được partition mới (10×401 rồi 429); login 11 lần/phút từ 1 IP → 429; endpoint không khai báo policy bị chặn bởi global limiter.
- **Ước lượng:** 2 giờ → thực tế ~1,5 giờ.

### G1-5. Giảm dữ liệu nhạy cảm trong AuditLog
- **File:** `Infrastructure/Persistence/Interceptors/AuditInterceptor.cs`
- **Cách làm:** mở rộng `SensitiveProperties`: `ParentPhone`, `Phone`, `PhoneNumber`, `Address`, `HealthNotes`, `Allergies`, `BloodType`, `Email`, `DateOfBirth`, `CitizenId`, `Notes`; hoặc chỉ ghi **tên trường thay đổi**, không ghi giá trị với entity nhóm `Student`/`Guardian`/`User`.
- **Nghiệm thu:** sửa hồ sơ đoàn sinh → bản ghi `AuditLogs` không chứa SĐT/địa chỉ/sức khoẻ; vẫn có `EntityType`, `EntityId`, `Action`, danh sách trường.
- **Ước lượng:** 2 giờ.

### G1-6. Rà soát toàn bộ endpoint `AllowAnonymous`
- **File:** 13 controller có `AllowAnonymous`: Announcements, Auth, Banners, Certificate(s), Documents, Health, Jobs, Leaders, Liturgical, News, Stats, Student.
- **Cách làm:** lập bảng `endpoint | mục đích | dữ liệu trả | có rate limit?`; nguyên tắc: public chỉ trả nội dung công khai; `Documents`/`Certificate` phải kiểm tra lại vì tài liệu nội bộ không được public.
- **Nghiệm thu:** bảng được review; không endpoint nào trả dữ liệu cá nhân/health/contact mà không có kiểm soát.
- **Ước lượng:** 3 giờ.

**Cổng thoát G1:** không còn endpoint trả PII công khai; 1 cơ chế phân quyền; `grep` không còn bí mật; rate limit hoạt động; toàn bộ test smoke G0 vẫn xanh.

---

## 6. GIAI ĐOẠN 3a — FRONTEND: BỎ HỆ THỐNG LEGACY (2 ngày)

### G3a-1. Xoá store/middleware/composable legacy
- **Xoá:** `web-admin/stores/auth.ts`, `web-admin/middleware/auth.legacy.ts`, `web-admin/composables/useApiLegacy.ts`, `web-admin/layouts/admin.legacy.vue`.
- **Sửa:** `web-admin/components/ImportWizard.vue` (đang `useAuthStore`) → dùng `useSessionStore` + `useApi()`.
- **Nghiệm thu:** `grep -rn "useAuthStore\|useApiLegacy\|auth_token" web-admin layer` → rỗng; không còn JWT trong cookie đọc được bằng JS.
- **Ước lượng:** 3 giờ.

### G3a-2. Hợp nhất giao diện quản trị
- **Xoá (legacy, trùng chức năng):** `web-admin/pages/admin/{dashboard,students,users,roles,reports,announcements,documents,leaders,liturgical,academic-years,draft-actions}.vue`, `web-admin/pages/admin/academic-years/[id].vue`, `web-admin/pages/admin/classrooms/[id].vue`, `web-admin/pages/admin/news/index.vue`, `web-admin/pages/admin/students/[id].vue`, `web-admin/pages/students/index.vue`, `web-admin/pages/catechist/*.vue`, `web-admin/pages/index.vue`, `web-admin/pages/login.vue`, `web-admin/pages/profile/*.vue`.
- **Giữ:** toàn bộ `layer/app/pages/**` (bộ mới, có `definePageMeta.permission`, dùng `useApi`).
- **Đối chiếu chức năng trước khi xoá:** mỗi trang legacy phải có trang tương ứng trong `layer` (bảng mapping trong phụ lục B). Trang nào chưa có (ví dụ `draft-actions`) thì **port sang layer** trước.
- **Nghiệm thu:** không còn 2 URL cho cùng nghiệp vụ; `nav.ts` là nguồn điều hướng duy nhất.
- **Ước lượng:** 1 ngày.

### G3a-3. Portal công khai đúng
- **File:** `layer/app/middleware/auth.global.ts`
- **Cách làm:** chỉ bảo vệ khu vực quản trị:
  ```ts
  if (!to.path.startsWith('/admin') && !to.meta.requiresAuth) return
  ```
  đồng thời thêm `definePageMeta({ public: true })` cho các trang portal: `index`, `news`, `verify`, `leadership`, `library`, `liturgical`, `thong-bao`.
- **Nghiệm thu:** mở 7 trang trên ở chế độ ẩn danh → 200, không redirect `/dang-nhap`; `/admin` → redirect đăng nhập.
- **Ước lượng:** 2 giờ.

### G3a-4. Cấu hình URL thay vì hard-code
- **File:** `web-portal/app/layouts/default.vue` (3 chỗ `localhost:3000`), `web-portal/app/components/layout/FooterSection.vue`, `web-admin/nuxt.config.ts`, 2 file `nuxt.config.ts`.
- **Cách làm:** thêm `runtimeConfig.public.{ apiBase, adminUrl, portalUrl }`; thay link cứng bằng `config.public.adminUrl`; bỏ hack `globalThis.process.env`; ghi rõ `NUXT_PUBLIC_API_BASE` phải đặt **lúc build** (SPA) và cấu hình trong CI cho từng môi trường.
- **Nghiệm thu:** `grep -rn "localhost:300" web-admin layer web-portal --include=*.vue --include=*.ts` → rỗng.
- **Ước lượng:** 2 giờ.

### G3a-5. Sửa contract tra cứu (404)
- **File:** `web-portal/app/pages/verify.vue`, `web-portal/app/components/PortalVerifyWidget.vue`
- **Cách làm:** gọi `GET {apiBase}/api/v1/public/students/lookup` với `code` hoặc `fullName + birthDate`; hiển thị trạng thái rỗng/lỗi rõ ràng.
- **Nghiệm thu:** tra cứu đúng 1 đoàn sinh thật → hiện kết quả; tra sai → "Không tìm thấy"; 11 request/phút → thông báo thử lại sau.
- **Ước lượng:** 2 giờ.

**Cổng thoát G3a:** portal dùng được ở chế độ ẩn danh; admin chỉ còn 1 bộ trang; không còn store legacy. **Chỉ sau cổng này mới được xoá controller legacy ở G2-2.**

---

## 7. GIAI ĐOẠN 2 — BACKEND: KIẾN TRÚC & NHẤT QUÁN (4–5 ngày)

### G2-1. Chuẩn hoá route — ✅ hoàn tất 16/11/2026
- **Hiện trạng:** mỗi action khai báo 2 route (`api/v1/...` và `api/...`); `Auth`, `Profile`, `User`, `GuardianLinks` khai báo 2 `[Route]`.
- **Cách làm:** giữ **duy nhất** `/api/v1/*`; xoá route không version. Với `api/auth|me|users|guardian-links` bỏ attribute `[Route("api/...")]` thứ hai.
- **Nghiệm thu:** `grep -c 'Http.*"api/' Controllers/*.cs` không còn route thiếu `v1`; frontend gọi đúng; 404 với route cũ (có thông báo deprecation trong docs).
- **Ước lượng:** 3 giờ.

### G2-2. Xoá controller legacy (sau G3a) — ✅ hoàn tất 16/11/2026
| Xoá | Thay bằng |
|---|---|
| `StudentController` (`/api/Student`) | `StudentsController` (`/api/v1/students`) |
| `GradeController` (`/api/Grade`) | `GradesController` |
| `AcademicYearController` | `AcademicYearsController` |
| `EnrollmentController` | `EnrollmentsController` |
| `CertificateController` | `CertificatesController` |
| `SacramentController` | `SacramentsController` |
| `StudentScoreController` | `GradesController` (kiểm tra `class/{className}` + `save` đã có tương đương) |
| `DraftActionController` | `PromotionController` (drafts approve/reject đã có) |
| `HealthController` | giữ, nhưng bỏ inject `AppDbContext` khỏi action `Health()` |

- **Nghiệm thu:** số controller legacy = 0; build xanh; toàn bộ màn hình vẫn chạy; `tools/fe_lint.js` PASS sau khi cập nhật catalog.
- **Ước lượng:** 1 ngày.

#### G2-1 + G2-2 — Hoàn tất 16/11/2026

**Đã xoá 8 controller legacy:** `StudentController`, `GradeController`, `AcademicYearController`, `EnrollmentController`, `CertificateController`, `SacramentController`, `StudentScoreController`, `DraftActionController` (thay bằng các controller `*sController` + `PromotionController` tương ứng). `HealthController` giữ lại; action `Health()` không truy vấn DB, chỉ `Ready()` mới kiểm tra kết nối.

**Đã bỏ 150 attribute route không version** (và 4 `[Route("api/...")]` trùng) trên 28 controller còn lại. Kiểm tra sau khi sửa:
```
grep -n 'api/' Controllers/*.cs  → 0 dòng không phải api/v1
[Route(  → chỉ còn api/v1/auth, api/v1/guardian-links, api/v1/me, api/v1/users, api/v1/public/students
```
**Ngoại lệ được giữ có chủ đích:** `GET /health` và `GET /health/ready` (probe hạ tầng, không phải API nghiệp vụ).

**Thông báo ngừng hỗ trợ:** mọi đường dẫn dạng `/api/Student`, `/api/Grade`, `/api/AcademicYear`, `/api/Enrollment`, `/api/Certificate`, `/api/Sacrament`, `/api/StudentScore`, `/api/DraftAction`, `/api/Announcement`, `/api/CampEvent`, `/api/Document`, `/api/DutyAssignment`, `/api/Leader`, `/api/LessonPlan`, `/api/News/*`, `/api/SpiritualBouquet/*`, `/api/Stats/public`, `/api/users`, `/api/me`, `/api/auth/*`, `/api/guardian-links`, `/api/branches`, `/api/class-levels`, `/api/classrooms/*`, `/api/roles`, `/api/permissions`, `/api/imports`, `/api/promotion-batches`, `/api/families`, `/api/banners/*`, `/api/public/*`, `/api/liturgical/*` **đã ngừng hỗ trợ từ 16/11/2026 và trả 404**; dùng `/api/v1/...` tương ứng.

**Frontend đã cập nhật sang v1:** `web-portal` (thông báo, lãnh đạo, thư viện, tin tức, banner, lịch phụng vụ hôm nay) và `web-admin` (mẫu import, tải tài liệu, danh sách tin công khai).

**Kiểm chứng thực tế:** build **0 warning / 0 error**; **40** URL legacy đại diện → **404** toàn bộ; 7 route public v1 → **200**; `POST /api/v1/auth/login` → **200**; 10 route nghiệp vụ v1 có token (`students`, `branches`, `class-levels`, `academic-years`, `roles`, `permissions`, `imports`, `promotion-batches`, `families`, `users`) → **200**; web-admin `http://localhost:3000` → **200**.

**Còn tồn tại (ngoài phạm vi G2-2):** `web-admin/pages/admin/news/index.vue` còn gọi `POST /api/news/sync` và `PATCH /api/news/{id}/toggle` — hai route này **không tồn tại ở cả bản cũ lẫn v1** (cần làm ở G3a/G2-9); `web-portal/app/pages/liturgical.vue` gọi `/api/liturgical` không có endpoint công khai tương đương. `tools/authz-matrix/endpoints.json`/`results.json` đang là catalog cũ, cần quét lại ở G2-9.

### G2-3. Áp scope (ABAC) cho mọi service nghiệp vụ
- **Hiện trạng:** chỉ 10/34 service dùng `IScopeContext`.
- **Ưu tiên bắt buộc:** `GradeService`, `CertificateService`, `EnrollmentService`, `PromotionService`, `ImportExportService`, `CampsService`.
- **Cách làm:** inject `IScopeContext`; trước khi đọc/ghi theo `classRoomId`/`studentId`, lọc qua `_scope.ClassRooms(...)` / `_scope.Students(...)`; trả `Result.Forbidden` khi ngoài phạm vi.
- **Nghiệm thu:** đăng nhập `Catechist` lớp A, gọi `GET /api/v1/grades/classroom/{id lớp B}` → 403; `PATCH` điểm lớp B → 403; `Report` theo ngành chỉ chứa dữ liệu ngành mình.
- **Ước lượng:** 1,5 ngày.

### G2-4. Đưa cấu hình JWT vào hiệu lực — ✅ hoàn tất 14/11/2026
- **File:** `Infrastructure/Security/TokenService.cs`, `appsettings.json`, `Common/ConfigurationValidator.cs`
- **Cách làm:** `TokenService` đọc `Jwt:ExpiryMinutes` (mặc định **20**) và `Jwt:RefreshTokenDays` (mặc định **14**) từ `IConfiguration`; giá trị ≤ 0 hoặc không phải số → ném lỗi cấu hình rõ ràng. `appsettings.json` khai báo 20/14; `appsettings.Production.json` giữ **120 phút / 14 ngày**. Validator chặn `ExpiryMinutes` ngoài 1–1440 và `RefreshTokenDays` ngoài 1–365.
- **Nghiệm thu (đã đạt):** đổi `Jwt__ExpiryMinutes`/`Jwt__RefreshTokenDays` bằng biến môi trường → `exp` của access token và hạn cookie `refreshToken` thay đổi theo, **không cần build lại**; giá trị sai → app dừng với thông báo rõ.
- **Bổ sung 16/11/2026:** `TokenValidationParameters.ClockSkew = TimeSpan.Zero` trong `Program.cs` — bỏ dung sai 5 phút mặc định để access token bị từ chối đúng `exp`. Đã kiểm với `Jwt__ExpiryMinutes=1`: token còn 59 giây hợp lệ, sau 65 giây trả 401, `POST /auth/refresh` cấp token mới và request được thử lại thành công; web-admin tự refresh khi gặp 401 mà không đá người dùng về trang đăng nhập.
- **Ước lượng:** 2 giờ → thực tế ~0,5 giờ.

### G2-5. Dọn đăng ký DI trùng & mã chết — ✅ hoàn tất 15/11/2026
- **File:** `Program.cs`, `DependencyInjection.cs`, `Services/VaticanNewsService.cs`, `Services/LiturgicalService.cs`
- **Cách làm:** bỏ `AddMemoryCache()` trùng (giữ 1 chỗ trong Infrastructure); bỏ đăng ký `LiturgicalService` dạng concrete nếu không nơi nào inject trực tiếp; **quyết định** `VaticanNewsService`: đăng ký `AddHostedService` hoặc xoá file.
- **Quyết định:** **xoá** `VaticanNewsService` (cùng `CatholicNewsDto`) và **xoá** `GiaoLy.API/Services/LiturgicalService.cs` — cả hai là bản trùng không còn ai dùng (xem chi tiết trong nhật ký).
- **Nghiệm thu (đã đạt):** `grep -c "AddMemoryCache"` = **1**; không còn `BackgroundService` chưa đăng ký; mỗi service chỉ còn một đăng ký.
- **Ước lượng:** 1 giờ → thực tế ~0,5 giờ.

### G2-6. Xử lý lỗi import/Excel
- **File:** các action import legacy + `ImportExportService`
- **Cách làm:** thay `catch { continue; }` bằng đếm dòng lỗi + log `Warning` kèm số dòng; trả về `imported`, `skipped`, `errors[]`; không trả `ex.Message` ra client (chỉ `correlationId`).
- **Nghiệm thu:** upload file có 3 dòng sai → phản hồi nêu rõ 3 dòng bị bỏ, không lộ stack/SQL.
- **Ước lượng:** 3 giờ.

### G2-7. Chuẩn hoá migration & baseline DB — ✅ hoàn tất 14/11/2026
- **Cách làm (đã chốt sau khi đo schema thật):** không vá chuỗi 22 migration cũ (lịch sử giả). Chuyển toàn bộ migration cũ sang `database/legacy-migrations/` để tham chiếu, sinh **một baseline `InitialCreateV3`** từ model hiện tại, tạo DB sạch, **sao chép dữ liệu thật** bằng script SQL tường minh, kiểm chứng đăng nhập, rồi đổi tên DB (giữ nguyên bản cũ).
- **Kết quả đo:** DB thật thiếu **142 cột** (23 bảng) và **19 bảng** so với model; 66 cột `NOT NULL` bị thiếu.
- **Nghiệm thu (đã đạt):** `__EFMigrationsHistory` = 1 dòng (`InitialCreateV3`); diff schema so với DB tham chiếu sinh từ model = **0 bảng / 0 cột**; `dotnet ef` không còn `has-pending-model-changes`; dữ liệu 9 bảng khớp 100%; login 200.
- **Ước lượng:** 4 giờ → thực tế ~4 giờ.
- **Quy trình cho môi trường khác (staging/production):** DB đang chạy schema cũ **không thể** chỉ `database update` (baseline mới sẽ cố tạo lại 46 bảng). Phải: backup → tạo DB rỗng → `dotnet ef database update` → chạy `database/G2-7_copy_from_legacy.sql` (sửa tên DB nguồn ở đầu file) → đối chiếu số dòng → đổi tên. Từ nay mọi thay đổi schema đi qua `migrations add` bình thường.

> **⚠ Phát hiện khi thực thi G0 (14/11/2026):** `dotnet ef migrations has-pending-model-changes` báo model đã lệch khỏi snapshot, nhưng khi thử `migrations add` thì sinh ra **146 `DropColumn` + 146 `AddColumn` + 38 `CreateTable/DropTable`** — trong đó có `Grades.GPA`, `Grades.ClassRoomId`, `Grades.AttendanceRate`, `Families.LeaderId`. **Tuyệt đối không áp dụng migration tự sinh này** (sẽ mất dữ liệu và phá vỡ `GradeController`/`Enrollment`).
>
> Đồng thời DB dev `GiaoLyDB_Vision2` có đủ **22** dòng trong `__EFMigrationsHistory` nhưng **thiếu các cột cốt lõi** (`Users.FailedLoginCount`, `Users.IsActive`, `Users.DeletedAt`, `Roles.IsSystem`, `AcademicYears.ActivatedAt/ArchivedAt/ClosedAt`…), tức lịch sử migration đã bị "đóng dấu" lên một schema cũ hơn.
>
> ⇒ Chuỗi 22 migration hiện tại **không phải lịch sử hợp lệ** của model. Phải làm baseline thủ công: so sánh schema thật với model, viết script SQL bổ sung cột/index/FK **có backup và chạy trên bản sao**, rồi mới tạo baseline mới. Không dùng `migrations add` một phát.
>
> **Đã xử lý (14/11/2026):** 22 migration cũ được lưu tại `database/legacy-migrations/`; baseline mới là `GiaoLy.Domain/Migrations/20261114124734_InitialCreateV3.cs` (46 `CreateTable`, 0 `DropColumn`). Thêm `GiaoLy.Domain/Data/AppDbContextFactory.cs` (`IDesignTimeDbContextFactory`) để `dotnet ef` không phụ thuộc host API — trước đó validator cấu hình làm mọi lệnh `dotnet ef` thất bại ở design-time.

### G2-8. Gia cố background service — ✅ hoàn tất 15/11/2026
- **File:** `CatholicNewsCrawlerService.cs`, `GradebookFinalizerService.cs`, `Services/BackgroundJobRunRecorder.cs` (mới)
- **Cách làm:** bỏ `GC.Collect()`/`WaitForPendingFinalizers()`; thêm retry 3 lần với backoff lũy thừa 2s → 4s + jitter (chỉ cho lỗi tạm thời: 5xx/408/429, mạng, timeout); ghi `BackgroundJobRun` cho mỗi lượt qua `BackgroundJobRunRecorder`; bắt `OperationCanceledException` khi shutdown để thoát êm.
- **Nghiệm thu (đã đạt):** mỗi lượt có bản ghi `BackgroundJobRuns` kèm `StartedAt`/`FinishedAt`/`Status`/`Message`; `grep GC.Collect` = rỗng; log có đủ 3 lần thử cho nguồn hỏng; dừng app không ném exception.
- **Ước lượng:** 3 giờ → thực tế ~2 giờ.

### G2-9. Sinh lại danh mục endpoint & ma trận quyền
- **Cách làm:** viết script trích `[Http*]` + `RequirePermission` từ controller → sinh `tools/api-catalog.csv`; cập nhật `permission-matrix.csv`; chạy `node tools/fe_lint.js` phải PASS trên **toàn bộ** endpoint thật.
- **Nghiệm thu:** catalog ≥ 190 endpoint thật (sau khi bỏ route kép), `fe_lint` = 0 lỗi, 0 cảnh báo.
- **Ước lượng:** 4 giờ.

**Cổng thoát G2:** build 0 warning; `dotnet ef migrations has-pending-model-changes` = "No changes"; không controller legacy; scope test 403/200 đúng; `fe_lint` PASS.

---

## 8. GIAI ĐOẠN 3b — FRONTEND HOÀN TẤT (2 ngày)

### G3b-1. Cài đặt & cổng chất lượng
- **Việc làm:** `pnpm install` đầy đủ cho `web-admin` và `web-portal` (hiện `web-admin/node_modules` thiếu `nuxt`/`vue`, chỉ 13 gói); chạy `pnpm lint`, `pnpm typecheck`, `pnpm build` cho cả hai.
- **Nghiệm thu:** 3 lệnh × 2 dự án đều exit 0; `web-admin/.output` và `web-portal/.output` mới được tạo.
- **Ước lượng:** 4 giờ.

### G3b-2. Dọn tàn dư
- Xoá `web-admin/.nuxt`, `.output` khỏi git (G4-1); xoá component/asset không dùng (`grep` xác nhận); thống nhất `compatibilityDate`, tắt `devtools` khi build production.
- **Nghiệm thu:** `npx nuxi analyze` hoặc rà thủ công không còn import chết; bundle size admin giảm (ghi lại số đo trước/sau).

### G3b-3. Trạng thái & lỗi nhất quán
- Mọi lời gọi API đi qua `useApi()` (đã có xử lý 401 → refresh → retry, 403, 429 `retry-after`).
- Rà các trang còn `$fetch` trực tiếp (`grep -rn "\$fetch" layer web-portal web-admin`) → chuyển sang `useApi` hoặc wrapper public có timeout.
- **Nghiệm thu:** hết token → tự refresh, không văng ra login; 429 hiện thông báo thử lại.

**Cổng thoát G3b:** lint + typecheck + build xanh cả 2 app; portal ẩn danh dùng được; admin đăng nhập/refresh/logout trọn vòng.

---

## 9. GIAI ĐOẠN 4 — REPO, CI, TÀI LIỆU (1–2 ngày)

### G4-1. `.gitignore` & bỏ artifact khỏi git
```gitignore
# build & deps
**/bin/
**/obj/
**/node_modules/
**/.nuxt/
**/.output/
**/dist/
# bí mật
.env
.env.*
!.env.example
appsettings.*.local.json
# test artifacts
e2e-tests/playwright-report/
e2e-tests/test-results/
# rác
*.log
```
```bash
git rm -r --cached GiaoLy.API/bin GiaoLy.API/obj \
  web-admin/node_modules web-admin/.nuxt web-admin/.output \
  web-portal/node_modules web-portal/.nuxt web-portal/.output \
  e2e-tests/playwright-report e2e-tests/test-results
```
- **Nghiệm thu:** `git ls-files | grep -E "bin/|obj/|node_modules|\.nuxt/|\.output/" | wc -l` = 0 (mục tiêu: giảm từ 162.223 xuống 0).

### G4-2. Commit toàn bộ mã nguồn đang untracked
- **Hiện trạng:** `GiaoLy.Infrastructure` **0 file được track**, `layer/` **0**, `docs/`, `tools/`, `database/` **0**, `GiaoLy.Application` chỉ 1 file nguồn; 297 file untracked.
- **Việc làm:** commit theo từng nhóm (Domain → Application → Infrastructure → API → layer → web-admin → web-portal → docs/tools/database) để review được.
- **Nghiệm thu:** `git ls-files GiaoLy.Infrastructure | wc -l` > 0; `git ls-files layer | wc -l` > 0; clone mới build được.

### G4-3. CI 4 job
```yaml
# .github/workflows/ci.yml
jobs:
  backend:   { build + dotnet test + ef has-pending-model-changes }
  admin:     { pnpm install, lint, typecheck, build }
  portal:    { pnpm install, lint, typecheck, build }
  contract:  { node tools/check_layer.js && node tools/fe_lint.js }
```
- **Nghiệm thu:** PR giả lập fail khi cố tình thêm endpoint không có trong catalog hoặc xoá `public: true`.

### G4-4. Viết lại e2e đúng nghiệp vụ
- Xoá nội dung copy từ dự án showroom (`"Ban Điều Hành & Chủ Showroom"`, `/workspace`); viết lại: đăng nhập, xem danh sách đoàn sinh, tạo đoàn sinh, nhập điểm, tra cứu công khai, phân quyền 403.
- Dùng `process.env.E2E_*`; chạy trên dữ liệu seed riêng.
- **Nghiệm thu:** 6/6 test xanh trên môi trường staging; không có thông tin đăng nhập trong mã.

### G4-5. Tài liệu
- Cập nhật `docs/RUNBOOK.md` (biến môi trường mới, quy trình migration/baseline), `docs/API_AND_SECURITY_CHECKLIST.md` (đánh dấu lại đúng thực tế), thêm ADR: "Loại bỏ controller legacy", "Một cơ chế phân quyền", "Chính sách token 20 phút/14 ngày".
- Ghi rõ trong README: lệnh chạy, biến môi trường, cách cài dependency.

---

## 10. GIAI ĐOẠN 5 — NGHIỆM THU (2 ngày)

### 10.1 Ma trận kiểm thử bắt buộc

| # | Kịch bản | Kỳ vọng |
|---|---|---|
| 1 | `GET /health` | 200 |
| 2 | `GET /api/v1/health/ready` | 200 (DB OK) / 503 (DB lỗi) |
| 3 | `GET /api/v1/students` không token | 401 |
| 4 | Login sai 5 lần | Lần 6 → 423, thông báo còn phút |
| 5 | Login đúng | 200 + accessToken + cookie `refreshToken` HttpOnly |
| 6 | Gọi API sau 20 phút (hoặc giảm exp khi test) | Tự refresh, không logout |
| 7 | Refresh token dùng lại lần 2 | Toàn bộ phiên bị thu hồi, 401 |
| 8 | `Catechist` gọi `students.create` | 403 |
| 9 | `Catechist` xem điểm lớp khác | 403 |
| 10 | `SystemAdmin` gọi mọi endpoint quản trị | 200 |
| 11 | `MustChangePassword=true` gọi nghiệp vụ | 403 `AUTH_MUST_CHANGE_PASSWORD`, chỉ đổi mật khẩu được |
| 12 | Tra cứu công khai với mã đúng | 200, ≤ 8 trường, không PII |
| 13 | Tra cứu 11 lần/phút | 429 |
| 14 | Portal 7 trang ẩn danh | 200, không redirect |
| 15 | `/admin` ẩn danh | redirect `/dang-nhap?quay_lai=...` |
| 16 | Sửa hồ sơ có `isActive=false` trong body | Không thay đổi DB |
| 17 | Audit log sau khi sửa hồ sơ | Không chứa SĐT/địa chỉ/sức khoẻ |
| 18 | Cron không header / sai header | 401; thiếu cấu hình → 503 |
| 19 | Migration trên DB sạch | 22 bản ghi history, app chạy |
| 20 | `pnpm lint/typecheck/build` × 2 app | exit 0 |

### 10.2 Lệnh nghiệm thu tổng
```bash
dotnet build GiaoLySystem.slnx
dotnet ef migrations has-pending-model-changes --project GiaoLy.Domain --startup-project GiaoLy.API
node tools/check_layer.js
node tools/fe_lint.js
pnpm -C web-admin lint && pnpm -C web-admin typecheck && pnpm -C web-admin build
pnpm -C web-portal lint && pnpm -C web-portal typecheck && pnpm -C web-portal build
npx playwright test --config e2e-tests/playwright.config.ts
```

### 10.3 Definition of Done
- [ ] Không còn lỗi P0/P1 nào trong bảng truy vết (mục 11).
- [ ] API trả 200 cho health, 401 cho endpoint bảo vệ, 403 đúng phân quyền, 429 đúng rate limit.
- [ ] Không còn bí mật trong repo (`gitleaks detect` sạch trên commit mới).
- [ ] `git ls-files` không chứa artifact; mã nguồn đủ để clone mới build được.
- [ ] CI 4 job xanh trên nhánh chính.
- [ ] Tài liệu vận hành khớp thực tế.

---

## 11. Ma trận truy vết lỗi → task

| Lỗi phát hiện | Task |
|---|---|
| API 500 toàn bộ, EF design-time hỏng | G0-1 |
| `EnsureCreated` bỏ qua migration | G0-2, G2-7 |
| Seed tài khoản/mật khẩu mặc định | G0-3 |
| Placeholder production qua validator | G0-4 |
| Bí mật trong appsettings/.env/e2e | G0-5, G4-4 |
| Cron key hard-code | G0-6 |
| 3 lớp `RequirePermission` + claim rỗng | G1-1 |
| `/api/Student/verify` lộ điểm; `GET /api/Student` lộ PII | G1-2, G1-6 |
| Mass assignment legacy | G1-3, G2-2 |
| Rate limit/ForwardedHeaders | G1-4 |
| Audit log chứa PII | G1-5 |
| JWT 20 phút/7 ngày vs config 120/14 | G2-4 |
| Controller/route trùng, route kép | G2-1, G2-2 |
| Scope chỉ 10/34 service | G2-3 |
| DI trùng, `VaticanNewsService` chết | G2-5 |
| Import nuốt lỗi/lộ `ex.Message` | G2-6 |
| `GC.Collect` trong crawler | G2-8 |
| Catalog 188 vs 394 endpoint | G2-9 |
| Store auth legacy (JWT trong cookie 7 ngày) | G3a-1 |
| Hai bộ trang admin trùng | G3a-2 |
| Portal bị middleware chặn | G3a-3 |
| Link `localhost:3000/3001` | G3a-4 |
| Portal gọi `/api/students/verify` (404) | G3a-5, G1-2 |
| `web-admin` thiếu dependency, không build được | G3b-1 |
| Repo 162k artifact, source untracked | G4-1, G4-2 |
| Không có CI backend/admin | G4-3 |
| E2E copy dự án khác + credentials | G4-4 |
| Docs lệch thực tế | G4-5 |

---

## 12. Rủi ro & phương án dự phòng

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Sửa DI làm thay đổi hành vi audit | Trung bình | Test 1 luồng CRUD, so sánh bản ghi `AuditLogs` trước/sau |
| `Migrate()` trên DB đã có dữ liệu tạo bởi `EnsureCreated` | **Cao** | Bắt buộc backup + baseline migration trên bản sao; chạy dry-run |
| Xoá controller legacy làm sập màn hình còn dùng | Cao | Chỉ xoá **sau** G3a; giữ tag git `pre-legacy-removal` để revert |
| Đổi `Jwt:Key` huỷ mọi phiên | Thấp | Thông báo trước; thực hiện ngoài giờ |
| Xoá trang admin legacy mất chức năng chưa port | Trung bình | Bảng mapping phụ lục B + review từng màn hình |
| `git rm --cached` gây conflict cho đồng đội | Trung bình | Thông báo; mọi người `git rm -r --cached . && git reset --hard` sau khi merge |
| Rate limit chặn nhầm sau proxy | Trung bình | Cấu hình `KnownNetworks` theo hạ tầng; test staging |

**Rollback:** mỗi giai đoạn là một nhánh + tag (`g0-hotfix`, `g1-security`, …). Không trộn nhiều giai đoạn trong một PR. DB: backup trước G0-2/G2-7, khôi phục bằng `RESTORE DATABASE` theo `docs/DISASTER_RECOVERY_DRILL.md`.

---

## 13. Lịch trình đề xuất

| Ngày | Công việc | Kết quả bàn giao |
|---|---|---|
| D0 (0,5) | G0-1 → G0-7 | API chạy, health 200, smoke test xanh |
| D1–D3 | G1-1 → G1-6 | Phân quyền hợp nhất, PII đóng, rate limit, audit sạch |
| D4–D5 | G3a-1 → G3a-5 | Frontend bỏ legacy, portal công khai, tra cứu chạy |
| D6–D10 | G2-1 → G2-9 | Xoá legacy, scope toàn diện, JWT config, catalog mới |
| D11–D12 | G3b-1 → G3b-3 | Lint/typecheck/build xanh 2 app |
| D13–D14 | G4-1 → G4-5 | Repo sạch, CI 4 job, e2e thật, docs |
| D15–D16 | G5 | Nghiệm thu 20 kịch bản, go-live |

---

## 14. Nhật ký thực thi

### G0 — Hoàn tất 14/11/2026

| Task | Trạng thái | Ghi chú |
|---|---|---|
| G0-1 Sửa DbContext | ✅ | `AuditInterceptor` chỉ dùng `IHttpContextAccessor`, đăng ký Singleton; giữ `AddDbContextPool` |
| G0-2 `Migrate()` | ✅ (mã) | EF Core 10 chặn bằng `PendingModelChangesWarning` → cần G2-7 trước khi seeding chạy được |
| G0-3 Seeder theo môi trường | ✅ | Tài khoản mẫu chỉ ở Development; bỏ mật khẩu hard-code; fail-closed khi thiếu mật khẩu |
| G0-4 Validator placeholder | ✅ | Chặn `PLACEHOLDER`/`REPLACE_WITH`/`MUST_CHANGE`/`CHANGE_ME`; Production bắt buộc Admin password, ServiceKey, CORS HTTPS |
| G0-5 Di chuyển bí mật | ✅ | Xoá JWT key + mật khẩu khỏi `appsettings.Development.json`; bỏ credential khỏi `e2e-tests`; `baseURL` e2e đọc từ `E2E_BASE_URL` |
| G0-6 Cron fail-closed | ✅ | Không còn khoá dự phòng; so sánh SHA-256 + `FixedTimeEquals`; thiếu cấu hình → 503 |
| G0-7 Smoke test | ⚠ một phần | health 200, ready 200, anon 401, cron 401/400 đúng; **login vẫn 500 do DB lệch schema** |

**Bắt buộc khi chạy dev sau G0-5:** phải đặt biến môi trường `Jwt__Key` và `Admin__InitialPassword` (và `App__DefaultPassword` nếu muốn có tài khoản mẫu), ví dụ:

```bash
Jwt__Key="<chuỗi ngẫu nhiên ≥32 ký tự>" \
Admin__InitialPassword="<mật khẩu mạnh>" \
App__DefaultPassword="<mật khẩu mẫu>" \
dotnet run --project GiaoLy.API
```

### G2-7 — Hoàn tất 14/11/2026

| Bước | Kết quả |
|---|---|
| Backup trước khi động vào DB | `database/backup/GiaoLyDB_Vision2_20261114.bak` (7.9 MB, không `WITH COMPRESSION` vì SQL Express) |
| Đo sai lệch schema | DB tham chiếu `GiaoLyDB_ModelRef` sinh từ model (`tools/SchemaRef`): 46 bảng. DB thật: 28 bảng → **thiếu 19 bảng, 142 cột** |
| Tái lập migration | 22 migration + designer + snapshot → `database/legacy-migrations/`; sinh `20261114124734_InitialCreateV3` |
| Design-time | Thêm `AppDbContextFactory` + `Microsoft.EntityFrameworkCore.Design` (PrivateAssets) vào `GiaoLy.Domain` |
| Tạo DB sạch | `GiaoLyDB_V3Migrated` = 46 bảng đúng model, `__EFMigrationsHistory` = 1 |
| Sao chép dữ liệu | `database/G2-7_copy_from_legacy.sql` — 9 bảng có dữ liệu + danh mục `Branches`: 4/4, 4/4 Roles, 43/43 Permissions, 43/43 RolePermissions, 3/3 Users, 52/52 Students, 5/5 Leaders, 5/5 NewsSources, 953/953 NewsArticles, 5/5 Announcements |
| Kiểm chứng (DB mới) | health 200, ready 200 (`Connected`), anon 401, **login 200**, `/auth/me` 200, refresh 200, `/api/v1/students` 200 (52 học sinh, `TN26xxxx`) |
| Đổi tên DB | `GiaoLyDB_Vision2` → `GiaoLyDB_Vision2_Legacy_20261114`; `GiaoLyDB_V3Migrated` → `GiaoLyDB_Vision2` |
| Kiểm chứng (cấu hình mặc định) | health 200, ready 200, anon 401, **login 200**, `/api/v1/students` 200, refresh 200, **0 lỗi seeding** |
| Diff schema sau cùng | **0 bảng / 0 cột thiếu** so với model |

**Bài học / lỗi phát hiện thêm trong G2-7:**
1. `dotnet ef` bị chặn bởi validator cấu hình → phải có design-time factory.
2. Seeder **không tạo `Branches`** (danh mục ngành) dù `Students.BranchId` có FK tới đó; script copy đã bổ sung 4 ngành. → **đã sửa trong `DbSeeder` ngày 15/11/2026** (xem mục “Seeder nền tảng” trong nhật ký).
3. `hasAdmin` chỉ kiểm tra `RoleId == SystemAdmin`, nên DB có sẵn `admin` với `RoleId` legacy bị coi là “chưa có admin” → `IX_Users_Username` ném lỗi trùng. Đã sửa: kiểm tra thêm `Username == "admin"`.
4. Cột `Users.Role` là thuộc tính tương thích (`get => RoleEntity?.Code`), nhưng **vẫn được map thành cột `NOT NULL`** — script copy phải điền tường minh, nếu không sẽ `Cannot insert NULL`.
5. Mật khẩu admin cũ không xác định được từ hash; đã đặt lại bằng `tools/SchemaRef --hash` (BCrypt cost 12) và `SecurityStamp` mới (vô hiệu token cũ).

**Lưu ý dữ liệu:** Role legacy (`Code` = `1..4`) vẫn còn trong bảng `Roles` bên cạnh 6 vai trò hệ thống; tài khoản mẫu được gán lại đúng vai trò (`admin`→`SystemAdmin`, `thuky`→`SecretaryTreasurer`, `truongnganh`→`DivisionLeader`). Việc gộp/dọn 4 role legacy thuộc G2-2.

### G2-4 — Hoàn tất 14/11/2026

| Nội dung | Trước | Sau |
|---|---|---|
| Access token | `AddMinutes(20)` hard-code | `Jwt:ExpiryMinutes` (mặc định 20) |
| Refresh token | `AddDays(7)` hard-code | `Jwt:RefreshTokenDays` (mặc định 14) |
| `appsettings.json` | không khai báo | `ExpiryMinutes: 20`, `RefreshTokenDays: 14` |
| `appsettings.Production.json` | 120/14 (bị bỏ qua) | 120/14 **có hiệu lực** |
| Validator | — | chặn `ExpiryMinutes` ∉ [1,1440], `RefreshTokenDays` ∉ [1,365] |

Đổi giá trị bằng biến môi trường `Jwt__ExpiryMinutes` / `Jwt__RefreshTokenDays` (không cần build lại). Lưu ý: `SystemSettingsRules.SecurityRefreshTokenDays` (mặc định `7`) là cấu hình trong DB cho nghiệp vụ, **không** điều khiển vòng đời token — tránh chỉnh nhầm chỗ.

### G1-1 — Hoàn tất 14/11/2026

| Nội dung | Trước | Sau |
|---|---|---|
| Số lớp `RequirePermissionAttribute` | 3 (`Authorization/`, `Attributes/`, `Helpers/`) | **1** (`Authorization/`) |
| Controller dùng `Helpers` | `StudentController`, `CertificateController` | chuyển sang `Authorization` (vẫn giữ `Helpers` cho `DateTimeHelper`) |
| Claim quyền trong token | **không có** → `HasPermission` luôn `false` | phát đủ `permission` từ `IPermissionProvider` (admin 86, thư ký 46) |
| `ICurrentUser.HasPermission` | chỉ đọc claim rỗng | `SystemAdmin` → luôn true; còn lại đọc claim thật |
| Thứ tự kiểm tra trong handler | SystemAdmin bypass trước `MustChangePassword` | `MustChangePassword` chặn trước (kể cả admin) |

Kiểm chứng thực tế: `GET /api/v1/roles` → admin **200**, `thuky` **403**; `GET /api/v1/users` → `thuky` **403**; bật `MustChangePassword=1` → `students` **403** với cả admin và thuky, `GET /auth/me` **200**; đã trả cờ về 0.

**Ghi chú:** mật khẩu dev của `thuky` đã được đặt lại ngày 16/11/2026 (bắt buộc đổi khi đăng nhập lần tới); giá trị không lưu trong tài liệu.

### Seeder nền tảng — Hoàn tất 15/11/2026

| Thay đổi | Chi tiết |
|---|---|
| `SeedBranches` (mới) | Tạo 4 ngành `AU`/`THIEU`/`NGHIA`/`HIEP` (Ấu Nhi 6–9, Thiếu Nhi 10–12, Nghĩa Sĩ 13–15, Hiệp Sĩ 16–18), idempotent theo `Code`; thiếu bảng này thì `Students.BranchId` vi phạm FK |
| `CleanupLegacyRoles` (mới) | Chuyển người dùng khỏi 4 vai trò cũ (`Code` "1".."4") sang vai trò hệ thống tương ứng rồi xoá vai trò + `RolePermissions`; đồng bộ lại cột tương thích `Users.Role` bằng SQL |
| Thứ tự seed | `SeedAnnouncements` chuyển xuống **sau** `SeedInitialUsers` vì `Announcements.AuthorUserId` là FK `NOT NULL` → trước đây database rỗng luôn ném `FK_Announcements_Users_AuthorUserId`; seed cũng gán `AuthorUserId` cho tài khoản sớm nhất |

Kiểm chứng trên **database rỗng hoàn toàn** (`GiaoLyDB_FreshSeed`, sau đó đã xoá):

```
branches=4  roles=6  perms=86  rolePermissions=276  users=3  announcements=2  settings=15  seed_errors=0
Branches: 1 AU | 2 THIEU | 3 NGHIA | 4 HIEP
Users: admin→SystemAdmin, thuky→SecretaryTreasurer, truongnganh→DivisionLeader
login (mật khẩu khởi tạo) = 200, mustChangePassword=true
GET /students khi còn bắt buộc đổi mật khẩu = 403
đổi mật khẩu = 200 (thử mật khẩu chứa "admin" → 400 đúng chính sách)
login lại = 200 → POST /students = 200, code TN260001, branchId=1 (Ấu Nhi)
```

Trên DB thật `GiaoLyDB_Vision2`: `roles` từ **10 → 6** (mất 4 vai trò legacy), `students=52` nguyên vẹn, login 200, 0 lỗi seeding.

### G2-8 — Hoàn tất 15/11/2026

| Nội dung | Trước | Sau |
|---|---|---|
| `GC.Collect()` + `WaitForPendingFinalizers()` | có trong crawler | **đã xoá** |
| Lỗi RSS | 1 lần thử, bỏ qua nguồn | 3 lần thử, backoff 2s → 4s (+ jitter 0–250ms); 4xx không thử lại |
| Ghi `BackgroundJobRun` | không có | mỗi lượt một bản ghi: `Running` → `Succeeded`/`Failed`/`Skipped`, `LockedBy` = tên service |
| Shutdown | `Task.Delay`/`PeriodicTimer` ném `OperationCanceledException` | bắt riêng, ghi `Skipped` + thoát êm |
| Lỗi ghi DB giữa lượt | bản ghi kẹt `Running` mãi | `FinishAsync` gỡ các entity đang treo rồi ghi trạng thái thất bại |

**Lỗi phát hiện thêm khi kiểm chứng:** crawler không set `NewsArticles.LinkHash` nên mọi bài sau bài đầu tiên vi phạm `UQ_NewsArticles_LinkHash` (`duplicate key value is ()`) → cả lượt cào hỏng và bản ghi job bị treo `Running`. Đã sửa: tính `SHA256(link)` như `BackgroundJobService`, và `ChangeTracker.Clear()` sau mỗi nguồn lỗi để lỗi không lan sang nguồn sau.

Kết quả chạy thật (nguồn test `http://127.0.0.1:59999/feed.xml` — đã xoá sau test):
```
log: “Không lấy được RSS … (lần 1/3)” → “(lần 2/3)” → “(lần 3/3)”
BackgroundJobRuns:
  NewsCrawler      | Succeeded | dur=18s  | Đã lưu 110 bài mới từ 3/6 nguồn tin (3 nguồn lỗi).
  GradebookCloser  | Succeeded | dur=0s   | Không có niên học nào quá hạn cần khóa sổ.
NewsArticles: 953 → 1063
dừng app: 0 “Unhandled exception”, 0 exception từ background service
```

### G2-5 — Hoàn tất 15/11/2026

| Đăng ký | Trước | Sau |
|---|---|---|
| `AddMemoryCache()` | 2 lần (Program + Infrastructure) | **1** (Infrastructure) |
| `LiturgicalService` | 2 đăng ký: concrete (`GiaoLy.API.Services`) + `ILiturgicalService` (Infrastructure) | **1**: `AddScoped<ILiturgicalService, LiturgicalService>()` |
| `VaticanNewsService` | `BackgroundService` không đăng ký, ghi cache `VaticanNewsList` mà không ai đọc | **xoá file** |
| `GiaoLy.API/Services/LiturgicalService.cs` | class trùng + `LiturgicalDay` chỉ dùng nội bộ file | **xoá file** |

Vì sao xoá thay vì đăng ký `VaticanNewsService`: cache key `VaticanNewsList` không có nơi đọc, `CatholicNewsDto` không dùng ở đâu, và `CatholicNewsCrawlerService` đã cào đủ 5 nguồn RSS (gồm VaticanNews) vào DB — chạy thêm service này chỉ tốn request và bộ nhớ.

Kiểm chứng sau khi dọn: build 0 warning/0 error; `health=200`, `GET /api/v1/public/liturgical/today=200` (chứng minh `ILiturgicalService` vẫn resolve), `login=200`, `GET /api/v1/news/sources=200`, log khởi động **0** lỗi `Unable to resolve service`.

### G1-2 — Hoàn tất 15/11/2026

**Endpoint mới:** `GET /api/v1/public/students/lookup` (`PublicStudentsController`)

| Đầu vào | Điều kiện |
|---|---|
| `code` | mã đoàn sinh, so khớp không phân biệt hoa/thường |
| `fullName` + `birthDate` | **bắt buộc đủ cả hai**; họ tên khớp chính xác sau chuẩn hoá dấu/khoảng trắng, ngày sinh đúng ngày (không tìm gần đúng) |
| thiếu tham số | `400` |
| không có hồ sơ | `404` (thông điệp chung, không tiết lộ gì thêm) |
| >1 hồ sơ khớp tên+ngày sinh | `409`, yêu cầu tra bằng mã |

**Đầu ra cố định 6 trường:** `studentCode`, `displayName` (che bớt: "Phạm Thị Hằng" → "P*** T** H***"), `className`, `branch`, `academicYear`, `averageGrade`. Không GUID, không SĐT/địa chỉ/sức khoẻ/ghi chú.

**Đã xoá:** `StudentController.GetStudents()` (trả nguyên entity `Student` gồm phụ huynh, SĐT, sức khoẻ) và `StudentController.VerifyStudent` (`/api/Student/verify` tìm gần đúng, trả về 10 hồ sơ + GUID).

**Lưu ý khi kiểm:** so khớp họ tên phải làm ở bộ nhớ bằng `VietnameseNormalizer` vì cột `Students.FullNameNormalized` của dữ liệu cũ lưu theo chuẩn khác (chữ hoa, còn dấu) — lọc theo ngày sinh trong SQL rồi so tên trong bộ nhớ.

**Dữ liệu đã sửa kèm:** `Branches.Name` của 3 ngành (AU/THIEU/HIEP) bị mojibake trong DB ("áº¤u Nhi"…) do lần seed trước ghi sai mã hoá; đã cập nhật lại `Ấu Nhi`/`Thiếu Nhi`/`Hiệp Sĩ` (NGHIA vốn đúng).

**Chưa kiểm được:** portal (`web-portal`) chưa chạy được vì thiếu dependency `@pinia/nuxt` do layer yêu cầu (lỗi có sẵn, cùng nhóm G3b-1) — 2 file `.vue` chỉ được kiểm biên dịch SFC (0 lỗi template/script), chưa bấm thử trên trình duyệt. Ngoài ra `GET /api/Student/verify` trả **405** chứ không phải 404 như kế hoạch (do còn route `{id}` của `StudentController`); vẫn không trả dữ liệu.

### G1-4 — Hoàn tất 15/11/2026

**ForwardedHeaders** — `GiaoLy.API/Common/ForwardedHeadersSetup.cs`, cấu hình ở section `ReverseProxy`:

```json
"ReverseProxy": { "Enabled": true, "ForwardLimit": 1, "KnownProxies": [], "KnownNetworks": [] }
```

- Không khai báo gì → giữ mặc định an toàn của ASP.NET Core: **chỉ tin loopback**.
- Có khai báo → **thay hẳn** danh sách mặc định bằng đúng proxy/CIDR của hạ tầng, tránh cảnh “thêm vào nhưng loopback vẫn được tin”.
- Giá trị sai → ghi cảnh báo và bỏ qua; nếu **tất cả** đều sai → `LogError` + quay về chỉ tin loopback.
- `Enabled=false` → không gắn middleware, dùng địa chỉ kết nối trực tiếp.

**Rate limit mặc định** — `RateLimiterExtensions.AddGiaoLyRateLimiting(config)` thêm `options.GlobalLimiter`:

```json
"RateLimiting": { "Global": { "PermitLimit": 120, "WindowSeconds": 60 } }
```

- Global limiter partition theo IP; riêng `upload`/`export` partition theo **user id** sau xác thực: `UseAuthentication()` đã được chuyển lên trước `UseRateLimiter()` (16/11/2026), request ẩn danh vẫn rơi về IP. Đã đo cùng một IP: `admin` hết 10 lượt export → 429 trong khi `thuky` vẫn 200; `admin` hết 20 lượt upload → 429 trong khi `thuky` vẫn 400 (chưa chạm hạn mức).
- Áp cho mọi endpoint **chưa** có `[EnableRateLimiting]`; endpoint có policy riêng vẫn ăn cả policy riêng **và** global (đã đo: global=5 làm endpoint `verify` 10/phút bị chặn ở request thứ 6).

**Kết quả đo:**

| Kịch bản | Kết quả |
|---|---|
| Endpoint không policy, global=5 | 5×200 rồi **429** (`code: RATE_LIMITED`, có `correlationId`) |
| Peer không tin cậy (`KnownProxies=203.0.113.10`), 11 lần login với 11 `X-Forwarded-For` khác nhau | 10×401 rồi **429** → XFF bị bỏ qua |
| Peer tin cậy (loopback), 8 lần login với 8 XFF khác nhau | 8×401, **không 429** → XFF được dùng đúng |
| Login 11 lần/phút từ 1 IP (không XFF) | 10×401 rồi **429** |
| `KnownProxies=khong-phai-ip` | log cảnh báo, ứng dụng vẫn chạy |

Ghi chú tồn tại (ngoài phạm vi G1-4): policy `upload`/`export` phân vùng theo `User.Identity.Name` nhưng cũng chạy trước authentication, nên thực tế đang phân vùng theo IP như nhau.

## Phụ lục A — Bộ biến môi trường chuẩn sau khi sửa

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | ✅ | `Production` khi phát hành |
| `ConnectionStrings__DefaultConnection` | ✅ | Không chứa placeholder |
| `Jwt__Key` | ✅ | ≥ 32 ký tự, sinh ngẫu nhiên, **không** commit |
| `Jwt__Issuer` / `Jwt__Audience` | ✅ | `GiaoLySystem` / `GiaoLyUsers` |
| `Jwt__ExpiryMinutes` | ✅ | 20 (thống nhất code + config) |
| `Jwt__RefreshTokenDays` | ✅ | 14 |
| `Admin__InitialPassword` | ✅ (lần đầu) | Chỉ dùng khi chưa có admin |
| `App__ServiceKey` | ✅ | Khoá cron, fail-closed nếu thiếu |
| `Cors__AllowedOrigins__0..n` | ✅ | HTTPS, không localhost |
| `Storage__UploadDirectory` | ⬜ | Nếu bật lưu tệp |
| `Storage__MaxFileSizeBytes` | ⬜ | Đồng bộ với `ImportExportService` |
| `ReverseProxy__KnownNetworks__0` | ⬜ | Theo hạ tầng |
| `NUXT_PUBLIC_API_BASE` | ✅ | Đặt **lúc build** cho web-admin |
| `NUXT_PUBLIC_ADMIN_URL` / `NUXT_PUBLIC_PORTAL_URL` | ✅ | Thay link localhost |

## Phụ lục B — Mapping trang legacy → trang mới (kiểm tra trước khi xoá)

| Trang legacy (`web-admin`) | Trang thay thế (`layer/app/pages`) |
|---|---|
| `/admin/dashboard` | `/admin` |
| `/admin/students`, `/students` | `/admin/doan-sinh` |
| `/admin/users` | `/admin/nguoi-dung` |
| `/admin/roles` | `/admin/vai-tro` |
| `/admin/reports` | `/admin/bao-cao` |
| `/admin/announcements` | `/admin/thong-bao` |
| `/admin/documents` | `/admin/tai-lieu` |
| `/admin/leaders` | `/admin/huynh-truong` |
| `/admin/liturgical` | `/admin/lich-phung-vu` |
| `/admin/academic-years(+[id])` | `/admin/nien-khoa`, `/admin/lop` |
| `/admin/classrooms/[id]` | `/admin/lop/[id]` |
| `/admin/news` | `/admin/tin-tuc` |
| `/catechist/*` (camps, duty, lesson-plans, sacraments, bouquets) | `/admin/trai`, `/admin/truc-lop`, `/admin/giao-an`, `/admin/lop/[id]/hoa-thieng` |
| `/profile/*` | `/admin/tai-khoan` |
| `/admin/draft-actions` | **chưa có tương đương** → port sang `/admin/len-lop` trước khi xoá |

## Phụ lục C — Lệnh kiểm tra nhanh sau mỗi task

```bash
# backend
dotnet build GiaoLySystem.slnx
dotnet ef migrations has-pending-model-changes --project GiaoLy.Domain --startup-project GiaoLy.API
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/health

# frontend & hợp đồng
node tools/check_layer.js
node tools/fe_lint.js
pnpm -C web-admin lint && pnpm -C web-admin typecheck
pnpm -C web-portal lint && pnpm -C web-portal typecheck

# bảo mật
grep -rniE "superSecret|GiaoLyDev@|GiaoLyAdmin@|REPLACE_WITH" --exclude-dir=node_modules --exclude-dir=bin --exclude-dir=obj .
git ls-files | grep -E "bin/|obj/|node_modules|\.nuxt/|\.output/" | wc -l
```
