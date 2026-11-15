namespace GiaoLy.API.Common;

/// <summary>
/// Kiểm tra cấu hình bắt buộc ngay khi khởi động (fail-fast).
/// Mục tiêu: không bao giờ chạy Production với khoá/mật khẩu mẫu (placeholder)
/// hay với cấu hình còn thiếu, vì như vậy hệ thống sẽ mở với bí mật ai cũng biết.
/// </summary>
public static class ConfigurationValidator
{
    private static readonly string[] PlaceholderMarkers =
    {
        "PLACEHOLDER",
        "REPLACE_WITH",
        "MUST_CHANGE",
        "CHANGE_ME"
    };

    public static void ValidateRequiredConfigurations(IConfiguration config, IHostEnvironment env)
    {
        var connectionString = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH: Chuỗi kết nối 'ConnectionStrings:DefaultConnection' chưa được cấu hình. " +
                "Ứng dụng dừng khởi động để bảo đảm an toàn.");
        }

        var jwtKey = config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey) || jwtKey.Length < 32)
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH: 'Jwt:Key' chưa được cấu hình hoặc ngắn hơn 32 ký tự. " +
                "Vui lòng thiết lập biến môi trường Jwt__Key hợp lệ.");
        }

        if (IsPlaceholder(connectionString))
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH: 'ConnectionStrings:DefaultConnection' vẫn chứa giá trị mẫu (placeholder). " +
                "Hãy đặt chuỗi kết nối thật qua biến môi trường ConnectionStrings__DefaultConnection.");
        }

        if (IsPlaceholder(jwtKey))
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH: 'Jwt:Key' vẫn là giá trị mẫu (placeholder). " +
                "Hãy sinh khoá ngẫu nhiên tối thiểu 32 ký tự và đặt qua biến môi trường Jwt__Key.");
        }

        // ── Thời hạn token: phải là số dương và trong khoảng hợp lý ────────
        ValidateTokenLifetime(config, "Jwt:ExpiryMinutes", min: 1, max: 1440, unit: "phút");
        ValidateTokenLifetime(config, "Jwt:RefreshTokenDays", min: 1, max: 365, unit: "ngày");

        if (!env.IsProduction())
        {
            return;
        }

        // ── Các kiểm tra chỉ áp dụng cho Production ───────────────────────────
        var adminPassword = config["Admin:InitialPassword"];
        if (!IsUsableSecret(adminPassword))
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH (Production): thiếu 'Admin:InitialPassword' hoặc giá trị vẫn là placeholder. " +
                "Đặt biến môi trường Admin__InitialPassword trước lần khởi động đầu tiên.");
        }

        var serviceKey = config["App:ServiceKey"] ?? config["Security:ServiceKey"];
        if (!IsUsableSecret(serviceKey))
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH (Production): thiếu khoá dịch vụ cho cron ('App:ServiceKey'). " +
                "Đặt biến môi trường App__ServiceKey với chuỗi ngẫu nhiên đủ mạnh.");
        }

        var origins = config.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (origins is null || origins.Length == 0)
        {
            throw new InvalidOperationException(
                "LỖI CẤU HÌNH (Production): 'Cors:AllowedOrigins' chưa được cấu hình.");
        }

        foreach (var origin in origins)
        {
            if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps)
            {
                throw new InvalidOperationException(
                    $"LỖI CẤU HÌNH (Production): CORS origin '{origin}' phải là URL HTTPS tuyệt đối.");
            }

            if (uri.Host is "localhost" or "127.0.0.1")
            {
                throw new InvalidOperationException(
                    $"LỖI CẤU HÌNH (Production): CORS origin '{origin}' không được trỏ về localhost.");
            }
        }
    }

    private static void ValidateTokenLifetime(IConfiguration config, string key, int min, int max, string unit)
    {
        var raw = config[key];
        if (string.IsNullOrWhiteSpace(raw))
        {
            return; // không khai báo → dùng giá trị mặc định trong TokenService
        }

        if (!int.TryParse(raw, out var value) || value < min || value > max)
        {
            throw new InvalidOperationException(
                $"LỖI CẤU HÌNH: '{key}' phải là số nguyên trong khoảng {min}–{max} {unit} (giá trị hiện tại: '{raw}').");
        }
    }

    private static bool IsPlaceholder(string? value)
        => !string.IsNullOrWhiteSpace(value)
           && PlaceholderMarkers.Any(marker => value.Contains(marker, StringComparison.OrdinalIgnoreCase));

    private static bool IsUsableSecret(string? value)
        => !string.IsNullOrWhiteSpace(value) && !IsPlaceholder(value);
}
