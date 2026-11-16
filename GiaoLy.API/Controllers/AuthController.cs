using GiaoLy.API.Common;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimiterExtensions.PolicyLogin)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.LoginAsync(request, ip, userAgent, ct);
        if (result.IsSuccess && result.Value != null)
        {
            SetRefreshTokenCookie(result.Value.RefreshToken, result.Value.ExpiresAt);
        }

        return result.ToActionResult();
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting(RateLimiterExtensions.PolicyLogin)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest? request, CancellationToken ct)
    {
        // Get refresh token from cookie or body
        var rawToken = Request.Cookies["refreshToken"] ?? request?.RefreshToken;
        if (string.IsNullOrWhiteSpace(rawToken))
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized",
                Detail = "Refresh token không được tìm thấy trong cookie hoặc yêu cầu."
            });
        }

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var result = await _authService.RefreshTokenAsync(rawToken, ip, userAgent, ct);
        if (result.IsSuccess && result.Value != null)
        {
            SetRefreshTokenCookie(result.Value.RefreshToken, result.Value.ExpiresAt);
        }

        return result.ToActionResult();
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        var rawToken = Request.Cookies["refreshToken"];
        var result = await _authService.LogoutAsync(rawToken, ct);

        Response.Cookies.Delete("refreshToken");
        return result.ToActionResult();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe(CancellationToken ct)
    {
        var result = await _authService.GetCurrentUserProfileAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        var result = await _authService.ChangePasswordAsync(request, ct);
        if (result.IsSuccess)
        {
            Response.Cookies.Delete("refreshToken");
        }

        return result.ToActionResult();
    }

    private void SetRefreshTokenCookie(string token, DateTime expiresAt)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Strict,
            Expires = expiresAt
        };

        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    public record RefreshRequest(string? RefreshToken);
}
