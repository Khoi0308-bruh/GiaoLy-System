using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Documents.Contracts;
using GiaoLy.Application.Documents.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Documents;

public class DocumentService : IDocumentService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IWebHostEnvironment _env;

    private readonly string _storageFolder;

    public DocumentService(
        AppDbContext context,
        ICurrentUser currentUser,
        IWebHostEnvironment env)
    {
        _context = context;
        _currentUser = currentUser;
        _env = env;

        // Secure storage directory outside wwwroot / public directory
        _storageFolder = Path.Combine(_env.ContentRootPath, "App_Data", "Documents");
        if (!Directory.Exists(_storageFolder))
        {
            Directory.CreateDirectory(_storageFolder);
        }
    }

    private bool IsParishWide => _currentUser.ScopeType == "All" || _currentUser.IsInRole("Admin") || _currentUser.IsInRole("BanQuanTri");

    private bool CanAccessBranch(int branchId)
    {
        if (IsParishWide) return true;
        if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            return _currentUser.BranchId.Value == branchId;
        }
        return false;
    }

    public async Task<Result<List<DocumentDto>>> GetPublicDocumentsAsync(int? branchId, string? category, string? search, CancellationToken ct = default)
    {
        var query = _context.Documents
            .AsNoTracking()
            .Include(d => d.BranchEntity)
            .Include(d => d.AcademicYear)
            .Include(d => d.UploadedByUser)
            .Where(d => d.AccessLevel == ContentRules.AccessLevelPublic)
            .AsQueryable();

        if (branchId.HasValue)
            query = query.Where(d => d.BranchId == branchId.Value);

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(d => d.Category == category.Trim());

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(d => d.FileName.Contains(s) || (d.Tags != null && d.Tags.Contains(s)));
        }

        var list = await query
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<DocumentDownloadDto>> DownloadPublicDocumentAsync(Guid id, CancellationToken ct = default)
    {
        var doc = await _context.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id && d.AccessLevel == ContentRules.AccessLevelPublic, ct);

        if (doc == null)
            return Result.NotFound<DocumentDownloadDto>("Không tìm thấy tài liệu công khai");

        var filePath = Path.Combine(_storageFolder, doc.StoredFileName);
        if (!File.Exists(filePath))
            return Result.NotFound<DocumentDownloadDto>("Tệp tài liệu trên máy chủ không tồn tại");

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Result.Ok(new DocumentDownloadDto
        {
            FileName = doc.FileName,
            ContentType = doc.ContentType,
            ContentStream = stream,
            FileSize = doc.FileSize
        });
    }

    public async Task<Result<List<DocumentDto>>> GetInternalDocumentsAsync(int? branchId, string? category, string? search, CancellationToken ct = default)
    {
        var query = _context.Documents
            .AsNoTracking()
            .Include(d => d.BranchEntity)
            .Include(d => d.AcademicYear)
            .Include(d => d.UploadedByUser)
            .AsQueryable();

        if (branchId.HasValue)
        {
            if (!CanAccessBranch(branchId.Value))
                return Result.Forbidden<List<DocumentDto>>("Bạn không có quyền truy cập tài liệu của ngành này");

            query = query.Where(d => d.BranchId == branchId.Value);
        }
        else if (!IsParishWide && _currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            var userBranch = _currentUser.BranchId.Value;
            query = query.Where(d => !d.BranchId.HasValue || d.BranchId == userBranch);
        }

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(d => d.Category == category.Trim());

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(d => d.FileName.Contains(s) || (d.Tags != null && d.Tags.Contains(s)));
        }

        var list = await query
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<DocumentDownloadDto>> DownloadInternalDocumentAsync(Guid id, CancellationToken ct = default)
    {
        var doc = await _context.Documents
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id, ct);

        if (doc == null)
            return Result.NotFound<DocumentDownloadDto>("Không tìm thấy tài liệu");

        if (doc.BranchId.HasValue && !CanAccessBranch(doc.BranchId.Value))
            return Result.Forbidden<DocumentDownloadDto>("Bạn không có quyền tải tài liệu của ngành này");

        var filePath = Path.Combine(_storageFolder, doc.StoredFileName);
        if (!File.Exists(filePath))
            return Result.NotFound<DocumentDownloadDto>("Tệp tài liệu trên máy chủ không tồn tại");

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Result.Ok(new DocumentDownloadDto
        {
            FileName = doc.FileName,
            ContentType = doc.ContentType,
            ContentStream = stream,
            FileSize = doc.FileSize
        });
    }

    public async Task<Result<DocumentDto>> UploadDocumentAsync(CreateDocumentRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.FileName))
            return Result.BadRequest<DocumentDto>(ErrorCodes.ValidationFailed, "Tên tệp không được để trống");

        if (request.FileBytes == null || request.FileBytes.Length == 0)
            return Result.BadRequest<DocumentDto>(ErrorCodes.ValidationFailed, "Dữ liệu tệp không được để trống");

        if (!ContentRules.ValidateDocumentExtension(request.FileName))
            return Result.BadRequest<DocumentDto>(ErrorCodes.UploadInvalid, "Định dạng tệp không được hỗ trợ");

        if (request.FileBytes.Length > ContentRules.DefaultMaxDocumentSizeBytes)
            return Result.BadRequest<DocumentDto>(ErrorCodes.UploadInvalid, "Dung lượng tệp vượt quá giới hạn tối đa cho phép (20 MB)");

        if (request.BranchId.HasValue && !CanAccessBranch(request.BranchId.Value))
            return Result.Forbidden<DocumentDto>("Bạn không có quyền tải lên tài liệu cho ngành này");

        var accessLevel = string.IsNullOrWhiteSpace(request.AccessLevel) ? ContentRules.AccessLevelInternal : request.AccessLevel.Trim();
        if (!ContentRules.AllowedAccessLevels.Contains(accessLevel, StringComparer.OrdinalIgnoreCase))
            return Result.BadRequest<DocumentDto>(ErrorCodes.ValidationFailed, "Mức độ truy cập không hợp lệ. Cho phép: Public, Internal");

        // Calculate SHA-256 hash
        var sha256Hex = Convert.ToHexString(SHA256.HashData(request.FileBytes)).ToLowerInvariant();

        // Server-generated unique file name
        var ext = Path.GetExtension(request.FileName).ToLowerInvariant();
        var storedFileName = $"{Guid.NewGuid():N}{ext}";
        var physicalPath = Path.Combine(_storageFolder, storedFileName);

        await File.WriteAllBytesAsync(physicalPath, request.FileBytes, ct);

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var document = new Document
        {
            Id = Guid.NewGuid(),
            FileName = Path.GetFileName(request.FileName.Trim()),
            StoredFileName = storedFileName,
            Category = string.IsNullOrWhiteSpace(request.Category) ? "Giáo án" : request.Category.Trim(),
            BranchId = request.BranchId,
            AcademicYearId = request.AcademicYearId,
            AccessLevel = accessLevel,
            Tags = request.Tags?.Trim(),
            FileSize = request.FileBytes.Length,
            ContentType = string.IsNullOrWhiteSpace(request.ContentType) ? "application/octet-stream" : request.ContentType.Trim(),
            Sha256 = sha256Hex,
            UploadedBy = currentUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Documents.Add(document);
        await _context.SaveChangesAsync(ct);

        return await GetDocumentDtoByIdAsync(document.Id, ct);
    }

    public async Task<Result<DocumentDto>> UpdateDocumentAsync(Guid id, UpdateDocumentRequest request, CancellationToken ct = default)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(d => d.Id == id, ct);
        if (doc == null)
            return Result.NotFound<DocumentDto>("Không tìm thấy tài liệu");

        if (doc.BranchId.HasValue && !CanAccessBranch(doc.BranchId.Value))
            return Result.Forbidden<DocumentDto>("Bạn không có quyền chỉnh sửa tài liệu của ngành này");

        if (request.BranchId.HasValue && !CanAccessBranch(request.BranchId.Value))
            return Result.Forbidden<DocumentDto>("Bạn không thể chuyển tài liệu sang ngành bạn không phụ trách");

        if (string.IsNullOrWhiteSpace(request.FileName))
            return Result.BadRequest<DocumentDto>(ErrorCodes.ValidationFailed, "Tên tài liệu không được để trống");

        var accessLevel = string.IsNullOrWhiteSpace(request.AccessLevel) ? ContentRules.AccessLevelInternal : request.AccessLevel.Trim();
        if (!ContentRules.AllowedAccessLevels.Contains(accessLevel, StringComparer.OrdinalIgnoreCase))
            return Result.BadRequest<DocumentDto>(ErrorCodes.ValidationFailed, "Mức độ truy cập không hợp lệ");

        doc.FileName = request.FileName.Trim();
        doc.Category = request.Category.Trim();
        doc.BranchId = request.BranchId;
        doc.AcademicYearId = request.AcademicYearId;
        doc.AccessLevel = accessLevel;
        doc.Tags = request.Tags?.Trim();
        doc.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetDocumentDtoByIdAsync(doc.Id, ct);
    }

    public async Task<Result<bool>> DeleteDocumentAsync(Guid id, CancellationToken ct = default)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(d => d.Id == id, ct);
        if (doc == null)
            return Result.NotFound<bool>("Không tìm thấy tài liệu");

        if (doc.BranchId.HasValue && !CanAccessBranch(doc.BranchId.Value))
            return Result.Forbidden<bool>("Bạn không có quyền xóa tài liệu của ngành này");

        doc.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok(true);
    }

    private async Task<Result<DocumentDto>> GetDocumentDtoByIdAsync(Guid id, CancellationToken ct)
    {
        var d = await _context.Documents
            .AsNoTracking()
            .Include(x => x.BranchEntity)
            .Include(x => x.AcademicYear)
            .Include(x => x.UploadedByUser)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (d == null)
            return Result.NotFound<DocumentDto>("Không tìm thấy tài liệu");

        return Result.Ok(MapToDto(d));
    }

    private static DocumentDto MapToDto(Document d) => new()
    {
        Id = d.Id,
        FileName = d.FileName,
        Category = d.Category,
        BranchId = d.BranchId,
        BranchName = d.BranchEntity?.Name,
        AcademicYearId = d.AcademicYearId,
        AcademicYearName = d.AcademicYear?.Name,
        AccessLevel = d.AccessLevel,
        Tags = d.Tags,
        FileSize = d.FileSize,
        ContentType = d.ContentType,
        Sha256 = d.Sha256,
        UploadedBy = d.UploadedBy,
        UploadedByName = d.UploadedByUser?.FullName ?? string.Empty,
        CreatedAt = d.CreatedAt
    };
}
