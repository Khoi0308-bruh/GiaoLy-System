using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Documents.Contracts;
using GiaoLy.Application.Documents.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet("api/v1/public/documents")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicDocuments(
        [FromQuery] int? branchId,
        [FromQuery] string? category,
        [FromQuery] string? search,
        CancellationToken ct)
    {
        var result = await _documentService.GetPublicDocumentsAsync(branchId, category, search, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/public/documents/{id:guid}/download")]
    [AllowAnonymous]
    public async Task<IActionResult> DownloadPublicDocument(Guid id, CancellationToken ct)
    {
        var result = await _documentService.DownloadPublicDocumentAsync(id, ct);
        if (result.IsFailure)
            return result.ToActionResult();

        var dto = result.Value!;
        return File(dto.ContentStream, dto.ContentType, dto.FileName);
    }

    [HttpGet("api/v1/documents")]
    [RequirePermission(Permissions.Documents.View)]
    public async Task<IActionResult> GetInternalDocuments(
        [FromQuery] int? branchId,
        [FromQuery] string? category,
        [FromQuery] string? search,
        CancellationToken ct)
    {
        var result = await _documentService.GetInternalDocumentsAsync(branchId, category, search, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/documents/{id:guid}/download")]
    [RequirePermission(Permissions.Documents.View)]
    public async Task<IActionResult> DownloadInternalDocument(Guid id, CancellationToken ct)
    {
        var result = await _documentService.DownloadInternalDocumentAsync(id, ct);
        if (result.IsFailure)
            return result.ToActionResult();

        var dto = result.Value!;
        return File(dto.ContentStream, dto.ContentType, dto.FileName);
    }

    [HttpPost("api/v1/documents")]
    [RequirePermission(Permissions.Documents.Create)]
    public async Task<IActionResult> UploadDocument(
        [FromForm] UploadDocumentForm form,
        CancellationToken ct)
    {
        var file = form.File;
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Vui lòng chọn tệp tin tải lên" });
        }

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream, ct);
        var fileBytes = memoryStream.ToArray();

        var request = new CreateDocumentRequest
        {
            FileName = file.FileName,
            Category = form.Category ?? "Giáo án",
            BranchId = form.BranchId,
            AcademicYearId = form.AcademicYearId,
            AccessLevel = form.AccessLevel ?? "Internal",
            Tags = form.Tags,
            ContentType = file.ContentType,
            FileBytes = fileBytes
        };

        var result = await _documentService.UploadDocumentAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/documents/{id:guid}")]
    [RequirePermission(Permissions.Documents.Update)]
    public async Task<IActionResult> UpdateDocument(
        Guid id,
        [FromBody] UpdateDocumentRequest request,
        CancellationToken ct)
    {
        var result = await _documentService.UpdateDocumentAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/documents/{id:guid}")]
    [RequirePermission(Permissions.Documents.Delete)]
    public async Task<IActionResult> DeleteDocument(Guid id, CancellationToken ct)
    {
        var result = await _documentService.DeleteDocumentAsync(id, ct);
        return result.ToActionResult();
    }
}

/// <summary>
/// Form upload tài liệu: gom nhiều trường vào một model để Swashbuckle sinh được schema
/// (dùng [FromForm] trực tiếp trên tham số IFormFile làm SwaggerGen ném lỗi 500).
/// </summary>
public class UploadDocumentForm
{
    public IFormFile? File { get; set; }
    public string? Category { get; set; }
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string? AccessLevel { get; set; }
    public string? Tags { get; set; }
}
