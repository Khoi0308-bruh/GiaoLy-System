using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/v1/guardian-links")]
public class GuardianLinksController : ControllerBase
{
    private readonly IGuardianLinkService _guardianLinkService;

    public GuardianLinksController(IGuardianLinkService guardianLinkService)
    {
        _guardianLinkService = guardianLinkService;
    }

    [HttpGet]
    [RequirePermission(Permissions.Students.GuardiansLink)]
    public async Task<IActionResult> GetGuardianLinks([FromQuery] Guid? studentId, CancellationToken ct)
    {
        var result = await _guardianLinkService.GetGuardianLinksAsync(studentId, ct);
        return result.ToActionResult();
    }

    [HttpPost]
    [RequirePermission(Permissions.Students.GuardiansLink)]
    public async Task<IActionResult> CreateGuardianLink([FromBody] CreateGuardianLinkRequest request, CancellationToken ct)
    {
        var result = await _guardianLinkService.CreateGuardianLinkAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("{id:guid}")]
    [RequirePermission(Permissions.Students.GuardiansLink)]
    public async Task<IActionResult> DeleteGuardianLink(Guid id, CancellationToken ct)
    {
        var result = await _guardianLinkService.DeleteGuardianLinkAsync(id, ct);
        return result.ToActionResult();
    }
}
