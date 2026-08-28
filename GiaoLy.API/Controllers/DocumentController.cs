using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public DocumentController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    /// <summary>GET tài liệu với context-aware filtering (branch, category, tags, accessLevel).</summary>
    [HttpGet]
    [AllowAnonymous] // Trang chủ public cần xem tài liệu không cần đăng nhập
    public async Task<ActionResult<IEnumerable<Document>>> GetDocuments(
        [FromQuery] int? branch,
        [FromQuery] string? category,
        [FromQuery] string? tag,
        [FromQuery] string? access,
        [FromQuery] int? page,
        [FromQuery] int? limit,
        [FromQuery] string? search)
    {
        var query = _context.Documents.AsQueryable();

        // Context-aware: lọc theo ngành người dùng
        if (branch.HasValue && branch > 0)
            query = query.Where(d => d.Branch == 0 || d.Branch == branch.Value);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(d => d.Category == category);

        // Tìm kiếm theo tag
        if (!string.IsNullOrEmpty(tag))
            query = query.Where(d => d.Tags.Contains(tag));

        // Tìm kiếm theo tên file (Search)
        if (!string.IsNullOrEmpty(search))
            query = query.Where(d => d.FileName.Contains(search) || d.Tags.Contains(search));

        // Lọc access level: Nếu không có token (anonymous) chỉ trả Public
        var isAuthenticated = User.Identity?.IsAuthenticated ?? false;
        if (access == "all" && isAuthenticated)
        {
            // Giữ nguyên (admin thấy tất cả)
        }
        else
        {
            query = query.Where(d => d.AccessLevel == DocumentAccessLevel.Public);
        }

        var totalCount = await query.CountAsync();
        Response.Headers.Append("X-Total-Count", totalCount.ToString());

        var orderedQuery = query.OrderByDescending(d => d.Branch == (branch ?? 0)) // Ưu tiên ngành của user
                                .ThenByDescending(d => d.UploadDate);

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

    [HttpPost("upload")]
    [RequirePermission("documents.create")] // Phân quyền quản lý tài liệu
    public async Task<IActionResult> UploadFile([FromForm] UploadDocumentRequest request)
    {
        var file = request.File;
        if (file == null || file.Length == 0) return BadRequest("File trống.");

        var uploadFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        if (!Directory.Exists(uploadFolder)) Directory.CreateDirectory(uploadFolder);

        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadFolder, fileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        // Lấy tên người upload từ JWT claim
        var uploader = User.FindFirstValue(ClaimTypes.Name) ?? "Ẩn danh";

        var doc = new Document
        {
            Id = Guid.NewGuid(),
            FileName = file.FileName,
            FilePath = "/uploads/" + fileName,
            Branch = request.Branch,
            Category = request.Category,
            Tags = request.Tags ?? string.Empty,
            AccessLevel = request.AccessLevel == "Internal" ? DocumentAccessLevel.Internal : DocumentAccessLevel.Public,
            FileSize = file.Length,
            UploadedBy = uploader
        };

        _context.Documents.Add(doc);
        await _context.SaveChangesAsync();
        return Ok(doc);
    }

    [HttpGet("download/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> DownloadFile(Guid id)
    {
        var doc = await _context.Documents.FindAsync(id);
        if (doc == null) return NotFound();

        // Internal docs chỉ cho role 1,2,3
        if (doc.AccessLevel == DocumentAccessLevel.Internal)
        {
            var role = User.FindFirstValue(ClaimTypes.Role) ?? "0";
            if (role == "0") return Forbid();
        }

        var path = Path.Combine(_env.ContentRootPath, "wwwroot", doc.FilePath.TrimStart('/'));
        if (!System.IO.File.Exists(path)) return NotFound("File không tồn tại trên server.");

        var bytes = await System.IO.File.ReadAllBytesAsync(path);
        return File(bytes, "application/octet-stream", doc.FileName);
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission("documents.delete")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        var doc = await _context.Documents.FindAsync(id);
        if (doc == null) return NotFound();

        // Xóa file vật lý
        var path = Path.Combine(_env.ContentRootPath, "wwwroot", doc.FilePath.TrimStart('/'));
        if (System.IO.File.Exists(path)) System.IO.File.Delete(path);

        _context.Documents.Remove(doc);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class UploadDocumentRequest
{
    public IFormFile File { get; set; } = null!;
    public int Branch { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string? AccessLevel { get; set; }
}