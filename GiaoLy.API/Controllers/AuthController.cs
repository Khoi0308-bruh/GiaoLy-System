using GiaoLy.API.Helpers;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.RoleEntity)
                .ThenInclude(r => r!.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Username == request.Username);


        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng!" });

        var token = GenerateJwt(user);
        var permissions = user.RoleEntity?.RolePermissions.Select(rp => rp.Permission.Code).ToList() ?? new List<string>();
        
        return Ok(new
        {
            token,
            userId = user.Id.ToString(), // Cần thiết cho ABAC check phía Frontend
            username = user.Username,
            role = user.RoleEntity?.Code ?? user.Role,
            permissions,
            fullName = user.FullName,
            branch = user.Branch
        });
    }

    private string GenerateJwt(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var permissions = user.RoleEntity?.RolePermissions.Select(rp => rp.Permission.Code).ToList() ?? new List<string>();
        var roleCode = user.RoleEntity?.Code ?? user.Role;

        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Giai đoạn 3A — Cần cho ABAC Policy
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, roleCode),
            new Claim("Branch", user.Branch?.ToString() ?? "0")
        };

        foreach (var p in permissions)
        {
            claims.Add(new Claim("Permission", p));
        }

        var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"],
          claims, expires: DateTimeHelper.GetVnNow().AddDays(7), signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}

public class LoginRequest { public string Username { get; set; } = ""; public string Password { get; set; } = ""; }