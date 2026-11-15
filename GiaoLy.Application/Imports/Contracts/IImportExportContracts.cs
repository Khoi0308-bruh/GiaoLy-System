using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Dtos;

namespace GiaoLy.Application.Imports.Contracts;

public interface IImportExportService
{
    Task<Result<ExportFileResult>> DownloadStudentTemplateAsync(CancellationToken ct = default);
    Task<Result<ImportJobDetailResponse>> UploadAndValidateStudentsAsync(Stream fileStream, string fileName, CancellationToken ct = default);
    Task<Result<ImportJobDetailResponse>> GetImportJobByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<ApplyImportResult>> ApplyImportJobAsync(Guid id, CancellationToken ct = default);
    Task<Result<IReadOnlyList<ImportJobSummaryResponse>>> GetImportHistoryAsync(string? importType = null, CancellationToken ct = default);
    Task<Result<ExportFileResult>> ExportStudentsAsync(int? branchId, Guid? classRoomId, string? status, CancellationToken ct = default);
}
