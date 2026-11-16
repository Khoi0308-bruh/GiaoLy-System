using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Enrollments.Contracts;
using GiaoLy.Application.Enrollments.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    [HttpGet("api/v1/classrooms/{id:guid}/enrollments")]
    [RequirePermission(Permissions.Enrollments.View)]
    public async Task<IActionResult> GetClassRoomEnrollments(Guid id, CancellationToken ct)
    {
        var result = await _enrollmentService.GetClassRoomEnrollmentsAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/classrooms/{id:guid}/enrollments")]
    [RequirePermission(Permissions.Enrollments.Manage)]
    public async Task<IActionResult> EnrollStudents(
        Guid id,
        [FromBody] EnrollStudentsRequest request,
        CancellationToken ct)
    {
        var result = await _enrollmentService.EnrollStudentsAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/enrollments/{id:guid}/transfer")]
    [RequirePermission(Permissions.Enrollments.Manage)]
    public async Task<IActionResult> TransferEnrollment(
        Guid id,
        [FromBody] TransferEnrollmentRequest request,
        CancellationToken ct)
    {
        var result = await _enrollmentService.TransferEnrollmentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/enrollments/{id:guid}/withdraw")]
    [RequirePermission(Permissions.Enrollments.Manage)]
    public async Task<IActionResult> WithdrawEnrollment(
        Guid id,
        [FromBody] WithdrawEnrollmentRequest request,
        CancellationToken ct)
    {
        var result = await _enrollmentService.WithdrawEnrollmentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}/enrollments")]
    [RequirePermission(Permissions.Enrollments.View)]
    public async Task<IActionResult> GetStudentEnrollments(Guid id, CancellationToken ct)
    {
        var result = await _enrollmentService.GetStudentEnrollmentsAsync(id, ct);
        return result.ToActionResult();
    }
}
