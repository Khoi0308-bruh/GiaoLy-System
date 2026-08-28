namespace GiaoLy.API.Helpers;

/// <summary>
/// Lớp tiện ích múi giờ tập trung. Hard-code offset UTC+7 để đảm bảo hoạt động
/// ổn định trên cả Windows (môi trường dev) và Linux Docker (Render/Railway free host).
/// Lý do không dùng TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"):
///   - ID "SE Asia Standard Time" là Windows-only, ném exception trên Linux.
///   - Linux dùng IANA ID "Asia/Ho_Chi_Minh", nhưng cần cài thêm tzdata package.
///   - Hard-code UTC+7 là giải pháp nhẹ nhất, không phụ thuộc OS, không bao giờ crash.
/// </summary>
public static class DateTimeHelper
{
    /// <summary>Offset múi giờ Việt Nam: UTC+7 (không thay đổi theo DST).</summary>
    private static readonly TimeSpan VnOffset = TimeSpan.FromHours(7);

    /// <summary>
    /// Trả về thời gian hiện tại theo giờ Việt Nam (UTC+7).
    /// Dùng thay thế cho DateTime.Now ở mọi nơi trong dự án.
    /// </summary>
    public static DateTime GetVnNow() => DateTime.UtcNow.Add(VnOffset);

    /// <summary>
    /// Trả về ngày hiện tại theo giờ Việt Nam, không có thành phần giờ/phút/giây.
    /// Dùng cho các logic kiểm tra ngày (VD: kiểm tra niên học hết hạn).
    /// </summary>
    public static DateTime GetVnToday() => GetVnNow().Date;
}
