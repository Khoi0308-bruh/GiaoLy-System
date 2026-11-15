using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace GiaoLy.API.Controllers;

[ApiController]
public class JobsController : ControllerBase
{
    private readonly IBackgroundJobService _jobService;
    private readonly ICurrentUser _currentUser;
    private readonly IPermissionProvider _permissionProvider;
    private readonly IConfiguration _config;

    public JobsController(
        IBackgroundJobService jobService,
        ICurrentUser currentUser,
        IPermissionProvider permissionProvider,
        IConfiguration config)
    {
        _jobService = jobService;
        _currentUser = currentUser;
        _permissionProvider = permissionProvider;
        _config = config;
    }

    [HttpGet("api/v1/system/jobs")]
    [RequirePermission(Permissions.Platform.JobsView)]
    public async Task<IActionResult> GetJobs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? jobName = null,
        CancellationToken ct = default)
    {
        var result = await _jobService.GetJobRunsAsync(page, pageSize, jobName, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/system/jobs/{name}/run")]
    [AllowAnonymous]
    public async Task<IActionResult> RunJob(string name, CancellationToken ct)
    {
        // 1. Check X-Service-Key header for external scheduler/cron.
        // Fail-closed: nếu chưa cấu hình khoá thì từ chối chạy, KHÔNG dùng khoá dự phòng hard-code.
        var configuredKey = _config["App:ServiceKey"] ?? _config["Security:ServiceKey"];
        if (string.IsNullOrWhiteSpace(configuredKey))
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                message = "Tác vụ nền chưa được cấu hình khoá dịch vụ (App:ServiceKey)."
            });
        }

        if (Request.Headers.TryGetValue("X-Service-Key", out var providedKey) &&
            SecretsMatch(providedKey.ToString(), configuredKey))
        {
            var cronResult = await _jobService.RunJobAsync(name, "ExternalCron", ct);
            return cronResult.ToActionResult();
        }

        // 2. Otherwise verify user authentication & permission
        if (_currentUser.UserId == null)
        {
            return Unauthorized(new { message = "Yêu cầu đăng nhập hoặc cung cấp X-Service-Key hợp lệ." });
        }

        if (_currentUser.RoleId.HasValue)
        {
            var permissions = await _permissionProvider.GetPermissionsForRoleAsync(_currentUser.RoleId.Value, ct);
            if (!permissions.Contains(Permissions.Platform.JobsRun))
            {
                return Forbid();
            }
        }
        else
        {
            return Forbid();
        }

        var userResult = await _jobService.RunJobAsync(name, _currentUser.UserName ?? _currentUser.UserId.Value.ToString(), ct);
        return userResult.ToActionResult();
    }

    /// <summary>
    /// So sánh khoá dịch vụ theo thời gian hằng định (hash trước để không lộ độ dài).
    /// </summary>
    private static bool SecretsMatch(string provided, string expected)
    {
        if (string.IsNullOrEmpty(provided)) return false;

        var providedHash = SHA256.HashData(Encoding.UTF8.GetBytes(provided));
        var expectedHash = SHA256.HashData(Encoding.UTF8.GetBytes(expected));

        return CryptographicOperations.FixedTimeEquals(providedHash, expectedHash);
    }
}
