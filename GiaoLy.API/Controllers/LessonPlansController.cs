using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.LessonPlans.Contracts;
using GiaoLy.Application.LessonPlans.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class LessonPlansController : ControllerBase
{
    private readonly ILessonPlanService _lessonPlanService;

    public LessonPlansController(ILessonPlanService lessonPlanService)
    {
        _lessonPlanService = lessonPlanService;
    }

    [HttpGet("api/v1/lesson-plans")]
    [RequirePermission(Permissions.LessonPlans.View)]
    public async Task<IActionResult> GetLessonPlans(
        [FromQuery] Guid? classRoomId,
        [FromQuery] int? branchId,
        [FromQuery] string? visibility,
        CancellationToken ct)
    {
        var result = await _lessonPlanService.GetLessonPlansAsync(classRoomId, branchId, visibility, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/lesson-plans/{id:guid}")]
    [RequirePermission(Permissions.LessonPlans.View)]
    public async Task<IActionResult> GetLessonPlanById(Guid id, CancellationToken ct)
    {
        var result = await _lessonPlanService.GetLessonPlanByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/lesson-plans")]
    [RequirePermission(Permissions.LessonPlans.Manage)]
    public async Task<IActionResult> CreateLessonPlan([FromBody] CreateLessonPlanRequest request, CancellationToken ct)
    {
        var result = await _lessonPlanService.CreateLessonPlanAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/lesson-plans/{id:guid}")]
    [RequirePermission(Permissions.LessonPlans.Manage)]
    public async Task<IActionResult> UpdateLessonPlan(
        Guid id,
        [FromBody] UpdateLessonPlanRequest request,
        CancellationToken ct)
    {
        var result = await _lessonPlanService.UpdateLessonPlanAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/lesson-plans/{id:guid}")]
    [RequirePermission(Permissions.LessonPlans.Manage)]
    public async Task<IActionResult> DeleteLessonPlan(Guid id, CancellationToken ct)
    {
        var result = await _lessonPlanService.DeleteLessonPlanAsync(id, ct);
        return result.ToActionResult();
    }
}
