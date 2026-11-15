using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Bouquets.Contracts;
using GiaoLy.Application.Bouquets.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class BouquetsController : ControllerBase
{
    private readonly IBouquetService _bouquetService;

    public BouquetsController(IBouquetService bouquetService)
    {
        _bouquetService = bouquetService;
    }

    [HttpGet("api/v1/classrooms/{classRoomId:guid}/bouquets")]
    [HttpGet("api/SpiritualBouquet/classroom/{classRoomId:guid}")]
    [RequirePermission(Permissions.Bouquets.View)]
    public async Task<IActionResult> GetClassBouquets(Guid classRoomId, CancellationToken ct)
    {
        var result = await _bouquetService.GetClassBouquetsAsync(classRoomId, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/classrooms/{classRoomId:guid}/bouquets")]
    [RequirePermission(Permissions.Bouquets.Give)]
    public async Task<IActionResult> RecordBouquet(
        Guid classRoomId,
        [FromBody] RecordBouquetRequest request,
        CancellationToken ct)
    {
        var result = await _bouquetService.RecordBouquetAsync(classRoomId, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/bouquets/{id:guid}/reverse")]
    [RequirePermission(Permissions.Bouquets.Manage)]
    public async Task<IActionResult> ReverseBouquet(
        Guid id,
        [FromBody] ReverseBouquetRequest request,
        CancellationToken ct)
    {
        var result = await _bouquetService.ReverseBouquetAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/classrooms/{classRoomId:guid}/bouquets/leaderboard")]
    [RequirePermission(Permissions.Bouquets.View)]
    public async Task<IActionResult> GetLeaderboard(Guid classRoomId, CancellationToken ct)
    {
        var result = await _bouquetService.GetLeaderboardAsync(classRoomId, ct);
        return result.ToActionResult();
    }
}
