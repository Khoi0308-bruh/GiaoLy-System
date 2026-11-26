using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Imports.Contracts;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GiaoLy.API.Controllers;

[ApiController]
public class ImportsController : ControllerBase
{
    private readonly IImportExportService _importExportService;

    public ImportsController(IImportExportService importExportService)
    {
        _importExportService = importExportService;
    }

    [HttpGet("api/v1/imports/students/template")]
    [RequirePermission(Permissions.Students.Import)]
    public async Task<IActionResult> DownloadStudentTemplate(CancellationToken ct)
    {
        var result = await _importExportService.DownloadStudentTemplateAsync(ct);
        if (result.IsFailure)
        {
            return result.ToActionResult();
        }

        var file = result.Value!;
        return File(file.Content, file.ContentType, file.FileName);
    }

    [HttpPost("api/v1/imports/students")]
    [RequirePermission(Permissions.Students.Import)]
    [EnableRateLimiting("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> UploadAndValidateStudents(IFormFile? file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation Failed",
                Detail = "Vui lòng chọn tệp Excel (.xlsx) để tải lên."
            });
        }

        using var stream = file.OpenReadStream();
        var result = await _importExportService.UploadAndValidateStudentsAsync(stream, file.FileName, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/imports/{id:guid}")]
    [RequirePermission(Permissions.Students.Import)]
    public async Task<IActionResult> GetImportJob(Guid id, CancellationToken ct)
    {
        var result = await _importExportService.GetImportJobByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/imports/{id:guid}/apply")]
    [RequirePermission(Permissions.Students.Import)]
    public async Task<IActionResult> ApplyImportJob(Guid id, CancellationToken ct)
    {
        var result = await _importExportService.ApplyImportJobAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/imports/{id:guid}/cancel")]
    [RequirePermission(Permissions.Students.Import)]
    public async Task<IActionResult> CancelImportJob(Guid id, CancellationToken ct)
    {
        var result = await _importExportService.CancelImportJobAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/imports")]
    [RequirePermission(Permissions.Students.Import)]
    public async Task<IActionResult> GetImportHistory([FromQuery] string? type, CancellationToken ct)
    {
        var result = await _importExportService.GetImportHistoryAsync(type, ct);
        return result.ToActionResult();
    }
}
