using GiaoLy.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LiturgicalController : ControllerBase
{
    private readonly LiturgicalService _liturgical;

    public LiturgicalController(LiturgicalService liturgical)
    {
        _liturgical = liturgical;
    }

    /// <summary>GET lịch phụng vụ hôm nay (public, ai cũng xem được)</summary>
    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        return Ok(await _liturgical.GetTodayAsync());
    }

    /// <summary>GET lịch phụng vụ theo ngày cụ thể</summary>
    [HttpGet("{dateStr}")]
    public async Task<IActionResult> GetByDate(string dateStr)
    {
        if (!DateTime.TryParse(dateStr, out var date))
            return BadRequest("Định dạng ngày không hợp lệ (dùng yyyy-MM-dd).");
        return Ok(await _liturgical.GetDayAsync(date));
    }

    /// <summary>GET Lịch Phụng Vụ nguyên tháng (Tính bằng thuật toán Computus)</summary>
    [HttpGet("month/{year}/{month}")]
    public async Task<IActionResult> GetMonthCalendar(int year, int month)
    {
        if (year < 2000 || year > 2100 || month < 1 || month > 12)
            return BadRequest("Năm hoặc tháng không hợp lệ.");
            
        var calendar = await _liturgical.GetMonthAsync(year, month);
        return Ok(calendar);
    }

    [HttpPost("override")]
    [RequirePermission("liturgical.update")] // Admin và Thư ký
    public async Task<IActionResult> OverrideLiturgicalDay([FromBody] OverrideLiturgicalRequest request, [FromServices] GiaoLy.Domain.Data.AppDbContext context)
    {
        var existing = await context.LiturgicalEvents.FirstOrDefaultAsync(e => e.Date.Date == request.Date.Date);
        if (existing != null)
        {
            existing.Title = request.Title;
            existing.Color = request.Color;
            existing.Level = request.Level;
            existing.IsOverride = true;
            existing.WordOfGodOverride = request.WordOfGodOverride;
            existing.WordOfGodReference = request.WordOfGodReference;
        }
        else
        {
            context.LiturgicalEvents.Add(new GiaoLy.Domain.Entities.LiturgicalEvent
            {
                Id = Guid.NewGuid(),
                Date = request.Date.Date,
                Title = request.Title,
                Color = request.Color,
                Level = request.Level,
                IsOverride = true,
                WordOfGodOverride = request.WordOfGodOverride,
                WordOfGodReference = request.WordOfGodReference
            });
        }
        await context.SaveChangesAsync();
        return Ok(new { message = "Lưu tùy chỉnh thành công" });
    }

    [HttpDelete("override/{dateStr}")]
    [RequirePermission("liturgical.update")]
    public async Task<IActionResult> DeleteOverride(string dateStr, [FromServices] GiaoLy.Domain.Data.AppDbContext context)
    {
        if (!DateTime.TryParse(dateStr, out var date))
            return BadRequest("Định dạng ngày không hợp lệ.");

        var existing = await context.LiturgicalEvents.FirstOrDefaultAsync(e => e.Date.Date == date.Date && e.IsOverride);
        if (existing != null)
        {
            context.LiturgicalEvents.Remove(existing);
            await context.SaveChangesAsync();
        }
        return Ok(new { message = "Xóa tùy chỉnh thành công" });
    }
}

public class OverrideLiturgicalRequest
{
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Color { get; set; } = "Green";
    public string Level { get; set; } = "Thường";
    public string? WordOfGodOverride { get; set; }
    public string? WordOfGodReference { get; set; }
}
