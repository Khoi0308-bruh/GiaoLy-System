using System;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Portal.Contracts;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class PortalController : ControllerBase
{
    private readonly IParentPortalService _portalService;

    public PortalController(IParentPortalService portalService)
    {
        _portalService = portalService;
    }

    [HttpGet("api/v1/portal/children")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetMyChildren(CancellationToken ct)
    {
        var result = await _portalService.GetMyChildrenAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/portal/children/{id:guid}")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetChildDetail(Guid id, CancellationToken ct)
    {
        var result = await _portalService.GetChildDetailAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/portal/children/{id:guid}/grades")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetChildGrades(Guid id, CancellationToken ct)
    {
        var result = await _portalService.GetChildGradesAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/portal/children/{id:guid}/certificates")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetChildCertificates(Guid id, CancellationToken ct)
    {
        var result = await _portalService.GetChildCertificatesAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/portal/children/{id:guid}/certificates/{certificateId:guid}/pdf")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetChildCertificatePdf(Guid id, Guid certificateId, CancellationToken ct)
    {
        var result = await _portalService.GetChildCertificatePdfAsync(id, certificateId, ct);
        if (result.IsFailure)
            return result.ToActionResult();

        var dto = result.Value!;
        return File(dto.Content, dto.ContentType, dto.FileName);
    }

    [HttpGet("api/v1/portal/announcements")]
    [RequirePermission(Permissions.Portal.ChildrenView)]
    public async Task<IActionResult> GetParentAnnouncements(CancellationToken ct)
    {
        var result = await _portalService.GetParentAnnouncementsAsync(ct);
        return result.ToActionResult();
    }
}
