using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Leaders.Contracts;
using GiaoLy.Application.Leaders.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class LeadersController : ControllerBase
{
    private readonly ILeaderService _leaderService;

    public LeadersController(ILeaderService leaderService)
    {
        _leaderService = leaderService;
    }

    [HttpGet("api/v1/public/leaders")]
    [HttpGet("api/Leader")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicLeaders(CancellationToken ct)
    {
        var result = await _leaderService.GetPublicLeadersAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/leaders")]
    [RequirePermission(Permissions.Leaders.View)]
    public async Task<IActionResult> GetAllLeaders(
        [FromQuery] int? branchId,
        [FromQuery] bool? isActive,
        CancellationToken ct)
    {
        var result = await _leaderService.GetAllLeadersAsync(branchId, isActive, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/leaders/{id:guid}")]
    [HttpGet("api/Leader/{id:guid}")]
    [RequirePermission(Permissions.Leaders.View)]
    public async Task<IActionResult> GetLeaderById(Guid id, CancellationToken ct)
    {
        var result = await _leaderService.GetLeaderByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/leaders")]
    [HttpPost("api/Leader")]
    [RequirePermission(Permissions.Leaders.Create)]
    public async Task<IActionResult> CreateLeader([FromBody] CreateLeaderRequest request, CancellationToken ct)
    {
        var result = await _leaderService.CreateLeaderAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/leaders/{id:guid}")]
    [HttpPut("api/Leader/{id:guid}")]
    [RequirePermission(Permissions.Leaders.Update)]
    public async Task<IActionResult> UpdateLeader(Guid id, [FromBody] UpdateLeaderRequest request, CancellationToken ct)
    {
        var result = await _leaderService.UpdateLeaderAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/leaders/{id:guid}")]
    [HttpDelete("api/Leader/{id:guid}")]
    [RequirePermission(Permissions.Leaders.Delete)]
    public async Task<IActionResult> DeleteLeader(Guid id, CancellationToken ct)
    {
        var result = await _leaderService.DeleteLeaderAsync(id, ct);
        return result.ToActionResult();
    }
}
