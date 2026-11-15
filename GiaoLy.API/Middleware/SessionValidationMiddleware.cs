using System.Security.Claims;
using System.Text.Json;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.API.Middleware;

public class SessionValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(60);

    public SessionValidationMiddleware(RequestDelegate _next, IMemoryCache cache)
    {
        this._next = _next;
        _cache = cache;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            await _next(context);
            return;
        }

        var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? context.User.FindFirst("sub")?.Value;

        var stampClaim = context.User.FindFirst("security_stamp")?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId) ||
            string.IsNullOrWhiteSpace(stampClaim) || !Guid.TryParse(stampClaim, out var tokenStamp))
        {
            await RejectAsync(context, StatusCodes.Status401Unauthorized, ErrorCodes.AuthTokenRevoked,
                "Phiên đăng nhập không hợp lệ hoặc thiếu thông tin định danh.");
            return;
        }

        var cacheKey = $"UserSession_{userId}";
        if (!_cache.TryGetValue(cacheKey, out UserSessionRecord? session) || session == null)
        {
            using var scope = serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var user = await db.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => new UserSessionRecord(u.IsActive, u.SecurityStamp, u.MustChangePassword))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                await RejectAsync(context, StatusCodes.Status401Unauthorized, ErrorCodes.AuthTokenRevoked,
                    "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.");
                return;
            }

            session = user;
            _cache.Set(cacheKey, session, CacheDuration);
        }

        if (!session.IsActive || session.SecurityStamp != tokenStamp)
        {
            _cache.Remove(cacheKey);
            await RejectAsync(context, StatusCodes.Status401Unauthorized, ErrorCodes.AuthTokenRevoked,
                "Phiên đăng nhập đã bị thu hồi hoặc mật khẩu/vai trò đã thay đổi.");
            return;
        }

        // Check forced password change requirement
        if (session.MustChangePassword)
        {
            var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";
            var isAllowedPath = path.Contains("/auth/change-password") ||
                                path.Contains("/auth/logout") ||
                                path.Contains("/auth/me") ||
                                path.Contains("/health");

            if (!isAllowedPath)
            {
                await RejectAsync(context, StatusCodes.Status403Forbidden, ErrorCodes.AuthMustChangePassword,
                    "Bạn phải đổi mật khẩu lần đầu trước khi truy cập các tính năng khác.");
                return;
            }
        }

        await _next(context);
    }

    private static async Task RejectAsync(HttpContext context, int statusCode, string errorCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode == 401 ? "Unauthorized" : "Forbidden",
            Detail = message,
            Type = "https://tools.ietf.org/html/rfc7807#section-3.1"
        };
        problemDetails.Extensions["code"] = errorCode;

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }

    public record UserSessionRecord(bool IsActive, Guid SecurityStamp, bool MustChangePassword);
}
