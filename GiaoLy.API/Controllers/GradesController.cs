using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Grades.Contracts;
using GiaoLy.Application.Grades.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class GradesController : ControllerBase
{
    private readonly IGradeService _gradeService;

    public GradesController(IGradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpGet("api/v1/classrooms/{id:guid}/grades")]
    [RequirePermission(Permissions.Grades.View)]
    public async Task<IActionResult> GetClassRoomGrades(Guid id, CancellationToken ct)
    {
        var result = await _gradeService.GetClassRoomGradesAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/classrooms/{id:guid}/grades")]
    [RequirePermission(Permissions.Grades.Update)]
    public async Task<IActionResult> UpdateClassRoomGrades(
        Guid id,
        [FromBody] BulkUpdateGradesRequest request,
        CancellationToken ct)
    {
        var result = await _gradeService.UpdateClassRoomGradesAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/enrollments/{id:guid}/grade")]
    [RequirePermission(Permissions.Grades.View)]
    public async Task<IActionResult> GetEnrollmentGrade(Guid id, CancellationToken ct)
    {
        var result = await _gradeService.GetEnrollmentGradeAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/classrooms/{id:guid}/grade-unlocks")]
    [RequirePermission(Permissions.Grades.Unlock)]
    public async Task<IActionResult> CreateGradeUnlock(
        Guid id,
        [FromBody] CreateGradeUnlockRequest request,
        CancellationToken ct)
    {
        var result = await _gradeService.CreateGradeUnlockAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/classrooms/{id:guid}/grade-unlocks")]
    [RequirePermission(Permissions.Grades.View)]
    public async Task<IActionResult> GetGradeUnlocks(Guid id, CancellationToken ct)
    {
        var result = await _gradeService.GetGradeUnlocksAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/classrooms/{id:guid}/grades/export")]
    [RequirePermission(Permissions.Grades.Export)]
    public async Task<IActionResult> ExportClassRoomGrades(Guid id, CancellationToken ct)
    {
        var result = await _gradeService.ExportClassRoomGradesAsync(id, ct);
        if (!result.IsSuccess)
        {
            return result.ToActionResult();
        }

        var file = result.Value!;
        return File(file.Content, file.ContentType, file.FileName);
    }
}
