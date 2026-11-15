using System.Security.Claims;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Rules;
using Microsoft.AspNetCore.Http;

namespace GiaoLy.Infrastructure.Security;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid? UserId
    {
        get
        {
            var idClaim = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User?.FindFirst("sub")?.Value
                ?? User?.FindFirst("uid")?.Value;

            return Guid.TryParse(idClaim, out var id) ? id : null;
        }
    }

    public string? UserName => User?.FindFirst(ClaimTypes.Name)?.Value;
    public string? FullName => User?.FindFirst("name")?.Value ?? UserName;

    public Guid? RoleId
    {
        get
        {
            var roleIdClaim = User?.FindFirst("role_id")?.Value;
            return Guid.TryParse(roleIdClaim, out var id) ? id : null;
        }
    }

    public string? RoleCode => User?.FindFirst(ClaimTypes.Role)?.Value;

    public string? ScopeType => User?.FindFirst("scope_type")?.Value
        ?? User?.FindFirst("scope")?.Value
        ?? "All";

    public int? BranchId
    {
        get
        {
            var branchIdClaim = User?.FindFirst("branch_id")?.Value;
            return int.TryParse(branchIdClaim, out var id) ? id : null;
        }
    }

    public Guid? SecurityStamp
    {
        get
        {
            var stampClaim = User?.FindFirst("security_stamp")?.Value;
            return Guid.TryParse(stampClaim, out var stamp) ? stamp : null;
        }
    }

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public bool MustChangePassword
    {
        get
        {
            var val = User?.FindFirst("must_change_password")?.Value;
            return bool.TryParse(val, out var b) && b;
        }
    }

    public IReadOnlySet<string> Permissions
    {
        get
        {
            if (User is null) return new HashSet<string>();
            var perms = User.FindAll("permission").Select(c => c.Value);
            return new HashSet<string>(perms, StringComparer.OrdinalIgnoreCase);
        }
    }

    public bool HasPermission(string permission)
    {
        if (string.IsNullOrWhiteSpace(permission)) return true;

        // SystemAdmin có toàn quyền — đồng bộ với PermissionAuthorizationHandler
        if (PrivilegeGuard.IsSystemAdmin(RoleCode)) return true;

        return Permissions.Contains(permission);
    }
}
