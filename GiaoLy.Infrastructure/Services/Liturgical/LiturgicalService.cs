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
            // Default computed liturgical day if none seeded
            var fallback = new LiturgicalEventDto
            {
                Id = Guid.Empty,
                EventDate = date,
                Title = $"Thứ {((int)date.DayOfWeek == 0 ? "Chúa Nhật" : ((int)date.DayOfWeek + 1).ToString())}",
                Color = "Green",
                ColorNameVi = ColorViMap["Green"],
                Level = "Thường",
                IsOverride = false
            };
            return Result.Ok(fallback);
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
