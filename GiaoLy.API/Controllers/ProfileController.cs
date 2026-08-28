using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ProfileController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Không tìm thấy thông tin người dùng trong token.");

        var user = await _context.Users
            .Select(u => new 
            {
                u.Id,
                u.Username,
                u.ChristianName,
                u.FullName,
                u.Role,
                u.Branch,
                u.Email,
                u.PhoneNumber,
                u.DateOfBirth,
                u.Address,
                u.Bio,
                u.AvatarPath,
                u.CreatedAt
            })
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound("Người dùng không tồn tại.");

        return Ok(user);
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Không tìm thấy thông tin người dùng trong token.");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Người dùng không tồn tại.");

        if (string.IsNullOrWhiteSpace(request.FullName))
            return BadRequest(new { errors = new { FullName = new[] { "Họ tên không được để trống." } } });

        user.ChristianName = request.ChristianName?.Trim() ?? string.Empty;
        user.FullName = request.FullName.Trim();
        user.Email = request.Email?.Trim() ?? string.Empty;
        user.PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty;
        user.DateOfBirth = request.DateOfBirth;
        user.Address = request.Address?.Trim() ?? string.Empty;
        user.Bio = request.Bio?.Trim() ?? string.Empty;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật hồ sơ thành công.", user = new {
            user.Id, user.Username, user.ChristianName, user.FullName,
            user.Role, user.Branch, user.Email, user.PhoneNumber,
            user.DateOfBirth, user.Address, user.Bio, user.AvatarPath, user.CreatedAt
        } });
    }

    [HttpPost("avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile avatar)
    {
        if (avatar == null || avatar.Length == 0)
            return BadRequest("Vui lòng chọn ảnh hợp lệ.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var ext = Path.GetExtension(avatar.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest("Chỉ hỗ trợ tệp định dạng JPG, PNG, GIF.");

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Không tìm thấy thông tin người dùng trong token.");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Người dùng không tồn tại.");

        var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "avatars");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{userId}_{DateTime.UtcNow.Ticks}{ext}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await avatar.CopyToAsync(stream);
        }

        if (!string.IsNullOrEmpty(user.AvatarPath))
        {
            var oldFilePath = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), user.AvatarPath.TrimStart('/'));
            if (System.IO.File.Exists(oldFilePath))
            {
                System.IO.File.Delete(oldFilePath);
            }
        }

        user.AvatarPath = $"/uploads/avatars/{uniqueFileName}";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Cập nhật ảnh đại diện thành công.", avatarPath = user.AvatarPath });
    }

    [HttpPatch("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OldPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest("Vui lòng nhập đầy đủ mật khẩu cũ và mới.");

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized("Không tìm thấy thông tin người dùng trong token.");

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound("Người dùng không tồn tại.");

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            return BadRequest("Mật khẩu hiện tại không chính xác.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        
        await _context.SaveChangesAsync();

        return Ok(new { message = "Đổi mật khẩu thành công." });
    }
}

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    public string ChristianName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}
