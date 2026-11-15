using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Documents.Dtos;

namespace GiaoLy.Application.Documents.Contracts;

public interface IDocumentService
{
    Task<Result<List<DocumentDto>>> GetPublicDocumentsAsync(int? branchId, string? category, string? search, CancellationToken ct = default);
    Task<Result<DocumentDownloadDto>> DownloadPublicDocumentAsync(Guid id, CancellationToken ct = default);
    Task<Result<List<DocumentDto>>> GetInternalDocumentsAsync(int? branchId, string? category, string? search, CancellationToken ct = default);
    Task<Result<DocumentDownloadDto>> DownloadInternalDocumentAsync(Guid id, CancellationToken ct = default);
    Task<Result<DocumentDto>> UploadDocumentAsync(CreateDocumentRequest request, CancellationToken ct = default);
    Task<Result<DocumentDto>> UpdateDocumentAsync(Guid id, UpdateDocumentRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteDocumentAsync(Guid id, CancellationToken ct = default);
}
