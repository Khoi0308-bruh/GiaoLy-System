using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class ClassLevelsController : ControllerBase
{
    private readonly IClassLevelService _classLevelService;

    public ClassLevelsController(IClassLevelService classLevelService)
    {
        _classLevelService = classLevelService;
    }

    [HttpGet("api/v1/class-levels")]
    [HttpGet("api/class-levels")]
    [Authorize]
    public async Task<IActionResult> GetClassLevels(CancellationToken ct)
    {
        var result = await _classLevelService.GetClassLevelsAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/class-levels")]
    [HttpPost("api/class-levels")]
    [RequirePermission(Permissions.Academic.OrgManage)]
    public async Task<IActionResult> CreateClassLevel([FromBody] CreateClassLevelRequest request, CancellationToken ct)
    {
        var result = await _classLevelService.CreateClassLevelAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/class-levels/{id:int}")]
    [HttpPut("api/class-levels/{id:int}")]
    [RequirePermission(Permissions.Academic.OrgManage)]
    public async Task<IActionResult> UpdateClassLevel(int id, [FromBody] UpdateClassLevelRequest request, CancellationToken ct)
    {
        var result = await _classLevelService.UpdateClassLevelAsync(id, request, ct);
        return result.ToActionResult();
    }
}
