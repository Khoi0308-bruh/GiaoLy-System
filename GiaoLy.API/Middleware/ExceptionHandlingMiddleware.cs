using System.Text.Json;
using GiaoLy.Application.Common.Errors;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate _next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        this._next = _next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var correlationId = context.Items["CorrelationId"]?.ToString();
            _logger.LogError(ex, "Lỗi chưa được xử lý khi xử lý yêu cầu {Method} {Path} (CorrelationId: {CorrelationId})",
                context.Request.Method, context.Request.Path, correlationId);

            await HandleExceptionAsync(context, ex, correlationId);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception, string? correlationId)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error",
            Detail = "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng liên hệ quản trị viên.",
            Type = "https://tools.ietf.org/html/rfc7807#section-3.1"
        };

        problemDetails.Extensions["code"] = ErrorCodes.InternalError;

        if (!string.IsNullOrWhiteSpace(correlationId))
        {
            problemDetails.Extensions["correlationId"] = correlationId;
        }

        var json = JsonSerializer.Serialize(problemDetails, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
