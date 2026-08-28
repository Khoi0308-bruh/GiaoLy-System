using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GiaoLy.API.Helpers;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>GET liệt kê toàn bộ tài khoản người dùng</summary>
    [HttpGet]
    [RequirePermission("users.view")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                FullName = u.FullName,
                Role = u.Role,
                RoleId = u.RoleId,
                Branch = u.Branch,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>POST tạo tài khoản người dùng mới</summary>
    [HttpPost]
    [RequirePermission("users.create")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
            return BadRequest("Tên tài khoản không được để trống.");

        var rawPassword = string.IsNullOrWhiteSpace(request.Password) ? "123456789" : request.Password;

        var exists = await _context.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower());
        if (exists) return BadRequest("Tên tài khoản này đã tồn tại trên hệ thống.");

        // Bản vá: Ép chuỗi số quyền để khớp chính xác với cấu trúc phân quyền JWT
        string mappedRole = request.Role switch
        {
            "1" or "Admin" => "1",
            "2" or "Secretary" => "2",
            "3" or "Moderator" => "3",
            _ => "4" // Viewer / Giáo lý viên thường
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(rawPassword),
            FullName = request.FullName,
            Role = mappedRole,
            RoleId = request.RoleId,
            Branch = request.Branch,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role,
            RoleId = user.RoleId,
            Branch = user.Branch,
            CreatedAt = user.CreatedAt
        });
    }

    /// <summary>PUT cập nhật quyền hạn / phân bổ ngành</summary>
    [HttpPut("{id:guid}")]
    [RequirePermission("users.update")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Bản vá: Ép chuỗi số quyền để khớp chính xác với cấu trúc phân quyền JWT
        string mappedRole = request.Role switch
        {
            "1" or "Admin" => "1",
            "2" or "Secretary" => "2",
            "3" or "Moderator" => "3",
            _ => "4" // Viewer / Giáo lý viên thường
        };

        user.FullName = request.FullName;
        user.Role = mappedRole;
        if (request.RoleId.HasValue || request.RoleId == Guid.Empty) 
        {
             user.RoleId = request.RoleId != Guid.Empty ? request.RoleId : null;
        }
        user.Branch = request.Branch;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>DELETE vô hiệu hóa / xóa tài khoản</summary>
    [HttpDelete("{id:guid}")]
    [RequirePermission("users.delete")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Không cho phép Admin tự xóa chính mình
        if (user.Username == "admin")
            return BadRequest("Không thể xóa tài khoản Quản trị viên hệ thống.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? RoleId { get; set; }
    public int? Branch { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "Viewer";
    public Guid? RoleId { get; set; }
    public int? Branch { get; set; }
}

public class UpdateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "Viewer";
    public Guid? RoleId { get; set; }
    public int? Branch { get; set; }
    public string? Password { get; set; } // Nếu cung cấp thì cập nhật, ngược lại giữ nguyên
}
