using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace GiaoLy.API.Attributes;

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
        // Require authentication
        if (context.HttpContext.User.Identity == null || !context.HttpContext.User.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var hasPermission = context.HttpContext.User.HasClaim(c => 
            c.Type == "Permission" && c.Value == _permission);
            
        var role = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

        // Admin (Role Code "1" hoặc "Admin") luôn có toàn quyền để fallback
        if (role == "1" || role == "Admin" || role == "admin" || hasPermission)
        {
            return;
        }

        context.Result = new ForbidResult();
    }
}
