using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Announcements.Contracts;
using GiaoLy.Application.Announcements.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementService _announcementService;

    public AnnouncementsController(IAnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

    [HttpGet("api/v1/public/announcements")]
    [HttpGet("api/public/announcements")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicAnnouncements(CancellationToken ct)
    {
        var result = await _announcementService.GetPublicAnnouncementsAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/announcements")]
    [HttpGet("api/Announcement")]
    [RequirePermission(Permissions.Announcements.View)]
    public async Task<IActionResult> GetMyAnnouncements(
        [FromQuery] int? branchId,
        [FromQuery] Guid? classRoomId,
        CancellationToken ct)
    {
        var result = await _announcementService.GetMyAnnouncementsAsync(branchId, classRoomId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/announcements/{id:guid}")]
    [HttpGet("api/Announcement/{id:guid}")]
    [RequirePermission(Permissions.Announcements.View)]
    public async Task<IActionResult> GetAnnouncementById(Guid id, CancellationToken ct)
    {
        var result = await _announcementService.GetAnnouncementByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/announcements")]
    [HttpPost("api/Announcement")]
    [RequirePermission(Permissions.Announcements.Create)]
    public async Task<IActionResult> CreateAnnouncement(
        [FromBody] CreateAnnouncementRequest request,
        CancellationToken ct)
    {
        var result = await _announcementService.CreateAnnouncementAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/announcements/{id:guid}")]
    [HttpPut("api/Announcement/{id:guid}")]
    [RequirePermission(Permissions.Announcements.Update)]
    public async Task<IActionResult> UpdateAnnouncement(
        Guid id,
        [FromBody] UpdateAnnouncementRequest request,
        CancellationToken ct)
    {
        var result = await _announcementService.UpdateAnnouncementAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/announcements/{id:guid}")]
    [HttpDelete("api/Announcement/{id:guid}")]
    [RequirePermission(Permissions.Announcements.Delete)]
    public async Task<IActionResult> DeleteAnnouncement(Guid id, CancellationToken ct)
    {
        var result = await _announcementService.DeleteAnnouncementAsync(id, ct);
        return result.ToActionResult();
    }
}
