using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace GiaoLy.API.Helpers;

/// <summary>
/// Đánh dấu một Endpoint yêu cầu quyền hạn cụ thể (ví dụ: "students.manage")
/// </summary>
public class RequirePermissionAttribute : TypeFilterAttribute
{
    public RequirePermissionAttribute(string permission) : base(typeof(RequirePermissionFilter))
    {
        Arguments = new object[] { permission };
    }
}

public class RequirePermissionFilter : IAuthorizationFilter
{
    private readonly string _permission;

    public RequirePermissionFilter(string permission)
    {
        _permission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (user == null || !user.Identity!.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        // 1. Role "1" (Admin) luôn có full quyền - không bị chặn
        var roleClaim = user.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value;
        if (roleClaim == "1")
        {
            return;
        }

        // 2. Các Role khác phải check trong danh sách claim "Permission"
        var hasPermission = user.Claims.Any(c => c.Type == "Permission" && c.Value == _permission);
        if (!hasPermission)
        {
            context.Result = new ForbidResult(); // 403 Forbidden
        }
    }
}
