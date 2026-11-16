using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class BranchesController : ControllerBase
{
    private readonly IBranchService _branchService;

    public BranchesController(IBranchService branchService)
    {
        _branchService = branchService;
    }

    [HttpGet("api/v1/branches")]
    [Authorize]
    public async Task<IActionResult> GetBranches(CancellationToken ct)
    {
        var result = await _branchService.GetBranchesAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/branches")]
    [RequirePermission(Permissions.Academic.OrgManage)]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchRequest request, CancellationToken ct)
    {
        var result = await _branchService.CreateBranchAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/branches/{id:int}")]
    [RequirePermission(Permissions.Academic.OrgManage)]
    public async Task<IActionResult> UpdateBranch(int id, [FromBody] UpdateBranchRequest request, CancellationToken ct)
    {
        var result = await _branchService.UpdateBranchAsync(id, request, ct);
        return result.ToActionResult();
    }
}
