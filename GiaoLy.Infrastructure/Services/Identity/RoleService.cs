using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Identity;

public class RoleService : IRoleService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IPermissionProvider _permissionProvider;

    public RoleService(AppDbContext db, ICurrentUser currentUser, IPermissionProvider permissionProvider)
    {
        _db = db;
        _currentUser = currentUser;
        _permissionProvider = permissionProvider;
    }

    public async Task<Result<IReadOnlyList<RoleResponse>>> GetRolesAsync(CancellationToken ct = default)
    {
        var roles = await _db.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .AsNoTracking()
            .OrderBy(r => r.IsSystem ? 0 : 1)
            .ThenBy(r => r.Name)
            .ToListAsync(ct);

        var result = roles.Select(r => new RoleResponse(
            r.Id,
            r.Code,
            r.Name,
            r.Description,
            r.IsSystem,
            r.ScopeType,
            r.CreatedAt,
            r.RolePermissions.Select(rp => rp.Permission.Code).ToList()
        )).ToList();

        return Result.Ok<IReadOnlyList<RoleResponse>>(result);
    }

    public async Task<Result<IReadOnlyList<PermissionResponse>>> GetPermissionsAsync(CancellationToken ct = default)
    {
        var perms = await _db.Permissions
            .AsNoTracking()
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Code)
            .Select(p => new PermissionResponse(p.Id, p.Code, p.Name, p.Module, p.Description))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<PermissionResponse>>(perms);
    }

    public async Task<Result<RoleResponse>> CreateRoleAsync(CreateRoleRequest request, CancellationToken ct = default)
    {
        var code = request.Code.Trim();
        if (PrivilegeGuard.IsReservedRoleCode(code))
        {
            return Result.BadRequest<RoleResponse>(ErrorCodes.ValidationFailed,
                $"Mã vai trò '{code}' là mã dành riêng của hệ thống. Vui lòng chọn mã khác.");
        }

        var exists = await _db.Roles.AnyAsync(r => r.Code == code, ct);
        if (exists)
        {
            return Result.Conflict<RoleResponse>(ErrorCodes.ConflictDuplicate, "Mã vai trò đã tồn tại.");
        }

        var requestedPerms = request.Permissions ?? new List<string>();
        var canGrant = PrivilegeGuard.CanGrantPermissions(_currentUser.RoleCode, _currentUser.Permissions, requestedPerms);
        if (!canGrant)
        {
            return Result.Failure<RoleResponse>(403, ErrorCodes.PrivilegeEscalation,
                "Bạn không thể cấp quyền mà chính bạn không có cho một vai trò.");
        }

        var role = new Role
        {
            Code = code,
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            ScopeType = request.ScopeType,
            IsSystem = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Roles.Add(role);

        if (requestedPerms.Count > 0)
        {
            var validPerms = await _db.Permissions
                .Where(p => requestedPerms.Contains(p.Code))
                .ToListAsync(ct);

            foreach (var p in validPerms)
            {
                role.RolePermissions.Add(new RolePermission { Role = role, Permission = p });
            }
        }

        await _db.SaveChangesAsync(ct);

        return Result.Ok(new RoleResponse(
            role.Id,
            role.Code,
            role.Name,
            role.Description,
            role.IsSystem,
            role.ScopeType,
            role.CreatedAt,
            requestedPerms
        ));
    }

    public async Task<Result<RoleResponse>> UpdateRoleAsync(Guid id, UpdateRoleRequest request, CancellationToken ct = default)
    {
        var role = await _db.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

        if (role == null) return Result.NotFound<RoleResponse>("Vai trò không tồn tại.");

        role.Name = request.Name.Trim();
        role.Description = request.Description?.Trim();

        // System roles cannot change scope
        if (!role.IsSystem)
        {
            role.ScopeType = request.ScopeType;
        }

        role.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return Result.Ok(new RoleResponse(
            role.Id,
            role.Code,
            role.Name,
            role.Description,
            role.IsSystem,
            role.ScopeType,
            role.CreatedAt,
            role.RolePermissions.Select(rp => rp.Permission.Code).ToList()
        ));
    }

    public async Task<Result> DeleteRoleAsync(Guid id, CancellationToken ct = default)
    {
        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Id == id, ct);
        if (role == null) return Result.NotFound("Vai trò không tồn tại.");

        if (role.IsSystem)
        {
            return Result.BadRequest(ErrorCodes.ValidationFailed, "Không thể xóa vai trò mặc định của hệ thống.");
        }

        var hasUsers = await _db.Users.AnyAsync(u => u.RoleId == id, ct);
        if (hasUsers)
        {
            return Result.Conflict(ErrorCodes.ConflictDuplicate, "Không thể xóa vai trò đang được gán cho người dùng.");
        }

        _db.Roles.Remove(role);
        await _db.SaveChangesAsync(ct);

        _permissionProvider.InvalidateRoleCache(id);

        return Result.Ok();
    }

    public async Task<Result> AssignPermissionsAsync(Guid id, AssignPermissionsRequest request, CancellationToken ct = default)
    {
        var role = await _db.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

        if (role == null) return Result.NotFound("Vai trò không tồn tại.");

        var requestedPerms = request.Permissions.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        var canGrant = PrivilegeGuard.CanGrantPermissions(_currentUser.RoleCode, _currentUser.Permissions, requestedPerms);
        if (!canGrant)
        {
            return Result.Failure(403, ErrorCodes.PrivilegeEscalation,
                "Bạn không thể cấp quyền mà chính bạn không có cho một vai trò.");
        }

        var dbPermissions = await _db.Permissions
            .Where(p => requestedPerms.Contains(p.Code))
            .ToListAsync(ct);

        // Remove old permissions
        _db.RolePermissions.RemoveRange(role.RolePermissions);

        // Add new permissions
        foreach (var p in dbPermissions)
        {
            role.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = p.Id });
        }

        role.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _permissionProvider.InvalidateRoleCache(id);

        return Result.Ok();
    }
}
