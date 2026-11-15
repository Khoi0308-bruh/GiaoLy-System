using System.Security.Cryptography;
using BCrypt.Net;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.Identity;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IPermissionProvider _permissionProvider;
    private readonly IMemoryCache _cache;

    public UserService(
        AppDbContext db,
        ICurrentUser currentUser,
        IPermissionProvider permissionProvider,
        IMemoryCache cache)
    {
        _db = db;
        _currentUser = currentUser;
        _permissionProvider = permissionProvider;
        _cache = cache;
    }

    public async Task<Result<PagedList<UserResponse>>> GetUsersAsync(
        PagingRequest paging,
        string? roleCode,
        int? branchId,
        bool? isActive,
        CancellationToken ct = default)
    {
        var query = _db.Users.Include(u => u.RoleEntity).AsNoTracking();

        if (!string.IsNullOrWhiteSpace(roleCode))
        {
            query = query.Where(u => u.RoleEntity != null && u.RoleEntity.Code == roleCode);
        }

        if (branchId.HasValue)
        {
            query = query.Where(u => u.BranchId == branchId.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        if (!string.IsNullOrWhiteSpace(paging.Search))
        {
            var search = paging.Search.Trim().ToLower();
            query = query.Where(u =>
                u.Username.ToLower().Contains(search) ||
                u.FullName.ToLower().Contains(search) ||
                (u.Email != null && u.Email.ToLower().Contains(search)) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(search)));
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((paging.Page - 1) * paging.PageSize)
            .Take(paging.PageSize)
            .Select(u => MapToUserResponse(u))
            .ToListAsync(ct);

        return Result.Ok(new PagedList<UserResponse>(items, totalCount, paging.Page, paging.PageSize));
    }

    public async Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, ct);

        if (user == null) return Result.NotFound<UserResponse>("Người dùng không tồn tại.");

        return Result.Ok(MapToUserResponse(user));
    }

    public async Task<Result<(UserResponse User, string TemporaryPassword)>> CreateUserAsync(
        CreateUserRequest request,
        CancellationToken ct = default)
    {
        var username = request.Username.Trim();
        var exists = await _db.Users.AnyAsync(u => u.Username == username, ct);
        if (exists)
        {
            return Result.Conflict<(UserResponse, string)>(ErrorCodes.ConflictDuplicate, "Tên đăng nhập đã tồn tại trong hệ thống.");
        }

        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId, ct);
        if (role == null)
        {
            return Result.BadRequest<(UserResponse, string)>(ErrorCodes.ValidationFailed, "Vai trò được chọn không tồn tại.");
        }

        var targetRolePerms = await _permissionProvider.GetPermissionsForRoleAsync(role.Id, ct);
        var canAssign = PrivilegeGuard.CanAssignRole(_currentUser.RoleCode, _currentUser.Permissions, targetRolePerms);
        if (!canAssign)
        {
            return Result.Failure<(UserResponse, string)>(403, ErrorCodes.PrivilegeEscalation,
                "Bạn không thể gán vai trò có quyền hạn vượt quá quyền của chính mình.");
        }

        var tempPassword = GenerateRandomPassword();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword, 12);

        var user = new User
        {
            Username = username,
            FullName = request.FullName.Trim(),
            ChristianName = request.ChristianName?.Trim(),
            Email = request.Email?.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            DateOfBirth = request.DateOfBirth,
            Address = request.Address?.Trim(),
            RoleId = role.Id,
            BranchId = request.BranchId,
            PasswordHash = passwordHash,
            MustChangePassword = true,
            IsActive = true,
            SecurityStamp = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        user.RoleEntity = role;
        return Result.Ok((MapToUserResponse(user), tempPassword));
    }

    public async Task<Result<UserResponse>> UpdateUserAsync(
        Guid id,
        UpdateUserRequest request,
        CancellationToken ct = default)
    {
        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Id == id, ct);

        if (user == null) return Result.NotFound<UserResponse>("Người dùng không tồn tại.");

        user.FullName = request.FullName.Trim();
        user.ChristianName = request.ChristianName?.Trim();
        user.Email = request.Email?.Trim();
        user.PhoneNumber = request.PhoneNumber?.Trim();
        user.DateOfBirth = request.DateOfBirth;
        user.Address = request.Address?.Trim();
        user.Bio = request.Bio?.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return Result.Ok(MapToUserResponse(user));
    }

    public async Task<Result> AssignRoleAsync(Guid id, AssignRoleRequest request, CancellationToken ct = default)
    {
        var operatorUserId = _currentUser.UserId ?? Guid.Empty;
        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Id == id, ct);

        if (user == null) return Result.NotFound("Người dùng không tồn tại.");

        var canModify = PrivilegeGuard.CanModifyUser(operatorUserId, _currentUser.RoleCode, user.Id, user.RoleEntity?.Code);
        if (!canModify)
        {
            return Result.Forbidden("Bạn không thể tự đổi vai trò của chính mình hoặc sửa tài khoản cấp cao hơn.");
        }

        var newRole = await _db.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId, ct);
        if (newRole == null) return Result.BadRequest(ErrorCodes.ValidationFailed, "Vai trò mới không tồn tại.");

        // Check if demoting the last active SystemAdmin
        if (PrivilegeGuard.IsSystemAdmin(user.RoleEntity?.Code) && !PrivilegeGuard.IsSystemAdmin(newRole.Code))
        {
            var adminRoleId = user.RoleId;
            var adminCount = await _db.Users.CountAsync(u => u.RoleId == adminRoleId && u.IsActive, ct);
            if (!PrivilegeGuard.CanDeactivateOrDemote(user.RoleEntity?.Code, adminCount))
            {
                return Result.Conflict(ErrorCodes.LastAdmin, "Không thể hạ quyền Quản trị viên hệ thống cuối cùng.");
            }
        }

        var targetRolePerms = await _permissionProvider.GetPermissionsForRoleAsync(newRole.Id, ct);
        var canAssign = PrivilegeGuard.CanAssignRole(_currentUser.RoleCode, _currentUser.Permissions, targetRolePerms);
        if (!canAssign)
        {
            return Result.Failure(403, ErrorCodes.PrivilegeEscalation,
                "Bạn không thể gán vai trò có quyền hạn vượt quá quyền của chính mình.");
        }

        user.RoleId = newRole.Id;
        user.BranchId = request.BranchId;
        user.SecurityStamp = Guid.NewGuid(); // Revoke old sessions
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        _cache.Remove($"UserSession_{user.Id}");

        return Result.Ok();
    }

    public async Task<Result<ResetPasswordResponse>> ResetPasswordAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);
        if (user == null) return Result.NotFound<ResetPasswordResponse>("Người dùng không tồn tại.");

        var tempPassword = GenerateRandomPassword();
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword, 12);
        user.MustChangePassword = true;
        user.FailedLoginCount = 0;
        user.LockoutUntil = null;
        user.SecurityStamp = Guid.NewGuid();
        user.UpdatedAt = DateTime.UtcNow;

        // Revoke all refresh tokens
        var activeTokens = await _db.RefreshTokens
            .Where(rt => rt.UserId == user.Id && rt.RevokedAt == null)
            .ToListAsync(ct);
        foreach (var t in activeTokens) t.RevokedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        _cache.Remove($"UserSession_{user.Id}");

        return Result.Ok(new ResetPasswordResponse(tempPassword));
    }

    public async Task<Result> DeactivateUserAsync(Guid id, CancellationToken ct = default)
    {
        var operatorUserId = _currentUser.UserId ?? Guid.Empty;
        var user = await _db.Users
            .Include(u => u.RoleEntity)
            .FirstOrDefaultAsync(u => u.Id == id, ct);

        if (user == null) return Result.NotFound("Người dùng không tồn tại.");

        var canModify = PrivilegeGuard.CanModifyUser(operatorUserId, _currentUser.RoleCode, user.Id, user.RoleEntity?.Code);
        if (!canModify)
        {
            return Result.Forbidden("Bạn không thể tự vô hiệu hóa tài khoản của chính mình hoặc tài khoản cấp cao hơn.");
        }

        if (PrivilegeGuard.IsSystemAdmin(user.RoleEntity?.Code))
        {
            var adminRoleId = user.RoleId;
            var adminCount = await _db.Users.CountAsync(u => u.RoleId == adminRoleId && u.IsActive, ct);
            if (!PrivilegeGuard.CanDeactivateOrDemote(user.RoleEntity?.Code, adminCount))
            {
                return Result.Conflict(ErrorCodes.LastAdmin, "Không thể vô hiệu hóa Quản trị viên hệ thống cuối cùng.");
            }
        }

        user.IsActive = false;
        user.SecurityStamp = Guid.NewGuid();
        user.UpdatedAt = DateTime.UtcNow;

        // Revoke active refresh tokens
        var tokens = await _db.RefreshTokens.Where(rt => rt.UserId == user.Id && rt.RevokedAt == null).ToListAsync(ct);
        foreach (var t in tokens) t.RevokedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        _cache.Remove($"UserSession_{user.Id}");

        return Result.Ok();
    }

    public async Task<Result> ActivateUserAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);
        if (user == null) return Result.NotFound("Người dùng không tồn tại.");

        user.IsActive = true;
        user.FailedLoginCount = 0;
        user.LockoutUntil = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        _cache.Remove($"UserSession_{user.Id}");

        return Result.Ok();
    }

    private static UserResponse MapToUserResponse(User u) => new(
        u.Id,
        u.Username,
        u.FullName,
        u.ChristianName,
        u.Email,
        u.PhoneNumber,
        u.DateOfBirth,
        u.Address,
        u.Bio,
        u.AvatarPath,
        u.RoleId,
        u.RoleEntity?.Code ?? "Viewer",
        u.RoleEntity?.Name ?? "Người dùng",
        u.RoleEntity?.ScopeType ?? "All",
        u.BranchId,
        u.IsActive,
        u.MustChangePassword,
        u.LastLoginAt,
        u.CreatedAt
    );

    private static string GenerateRandomPassword()
    {
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string lower = "abcdefghijkmnpqrstuvwxyz";
        const string digits = "23456789";
        const string special = "!@#$%^&*";

        var bytes = new byte[12];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);

        var chars = new char[12];
        chars[0] = upper[bytes[0] % upper.Length];
        chars[1] = lower[bytes[1] % lower.Length];
        chars[2] = digits[bytes[2] % digits.Length];
        chars[3] = special[bytes[3] % special.Length];

        var allChars = upper + lower + digits + special;
        for (int i = 4; i < 12; i++)
        {
            chars[i] = allChars[bytes[i] % allChars.Length];
        }

        // Shuffle
        return new string(chars.OrderBy(_ => RandomNumberGenerator.GetInt32(100)).ToArray());
    }
}
