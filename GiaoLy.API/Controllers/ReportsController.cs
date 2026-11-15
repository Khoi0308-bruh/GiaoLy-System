using System;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Reports.Contracts;
using GiaoLy.Application.Reports.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("api/v1/reports/dashboard")]
    [RequirePermission(Permissions.Reports.View)]
    public async Task<IActionResult> GetDashboard(CancellationToken ct)
    {
        var result = await _reportService.GetDashboardAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/reports/students-by-branch")]
    [RequirePermission(Permissions.Reports.View)]
    public async Task<IActionResult> GetStudentsByBranch([FromQuery] Guid? academicYearId, CancellationToken ct)
    {
        var result = await _reportService.GetStudentsByBranchAsync(academicYearId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/reports/missing-data")]
    [RequirePermission(Permissions.Reports.View)]
    public async Task<IActionResult> GetMissingData(
        [FromQuery] int? branchId,
        [FromQuery] Guid? classRoomId,
        CancellationToken ct)
    {
        var result = await _reportService.GetMissingDataAsync(branchId, classRoomId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/reports/promotion-summary")]
    [RequirePermission(Permissions.Reports.View)]
    public async Task<IActionResult> GetPromotionSummary(
        [FromQuery] Guid? academicYearId,
        [FromQuery] int? branchId,
        CancellationToken ct)
    {
        var result = await _reportService.GetPromotionSummaryAsync(academicYearId, branchId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/reports/grades-summary")]
    [RequirePermission(Permissions.Reports.View)]
    public async Task<IActionResult> GetGradesSummary(
        [FromQuery] Guid? academicYearId,
        [FromQuery] Guid? classRoomId,
        CancellationToken ct)
    {
        var result = await _reportService.GetGradesSummaryAsync(academicYearId, classRoomId, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/reports/export")]
    [RequirePermission(Permissions.Reports.Export)]
    public async Task<IActionResult> ExportReport([FromBody] ExportReportRequest request, CancellationToken ct)
    {
        var result = await _reportService.ExportReportAsync(request, ct);
        if (result.IsFailure)
            return result.ToActionResult();

        var dto = result.Value!;
        return File(dto.Content, dto.ContentType, dto.FileName);
    }
}
