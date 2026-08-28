using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Services;

/// <summary>
/// Tính toán Lịch Phụng Vụ Công Giáo (màu áo lễ, tên lễ) dựa theo ngày.
/// Logic đơn giản hóa: ưu tiên các lễ trọng, mùa phụng vụ.
/// Nếu có sự ghi đè (Override) trong Database, sẽ trả về kết quả đó.
/// </summary>
public class LiturgicalService
{
    private readonly AppDbContext _context;

    public LiturgicalService(AppDbContext context)
    {
        _context = context;
    }
    // ────────────────────────────────────────────────────────
    //  Public API
    // ────────────────────────────────────────────────────────

    public async Task<LiturgicalDay> GetTodayAsync()
    {
        // Ép cứng múi giờ Việt Nam (GMT+7) để tránh lệch ngày khi deploy trên UTC server
        var zone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        var localToday = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zone).Date;
        return await GetDayAsync(localToday);
    }

    public async Task<LiturgicalDay> GetDayAsync(DateTime date)
    {
        // 0. Kiểm tra Admin Override trong Database
        var overrideEvent = await _context.LiturgicalEvents
            .FirstOrDefaultAsync(e => e.Date.Date == date.Date);

        if (overrideEvent != null)
        {
            var colorViMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "white", "Trắng" },
                { "red", "Đỏ" },
                { "green", "Xanh Lá" },
                { "purple", "Tím" },
                { "rose", "Hồng" },
                { "black", "Đen" }
            };

            return new LiturgicalDay
            {
                FeastName = overrideEvent.Title + (overrideEvent.IsOverride ? " (Tùy chỉnh)" : ""),
                LiturgicalColor = overrideEvent.Color.ToLower(),
                LiturgicalColorVi = colorViMap.TryGetValue(overrideEvent.Color, out var vi) ? vi : overrideEvent.Color,
                Date = date.ToString("dd/MM/yyyy")
            };
        }

        // 1. Kiểm tra lễ trọng cố định
        var fixedFeast = GetFixedFeast(date);
        if (fixedFeast != null) return fixedFeast;

        // 2. Tính mùa phụng vụ
        return GetSeasonDay(date);
    }

    public async Task<List<LiturgicalDay>> GetMonthAsync(int year, int month)
    {
        var days = new List<LiturgicalDay>();
        int daysInMonth = DateTime.DaysInMonth(year, month);
        for (int day = 1; day <= daysInMonth; day++)
        {
            var date = new DateTime(year, month, day);
            days.Add(await GetDayAsync(date));
        }
        return days;
    }

    // ────────────────────────────────────────────────────────
    //  Lễ trọng cố định hàng năm (ngày-tháng)
    // ────────────────────────────────────────────────────────

    private static readonly Dictionary<(int month, int day), (string name, string color, string colorVi)> FixedFeasts = new()
    {
        { (1,  1),  ("Lễ Đức Maria Mẹ Thiên Chúa", "white",  "Trắng") },
        { (1,  6),  ("Lễ Hiển Linh",               "white",  "Trắng") },
        { (2,  2),  ("Lễ Dâng Chúa Giêsu",         "white",  "Trắng") },
        { (3, 19),  ("Lễ Thánh Giuse",              "white",  "Trắng") },
        { (3, 25),  ("Lễ Truyền Tin",               "white",  "Trắng") },
        { (6, 24),  ("Lễ Sinh Nhật Thánh Gioan",    "white",  "Trắng") },
        { (6, 29),  ("Lễ Hai Thánh Tông Đồ",        "red",    "Đỏ")    },
        { (8, 15),  ("Lễ Đức Mẹ Lên Trời",          "white",  "Trắng") },
        { (11, 1),  ("Lễ Các Thánh",                "white",  "Trắng") },
        { (11, 2),  ("Lễ Các Đẳng",                 "black",  "Đen")   },
        { (12, 8),  ("Lễ Đức Mẹ Vô Nhiễm",          "white",  "Trắng") },
        { (12, 25), ("Lễ Giáng Sinh",               "white",  "Trắng") },
    };

    private static LiturgicalDay? GetFixedFeast(DateTime date)
    {
        if (FixedFeasts.TryGetValue((date.Month, date.Day), out var feast))
            return new LiturgicalDay { FeastName = feast.name, LiturgicalColor = feast.color, LiturgicalColorVi = feast.colorVi };
        return null;
    }

    // ────────────────────────────────────────────────────────
    //  Tính mùa phụng vụ theo năm
    // ────────────────────────────────────────────────────────

    private static LiturgicalDay GetSeasonDay(DateTime date)
    {
        int year = date.Year;

        var easter = GetEasterDate(year);
        var christmas = new DateTime(year, 12, 25);

        // Mùa Vọng: 4 Chúa Nhật trước Giáng Sinh
        var adventStart = christmas.AddDays(-(((int)christmas.DayOfWeek + 6) % 7) - 21);
        if (date >= adventStart && date <= christmas)
            return new LiturgicalDay { FeastName = "Mùa Vọng", LiturgicalColor = "purple", LiturgicalColorVi = "Tím" };

        // Mùa Chay: 46 ngày trước Phục Sinh
        var lentStart = easter.AddDays(-46);
        var holyThursday = easter.AddDays(-3);
        if (date >= lentStart && date < holyThursday)
            return new LiturgicalDay { FeastName = "Mùa Chay", LiturgicalColor = "purple", LiturgicalColorVi = "Tím" };

        // Tuần Thánh
        var palmSunday = easter.AddDays(-7);
        if (date >= palmSunday && date < easter)
            return new LiturgicalDay { FeastName = "Tuần Thánh", LiturgicalColor = "red", LiturgicalColorVi = "Đỏ" };

        // Mùa Phục Sinh: 50 ngày từ Phục Sinh
        var pentecost = easter.AddDays(49);
        if (date >= easter && date <= pentecost)
            return new LiturgicalDay { FeastName = "Mùa Phục Sinh", LiturgicalColor = "white", LiturgicalColorVi = "Trắng" };

        // Thứ Tư Lễ Tro
        if (date == lentStart)
            return new LiturgicalDay { FeastName = "Thứ Tư Lễ Tro", LiturgicalColor = "black", LiturgicalColorVi = "Đen" };

        // Mùa Thường Niên
        return date.DayOfWeek == DayOfWeek.Sunday
            ? new LiturgicalDay { FeastName = "Chúa Nhật Thường Niên", LiturgicalColor = "green", LiturgicalColorVi = "Xanh Lá" }
            : new LiturgicalDay { FeastName = "Mùa Thường Niên", LiturgicalColor = "green", LiturgicalColorVi = "Xanh Lá" };
    }

    /// <summary>Tính ngày Phục Sinh theo thuật toán Anonymous Gregorian.</summary>
    public static DateTime GetEasterDate(int year)
    {
        int a = year % 19, b = year / 100, c = year % 100;
        int d = b / 4, e = b % 4, f = (b + 8) / 25;
        int g = (b - f + 1) / 3, h = (19 * a + b - d - g + 15) % 30;
        int i = c / 4, k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
        int m = (a + 11 * h + 22 * l) / 451;
        int month = (h + l - 7 * m + 114) / 31;
        int day = ((h + l - 7 * m + 114) % 31) + 1;
        return new DateTime(year, month, day);
    }
}

public class LiturgicalDay
{
    public string FeastName { get; set; } = string.Empty;
    public string LiturgicalColor { get; set; } = "green";    // CSS class / hex key
    public string LiturgicalColorVi { get; set; } = "Xanh Lá";
    public string Date { get; set; } = TimeZoneInfo.ConvertTimeFromUtc(
        DateTime.UtcNow,
        TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    ).ToString("dd/MM/yyyy");
}
