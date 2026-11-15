# BÁO CÁO TOÀN DIỆN HỆ THỐNG BACKEND GIÁO LÝ V3
**Tài Liệu Kỹ Thuật & Kiến Trúc Tổng Thể (Master Architecture & Specifications Report)**
*Ngày phát hành: Tháng 11/2026 | Phiên bản hệ thống: V3.0-Production-Ready*

---

## 1. TỔNG QUAN HỆ THỐNG & NỀN TẢNG CÔNG NGHỆ

Hệ thống Quản lý Giáo Lý V3 là giải pháp chuyển đổi số toàn diện dành cho Ban Giáo Lý và các Giáo xứ Công giáo. Hệ thống được thiết kế theo tiêu chuẩn công nghiệp hiện đại, bảo mật cao và chịu tải tốt.

```
                              KIẾN TRÚC TỔNG THỂ HỆ THỐNG
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                          CLIENT APPLICATIONS                             │
   │      [Giao diện Quản trị Nuxt 3]             [Cổng Phụ Huynh Nuxt 3]     │
   └──────────────────────┬───────────────────────────────────┬───────────────┘
                          │ (HTTPS / REST API)                │
                          ▼                                   ▼
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                       HẠ TẦNG BẢO VỆ PHÍA TRƯỚC                          │
   │  [Nginx / Cloudflare] ──► [HSTS, CSP, Rate Limiting 5 Tầng, Real IP]     │
   └──────────────────────────────────┬───────────────────────────────────────┘
                                      │
   ┌──────────────────────────────────▼───────────────────────────────────────┐
   │                     BACKEND ASP.NET CORE (.NET 10)                       │
   │  ┌────────────────────────────────────────────────────────────────────┐  │
   │  │ 1. GiaoLy.API (Controllers, Middlewares, Health Probes, Swagger)   │  │
   │  └─────────────────────────────────┬──────────────────────────────────┘  │
   │  ┌─────────────────────────────────▼──────────────────────────────────┐  │
   │  │ 2. GiaoLy.Application (Contracts, DTOs, Result Pattern, Errors)    │  │
   │  └─────────────────────────────────┬──────────────────────────────────┘  │
   │  ┌─────────────────────────────────▼──────────────────────────────────┐  │
   │  │ 3. GiaoLy.Infrastructure (Services, EF Core, QuestPDF, ClosedXML)  │  │
   │  └─────────────────────────────────┬──────────────────────────────────┘  │
   │  ┌─────────────────────────────────▼──────────────────────────────────┐  │
   │  │ 4. GiaoLy.Domain (Entities, Enums, Pure Rules, DbContext, Migrations)│  │
   │  └─────────────────────────────────┬──────────────────────────────────┘  │
   └────────────────────────────────────┼─────────────────────────────────────┘
                                        │
   ┌────────────────────────────────────▼─────────────────────────────────────┐
   │                       CƠ SỞ DỮ LIỆU & LƯU TRỮ TỆP                         │
   │      [SQL Server 2022 (Full Recovery)]        [Kho Tệp An Toàn /uploads] │
   └──────────────────────────────────────────────────────────────────────────┘
```

### Công Nghệ Nòng Cốt:
- **Ngôn ngữ & Nền tảng**: C# 14 / .NET 10 LTS (ASP.NET Core Web API).
- **Truy cập dữ liệu**: Entity Framework Core 10 (Sử dụng `AddDbContextPool` với kích thước pool 128 tối ưu hiệu năng).
- **Cơ sở dữ liệu**: Microsoft SQL Server 2019 / 2022.
- **Xác thực & Mã hóa**: JWT (HMAC-SHA256) + BCrypt (WorkFactor = 12).
- **Xuất tệp & Báo cáo**: ClosedXML (Streaming Excel không tràn RAM) & QuestPDF (Chứng chỉ PDF vector tem mẫu).
- **Xử lý tệp & An toàn**: `HtmlSanitizer` (chống XSS), Magic Bytes Validator (chống mã độc giả dạng ảnh).

---

## 2. KIẾN TRÚC PHÂN TẦNG (CLEAN ARCHITECTURE)

Mã nguồn được cấu trúc theo 4 dự án độc lập, bảo đảm nguyên lý trách nhiệm đơn lẻ (Single Responsibility) và đảo ngược phụ thuộc (Dependency Inversion):

### 1. `GiaoLy.Domain` (Tầng Lõi Nghiệp Vụ)
- **Entities**: 42 thực thể CSDL mô tả toàn bộ đời sống giáo xứ (Đoàn sinh, Phụ huynh, Lớp học, Điểm số, Bí tích, Chứng chỉ, Hoạt động trại hè, Sổ cái tài chính, v.v.).
- **Pure Rules**: Các quy tắc tính toán nghiệp vụ thuần túy không phụ thuộc framework (`GradeRules.cs`, `SystemSettingsRules.cs`).
- **Constants**: Hệ thống 52 quyền hạn (`Permissions.cs`) và 6 vai trò chuẩn (`Roles.cs`).
- **Persistence Model**: `AppDbContext.cs` với định nghĩa các ràng buộc khoá ngoại, chỉ mục duy nhất và cấu hình cascade an toàn.

### 2. `GiaoLy.Application` (Tầng Ca Sử Dụng & Hợp Đồng)
- **Contracts**: Toàn bộ Interfaces cho các dịch vụ ứng dụng (Ví dụ: `IStudentService`, `IGradeService`, `IParentPortalService`, `IReportService`).
- **DTOs**: Các lớp truyền tải dữ liệu tách biệt giữa `CreateRequest`, `UpdateRequest`, `ResponseDto` và `ExportResult`.
- **Result Pattern**: Hệ thống kết quả chuẩn hóa `Result<T>` (`Ok`, `Created`, `BadRequest`, `NotFound`, `Conflict`, `Forbidden`), thống nhất mã lỗi qua `ErrorCodes.cs`.

### 3. `GiaoLy.Infrastructure` (Tầng Hạ Tầng & Dịch Vụ Ngoài)
- **Services Implementation**: Cài đặt thực tế các logic ứng dụng qua EF Core và LINQ.
- **Interceptors**: `AuditInterceptor` tự động bắt các thay đổi `Added`, `Modified`, `Deleted` để ghi nhận nhật ký kiểm toán bất biến `AuditLogs`.
- **Security & Jobs**: Dịch vụ sinh token, mã hóa BCrypt, bộ thu thập tin tức RSS an toàn, và điều phối tác vụ nền.

### 4. `GiaoLy.API` (Tầng Giao Tiếp HTTP)
- **Controllers**: 20+ bộ điều khiển API tuân thủ tiêu chuẩn RESTful.
- **Middlewares**: Pipeline bảo vệ 6 bước: ForwardedHeaders -> ExceptionHandling (RFC 7807) -> CorrelationId -> SecurityHeaders -> RateLimiter -> SessionValidation.
- **Health Probes**: Cung cấp các endpoint đo đạc sức khỏe `/api/v1/health` và `/api/v1/health/ready`.

---

## 3. LƯỢC ĐỒ CƠ SỞ DỮ LIỆU & RÀNG BUỘC BẤT BIẾN (INVARIANTS)

Hệ thống sở hữu 42 bảng dữ liệu quan hệ, được bảo vệ bởi các quy tắc toàn vẹn nghiêm ngặt:

```
                            MỐI QUAN HỆ CỐT LÕI (CORE ERD)
  ┌──────────────┐         ┌──────────────┐         ┌──────────────────┐
  │   Branches   │1───────*│ ClassLevels  │1───────*│    ClassRooms    │
  └──────────────┘         └──────────────┘         └────────┬─────────┘
                                                             │1
                                                             │*
  ┌──────────────┐         ┌──────────────┐         ┌────────┴─────────┐
  │  Guardians   │         │   Students   │1───────*│   Enrollments    │
  └──────┬───────┘         └──────┬───────┘         └────────┬─────────┘
         │1                       │1                         │1
         │*                       │*                         │1
  ┌──────┴───────────────┐ ┌──────┴───────────────┐ ┌────────┴─────────┐
  │   StudentGuardians   │ │  StudentSacraments   │ │      Grades      │
  │ (Ưu tiên liên lạc)   │ │  (Hồ sơ bí tích)     │ │(Chuyên cần & điểm│
  └──────────────────────┘ └──────────────────────┘ └──────────────────┘
```

### Các Ràng Buộc Bất Biến Trọng Yếu:
1. **Phụ huynh & Đoàn sinh độc lập**: Phụ huynh được gom nhóm theo số điện thoại trong `Guardians`. Một phụ huynh có thể có nhiều con và một em có thể có nhiều người giám hộ (Cha, Mẹ, Đỡ đầu) có thứ tự ưu tiên `IsPrimary`.
2. **Quy tắc tính điểm**: Điểm số không tự động gán giá trị 0 khi học viên vắng thi chưa có lý do; giá trị `NULL` biểu thị bài thi chưa diễn ra.
3. **Phân công giảng dạy linh hoạt**: Bảng `ClassRoomTeachers` cho phép phân định rõ Huynh trưởng Chủ nhiệm (`IsLead = 1`) và các Huynh trưởng Phụ tá trong cùng một lớp học.
4. **Chứng chỉ điện tử bất biến**: Mỗi chứng chỉ lưu trữ một chuỗi JSON `Snapshot` tại thời điểm ký phát và mã tra cứu bảo mật ngẫu nhiên 12 ký tự (`VerificationCode`). Dữ liệu này không bị thay đổi ngay cả khi hồ sơ đoàn sinh được chỉnh sửa sau đó.

---

## 4. HỆ THỐNG AN NINH & BẢO VỆ DỮ LIỆU ĐA TẦNG

```
                           LỚP PHÒNG VỆ ĐA TẦNG (DEFENSE-IN-DEPTH)
   ┌────────────────────────────────────────────────────────────────────────┐
   │ TẦNG 1: MẠNG & TIÊU ĐỀ (SecurityHeaders, HSTS, CSP, ForwardedHeaders)   │
   ├────────────────────────────────────────────────────────────────────────┤
   │ TẦNG 2: TẦN SUẤT & PHIÊN (Rate Limiter 5 Cấp, JWT, SecurityStamp)      │
   ├────────────────────────────────────────────────────────────────────────┤
   │ TẦNG 3: PHÂN QUYỀN TRUY CẬP (RBAC 52 Permissions, Scope Validation)    │
   ├────────────────────────────────────────────────────────────────────────┤
   │ TẦNG 4: CHỐNG LEO QUYỀN & SSRF (PrivilegeGuard, SafeUrlValidator)       │
   ├────────────────────────────────────────────────────────────────────────┤
   │ TẦNG 5: DỮ LIỆU & KIỂM TOÁN (BCrypt 12, PII Masking, AuditLog Tracker)  │
   └────────────────────────────────────────────────────────────────────────┘
```

1. **Phân Quyền Theo Phạm Vi (Scope-based Authorization)**:
   - Hệ thống kiểm tra quyền kết hợp phạm vi: `Global` (Ban Giáo Lý), `Branch` (Trưởng Ngành), `Classroom` (Giáo lý viên đứng lớp), `Self` (Cá nhân) và `Guardian` (Phụ huynh).
   - Truy cập trái phạm vi tự động trả về **HTTP 404 Not Found** để triệt tiêu nguy cơ vét cạn ID (Anti-Enumeration).
2. **Lớp Bảo Vệ Chống Leo Quyền (`PrivilegeGuard`)**:
   - Khóa các vai trò hệ thống (`IsSystem = true`). Người dùng không thể tự gán quyền cho chính mình hoặc nâng vai trò cao hơn cấp bậc hiện tại.
3. **5 Chính Sách Giới Hạn Tần Suất (Rate Limiting)**:
   - `login`: 10 yêu cầu/phút (chống dò mật khẩu brute-force).
   - `verify`: 10 yêu cầu/phút (bảo vệ cổng tra cứu chứng chỉ).
   - `public`: 60 yêu cầu/phút (chống quét dữ liệu tin tức, phụng vụ).
   - `upload`: 20 yêu cầu/giờ (chống làm nghẽn dung lượng ổ đĩa).
   - `export`: 10 yêu cầu/giờ (bảo vệ máy chủ khỏi nghẽn CPU khi xuất Excel dung lượng lớn).
4. **Phòng Vệ SSRF & Tải Lên Tệp**:
   - `SafeUrlValidator`: Chặn toàn bộ IP nội bộ, loopback, private ranges, metadata cloud và port lạ khi cào tin tức RSS.
   - Magic Bytes Validator: Kiểm tra cấu trúc byte đầu tiên của tệp tải lên để ngăn chặn việc tải lên mã thực thi trá hình ảnh.

---

## 5. TỔNG HỢP CÁC PHÂN HỆ NGHIỆP VỤ & DANH MỤC API

Hệ thống cung cấp hơn 100 API endpoints được bảo vệ chặt chẽ:

| Phân hệ | Đường dẫn API chính | Chức năng nghiệp vụ chính |
| :--- | :--- | :--- |
| **Xác thực & Danh tính** | `/api/v1/auth/*`<br>`/api/v1/users/*`<br>`/api/v1/roles/*` | Đăng nhập, làm mới token, đổi mật khẩu, thu hồi phiên làm việc, quản lý người dùng và ma trận vai trò. |
| **Tổ chức & Niên khóa** | `/api/v1/branches/*`<br>`/api/v1/class-levels/*`<br>`/api/v1/academic-years/*` | Quản lý 4 ngành, 12 cấp lớp có thứ tự tiến trình, vòng đời niên khóa và đóng/khóa sổ. |
| **Đoàn sinh & Phụ huynh** | `/api/v1/students/*`<br>`/api/v1/guardians/*`<br>`/api/v1/families/*` | Quản lý hồ sơ thiếu nhi, gia đình, liên kết phụ huynh ưu tiên, thuật toán chống trùng 3 mức. |
| **Lớp học & Ghi danh** | `/api/v1/classrooms/*`<br>`/api/v1/enrollments/*` | Mở lớp theo niên khóa, phân công chủ nhiệm và phụ tá, quản lý danh sách học sinh theo lớp. |
| **Điểm số & Mở khóa** | `/api/v1/grades/*` | Bảng điểm học kỳ, tính chuyên cần, xếp loại 3 mức, quy trình đề xuất và duyệt mở khóa điểm có hạn. |
| **Lên lớp & Tốt nghiệp** | `/api/v1/promotion/*` | Đợt xét lên lớp, tự động phát hiện bản nháp lỗi thời (Stale Drafts), cập nhật lớp mới và tốt nghiệp. |
| **Bí tích & Chứng chỉ** | `/api/v1/sacraments/*`<br>`/api/v1/certificates/*` | Hồ sơ lãnh nhận 4 bí tích, cấp chứng chỉ điện tử có Snapshot JSON, in PDF và tra cứu bảo mật. |
| **Hoạt động & Trại hè** | `/api/v1/camps/*`<br>`/api/v1/duty/*`<br>`/api/v1/lesson-plans/*`<br>`/api/v1/bouquets/*` | Đăng ký trại, sổ cái tài chính trại, phân công phận vụ, soạn giáo án, sổ hoa thiêng dâng Chúa. |
| **Nội dung công khai** | `/api/v1/announcements/*`<br>`/api/v1/documents/*`<br>`/api/v1/news/*`<br>`/api/v1/liturgical/*` | Thông báo phân loại đối tượng, kho tài liệu văn kiện, tin tức công giáo, lịch phụng vụ tuần. |
| **Báo cáo & Nền tảng** | `/api/v1/reports/*`<br>`/api/v1/system/settings/*`<br>`/api/v1/jobs/*`<br>`/api/v1/audit-logs/*` | Xuất 6 mẫu báo cáo Excel chuẩn, 15 thiết lập hệ thống, điều phối tác vụ nền, xem nhật ký kiểm toán. |
| **Cổng Phụ Huynh** | `/api/v1/portal/*` | 6 endpoint xem danh sách con em, kết quả điểm số, chuyên cần, bí tích, chứng chỉ và thông báo gia đình. |
| **Chuyển đổi dữ liệu** | `/api/v1/system/migration/*` | Kích hoạt 4 đợt chuyển đổi ETL và truy xuất báo cáo đối soát bất biến thời gian thực. |

---

## 6. ĐIỀU HÀNH TÁC VỤ NỀN (BACKGROUND JOBS)

Hệ thống tích hợp 5 tác vụ nền tự động với cơ chế khóa đơn phiên (Single-instance locking), chống xung đột dữ liệu:
1. `GradebookCloser`: Tự động khóa sổ điểm khi niên khóa kết thúc.
2. `NewsCrawler`: Cào tin tức công giáo định kỳ qua RSS hợp lệ.
3. `TokenCleanup`: Thu dọn các Refresh Token quá hạn hoặc bị thu hồi.
4. `GradeUnlockExpiry`: Đóng tự động các yêu cầu mở khóa điểm vượt quá thời hạn cho phép.
5. `AuditRetention`: Tự động nén và lưu trữ nhật ký kiểm toán sau 24 tháng.

---

## 7. ĐÁNH GIÁ SẴN SÀNG TRIỂN KHAI (PRODUCTION READINESS)

- **Biên dịch**: Giải pháp đạt **0 Warnings, 0 Errors** trên toàn bộ 4 tầng dự án.
- **Tài liệu bàn giao**:
  - `RUNBOOK.md`: Hướng dẫn cấu hình môi trường, triển khai Docker/IIS và xử lý sự cố.
  - `DISASTER_RECOVERY_DRILL.md`: Cam kết RPO < 15 phút, RTO < 30 phút và quy trình khôi phục thực tế.
  - `API_AND_SECURITY_CHECKLIST.md`: Bảng kiểm chứng an ninh và danh mục nghiệm thu.
- **Tính tương thích**: Sẵn sàng 100% để kết nối với giao diện người dùng Frontend Nuxt 3 qua bộ RESTful API và xác thực HttpOnly Cookie an toàn.
