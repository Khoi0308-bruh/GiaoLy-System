using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Liturgical.Contracts;
using GiaoLy.Application.Liturgical.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class LiturgicalController : ControllerBase
{
    private readonly ILiturgicalService _liturgicalService;

    public LiturgicalController(ILiturgicalService liturgicalService)
    {
        _liturgicalService = liturgicalService;
    }

    [HttpGet("api/v1/public/liturgical/today")]
    [HttpGet("api/Liturgical/today")]
    [AllowAnonymous]
    public async Task<IActionResult> GetToday(CancellationToken ct)
    {
        var result = await _liturgicalService.GetTodayAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/public/liturgical/date/{date}")]
    [HttpGet("api/Liturgical/{date}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByDate(string date, CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
        {
            return BadRequest(new { message = "Định dạng ngày không hợp lệ. Vui lòng dùng yyyy-MM-dd" });
        }

        var result = await _liturgicalService.GetByDateAsync(parsedDate, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/public/liturgical/month/{year:int}/{month:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetMonth(int year, int month, CancellationToken ct)
    {
        if (month < 1 || month > 12)
        {
            return BadRequest(new { message = "Tháng phải từ 1 đến 12" });
        }

        var result = await _liturgicalService.GetMonthAsync(year, month, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/liturgical")]
    [RequirePermission(Permissions.Liturgical.View)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? year,
        [FromQuery] int? month,
        CancellationToken ct)
    {
        var result = await _liturgicalService.GetAllAsync(year, month, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/liturgical/{date}")]
    [RequirePermission(Permissions.Liturgical.Update)]
    public async Task<IActionResult> OverrideDay(
        string date,
        [FromBody] OverrideLiturgicalDayRequest request,
        CancellationToken ct)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
        {
            return BadRequest(new { message = "Định dạng ngày không hợp lệ. Vui lòng dùng yyyy-MM-dd" });
        }

        var result = await _liturgicalService.OverrideDayAsync(parsedDate, request, ct);
        return result.ToActionResult();
    }
}
