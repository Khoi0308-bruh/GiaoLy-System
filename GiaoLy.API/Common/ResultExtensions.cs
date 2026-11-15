using GiaoLy.Application.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Common;

public static class ResultExtensions
{
    public static IActionResult ToActionResult(this Result result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode switch
            {
                204 => new NoContentResult(),
                _ => new StatusCodeResult(result.StatusCode)
            };
        }

        return CreateProblemDetails(result.StatusCode, result.ErrorCode, result.Message, result.Errors);
    }

    public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        if (result.IsSuccess)
        {
            return result.StatusCode switch
            {
                201 => new ObjectResult(result.Value) { StatusCode = 201 },
                204 => new NoContentResult(),
                _ => new OkObjectResult(result.Value)
            };
        }

        return CreateProblemDetails(result.StatusCode, result.ErrorCode, result.Message, result.Errors);
    }

    private static ObjectResult CreateProblemDetails(int statusCode, string? errorCode, string? message, IDictionary<string, string[]>? errors)
    {
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = GetTitleForStatusCode(statusCode),
            Detail = message,
            Type = $"https://tools.ietf.org/html/rfc7807#section-3.1"
        };

        if (!string.IsNullOrWhiteSpace(errorCode))
        {
            problemDetails.Extensions["code"] = errorCode;
        }

        if (errors is not null && errors.Count > 0)
        {
            problemDetails.Extensions["errors"] = errors;
        }

        return new ObjectResult(problemDetails)
        {
            StatusCode = statusCode,
            ContentTypes = { "application/problem+json" }
        };
    }

    private static string GetTitleForStatusCode(int statusCode) => statusCode switch
    {
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        409 => "Conflict",
        410 => "Gone",
        422 => "Unprocessable Entity",
        423 => "Locked",
        429 => "Too Many Requests",
        500 => "Internal Server Error",
        _ => "An error occurred"
    };
}
