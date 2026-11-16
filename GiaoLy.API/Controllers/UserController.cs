using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [RequirePermission(Permissions.Users.View)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? role = null,
        [FromQuery] int? branchId = null,
        [FromQuery] bool? isActive = null,
        CancellationToken ct = default)
    {
        var paging = new PagingRequest { Page = page, PageSize = pageSize, Search = search };
        var result = await _userService.GetUsersAsync(paging, role, branchId, isActive, ct);
        return result.ToActionResult();
    }

    [HttpGet("{id:guid}")]
    [RequirePermission(Permissions.Users.View)]
    public async Task<IActionResult> GetUserById(Guid id, CancellationToken ct)
    {
        var result = await _userService.GetUserByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost]
    [RequirePermission(Permissions.Users.Create)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request, CancellationToken ct)
    {
        var result = await _userService.CreateUserAsync(request, ct);
        if (result.IsSuccess && result.Value.User != null)
        {
            return CreatedAtAction(nameof(GetUserById), new { id = result.Value.User.Id }, new
            {
                user = result.Value.User,
                temporaryPassword = result.Value.TemporaryPassword
            });
        }

        return result.ToActionResult();
    }

    [HttpPut("{id:guid}")]
    [RequirePermission(Permissions.Users.Update)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request, CancellationToken ct)
    {
        var result = await _userService.UpdateUserAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPut("{id:guid}/role")]
    [RequirePermission(Permissions.Users.AssignRole)]
    public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequest request, CancellationToken ct)
    {
        var result = await _userService.AssignRoleAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/reset-password")]
    [RequirePermission(Permissions.Users.ResetPassword)]
    public async Task<IActionResult> ResetPassword(Guid id, CancellationToken ct)
    {
        var result = await _userService.ResetPasswordAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/deactivate")]
    [RequirePermission(Permissions.Users.Delete)]
    public async Task<IActionResult> Deactivate(Guid id, CancellationToken ct)
    {
        var result = await _userService.DeactivateUserAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/activate")]
    [RequirePermission(Permissions.Users.Update)]
    public async Task<IActionResult> Activate(Guid id, CancellationToken ct)
    {
        var result = await _userService.ActivateUserAsync(id, ct);
        return result.ToActionResult();
    }
}
