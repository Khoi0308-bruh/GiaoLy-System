using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Imports.Contracts;
using GiaoLy.Application.Students.Contracts;
using GiaoLy.Application.Students.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Controllers;

[ApiController]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly IImportExportService _importExportService;

    public StudentsController(
        IStudentService studentService,
        IImportExportService importExportService)
    {
        _studentService = studentService;
        _importExportService = importExportService;
    }

    [HttpGet("api/v1/students")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetStudents([FromQuery] StudentFilterRequest request, CancellationToken ct)
    {
        var result = await _studentService.GetStudentsAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetStudentById(Guid id, CancellationToken ct)
    {
        var result = await _studentService.GetStudentByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students")]
    [RequirePermission(Permissions.Students.Create)]
    public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request, CancellationToken ct)
    {
        var result = await _studentService.CreateStudentAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPatch("api/v1/students/{id:guid}")]
    [RequirePermission(Permissions.Students.Update)]
    public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] UpdateStudentRequest request, CancellationToken ct)
    {
        var result = await _studentService.UpdateStudentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/{id:guid}/status")]
    [RequirePermission(Permissions.Students.ChangeStatus)]
    public async Task<IActionResult> ChangeStudentStatus(Guid id, [FromBody] ChangeStudentStatusRequest request, CancellationToken ct)
    {
        var result = await _studentService.ChangeStudentStatusAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/students/{id:guid}")]
    [RequirePermission(Permissions.Students.Delete)]
    public async Task<IActionResult> DeleteStudent(Guid id, CancellationToken ct)
    {
        var result = await _studentService.DeleteStudentAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/{id:guid}/restore")]
    [RequirePermission(Permissions.Students.Restore)]
    public async Task<IActionResult> RestoreStudent(Guid id, CancellationToken ct)
    {
        var result = await _studentService.RestoreStudentAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/{id:guid}/photo")]
    [RequirePermission(Permissions.Students.Update)]
    [EnableRateLimiting("upload")]
    [RequestSizeLimit(2 * 1024 * 1024)]
    public async Task<IActionResult> UploadPhoto(Guid id, IFormFile? file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation Failed",
                Detail = "Vui lòng chọn tệp hình ảnh để tải lên."
            });
        }

        using var stream = file.OpenReadStream();
        var result = await _studentService.UploadPhotoAsync(id, stream, file.FileName, file.ContentType, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}/guardians")]
    [RequirePermission(Permissions.Students.ViewContact)]
    public async Task<IActionResult> GetStudentGuardians(Guid id, CancellationToken ct)
    {
        var result = await _studentService.GetStudentGuardiansAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/students/{id:guid}/guardians")]
    [RequirePermission(Permissions.Students.Update)]
    public async Task<IActionResult> UpdateStudentGuardians(Guid id, [FromBody] List<GuardianDto> guardians, CancellationToken ct)
    {
        var result = await _studentService.UpdateStudentGuardiansAsync(id, guardians, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}/notes")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetStudentNotes(Guid id, CancellationToken ct)
    {
        var result = await _studentService.GetStudentNotesAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/{id:guid}/notes")]
    [RequirePermission(Permissions.Students.NotesWrite)]
    public async Task<IActionResult> CreateStudentNote(Guid id, [FromBody] CreateStudentNoteRequest request, CancellationToken ct)
    {
        var result = await _studentService.CreateStudentNoteAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/student-notes/{noteId:guid}")]
    [RequirePermission(Permissions.Students.NotesWrite)]
    public async Task<IActionResult> DeleteStudentNote(Guid noteId, CancellationToken ct)
    {
        var result = await _studentService.DeleteStudentNoteAsync(noteId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/{id:guid}/history")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetStudentHistory(Guid id, CancellationToken ct)
    {
        var result = await _studentService.GetStudentHistoryAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/students/duplicates/check")]
    [RequirePermission(Permissions.Students.Create)]
    public async Task<IActionResult> CheckDuplicate([FromBody] CheckDuplicateRequest request, CancellationToken ct)
    {
        var result = await _studentService.CheckDuplicateAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/unassigned")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetUnassignedStudents(CancellationToken ct)
    {
        var result = await _studentService.GetUnassignedStudentsAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/stats")]
    [RequirePermission(Permissions.Students.View)]
    public async Task<IActionResult> GetStudentStats(CancellationToken ct)
    {
        var result = await _studentService.GetStudentStatsAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/students/export")]
    [RequirePermission(Permissions.Students.Export)]
    [EnableRateLimiting("export")]
    public async Task<IActionResult> ExportStudents(
        [FromQuery] int? branchId,
        [FromQuery] Guid? classRoomId,
        [FromQuery] string? status,
        CancellationToken ct)
    {
        var result = await _importExportService.ExportStudentsAsync(branchId, classRoomId, status, ct);
        if (result.IsFailure)
        {
            return result.ToActionResult();
        }

        var file = result.Value!;
        return File(file.Content, file.ContentType, file.FileName);
    }
}
