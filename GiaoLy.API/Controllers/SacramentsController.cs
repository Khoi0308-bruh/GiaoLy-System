using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Sacraments.Contracts;
using GiaoLy.Application.Sacraments.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class SacramentsController : ControllerBase
{
    private readonly ISacramentService _sacramentService;

    public SacramentsController(ISacramentService sacramentService)
    {
        _sacramentService = sacramentService;
    }

    [HttpGet("api/v1/students/{id:guid}/sacraments")]
    [HttpGet("api/students/{id:guid}/sacraments")]
    [RequirePermission(Permissions.Sacraments.View)]
    public async Task<IActionResult> GetStudentSacraments(Guid id, CancellationToken ct)
    {
        var result = await _sacramentService.GetStudentSacramentsAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/students/{id:guid}/sacraments/{type}")]
    [HttpPut("api/students/{id:guid}/sacraments/{type}")]
    [RequirePermission(Permissions.Sacraments.Update)]
    public async Task<IActionResult> UpsertStudentSacrament(
        Guid id,
        string type,
        [FromBody] UpsertSacramentRequest request,
        CancellationToken ct)
    {
        var result = await _sacramentService.UpsertStudentSacramentAsync(id, type, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/students/{id:guid}/sacraments/{type}")]
    [HttpDelete("api/students/{id:guid}/sacraments/{type}")]
    [RequirePermission(Permissions.Sacraments.Update)]
    public async Task<IActionResult> DeleteStudentSacrament(Guid id, string type, CancellationToken ct)
    {
        var result = await _sacramentService.DeleteStudentSacramentAsync(id, type, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/sacrament-requirements")]
    [HttpGet("api/sacrament-requirements")]
    [RequirePermission(Permissions.Sacraments.View)]
    public async Task<IActionResult> GetRequirements([FromQuery] string? sacramentType, CancellationToken ct)
    {
        var result = await _sacramentService.GetSacramentRequirementsAsync(sacramentType, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/sacrament-requirements")]
    [HttpPost("api/sacrament-requirements")]
    [RequirePermission(Permissions.Sacraments.ManageRequirements)]
    public async Task<IActionResult> CreateRequirement(
        [FromBody] CreateSacramentRequirementRequest request,
        CancellationToken ct)
    {
        var result = await _sacramentService.CreateSacramentRequirementAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/sacrament-requirements/{id:guid}")]
    [HttpPut("api/sacrament-requirements/{id:guid}")]
    [RequirePermission(Permissions.Sacraments.ManageRequirements)]
    public async Task<IActionResult> UpdateRequirement(
        Guid id,
        [FromBody] UpdateSacramentRequirementRequest request,
        CancellationToken ct)
    {
        var result = await _sacramentService.UpdateSacramentRequirementAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}/requirement-progress")]
    [HttpGet("api/students/{id:guid}/requirement-progress")]
    [RequirePermission(Permissions.Sacraments.View)]
    public async Task<IActionResult> GetRequirementProgress(
        Guid id,
        [FromQuery] string? sacramentType,
        CancellationToken ct)
    {
        var result = await _sacramentService.GetStudentRequirementProgressAsync(id, sacramentType, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/students/{id:guid}/requirement-progress/{requirementId:guid}")]
    [HttpPut("api/students/{id:guid}/requirement-progress/{requirementId:guid}")]
    [RequirePermission(Permissions.Sacraments.Update)]
    public async Task<IActionResult> UpdateRequirementProgress(
        Guid id,
        Guid requirementId,
        [FromBody] UpdateRequirementProgressRequest request,
        CancellationToken ct)
    {
        var result = await _sacramentService.UpdateStudentRequirementProgressAsync(id, requirementId, request, ct);
        return result.ToActionResult();
    }
}
