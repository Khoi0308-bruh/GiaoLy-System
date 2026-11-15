using System.Security.Claims;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Rules;
using Microsoft.AspNetCore.Authorization;

namespace GiaoLy.API.Authorization;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IPermissionProvider _permissionProvider;
    private readonly ICurrentUser _currentUser;

    public PermissionAuthorizationHandler(IPermissionProvider permissionProvider, ICurrentUser currentUser)
    {
        _permissionProvider = permissionProvider;
        _currentUser = currentUser;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        if (!context.User.Identity?.IsAuthenticated ?? true)
        {
            return;
        }

        // Nếu đang bắt buộc đổi mật khẩu thì chặn mọi endpoint nghiệp vụ — kể cả SystemAdmin
        // (đổi mật khẩu dùng endpoint [Authorize] thường, không qua RequirePermission)
        if (_currentUser.MustChangePassword)
        {
            context.Fail();
            return;
        }

        // SystemAdmin has all permissions bypass
        if (PrivilegeGuard.IsSystemAdmin(_currentUser.RoleCode))
        {
            context.Succeed(requirement);
            return;
        }

        var roleId = _currentUser.RoleId;
        if (roleId is null)
        {
            context.Fail();
            return;
        }

        var hasPermission = await _permissionProvider.HasPermissionAsync(roleId.Value, requirement.Permission);
        if (hasPermission)
        {
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}
