using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Duty.Contracts;
using GiaoLy.Application.Duty.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class DutyAssignmentsController : ControllerBase
{
    private readonly IDutyService _dutyService;

    public DutyAssignmentsController(IDutyService dutyService)
    {
        _dutyService = dutyService;
    }

    [HttpGet("api/v1/duty-assignments")]
    [HttpGet("api/DutyAssignment")]
    [RequirePermission(Permissions.Duty.View)]
    public async Task<IActionResult> GetAssignments(
        [FromQuery] Guid? classRoomId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] Guid? userId,
        CancellationToken ct)
    {
        var result = await _dutyService.GetAssignmentsAsync(classRoomId, fromDate, toDate, userId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/duty-assignments/classroom/{classRoomId:guid}")]
    [HttpGet("api/DutyAssignment/classroom/{classRoomId:guid}")]
    [RequirePermission(Permissions.Duty.View)]
    public async Task<IActionResult> GetByClassRoom(Guid classRoomId, CancellationToken ct)
    {
        var result = await _dutyService.GetAssignmentsAsync(classRoomId, null, null, null, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/duty-assignments/{id:guid}")]
    [HttpGet("api/DutyAssignment/{id:guid}")]
    [RequirePermission(Permissions.Duty.View)]
    public async Task<IActionResult> GetAssignmentById(Guid id, CancellationToken ct)
    {
        var result = await _dutyService.GetAssignmentByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/duty-assignments")]
    [HttpPost("api/DutyAssignment")]
    [RequirePermission(Permissions.Duty.Manage)]
    public async Task<IActionResult> CreateAssignment([FromBody] CreateDutyAssignmentRequest request, CancellationToken ct)
    {
        var result = await _dutyService.CreateAssignmentAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/duty-assignments/{id:guid}")]
    [HttpPut("api/DutyAssignment/{id:guid}")]
    [RequirePermission(Permissions.Duty.Manage)]
    public async Task<IActionResult> UpdateAssignment(Guid id, [FromBody] UpdateDutyAssignmentRequest request, CancellationToken ct)
    {
        var result = await _dutyService.UpdateAssignmentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/duty-assignments/{id:guid}")]
    [HttpDelete("api/DutyAssignment/{id:guid}")]
    [RequirePermission(Permissions.Duty.Manage)]
    public async Task<IActionResult> DeleteAssignment(Guid id, CancellationToken ct)
    {
        var result = await _dutyService.DeleteAssignmentAsync(id, ct);
        return result.ToActionResult();
    }
}
