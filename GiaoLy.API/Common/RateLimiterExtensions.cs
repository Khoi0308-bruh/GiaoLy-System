using System.Security.Claims;
using System.Text.Json;
using System.Threading.RateLimiting;
using GiaoLy.Application.Common.Errors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Common;

public static class RateLimiterExtensions
{
    public const string PolicyLogin = "login";
    public const string PolicyRefresh = "refresh";
    public const string PolicyVerify = "verify";
    public const string PolicyPublic = "public";
    public const string PolicyUpload = "upload";
    public const string PolicyExport = "export";

    /// <summary>
    /// Khoá phân vùng cho các policy chỉ áp dụng sau khi đã xác thực:
    /// user đã đăng nhập → <c>user:{id}</c> (ổn định kể cả khi đổi username);
    /// chưa đăng nhập → <c>ip:{ip}</c>.
    /// Vì vậy <c>UseAuthentication()</c> phải chạy trước <c>UseRateLimiter()</c>.
    /// </summary>
    private static string GetUserOrIpPartitionKey(HttpContext httpContext)
    {
        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? httpContext.User.Identity.Name;
            if (!string.IsNullOrWhiteSpace(userId))
            {
                return $"user:{userId}";
            }
        }

        return $"ip:{httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
    }

    public static IServiceCollection AddGiaoLyRateLimiting(this IServiceCollection services, IConfiguration? config = null)
    {
        // Mức mặc định cho mọi endpoint chưa khai báo policy riêng (per IP, mỗi phút).
        var globalPermitLimit = config?.GetValue<int?>("RateLimiting:Global:PermitLimit") ?? 120;
        var globalWindowSeconds = config?.GetValue<int?>("RateLimiting:Global:WindowSeconds") ?? 60;

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Global limiter vẫn phân vùng theo IP: chặn lưu lượng ẩn danh trước khi xác thực.
            // Các policy upload/export dùng GetUserOrIpPartitionKey sau khi UseAuthentication đã chạy.
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = globalPermitLimit,
                        Window = TimeSpan.FromSeconds(globalWindowSeconds),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.ContentType = "application/problem+json";
                var problemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status429TooManyRequests,
                    Title = "Too Many Requests",
                    Detail = "Bạn đã thực hiện quá nhiều yêu cầu trong khoảng thời gian ngắn. Vui lòng thử lại sau.",
                    Type = "https://tools.ietf.org/html/rfc7807#section-3.1"
                };
                problemDetails.Extensions["code"] = ErrorCodes.RateLimited;

                var correlationId = context.HttpContext.Items["CorrelationId"]?.ToString();
                if (!string.IsNullOrWhiteSpace(correlationId))
                {
                    problemDetails.Extensions["correlationId"] = correlationId;
                }

                var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                await context.HttpContext.Response.WriteAsync(json, token);
            };

            // Login policy: 10 req/min per IP
            options.AddPolicy(PolicyLogin, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 10,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            // Refresh policy: 60 req/min per IP.
            // Mỗi lần mở hoặc tải lại trang, client đều gọi /auth/refresh để lấy access token
            // mới. Dùng chung hạn mức 10/phút với login sẽ khiến người dùng đang đăng nhập
            // bị 429 và bị đá về trang đăng nhập, nên policy này phải rộng hơn hẳn.
            options.AddPolicy(PolicyRefresh, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 60,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            // Verify policy: 10 req/min per IP
            options.AddPolicy(PolicyVerify, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 10,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            // Public policy: 60 req/min per IP
            options.AddPolicy(PolicyPublic, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 60,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            // Upload policy: 20 req/hour per user (or IP if unauthenticated)
            options.AddPolicy(PolicyUpload, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetUserOrIpPartitionKey(httpContext),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 20,
                        Window = TimeSpan.FromHours(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));

            // Export policy: 10 req/hour per user (or IP if unauthenticated)
            options.AddPolicy(PolicyExport, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetUserOrIpPartitionKey(httpContext),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 10,
                        Window = TimeSpan.FromHours(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    }));
        });

        return services;
    }
}
