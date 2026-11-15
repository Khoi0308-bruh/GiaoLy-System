# SỔ TAY VẬN HÀNH HỆ THỐNG QUẢN LÝ GIÁO LÝ V3 (OPERATIONS RUNBOOK)

Hệ thống Backend Quản lý Giáo Lý V3 được xây dựng trên nền tảng **.NET 10 (C# 14)** và **SQL Server**, tuân thủ kiến trúc phân tầng (Clean Architecture), bộ lọc bảo mật đa tầng, và chuẩn thiết kế phi chức năng nghiêm ngặt theo Blueprint V3.

---

## 1. YÊU CẦU HẠ TẦNG VÀ MÔI TRƯỜNG

- **Hệ điều hành**: Linux (Ubuntu 22.04 LTS / 24.04 LTS) hoặc Windows Server 2022.
- **Runtime**: .NET Runtime 10.0 (ASP.NET Core Runtime).
- **Cơ sở dữ liệu**: Microsoft SQL Server 2019 / 2022 (Standard hoặc Enterprise).
- **Reverse Proxy**: Nginx, Cloudflare, hoặc IIS (Reverse Proxy ARR).
- **Bộ nhớ tối thiểu**: 2 GB RAM (Khuyến nghị 4 GB trở lên khi chạy nền nhiều tác vụ xuất báo cáo).
- **Dung lượng lưu trữ**: Tối thiểu 20 GB SSD cho hệ thống tệp đính kèm (Documents) và sao lưu CSDL.

---

## 2. CẤU HÌNH BIẾN MÔI TRƯỜNG & BÍ MẬT (ENVIRONMENT VARIABLES)

Khi triển khai trên máy chủ Production, **tuyệt đối không lưu mật khẩu thật trong mã nguồn**. Hãy cấu hình qua Environment Variables của hệ điều hành hoặc Docker Container:

| Tên biến môi trường | Kiểu dữ liệu | Ý nghĩa & Mô tả |
| :--- | :--- | :--- |
| `ConnectionStrings__DefaultConnection` | Chuỗi kết nối | Chuỗi kết nối SQL Server có mã hóa SSL (`TrustServerCertificate=False;Encrypt=True;`) |
| `Jwt__Key` | Chuỗi ký tự (>= 32 ký tự) | Khóa đối xứng dùng ký HMAC-SHA256 cho JWT Access Token. Phải sinh ngẫu nhiên có độ entropy cao |
| `Jwt__Issuer` | Chuỗi | Định danh nhà phát hành token (Mặc định: `GiaoLySystem`) |
| `Jwt__Audience` | Chuỗi | Định danh người tiêu thụ token (Mặc định: `GiaoLyUsers`) |
| `App__DefaultPassword` | Chuỗi | Mật khẩu mẫu chỉ áp dụng ở môi trường Development |
| `Security__InitialAdminPassword` | Chuỗi | Mật khẩu tài khoản `admin` khởi tạo lần đầu duy nhất. Hệ thống không bao giờ ghi đè khi khởi động lại |
| `Security__ServiceKey` | Chuỗi bí mật | Khóa xác thực dịch vụ bên ngoài gửi qua tiêu đề `X-Service-Key` khi kích hoạt Background Jobs từ Cron máy chủ |
| `Cors__AllowedOrigins__0` | URL | Tên miền ứng dụng web chính (VD: `https://giaoly.giaoxu.vn`) |
| `Cors__AllowedOrigins__1` | URL | Tên miền Cổng phụ huynh (VD: `https://portal.giaoxu.vn`) |
| `Storage__UploadDirectory` | Đường dẫn | Thư mục vật lý lưu trữ tài liệu tệp tải lên (Nằm ngoài web root) |

---

## 3. CÁC PHƯƠNG THỨC TRIỂN KHAI (DEPLOYMENT)

### Cách 1: Triển khai với Docker & Docker Compose (Khuyến nghị cho Linux)

File `docker-compose.yml` mẫu:
```yaml
version: '3.8'

services:
  giaoly-api:
    image: giaoly-backend:v3.0.0
    restart: always
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=GiaoLyDB_V3;User Id=sa;Password=${DB_PASSWORD};TrustServerCertificate=True;
      - Jwt__Key=${JWT_SECRET_KEY}
      - Security__ServiceKey=${CRON_SERVICE_KEY}
      - Security__InitialAdminPassword=${ADMIN_INIT_PASSWORD}
    ports:
      - "5000:8080"
    volumes:
      - /data/giaoly/uploads:/var/giaoly/uploads
    depends_on:
      - sqlserver

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    restart: always
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=${DB_PASSWORD}
    volumes:
      - /data/giaoly/sqldata:/var/opt/mssql/data
```

### Cách 2: Triển khai Nginx Reverse Proxy phía trước Kestrel
Cấu hình mẫu `/etc/nginx/sites-available/giaoly.conf`:
```nginx
server {
    listen 443 ssl http2;
    server_name api.giaoxu.vn;

    ssl_certificate /etc/letsencrypt/live/api.giaoxu.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.giaoxu.vn/privkey.pem;

    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 4. GIÁM SÁT SỨC KHỎE (HEALTH CHECKS)

Hệ thống cung cấp hai cấp độ kiểm tra trạng thái tự động:
1. **Liveness Probe**: `GET /api/v1/health`
   - Trả về `200 OK` `{ "status": "Healthy", "timestamp": "..." }`
   - Dùng để xác nhận tiến trình ASP.NET Core vẫn đang sống và nhận diện HTTP request.
2. **Readiness Probe**: `GET /api/v1/health/ready`
   - Trả về `200 OK` `{ "status": "Ready", "database": "Connected", "timestamp": "..." }`
   - Khi mất kết nối SQL Server, trả về `503 Service Unavailable` `{ "status": "Unhealthy", "database": "Disconnected" }`.
   - Dùng để bộ cân bằng tải (Load Balancer) ngừng định tuyến lưu lượng vào máy chủ lỗi.

---

## 5. ĐIỀU HÀNH TÁC VỤ NỀN (BACKGROUND JOBS)

Có 5 tác vụ nền tự động được đăng ký trong hệ thống:
1. **GradebookCloser**: Tự động khóa sổ điểm khi niên khóa chuyển sang trạng thái kết thúc hoặc hết hạn.
2. **NewsCrawler**: Tự động thu thập tin tức Giáo hội từ các nguồn RSS hợp lệ (qua bộ kiểm tra `SafeUrlValidator`).
3. **TokenCleanup**: Thu dọn các Refresh Token đã hết hạn hoặc bị thu hồi quá 30 ngày.
4. **GradeUnlockExpiry**: Đóng tự động các yêu cầu mở khóa điểm vượt quá thời hạn cho phép.
5. **AuditRetention**: Tự động lưu trữ/dọn dẹp nhật ký kiểm toán vượt quá 24 tháng theo quy định lưu trữ.

**Kích hoạt thủ công từ máy chủ**:
```bash
curl -X POST https://api.giaoxu.vn/api/v1/jobs/trigger/GradebookCloser \
     -H "X-Service-Key: <SECURITY_SERVICE_KEY>"
```

---

## 6. SỔ TAY XỬ LÝ SỰ CỐ KHẨN CẤP (INCIDENT RESPONSE PLAYBOOK)

### Sự cố 1: Giáo lý viên quên hạn khóa điểm, cần mở khóa nhập điểm bù
- **Nguyên nhân**: Niên khóa đã chuyển sang `Closing` hoặc đã qua thời hạn nhập điểm.
- **Quy trình xử lý chuẩn**:
  1. Trưởng Ban Giáo Lý hoặc Cha Tuyên Úy gửi đề xuất mở khóa qua endpoint: `POST /api/v1/grades/unlock-requests`.
  2. Quản trị viên duyệt đề xuất có thời hạn (ví dụ: mở khóa trong 24 giờ).
  3. Hệ thống ghi nhận đầy đủ bản ghi nhật ký kiểm toán (`AuditLog`) ghi rõ người yêu cầu, lý do và thời gian hết hạn. Tác vụ `GradeUnlockExpiry` sẽ tự động đóng lại khi hết giờ.

### Sự cố 2: Phát hiện tài khoản bị xâm nhập hoặc mất thiết bị
- **Biện pháp khẩn cấp**:
  1. Quản trị viên vào màn hình quản lý người dùng, bấm nút **"Thu hồi phiên làm việc (Revoke Sessions)"** hoặc đổi SecurityStamp:
     `POST /api/v1/users/{id}/revoke-sessions`
  2. Toàn bộ JWT Access Token và Refresh Token của người dùng đó lập tức mất hiệu lực trong vòng < 60 giây nhờ cơ chế `SessionValidationMiddleware` đối chiếu `SecurityStamp`.

### Sự cố 3: Máy chủ báo động CPU cao do xuất báo cáo dữ liệu lớn
- **Biện pháp xử lý**:
  - Hệ thống đã kích hoạt chính sách Rate Limit `export` (tối đa 10 lượt xuất/giờ cho mỗi tài khoản).
  - Xuất Excel đã sử dụng cơ chế streaming ClosedXML với truy vấn `AsNoTracking()`.
  - Nếu cần tạm dừng, quản trị viên có thể tạm khóa quyền `reports.view` hoặc khởi động lại container API trong thời gian bảo trì.
