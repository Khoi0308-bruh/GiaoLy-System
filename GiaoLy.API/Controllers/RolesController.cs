using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet("api/v1/roles")]
    [HttpGet("api/roles")]
    [RequirePermission(Permissions.Roles.View)]
    public async Task<IActionResult> GetRoles(CancellationToken ct)
    {
        var result = await _roleService.GetRolesAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/roles")]
    [HttpPost("api/roles")]
    [RequirePermission(Permissions.Roles.Create)]
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request, CancellationToken ct)
    {
        var result = await _roleService.CreateRoleAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/roles/{id:guid}")]
    [HttpPut("api/roles/{id:guid}")]
    [RequirePermission(Permissions.Roles.Update)]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateRoleRequest request, CancellationToken ct)
    {
        var result = await _roleService.UpdateRoleAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/roles/{id:guid}")]
    [HttpDelete("api/roles/{id:guid}")]
    [RequirePermission(Permissions.Roles.Delete)]
    public async Task<IActionResult> DeleteRole(Guid id, CancellationToken ct)
    {
        var result = await _roleService.DeleteRoleAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/permissions")]
    [HttpGet("api/permissions")]
    [RequirePermission(Permissions.Roles.View)]
    public async Task<IActionResult> GetPermissions(CancellationToken ct)
    {
        var result = await _roleService.GetPermissionsAsync(ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/roles/{id:guid}/permissions")]
    [HttpPut("api/roles/{id:guid}/permissions")]
    [RequirePermission(Permissions.Roles.Assign)]
    public async Task<IActionResult> AssignPermissions(Guid id, [FromBody] AssignPermissionsRequest request, CancellationToken ct)
    {
        var result = await _roleService.AssignPermissionsAsync(id, request, ct);
        return result.ToActionResult();
    }
}
