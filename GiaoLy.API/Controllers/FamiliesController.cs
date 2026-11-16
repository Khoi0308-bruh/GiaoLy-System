using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class FamiliesController : ControllerBase
{
    private readonly IFamilyService _familyService;

    public FamiliesController(IFamilyService familyService)
    {
        _familyService = familyService;
    }

    [HttpGet("api/v1/families")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetFamilies([FromQuery] Guid? classRoomId, CancellationToken ct)
    {
        var result = await _familyService.GetFamiliesAsync(classRoomId, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/families")]
    [RequirePermission(Permissions.Academic.FamiliesManage)]
    public async Task<IActionResult> CreateFamily([FromBody] CreateFamilyRequest request, CancellationToken ct)
    {
        var result = await _familyService.CreateFamilyAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/families/{id:guid}")]
    [RequirePermission(Permissions.Academic.FamiliesManage)]
    public async Task<IActionResult> UpdateFamily(Guid id, [FromBody] UpdateFamilyRequest request, CancellationToken ct)
    {
        var result = await _familyService.UpdateFamilyAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/families/{id:guid}")]
    [RequirePermission(Permissions.Academic.FamiliesManage)]
    public async Task<IActionResult> DeleteFamily(Guid id, CancellationToken ct)
    {
        var result = await _familyService.DeleteFamilyAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/families/{id:guid}/members")]
    [RequirePermission(Permissions.Academic.FamiliesManage)]
    public async Task<IActionResult> AssignFamilyMembers(Guid id, [FromBody] AssignFamilyMembersRequest request, CancellationToken ct)
    {
        var result = await _familyService.AssignFamilyMembersAsync(id, request, ct);
        return result.ToActionResult();
    }
}
