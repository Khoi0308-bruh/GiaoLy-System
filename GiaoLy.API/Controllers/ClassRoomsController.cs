using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class ClassRoomsController : ControllerBase
{
    private readonly IClassRoomService _classRoomService;

    public ClassRoomsController(IClassRoomService classRoomService)
    {
        _classRoomService = classRoomService;
    }

    [HttpGet("api/v1/classrooms/{id:guid}")]
    [HttpGet("api/classrooms/{id:guid}")]
    [RequirePermission(Permissions.Academic.View)]
    public async Task<IActionResult> GetClassRoomById(Guid id, CancellationToken ct)
    {
        var result = await _classRoomService.GetClassRoomByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/classrooms/{id:guid}")]
    [HttpPut("api/classrooms/{id:guid}")]
    [RequirePermission(Permissions.Academic.Update)]
    public async Task<IActionResult> UpdateClassRoom(Guid id, [FromBody] UpdateClassRoomRequest request, CancellationToken ct)
    {
        var result = await _classRoomService.UpdateClassRoomAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/classrooms/{id:guid}")]
    [HttpDelete("api/classrooms/{id:guid}")]
    [RequirePermission(Permissions.Academic.Delete)]
    public async Task<IActionResult> DeleteClassRoom(Guid id, CancellationToken ct)
    {
        var result = await _classRoomService.DeleteClassRoomAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/classrooms/{id:guid}/teachers")]
    [HttpPut("api/classrooms/{id:guid}/teachers")]
    [RequirePermission(Permissions.Academic.AssignTeachers)]
    public async Task<IActionResult> AssignTeachers(Guid id, [FromBody] AssignTeachersRequest request, CancellationToken ct)
    {
        var result = await _classRoomService.AssignTeachersAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/classrooms/{id:guid}/roster")]
    [HttpGet("api/classrooms/{id:guid}/roster")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetClassRoster(Guid id, CancellationToken ct)
    {
        var result = await _classRoomService.GetClassRosterAsync(id, ct);
        return result.ToActionResult();
    }
}
