using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public LeaderController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    /// <summary>GET tất cả huynh trưởng đang hoạt động (ai cũng xem được)</summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Leader>>> GetLeaders()
    {
        return await _context.Leaders
            .Where(l => l.IsActive)
            .OrderBy(l => l.Level)
            .ThenBy(l => l.FullName)
            .ToListAsync();
    }

    /// <summary>GET lịch sử huynh trưởng các nhiệm kỳ cũ</summary>
    [HttpGet("history")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Leader>>> GetHistory()
    {
        return await _context.Leaders
            .Where(l => !l.IsActive)
            .OrderBy(l => l.Term)
            .ToListAsync();
    }

    /// <summary>GET một huynh trưởng theo ID</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<Leader>> GetLeader(Guid id)
    {
        var leader = await _context.Leaders.FindAsync(id);
        if (leader == null) return NotFound();
        return Ok(leader);
    }

    /// <summary>POST tạo mới huynh trưởng (chỉ Admin)</summary>
    [HttpPost]
    [RequirePermission("leaders.create")]
    public async Task<ActionResult<Leader>> CreateLeader([FromBody] Leader leader)
    {
        leader.Id = Guid.NewGuid();
        _context.Leaders.Add(leader);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLeader), new { id = leader.Id }, leader);
    }

    /// <summary>PUT cập nhật thông tin huynh trưởng (chỉ Admin)</summary>
    [HttpPut("{id:guid}")]
    [RequirePermission("leaders.update")]
    public async Task<IActionResult> UpdateLeader(Guid id, [FromBody] Leader leader)
    {
        if (id != leader.Id) return BadRequest();
        _context.Entry(leader).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>POST upload ảnh đại diện huynh trưởng</summary>
    [HttpPost("{id:guid}/avatar")]
    [RequirePermission("leaders.update")]
    public async Task<IActionResult> UploadAvatar(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File trống.");

        var leader = await _context.Leaders.FindAsync(id);
        if (leader == null) return NotFound();

        var uploadsDir = Path.Combine(_env.WebRootPath ?? "wwwroot", "avatars");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(file.FileName);
        var fileName = $"{id}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        leader.AvatarPath = $"/avatars/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { avatarPath = leader.AvatarPath });
    }

    /// <summary>POST Xoay vòng nhiệm kỳ: tắt BĐH cũ, kích hoạt BĐH mới theo nhiệm kỳ</summary>
    [HttpPost("rotate-term")]
    [RequirePermission("leaders.update")]
    public async Task<IActionResult> RotateTerm([FromBody] string newTerm)
    {
        // Bản vá: Dùng ExecuteUpdateAsync để tắt BĐH cũ trực tiếp trong DB (không tải RAM)
        int deactivatedCount = await _context.Leaders
            .Where(l => l.IsActive)
            .ExecuteUpdateAsync(s => s.SetProperty(l => l.IsActive, false));

        // Kích hoạt những người có nhiệm kỳ mới
        await _context.Leaders
            .Where(l => l.Term == newTerm)
            .ExecuteUpdateAsync(s => s.SetProperty(l => l.IsActive, true));

        return Ok(new
        {
            message = $"Đã xoay vòng sang nhiệm kỳ {newTerm}. {deactivatedCount} thành viên cũ đã được lưu trữ."
        });
    }

    /// <summary>DELETE xoá huynh trưởng (chỉ Admin)</summary>
    [HttpDelete("{id:guid}")]
    [RequirePermission("leaders.delete")]
    public async Task<IActionResult> DeleteLeader(Guid id)
    {
        var leader = await _context.Leaders.FindAsync(id);
        if (leader == null) return NotFound();
        _context.Leaders.Remove(leader);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}