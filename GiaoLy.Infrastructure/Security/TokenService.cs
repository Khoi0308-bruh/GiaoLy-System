using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GiaoLy.Infrastructure.Security;

public class TokenService : ITokenService
{
    /// <summary>Thời hạn access token mặc định (phút) khi cấu hình không khai báo.</summary>
    public const int DefaultAccessTokenMinutes = 20;

    /// <summary>Thời hạn refresh token mặc định (ngày) khi cấu hình không khai báo.</summary>
    public const int DefaultRefreshTokenDays = 14;

    private readonly IConfiguration _config;
    private readonly IPermissionProvider _permissionProvider;
    private readonly SymmetricSecurityKey _key;
    private readonly int _accessTokenMinutes;
    private readonly int _refreshTokenDays;

    public TokenService(IConfiguration config, IPermissionProvider permissionProvider)
    {
        _config = config;
        _permissionProvider = permissionProvider;
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        // Đọc thời hạn từ cấu hình (Jwt:ExpiryMinutes / Jwt:RefreshTokenDays) thay vì hard-code.
        _accessTokenMinutes = ReadPositiveInt(config, "Jwt:ExpiryMinutes", DefaultAccessTokenMinutes);
        _refreshTokenDays = ReadPositiveInt(config, "Jwt:RefreshTokenDays", DefaultRefreshTokenDays);
    }

    public async Task<string> GenerateAccessTokenAsync(
        User user, string roleCode, string scopeType, CancellationToken ct = default)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new("name", user.FullName),
            new(ClaimTypes.Role, roleCode),
            new("role_id", user.RoleId.ToString()),
            new("scope_type", scopeType),
            new("security_stamp", user.SecurityStamp.ToString()),
            new("must_change_password", user.MustChangePassword.ToString().ToLowerInvariant())
        };

        if (user.BranchId.HasValue)
        {
            claims.Add(new Claim("branch_id", user.BranchId.Value.ToString()));
        }

        // Quyền hiệu lực lấy từ nguồn duy nhất là IPermissionProvider (DB, có cache) để
        // ICurrentUser.HasPermission phản ánh đúng quyền thay vì danh sách claim rỗng.
        var permissions = await _permissionProvider.GetPermissionsForRoleAsync(user.RoleId, ct);
        foreach (var permission in permissions)
        {
            claims.Add(new Claim("permission", permission));
        }

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_accessTokenMinutes),
            Issuer = _config["Jwt:Issuer"] ?? "GiaoLySystem",
            Audience = _config["Jwt:Audience"] ?? "GiaoLyUsers",
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public (string RawToken, string TokenHash, DateTime ExpiresAt) GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        var rawToken = Convert.ToBase64String(randomBytes);

        var tokenHash = HashToken(rawToken);
        var expiresAt = DateTime.UtcNow.AddDays(_refreshTokenDays);

        return (rawToken, tokenHash, expiresAt);
    }

    public string HashToken(string rawToken)
    {
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static int ReadPositiveInt(IConfiguration config, string key, int fallback)
    {
        var raw = config[key];
        if (string.IsNullOrWhiteSpace(raw))
        {
            return fallback;
        }

        if (!int.TryParse(raw, out var value) || value <= 0)
        {
            throw new InvalidOperationException(
                $"LỖI CẤU HÌNH: '{key}' phải là số nguyên dương (giá trị hiện tại: '{raw}').");
        }

        return value;
    }
}
