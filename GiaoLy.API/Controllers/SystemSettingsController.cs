using System;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Application.Platform.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class SystemSettingsController : ControllerBase
{
    private readonly ISystemSettingService _systemSettingService;
    private readonly ICurrentUser _currentUser;

    public SystemSettingsController(
        ISystemSettingService systemSettingService,
        ICurrentUser currentUser)
    {
        _systemSettingService = systemSettingService;
        _currentUser = currentUser;
    }

    [HttpGet("api/v1/system/settings")]
    [RequirePermission(Permissions.Platform.SettingsView)]
    public async Task<IActionResult> GetAllSettings(CancellationToken ct)
    {
        var result = await _systemSettingService.GetAllSettingsAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/system/settings/{key}")]
    [RequirePermission(Permissions.Platform.SettingsView)]
    public async Task<IActionResult> GetSettingByKey(string key, CancellationToken ct)
    {
        var result = await _systemSettingService.GetSettingByKeyAsync(key, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/system/settings/{key}")]
    [RequirePermission(Permissions.Platform.SettingsManage)]
    public async Task<IActionResult> UpdateSetting(
        string key,
        [FromBody] UpdateSystemSettingRequest request,
        CancellationToken ct)
    {
        var result = await _systemSettingService.UpdateSettingAsync(key, request, _currentUser.UserId, ct);
        return result.ToActionResult();
    }
}
