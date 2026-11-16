using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Camps.Contracts;
using GiaoLy.Application.Camps.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class CampsController : ControllerBase
{
    private readonly ICampService _campService;

    public CampsController(ICampService campService)
    {
        _campService = campService;
    }

    [HttpGet("api/v1/camps")]
    [RequirePermission(Permissions.Camps.View)]
    public async Task<IActionResult> GetEvents(
        [FromQuery] int? branchId,
        [FromQuery] Guid? academicYearId,
        CancellationToken ct)
    {
        var result = await _campService.GetEventsAsync(branchId, academicYearId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/camps/{id:guid}")]
    [RequirePermission(Permissions.Camps.View)]
    public async Task<IActionResult> GetEventById(Guid id, CancellationToken ct)
    {
        var result = await _campService.GetEventByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/camps")]
    [RequirePermission(Permissions.Camps.Manage)]
    public async Task<IActionResult> CreateEvent([FromBody] CreateCampEventRequest request, CancellationToken ct)
    {
        var result = await _campService.CreateEventAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/camps/{id:guid}")]
    [RequirePermission(Permissions.Camps.Manage)]
    public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] UpdateCampEventRequest request, CancellationToken ct)
    {
        var result = await _campService.UpdateEventAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/camps/{id:guid}")]
    [RequirePermission(Permissions.Camps.Manage)]
    public async Task<IActionResult> DeleteEvent(Guid id, CancellationToken ct)
    {
        var result = await _campService.DeleteEventAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/camps/{id:guid}/registrations")]
    [RequirePermission(Permissions.Camps.View)]
    public async Task<IActionResult> GetRegistrations(Guid id, CancellationToken ct)
    {
        var result = await _campService.GetRegistrationsAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/camps/{id:guid}/registrations")]
    [RequirePermission(Permissions.Camps.Register)]
    public async Task<IActionResult> RegisterStudent(Guid id, [FromBody] CreateCampRegistrationRequest request, CancellationToken ct)
    {
        var result = await _campService.RegisterStudentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/camps/{id:guid}/registrations/{registrationId:guid}")]
    [RequirePermission(Permissions.Camps.Register)]
    public async Task<IActionResult> UpdateRegistration(
        Guid id,
        Guid registrationId,
        [FromBody] UpdateCampRegistrationRequest request,
        CancellationToken ct)
    {
        var result = await _campService.UpdateRegistrationAsync(id, registrationId, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/camps/{id:guid}/registrations/{registrationId:guid}")]
    [RequirePermission(Permissions.Camps.Register)]
    public async Task<IActionResult> CancelRegistration(Guid id, Guid registrationId, CancellationToken ct)
    {
        var result = await _campService.CancelRegistrationAsync(id, registrationId, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/camps/registrations/{registrationId:guid}/payments")]
    [RequirePermission(Permissions.Camps.Collect)]
    public async Task<IActionResult> RecordPayment(
        Guid registrationId,
        [FromBody] RecordCampPaymentRequest request,
        CancellationToken ct)
    {
        var result = await _campService.RecordPaymentAsync(registrationId, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/camps/payments/{id:guid}/reverse")]
    [RequirePermission(Permissions.Camps.Collect)]
    public async Task<IActionResult> ReversePayment(
        Guid id,
        [FromBody] ReverseCampPaymentRequest request,
        CancellationToken ct)
    {
        var result = await _campService.ReversePaymentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/camps/{id:guid}/finance")]
    [RequirePermission(Permissions.Camps.Collect)]
    public async Task<IActionResult> GetFinanceSummary(Guid id, CancellationToken ct)
    {
        var result = await _campService.GetFinanceSummaryAsync(id, ct);
        return result.ToActionResult();
    }
}
