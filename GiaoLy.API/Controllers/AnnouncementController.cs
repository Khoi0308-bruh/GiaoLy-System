using Ganss.Xss;
using GiaoLy.API.Helpers;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnnouncementController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnnouncementController(AppDbContext context) { _context = context; }

    /// <summary>
    /// GET thông báo: tự lọc hết hạn, hỗ trợ lọc theo ngành và loại.
    /// </summary>
    [HttpGet]
    [AllowAnonymous] // Trang chủ public cần hiển thị thông báo công khai
    public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements(
        [FromQuery] int? branch,
        [FromQuery] string? type,
        [FromQuery] int? page,
        [FromQuery] int? limit)
    {
        var query = _context.Announcements.AsQueryable();

        // Tự ẩn thông báo đã hết hạn (Auto-Expiry) - dùng DateTimeHelper (cross-platform safe)
        var nowVn = DateTimeHelper.GetVnNow();
        query = query.Where(a => a.ExpiryDate == null || a.ExpiryDate > nowVn);

        // Lọc theo ngành (0 = tất cả)
        if (branch.HasValue && branch > 0)
            query = query.Where(a => a.Branch == 0 || a.Branch == branch.Value);

        // Lọc theo loại (Urgent, Event, Normal)
        if (!string.IsNullOrEmpty(type) && Enum.TryParse<AnnouncementType>(type, true, out var parsedType))
            query = query.Where(a => a.Type == parsedType);

        var totalCount = await query.CountAsync();
        Response.Headers.Append("X-Total-Count", totalCount.ToString());

        var orderedQuery = query.OrderByDescending(a => a.Type == AnnouncementType.Urgent)
                                .ThenByDescending(a => a.CreatedDate);

        if (page.HasValue && limit.HasValue && page.Value > 0 && limit.Value > 0)
        {
            var pagedItems = await orderedQuery
                .Skip((page.Value - 1) * limit.Value)
                .Take(limit.Value)
                .ToListAsync();
            return pagedItems;
        }

        return await orderedQuery.ToListAsync();
    }

    [HttpPost]
    [RequirePermission("announcements.create")] // Phân quyền mới
    public async Task<ActionResult<Announcement>> CreateAnnouncement([FromBody] Announcement announcement)
    {
        // Giai đoạn 1B — Defense-in-depth: Gột rửa HTML tại Backend trước khi lưu DB.
        // Kẻ xấu có thể bypass Frontend và dùng Postman bắn trực tiếp API.
        var sanitizer = new HtmlSanitizer();
        announcement.Content = sanitizer.Sanitize(announcement.Content ?? string.Empty);
        // Title không cần HTML, encode để triệt tiêu hoàn toàn
        announcement.Title = System.Net.WebUtility.HtmlEncode(announcement.Title ?? string.Empty);

        announcement.Id = Guid.NewGuid();
        announcement.CreatedDate = DateTimeHelper.GetVnNow(); // Cross-platform safe

        // Đồng bộ IsUrgent từ Type để giữ compatibility với frontend cũ
        if (announcement.Type == AnnouncementType.Urgent)
            announcement.IsUrgent = true;

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();
        return Ok(announcement);
    }

    [HttpPut("{id:guid}")]
    [RequirePermission("announcements.update")] // Phân quyền mới
    public async Task<IActionResult> UpdateAnnouncement(Guid id, [FromBody] Announcement announcement)
    {
        var existing = await _context.Announcements.FindAsync(id);
        if (existing == null) return NotFound();

        // Gột rửa HTML tương tự như khi tạo mới
        var sanitizer = new Ganss.Xss.HtmlSanitizer();
        existing.Content = sanitizer.Sanitize(announcement.Content ?? string.Empty);
        existing.Title = System.Net.WebUtility.HtmlEncode(announcement.Title ?? string.Empty);
        existing.Type = announcement.Type;
        existing.TargetAudience = announcement.TargetAudience;
        existing.ExpiryDate = announcement.ExpiryDate;
        existing.Branch = announcement.Branch;

        // Đồng bộ IsUrgent từ Type
        existing.IsUrgent = announcement.Type == AnnouncementType.Urgent;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission("announcements.delete")]
    public async Task<IActionResult> DeleteAnnouncement(Guid id)
    {
        var item = await _context.Announcements.FindAsync(id);
        if (item == null) return NotFound();
        _context.Announcements.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}