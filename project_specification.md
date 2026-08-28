# Đặc Tả Kiến Trúc & Dự Án Hệ Sinh Thái GiaoLy (Văn Phòng Giáo Xứ)

## 1. Tổng Quan Dự Án (Project Overview)
**GiaoLy** là một hệ sinh thái phần mềm quản lý mục vụ hiện đại, được thiết kế đặc thù cho mô hình Sứ Đoàn Thiếu Nhi Thánh Thể tại Giáo Xứ. Mục tiêu của dự án không chỉ dừng lại ở việc số hóa danh sách đoàn sinh mà còn mở rộng thành một công cụ học vụ, phát hành chứng từ số và quản lý nhân sự (Giáo Lý Viên, Ban Điều Hành) toàn diện.

## 2. Ngăn Xếp Công Nghệ (Technology Stack)
- **Backend (API Layer):** C# ASP.NET Core 10 Web API.
- **ORM & Database:** Entity Framework Core với hệ quản trị cơ sở dữ liệu SQL Server.
- **Frontend (Client Layer):** Nuxt 3 (Vue 3, Composition API) kết hợp Nuxt UI v3 và Tailwind CSS.
- **Bảo mật:** JSON Web Token (JWT) cho Authentication và thuật toán mã hóa BCrypt cho mật khẩu.
- **Tính năng UI/UX:** Hỗ trợ Light/Dark mode toàn diện (tông màu pastel pink/rose, stone và amber), hỗ trợ song ngữ (Tiếng Việt / Tiếng Anh) bằng trình quản lý trạng thái Pinia.

---

## 3. Cấu Trúc Cơ Sở Dữ Liệu (Database Schema)

### 3.1. Phân hệ Quản trị & Phân Quyền (Auth & Access Control)
- **`Users`**: Bảng quản lý thông tin đăng nhập của hệ thống.
  - Cấu trúc: `Id`, `Username`, `PasswordHash`, `FullName`, `Role`, `Branch`, `CreatedAt`.
  - Phân quyền (Roles): `1` (Admin - Quản trị viên), `2` (Secretary - Thư ký), `3` (Moderator - Trưởng Ngành), `Viewer` (Người xem).

### 3.2. Phân hệ Học Vụ & Đoàn Sinh (Academic & Students)
- **`Students`**: Bảng gốc quản lý thông tin lý lịch cá nhân và ngày nhận Bí Tích (Rửa Tội, Rước Lễ, Thêm Sức).
- **`AcademicYears`**: Niên khóa giáo lý (Ví dụ: 2026-2027).
- **`ClassRooms`**: Quản lý Lớp học thuộc về Niên khóa và Ngành (Ấu, Thiếu, Nghĩa, Hiệp).
- **`Enrollments`**: Ghi danh đoàn sinh vào các lớp học.
- **`Grades`**: Bảng điểm điện tử cho đoàn sinh.
  - *Logic khống chế:* Có tính toán tự động Điểm Trung Bình (GPA) và Tỷ lệ Chuyên cần (Attendance Rate).
  - *Điều kiện lên lớp:* `GPA >= 5.0` và `AttendanceRate >= 80%`.

### 3.3. Phân hệ Ban Điều Hành (Leadership)
- **`Leaders`**: Sơ đồ tổ chức Sứ Đoàn.
  - Được chia theo 3 cấp độ (Level 1: Tuyên Úy, Level 2: Ban Quản Trị, Level 3: Trưởng Ngành).
  - Chức năng này được dùng để render giao diện Tổ chức (Organization Chart) tĩnh và động.

### 3.4. Phân hệ CMS & Truyền Thông (CMS & Communication)
- **`Announcements`**: Bài viết, thông báo sự kiện, tin tức khẩn cấp.
- **`Documents`**: Tài liệu học tập, văn thư, biểu mẫu dành cho việc lưu trữ Thư Viện điện tử.

### 3.5. Phân hệ Chứng Từ Số (E-Certificates)
- **`Certificates`**: Quản lý cấp phát chứng chỉ Bí tích (Rửa Tội, Rước Lễ, Thêm Sức).
  - Lưu trữ mã xác thực `VerificationCode` (VD: CERT-BAP-2026-X8R2), linh mục ban Bí tích và người đỡ đầu. 
  - Là tiền đề cho việc xác thực (Verify) bằng QR Code.

---

## 4. Các Chức Năng Đã Hoàn Thiện Tới Hiện Tại
1. **Kiến Trúc Frontend Tối Ưu:** Đã nâng cấp các bảng tính (`UTable`) lên chuẩn TanStack của Nuxt UI v3.
2. **Giao Diện Premium:** Sử dụng glass-morphism, gradients (tông màu pastel pink/rose), badge trạng thái và animations. Đã có Switcher Sáng/Tối.
3. **Bilingual (I18n):** Tích hợp dịch thuật động (Anh/Việt) ở tất cả các component.
4. **Phân quyền Route Navigation:** Quản lý truy cập chặt chẽ bằng middleware `auth.global.ts` trên toàn bộ dự án.
5. **Autoseed Database:** Hệ thống tự động nạp các user Admin, Thư ký, Trưởng ngành và dữ liệu mẫu mỗi khi khởi động nếu thiếu.
