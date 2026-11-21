using BCrypt.Net;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.Identity;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly ICurrentUser _currentUser;
    private readonly IPermissionProvider _permissionProvider;
    private readonly IMemoryCache _cache;

    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);
    // Dummy hash to run BCrypt verification in constant time when user does not exist
    private const string DummyHash = "$2a$12$e80yV0Y9a7sF9x5eB1oPaeY0057J4P2Jj1c8C4V4oXwA5Y1jL1G7C";

    public AuthService(
        AppDbContext db,
        ITokenService tokenService,
        ICurrentUser currentUser,
        IPermissionProvider permissionProvider,
        IMemoryCache cache)
    {
        _db = db;
        _tokenService = tokenService;
        _currentUser = currentUser;
        _permissionProvider = permissionProvider;
        _cache = cache;
    }

    public async Task<Result<AuthResponse>> LoginAsync(
        LoginRequest request,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Result.BadRequest<AuthResponse>(ErrorCodes.AuthInvalidCredentials, "Vui lòng nhập tên đăng nhập và mật khẩu.");
        }

        var username = request.Username.Trim();
        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Username == username, ct);

        // Constant time mitigation
        if (user == null)
        {
            BCrypt.Net.BCrypt.Verify(request.Password, DummyHash);
            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthInvalidCredentials, "Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        if (!user.IsActive)
        {
            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthTokenRevoked, "Tài khoản này đã bị vô hiệu hóa.");
        }

        // Check temporary lockout
        if (user.LockoutUntil.HasValue && user.LockoutUntil.Value > DateTime.UtcNow)
        {
            var remaining = Math.Ceiling((user.LockoutUntil.Value - DateTime.UtcNow).TotalMinutes);
            return Result.Failure<AuthResponse>(423, ErrorCodes.AuthLocked,
                $"Tài khoản đã bị tạm khóa do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau {remaining} phút.");
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            user.FailedLoginCount++;
            if (user.FailedLoginCount >= MaxFailedAttempts)
            {
                user.LockoutUntil = DateTime.UtcNow.Add(LockoutDuration);
            }
            await _db.SaveChangesAsync(ct);

            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthInvalidCredentials, "Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        // Login successful: reset lockout counters
        user.FailedLoginCount = 0;
        user.LockoutUntil = null;
        user.LastLoginAt = DateTime.UtcNow;

        var roleCode = user.RoleEntity?.Code ?? "Viewer";
        var scopeType = user.RoleEntity?.ScopeType ?? "All";

        var accessToken = await _tokenService.GenerateAccessTokenAsync(user, roleCode, scopeType, ct);
        var (rawRefreshToken, tokenHash, expiresAt) = _tokenService.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedByIp = ipAddress,
            DeviceInfo = userAgent
        };

        _db.RefreshTokens.Add(refreshTokenEntity);
        await _db.SaveChangesAsync(ct);

        // Invalidate session cache to pick up latest state
        _cache.Remove($"UserSession_{user.Id}");

        var userSummary = new UserSummaryResponse(
            user.Id,
            user.Username,
            user.FullName,
            user.ChristianName,
            user.AvatarPath,
            roleCode,
            scopeType,
            user.BranchId,
            user.MustChangePassword
        );

        return Result.Ok(new AuthResponse(accessToken, rawRefreshToken, expiresAt, userSummary));
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(
        string rawRefreshToken,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthTokenRevoked, "Refresh token không hợp lệ.");
        }

        var tokenHash = _tokenService.HashToken(rawRefreshToken);
        var existingToken = await _db.RefreshTokens
            .Include(rt => rt.User)
            .ThenInclude(u => u!.RoleEntity)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, ct);

        if (existingToken == null || existingToken.User == null || !existingToken.User.IsActive)
        {
            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthTokenRevoked, "Phiên đăng nhập không tồn tại hoặc đã hết hiệu lực.");
        }

        if (existingToken.IsRevoked)
        {
            // Revocation / reuse detection: revoke all tokens for this user
            var userTokens = await _db.RefreshTokens
                .Where(rt => rt.UserId == existingToken.UserId && rt.RevokedAt == null)
                .ToListAsync(ct);

            foreach (var t in userTokens)
            {
                t.RevokedAt = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync(ct);

            _cache.Remove($"UserSession_{existingToken.UserId}");

            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthTokenRevoked,
                "Phát hiện refresh token bị sử dụng lại. Toàn bộ phiên đăng nhập đã bị thu hồi vì lý do an toàn.");
        }

        if (existingToken.IsExpired)
        {
            return Result.Failure<AuthResponse>(401, ErrorCodes.AuthTokenRevoked, "Refresh token đã hết hạn. Vui lòng đăng nhập lại.");
        }

        var user = existingToken.User;
        var roleCode = user.RoleEntity?.Code ?? "Viewer";
        var scopeType = user.RoleEntity?.ScopeType ?? "All";

        // Rotate token
        var (newRawRefreshToken, newTokenHash, newExpiresAt) = _tokenService.GenerateRefreshToken();
        var newTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newTokenHash,
            ExpiresAt = newExpiresAt,
            CreatedByIp = ipAddress,
            DeviceInfo = userAgent
        };

        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.ReplacedByTokenId = newTokenEntity.Id;

        _db.RefreshTokens.Add(newTokenEntity);
        await _db.SaveChangesAsync(ct);

        var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user, roleCode, scopeType, ct);

        var userSummary = new UserSummaryResponse(
            user.Id,
            user.Username,
            user.FullName,
            user.ChristianName,
            user.AvatarPath,
            roleCode,
            scopeType,
            user.BranchId,
            user.MustChangePassword
        );

        return Result.Ok(new AuthResponse(newAccessToken, newRawRefreshToken, newExpiresAt, userSummary));
    }

    public async Task<Result> LogoutAsync(string? rawRefreshToken, CancellationToken ct = default)
    {
        var userId = _currentUser.UserId;
        if (!string.IsNullOrWhiteSpace(rawRefreshToken))
        {
            var tokenHash = _tokenService.HashToken(rawRefreshToken);
            var token = await _db.RefreshTokens.FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, ct);
            if (token != null)
            {
                token.RevokedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync(ct);
            }
        }

        if (userId.HasValue)
        {
            _cache.Remove($"UserSession_{userId.Value}");
        }

        return Result.Ok();
    }

    public async Task<Result> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken ct = default)
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue)
        {
            return Result.Forbidden("Bạn chưa đăng nhập.");
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId.Value, ct);
        if (user == null || !user.IsActive)
        {
            return Result.NotFound("Không tìm thấy tài khoản người dùng.");
        }

        var isOldPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
        if (!isOldPasswordValid)
        {
            return Result.BadRequest(ErrorCodes.AuthInvalidCredentials, "Mật khẩu hiện tại không chính xác.");
        }

        var (isValid, errorMessage) = PrivilegeGuard.ValidatePasswordPolicy(request.NewPassword, user.Username);
        if (!isValid)
        {
            return Result.BadRequest(ErrorCodes.AuthPasswordWeak, errorMessage ?? "Mật khẩu mới không đạt chính sách bảo mật.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);
        user.PasswordChangedAt = DateTime.UtcNow;
        user.MustChangePassword = false;
        user.SecurityStamp = Guid.NewGuid(); // Revokes all previous sessions

        // Revoke all active refresh tokens for this user
        var activeTokens = await _db.RefreshTokens
            .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
            .ToListAsync(ct);

        foreach (var t in activeTokens)
        {
            t.RevokedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync(ct);

        // Clear session cache
        _cache.Remove($"UserSession_{user.Id}");

        return Result.Ok();
    }

    public async Task<Result<UserProfileResponse>> GetCurrentUserProfileAsync(CancellationToken ct = default)
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue) return Result.Forbidden<UserProfileResponse>();

        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Id == userId.Value, ct);

        if (user == null) return Result.NotFound<UserProfileResponse>("Người dùng không tồn tại.");

        var roleCode = user.RoleEntity?.Code ?? "Viewer";
        var roleName = user.RoleEntity?.Name ?? "Người dùng";
        var scopeType = user.RoleEntity?.ScopeType ?? "All";

        var permissions = await _permissionProvider.GetPermissionsForRoleAsync(user.RoleId, ct);

        var branch = user.BranchId.HasValue
            ? await _db.Branches
                .AsNoTracking()
                .Where(b => b.Id == user.BranchId.Value)
                .Select(b => new BranchSummaryResponse(b.Id, b.Name))
                .FirstOrDefaultAsync(ct)
            : null;

        // Lớp do chính người dùng phụ trách, cùng định nghĩa với phạm vi Classroom.
        var ledClasses = await _db.ClassRooms
            .AsNoTracking()
            .Where(c => c.LeaderId == user.Id || c.Teachers.Any(t => t.IsLead && t.UserId == user.Id))
            .Select(c => new
            {
                c.Id,
                LevelName = c.ClassLevel != null ? c.ClassLevel.Name : string.Empty,
                c.Section
            })
            .ToListAsync(ct);

        var classRooms = ledClasses
            .Select(c => new ClassRoomSummaryResponse(
                c.Id,
                string.IsNullOrWhiteSpace(c.Section) ? c.LevelName : $"{c.LevelName} - {c.Section}"))
            .ToList();

        var profile = new UserProfileResponse(
            user.Id,
            user.Username,
            user.FullName,
            user.ChristianName,
            user.Email,
            user.PhoneNumber,
            user.DateOfBirth,
            user.Address,
            user.Bio,
            user.AvatarPath,
            roleCode,
            roleName,
            scopeType,
            user.BranchId,
            branch,
            classRooms,
            permissions,
            user.MustChangePassword
        );

        return Result.Ok(profile);
    }

    public async Task<Result<UserProfileResponse>> UpdateProfileAsync(UpdateProfileRequest request, CancellationToken ct = default)
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue) return Result.Forbidden<UserProfileResponse>();

        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Id == userId.Value, ct);

        if (user == null) return Result.NotFound<UserProfileResponse>("Người dùng không tồn tại.");

        user.FullName = request.FullName.Trim();
        user.ChristianName = request.ChristianName?.Trim();
        user.Email = request.Email?.Trim();
        user.PhoneNumber = request.PhoneNumber?.Trim();
        user.DateOfBirth = request.DateOfBirth;
        user.Address = request.Address?.Trim();
        user.Bio = request.Bio?.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return await GetCurrentUserProfileAsync(ct);
    }

    public async Task<Result<string>> UpdateAvatarAsync(string avatarPath, CancellationToken ct = default)
    {
        var userId = _currentUser.UserId;
        if (!userId.HasValue) return Result.Forbidden<string>();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId.Value, ct);
        if (user == null) return Result.NotFound<string>("Người dùng không tồn tại.");

        user.AvatarPath = avatarPath;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return Result.Ok(avatarPath);
    }
}
