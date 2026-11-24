using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Liturgical.Contracts;
using GiaoLy.Application.Liturgical.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Liturgical;

public class LiturgicalService : ILiturgicalService
{
    private readonly AppDbContext _context;

    private static readonly Dictionary<string, string> ColorViMap = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Green"]  = "Màu Xanh (Thường niên)",
        ["Red"]    = "Màu Đỏ (Tử đạo, Chúa Thánh Thần)",
        ["White"]  = "Màu Trắng (Lễ Chúa, Đức Mẹ, Các Thánh)",
        ["Purple"] = "Màu Tím (Mùa Vọng, Mùa Chay)",
        ["Violet"] = "Màu Tím (Mùa Vọng, Mùa Chay)",
        ["Rose"]   = "Màu Hồng (Chúa Nhật Vui, Chúa Nhật Hãy Vui Lên)"
    };

    public LiturgicalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<LiturgicalEventDto>> GetTodayAsync(CancellationToken ct = default)
    {
        // Enforce Vietnam Time Zone (UTC+7)
        var vnZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
        var vnNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnZone);
        var today = DateOnly.FromDateTime(vnNow);

        return await GetByDateAsync(today, ct);
    }

    public async Task<Result<LiturgicalEventDto>> GetByDateAsync(DateOnly date, CancellationToken ct = default)
    {
        // Rule: If an override entry exists for this date, prefer override
        var events = await _context.LiturgicalEvents
            .AsNoTracking()
            .Where(e => e.EventDate == date)
            .ToListAsync(ct);

        var selected = events.FirstOrDefault(e => e.IsOverride) ?? events.FirstOrDefault();

        if (selected == null)
        {
            // Không có bản ghi: dùng lịch phụng vụ tự tính (mùa, màu, lễ trọng)
            // để trang chủ và trang lịch hiển thị cùng một kết quả.
            return Result.Ok(ComputeDay(date));
        }

        return Result.Ok(MapToDto(selected));
    }

    public async Task<Result<List<LiturgicalEventDto>>> GetMonthAsync(int year, int month, CancellationToken ct = default)
    {
        var startDate = new DateOnly(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var events = await _context.LiturgicalEvents
            .AsNoTracking()
            .Where(e => e.EventDate >= startDate && e.EventDate <= endDate)
            .ToListAsync(ct);

        // Group by Date and pick override if exists
        var grouped = events
            .GroupBy(e => e.EventDate)
            .Select(g => g.FirstOrDefault(x => x.IsOverride) ?? g.First())
            .OrderBy(e => e.EventDate)
            .Select(MapToDto)
            .ToList();

        return Result.Ok(grouped);
    }

    public async Task<Result<List<LiturgicalEventDto>>> GetCalendarAsync(int year, int month, CancellationToken ct = default)
    {
        if (month < 1 || month > 12)
            return Result.BadRequest<List<LiturgicalEventDto>>(ErrorCodes.ValidationFailed, "Tháng phải từ 1 đến 12");

        var start = new DateOnly(year, month, 1);
        var end = start.AddMonths(1).AddDays(-1);

        // Chỉ đọc dữ liệu đã lưu của đúng tháng này; các ngày còn lại được tính
        // theo lịch phụng vụ Công giáo để trang không bị trống.
        var stored = await _context.LiturgicalEvents
            .AsNoTracking()
            .Where(e => e.EventDate >= start && e.EventDate <= end)
            .ToListAsync(ct);

        var byDate = stored
            .GroupBy(e => e.EventDate)
            .ToDictionary(g => g.Key, g => g.FirstOrDefault(x => x.IsOverride) ?? g.First());

        var days = new List<LiturgicalEventDto>();
        for (var date = start; date <= end; date = date.AddDays(1))
        {
            days.Add(byDate.TryGetValue(date, out var storedDay) ? MapToDto(storedDay) : ComputeDay(date));
        }

        return Result.Ok(days);
    }

    // ── Lịch phụng vụ tự tính ─────────────────────────────────────────────────

    private sealed record Season(string Name, string Color, DateOnly Start);

    /// <summary>Chúa Nhật Phục Sinh theo thuật toán Gregorian (Anonymous Computus).</summary>
    private static DateOnly EasterSunday(int year)
    {
        int a = year % 19, b = year / 100, c = year % 100,
            d = b / 4, e = b % 4,
            f = (b + 8) / 25, g = (b - f + 1) / 3,
            h = (19 * a + b - d - g + 15) % 30,
            i = c / 4, k = c % 4,
            l = (32 + 2 * e + 2 * i - h - k) % 7,
            m = (a + 11 * h + 22 * l) / 451,
            month = (h + l - 7 * m + 114) / 31,
            day = ((h + l - 7 * m + 114) % 31) + 1;
        return new DateOnly(year, month, day);
    }

    /// <summary>Chúa Nhật I Mùa Vọng: Chúa Nhật rơi vào khoảng 27/11 – 3/12.</summary>
    private static DateOnly AdventStart(int year)
    {
        var date = new DateOnly(year, 11, 27);
        while (date.DayOfWeek != DayOfWeek.Sunday) date = date.AddDays(1);
        return date;
    }

    private static Season SeasonOf(DateOnly date)
    {
        var year = date.Year;
        var easter = EasterSunday(year);
        var ashWednesday = easter.AddDays(-46);
        var holyThursday = easter.AddDays(-3);
        var pentecost = easter.AddDays(49);
        var adventStart = AdventStart(year);
        var christmasEnd = new DateOnly(year, 1, 13);

        if (date >= adventStart && date <= new DateOnly(year, 12, 24))
            return new Season("Mùa Vọng", "Purple", adventStart);

        if (date >= new DateOnly(year, 12, 25) || date <= christmasEnd)
        {
            var start = date >= new DateOnly(year, 12, 25)
                ? new DateOnly(year, 12, 25)
                : new DateOnly(year - 1, 12, 25);
            return new Season("Mùa Giáng Sinh", "White", start);
        }

        if (date >= ashWednesday && date <= holyThursday)
            return new Season("Mùa Chay", "Purple", ashWednesday);

        if (date > holyThursday && date < easter)
            return new Season("Tam Nhật Thánh", "Red", holyThursday.AddDays(1));

        if (date >= easter && date <= pentecost)
            return new Season("Mùa Phục Sinh", "White", easter);

        // Mùa Thường Niên: sau lễ Chúa Giêsu chịu phép rửa (13/01) hoặc sau lễ Hiện Xuống.
        var ordinaryStart = date > pentecost
            ? pentecost.AddDays(1)
            : new DateOnly(year, 1, 14);
        return new Season("Mùa Thường Niên", "Green", ordinaryStart);
    }

    private static readonly Dictionary<(int Month, int Day), (string Title, string Color, string Level)> FixedFeasts = new()
    {
        [(1, 1)] = ("Đức Maria, Mẹ Thiên Chúa", "White", "Lễ trọng"),
        [(1, 6)] = ("Lễ Hiển Linh", "White", "Lễ trọng"),
        [(2, 2)] = ("Lễ Dâng Chúa Giêsu trong Đền Thánh", "White", "Lễ"),
        [(3, 19)] = ("Thánh Giuse, bạn trăm năm Đức Maria", "White", "Lễ trọng"),
        [(3, 25)] = ("Lễ Truyền Tin", "White", "Lễ trọng"),
        [(6, 24)] = ("Sinh nhật Thánh Gioan Tẩy Giả", "White", "Lễ trọng"),
        [(6, 29)] = ("Thánh Phêrô và Thánh Phaolô", "Red", "Lễ trọng"),
        [(8, 15)] = ("Đức Mẹ Hồn Xác Lên Trời", "White", "Lễ trọng"),
        [(9, 14)] = ("Suy Tôn Thánh Giá", "Red", "Lễ"),
        [(11, 1)] = ("Các Thánh Nam Nữ", "White", "Lễ trọng"),
        [(11, 2)] = ("Các Đẳng Linh Hồn", "Purple", "Lễ"),
        [(12, 8)] = ("Đức Mẹ Vô Nhiễm Nguyên Tội", "White", "Lễ trọng"),
        [(12, 12)] = ("Đức Mẹ Guadalupe", "White", "Lễ"),
        [(12, 25)] = ("Chúa Giáng Sinh", "White", "Lễ trọng")
    };

    private static LiturgicalEventDto ComputeDay(DateOnly date)
    {
        var season = SeasonOf(date);
        var easter = EasterSunday(date.Year);

        string title;
        var color = season.Color;
        var level = "Thường";

        if (FixedFeasts.TryGetValue((date.Month, date.Day), out var feast))
        {
            title = feast.Title;
            color = feast.Color;
            level = feast.Level;
        }
        else if (date == easter)
        {
            title = "Chúa Nhật Phục Sinh";
            color = "White";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(-7))
        {
            title = "Chúa Nhật Lễ Lá";
            color = "Red";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(-3))
        {
            title = "Thứ Năm Tuần Thánh";
            color = "White";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(-2))
        {
            title = "Thứ Sáu Tuần Thánh";
            color = "Red";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(-1))
        {
            title = "Thứ Bảy Tuần Thánh";
            color = "Purple";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(-46))
        {
            title = "Thứ Tư Lễ Tro";
            color = "Purple";
            level = "Lễ";
        }
        else if (date == easter.AddDays(39))
        {
            title = "Lễ Chúa Giêsu Lên Trời";
            color = "White";
            level = "Lễ trọng";
        }
        else if (date == easter.AddDays(49))
        {
            title = "Lễ Chúa Thánh Thần Hiện Xuống";
            color = "Red";
            level = "Lễ trọng";
        }
        else if (date.DayOfWeek == DayOfWeek.Sunday)
        {
            var ordinal = SundayOrdinal(season.Start, date);
            title = $"Chúa Nhật {Roman(ordinal)} — {season.Name}";
            level = "Chúa Nhật";

            // Chúa Nhật thứ 3 Mùa Vọng và thứ 4 Mùa Chay được mặc màu hồng.
            if ((season.Name == "Mùa Vọng" && ordinal == 3) || (season.Name == "Mùa Chay" && ordinal == 4))
                color = "Rose";
        }
        else
        {
            title = $"{WeekdayVi(date)} — {season.Name}";
        }

        return new LiturgicalEventDto
        {
            Id = Guid.Empty,
            EventDate = date,
            Title = title,
            Color = color,
            ColorNameVi = ColorViMap.TryGetValue(color, out var vi) ? vi : color,
            Level = level,
            Description = null,
            IsOverride = false
        };
    }

    private static int SundayOrdinal(DateOnly start, DateOnly date)
    {
        var count = 0;
        for (var d = start; d <= date; d = d.AddDays(1))
        {
            if (d.DayOfWeek == DayOfWeek.Sunday) count++;
        }
        return Math.Max(count, 1);
    }

    private static string WeekdayVi(DateOnly date) => date.DayOfWeek switch
    {
        DayOfWeek.Monday => "Thứ Hai",
        DayOfWeek.Tuesday => "Thứ Ba",
        DayOfWeek.Wednesday => "Thứ Tư",
        DayOfWeek.Thursday => "Thứ Năm",
        DayOfWeek.Friday => "Thứ Sáu",
        DayOfWeek.Saturday => "Thứ Bảy",
        _ => "Chúa Nhật"
    };

    private static readonly string[] RomanNumerals =
    {
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
        "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
        "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
        "XXXI", "XXXII", "XXXIII", "XXXIV"
    };

    private static string Roman(int number) =>
        number > 0 && number < RomanNumerals.Length ? RomanNumerals[number] : number.ToString();

    public async Task<Result<List<LiturgicalEventDto>>> GetAllAsync(int? year, int? month, CancellationToken ct = default)
    {
        var query = _context.LiturgicalEvents.AsNoTracking().AsQueryable();

        if (year.HasValue && month.HasValue)
        {
            var start = new DateOnly(year.Value, month.Value, 1);
            var end = start.AddMonths(1).AddDays(-1);
            query = query.Where(e => e.EventDate >= start && e.EventDate <= end);
        }
        else if (year.HasValue)
        {
            var start = new DateOnly(year.Value, 1, 1);
            var end = new DateOnly(year.Value, 12, 31);
            query = query.Where(e => e.EventDate >= start && e.EventDate <= end);
        }

        var list = await query
            .OrderByDescending(e => e.EventDate)
            .ThenByDescending(e => e.IsOverride)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<LiturgicalEventDto>> OverrideDayAsync(DateOnly date, OverrideLiturgicalDayRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<LiturgicalEventDto>(ErrorCodes.ValidationFailed, "Tiêu đề ngày lễ không được để trống");

        var existingOverride = await _context.LiturgicalEvents
            .FirstOrDefaultAsync(e => e.EventDate == date && e.IsOverride, ct);

        if (existingOverride != null)
        {
            existingOverride.Title = request.Title.Trim();
            existingOverride.Color = request.Color.Trim();
            existingOverride.Level = request.Level.Trim();
            existingOverride.Description = request.Description?.Trim();
            existingOverride.WordOfGodOverride = request.WordOfGodOverride?.Trim();
            existingOverride.WordOfGodReference = request.WordOfGodReference?.Trim();
            existingOverride.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(ct);
            return Result.Ok(MapToDto(existingOverride));
        }

        var newOverride = new LiturgicalEvent
        {
            Id = Guid.NewGuid(),
            EventDate = date,
            Title = request.Title.Trim(),
            Color = request.Color.Trim(),
            Level = request.Level.Trim(),
            Description = request.Description?.Trim(),
            IsOverride = true,
            WordOfGodOverride = request.WordOfGodOverride?.Trim(),
            WordOfGodReference = request.WordOfGodReference?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.LiturgicalEvents.Add(newOverride);
        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapToDto(newOverride));
    }

    private static LiturgicalEventDto MapToDto(LiturgicalEvent e) => new()
    {
        Id = e.Id,
        EventDate = e.EventDate,
        Title = e.Title,
        Color = e.Color,
        ColorNameVi = ColorViMap.TryGetValue(e.Color, out var vi) ? vi : e.Color,
        Level = e.Level,
        Description = e.Description,
        IsOverride = e.IsOverride,
        WordOfGodOverride = e.WordOfGodOverride,
        WordOfGodReference = e.WordOfGodReference
    };
}
