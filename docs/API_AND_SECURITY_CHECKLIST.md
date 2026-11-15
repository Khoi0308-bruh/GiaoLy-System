# BẢNG KIỂM CHỨNG BẢO MẬT VÀ DANH MỤC NGHIỆP VỤ HỆ THỐNG GIÁO LÝ V3

Tài liệu này tổng kết toàn bộ các tiêu chí an ninh (Security Hardening), kiểm thử xâm nhập phòng ngừa (Defensive Engineering), và đối chiếu 100% các khối tính năng đã xây dựng qua 15 gói triển khai (P0 đến P14) theo Blueprint V3.

---

## 1. MA TRẬN RÀ SOÁT BẢO MẬT THEO MỤC 7.1 BLUEPRINT V3

| Hạng mục bảo mật | Giải pháp kỹ thuật đã hiện thực | Trạng thái |
| :--- | :--- | :--- |
| **Xác thực danh tính (Authentication)** | - Thuật toán BCrypt với hệ số độ khó `WorkFactor = 12`<br>- Khóa tài khoản tạm thời khi đăng nhập sai nhiều lần<br>- Access token JWT thời gian ngắn (120 phút)<br>- Refresh token xoay vòng lưu an toàn (HttpOnly Cookie)<br>- Thu hồi tức thì mọi phiên đăng nhập qua `SecurityStamp` và `SessionValidationMiddleware` | **HOÀN THÀNH** |
| **Phân quyền truy cập (Authorization)** | - 100% các endpoint nghiệp vụ được bảo vệ bởi attribute `[RequirePermission(...)]`<br>- Kiểm tra phạm vi dữ liệu đa cấp (Global, Branch, Classroom, Self, Guardian)<br>- Trả về **404 Not Found** khi người dùng truy cập bản ghi ngoài phạm vi (chống tấn công vét cạn enumeration ID) | **HOÀN THÀNH** |
| **Chống leo quyền (Privilege Escalation)** | - Lớp bảo vệ `PrivilegeGuard` ngăn chặn người dùng tự gán thêm quyền cho chính mình<br>- Khóa vai trò hệ thống (`IsSystem = true`) và mã vai trò dành riêng<br>- Tách biệt quyền `users.assign-role` với quyền sửa thông tin thông thường | **HOÀN THÀNH** |
| **Kiểm tra dữ liệu đầu vào (Input Validation)** | - Toàn bộ DTO có FluentValidation với quy tắc ràng buộc chặt chẽ<br>- Từ chối các trường lạ ngoài DTO, kiểm tra độ dài chuỗi khớp độ dài lược đồ CSDL<br>- Chuẩn hóa tên bỏ dấu `FullNameNormalized` chống trùng lặp | **HOÀN THÀNH** |
| **Chống tấn công chèn lệnh (Injection Defense)** | - 100% truy vấn CSDL qua EF Core được tham số hóa (Parameterized queries)<br>- Tuyệt đối không nối chuỗi thô trong SQL commands<br>- Sử dụng thư viện `HtmlSanitizer` lọc mã độc trước khi lưu nội dung thông báo | **HOÀN THÀNH** |
| **Chống giả mạo yêu cầu từ phía máy chủ (SSRF)** | - Kiểm tra URL qua `SafeUrlValidator`<br>- Chặn toàn bộ IP nội bộ, loopback, private ranges, metadata cloud và port lạ<br>- Cấu hình Timeout 5s và tắt cơ chế tự động chuyển hướng (Redirects) | **HOÀN THÀNH** |
| **An toàn tải lên tệp (File Upload Security)** | - Kiểm tra Magic Bytes nhị phân thật ở đầu tệp<br>- Giới hạn dung lượng tệp tối đa (10 MB)<br>- Máy chủ tự sinh tên tệp GUID ngẫu nhiên và lưu trữ bên ngoài thư mục web root | **HOÀN THÀNH** |
| **Giới hạn tần suất (Rate Limiting)** | - Thiết lập 5 chính sách độc lập: `login`, `verify`, `public`, `upload`, `export`<br>- Tích hợp `UseForwardedHeaders` để lấy đúng IP thật của máy trạm phía sau reverse proxy<br>- Trả về mã chuẩn `429 Too Many Requests` kèm ProblemDetails khi vượt ngưỡng | **HOÀN THÀNH** |
| **Tiêu đề an ninh (Security Headers)** | - Ép buộc `Strict-Transport-Security (HSTS)`<br>- `X-Content-Type-Options: nosniff`<br>- `X-Frame-Options: DENY`<br>- `Referrer-Policy: strict-origin-when-cross-origin`<br>- `Content-Security-Policy (CSP)` chặt chẽ<br>- `Permissions-Policy: camera=(), microphone=(), geolocation=()` | **HOÀN THÀNH** |
| **Xử lý lỗi & Bảo vệ PII** | - `ExceptionHandlingMiddleware` trả về RFC 7807 `ProblemDetails`<br>- Tuyệt đối không để lộ Stack Trace, truy vấn SQL, hay đường dẫn vật lý ra ngoài Client<br>- Che giấu thông tin cá nhân (PII) trên tất cả các API công khai tra cứu chứng chỉ và tin tức | **HOÀN THÀNH** |

---

## 2. BẢNG TỔNG KẾT BÀN GIAO 15 GÓI TRIỂN KHAI THEO LỘ TRÌNH V3

| Gói | Tên Gói Nghiệp Vụ | Trạng Thái | Điểm Nhấn Nghiệp Vụ Chính |
| :---: | :--- | :---: | :--- |
| **P0** | Nền tảng thiết kế & CSDL | **Hoàn thành** | Lược đồ V3, 40+ thực thể, chỉ mục duy nhất và ràng buộc toàn vẹn |
| **P1** | Danh tính, Phân quyền & Khung API | **Hoàn thành** | JWT, Refresh Token xoay vòng, SecurityStamp, 50+ quyền hạn, 5 vai trò hệ thống |
| **P2** | Cơ cấu tổ chức & Đoàn sinh | **Hoàn thành** | 4 Ngành, 12 Cấp lớp có thứ tự, Đoàn sinh, Phụ huynh tách rời, Chống trùng 3 mức |
| **P3** | Ghi danh & Lớp học | **Hoàn thành** | Trạng thái ghi danh, phân công đa chủ nhiệm `ClassRoomTeachers`, bảo vệ phạm vi lớp |
| **P4** | Đề xuất & Phê duyệt | **Hoàn thành** | Đợt xét duyệt (`DraftActions`), phê duyệt luồng nhiều cấp |
| **P5** | Quản lý Gia đình & Sổ liên lạc | **Hoàn thành** | Hồ sơ gia đình, liên kết phụ huynh - đoàn sinh, ghi chú bí mật `StudentNotes` |
| **P6** | Điểm số & Chuyên cần | **Hoàn thành** | Quy tắc điểm thuần túy, loại bỏ điểm 0 mặc định, cơ chế đề xuất mở khóa điểm có hạn |
| **P7** | Lên lớp & Tốt nghiệp | **Hoàn thành** | `PromotionBatches` & `PromotionDrafts`, tự động phát hiện Stale, xét tốt nghiệp |
| **P8** | Bí tích & Chứng chỉ | **Hoàn thành** | Tiến trình bí tích, cấp chứng chỉ kèm mã tra cứu 12 ký tự, Snapshot JSON bất biến |
| **P9** | Hoạt động, Tài chính trại & Giáo án | **Hoàn thành** | Sổ cái trại `CampPayments`, giáo án, phân công phận vụ, sổ hoa thiêng |
| **P10** | Nội dung công khai & Thông báo | **Hoàn thành** | Thông báo phân loại đối tượng, văn kiện tài liệu, tin tức, proxy ảnh chống SSRF |
| **P11** | Báo cáo & Nền tảng hệ thống | **Hoàn thành** | Báo cáo Excel streaming, nhật ký kiểm toán, 15 thiết lập hệ thống, 5 tác vụ nền |
| **P12** | Cổng phụ huynh (Parent Portal) | **Hoàn thành** | 6 endpoint riêng cho phụ huynh, bảo vệ chống rò rỉ dữ liệu, 404 chống dò ID |
| **P13** | Chuyển dữ liệu (ETL) & Chuyển đổi | **Hoàn thành** | 4 kịch bản ETL Expand & Contract, báo cáo đối soát 4 bất biến đạt 0 lỗi |
| **P14** | Làm cứng & Bàn giao hệ thống | **Hoàn thành** | Security Headers, Rate Limiting, Health Checks, Runbook và Diễn tập thảm họa |

---

## 3. KẾT LUẬN NGHIỆM THU

Hệ thống Backend Giáo Lý V3 đã hoàn tất 100% khối lượng công việc, vượt qua toàn bộ các bài kiểm thử biên dịch và yêu cầu kỹ thuật đề ra trong đồ án thiết kế. Hệ thống hoàn toàn sẵn sàng cho công tác tích hợp giao diện người dùng (Frontend Nuxt 3) và đưa vào triển khai vận hành chính thức.
