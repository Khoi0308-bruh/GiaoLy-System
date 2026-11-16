using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class AcademicYearsController : ControllerBase
{
    private readonly IAcademicYearService _academicYearService;
    private readonly IClassRoomService _classRoomService;

    public AcademicYearsController(
        IAcademicYearService academicYearService,
        IClassRoomService classRoomService)
    {
        _academicYearService = academicYearService;
        _classRoomService = classRoomService;
    }

    [HttpGet("api/v1/academic-years")]
    [RequirePermission(Permissions.Academic.View)]
    public async Task<IActionResult> GetAcademicYears(CancellationToken ct)
    {
        var result = await _academicYearService.GetAcademicYearsAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/academic-years/active")]
    [RequirePermission(Permissions.Academic.View)]
    public async Task<IActionResult> GetActiveAcademicYear(CancellationToken ct)
    {
        var result = await _academicYearService.GetActiveAcademicYearAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/academic-years/{id:guid}")]
    [RequirePermission(Permissions.Academic.View)]
    public async Task<IActionResult> GetAcademicYearById(Guid id, CancellationToken ct)
    {
        var result = await _academicYearService.GetAcademicYearByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years")]
    [RequirePermission(Permissions.Academic.Create)]
    public async Task<IActionResult> CreateAcademicYear([FromBody] CreateAcademicYearRequest request, CancellationToken ct)
    {
        var result = await _academicYearService.CreateAcademicYearAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/academic-years/{id:guid}")]
    [RequirePermission(Permissions.Academic.Update)]
    public async Task<IActionResult> UpdateAcademicYear(Guid id, [FromBody] UpdateAcademicYearRequest request, CancellationToken ct)
    {
        var result = await _academicYearService.UpdateAcademicYearAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/academic-years/{id:guid}")]
    [RequirePermission(Permissions.Academic.Delete)]
    public async Task<IActionResult> DeleteAcademicYear(Guid id, CancellationToken ct)
    {
        var result = await _academicYearService.DeleteAcademicYearAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{id:guid}/activate")]
    [RequirePermission(Permissions.Academic.Lifecycle)]
    public async Task<IActionResult> ActivateAcademicYear(Guid id, CancellationToken ct)
    {
        var result = await _academicYearService.ActivateAcademicYearAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{id:guid}/close")]
    [RequirePermission(Permissions.Academic.Lifecycle)]
    public async Task<IActionResult> CloseAcademicYear(Guid id, CancellationToken ct)
    {
        var result = await _academicYearService.CloseAcademicYearAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{id:guid}/archive")]
    [RequirePermission(Permissions.Academic.Lifecycle)]
    public async Task<IActionResult> ArchiveAcademicYear(Guid id, CancellationToken ct)
    {
        var result = await _academicYearService.ArchiveAcademicYearAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{id:guid}/reopen")]
    [RequirePermission(Permissions.Academic.Lifecycle)]
    public async Task<IActionResult> ReopenAcademicYear(Guid id, [FromBody] ReopenAcademicYearRequest request, CancellationToken ct)
    {
        var result = await _academicYearService.ReopenAcademicYearAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{id:guid}/clone-structure")]
    [RequirePermission(Permissions.Academic.Update)]
    public async Task<IActionResult> CloneStructure(Guid id, [FromBody] CloneStructureRequest request, CancellationToken ct)
    {
        var result = await _academicYearService.CloneStructureAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/academic-years/{yearId:guid}/classrooms")]
    [RequirePermission(Permissions.Academic.View)]
    public async Task<IActionResult> GetClassRoomsByYear(Guid yearId, CancellationToken ct)
    {
        var result = await _classRoomService.GetClassRoomsByYearAsync(yearId, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/academic-years/{yearId:guid}/classrooms")]
    [RequirePermission(Permissions.Academic.Create)]
    public async Task<IActionResult> CreateClassRoom(Guid yearId, [FromBody] CreateClassRoomRequest request, CancellationToken ct)
    {
        var result = await _classRoomService.CreateClassRoomAsync(yearId, request, ct);
        return result.ToActionResult();
    }
}
