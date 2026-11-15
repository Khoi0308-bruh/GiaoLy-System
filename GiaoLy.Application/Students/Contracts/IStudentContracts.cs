using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Students.Dtos;

namespace GiaoLy.Application.Students.Contracts;

public interface IStudentService
{
    Task<Result<PagedList<StudentSummaryResponse>>> GetStudentsAsync(StudentFilterRequest request, CancellationToken ct = default);
    Task<Result<StudentDetailResponse>> GetStudentByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<StudentDetailResponse>> CreateStudentAsync(CreateStudentRequest request, CancellationToken ct = default);
    Task<Result<StudentDetailResponse>> UpdateStudentAsync(Guid id, UpdateStudentRequest request, CancellationToken ct = default);
    Task<Result> ChangeStudentStatusAsync(Guid id, ChangeStudentStatusRequest request, CancellationToken ct = default);
    Task<Result> DeleteStudentAsync(Guid id, CancellationToken ct = default);
    Task<Result> RestoreStudentAsync(Guid id, CancellationToken ct = default);
    Task<Result<string>> UploadPhotoAsync(Guid id, Stream fileStream, string fileName, string contentType, CancellationToken ct = default);
    Task<Result<IReadOnlyList<GuardianDto>>> GetStudentGuardiansAsync(Guid id, CancellationToken ct = default);
    Task<Result<IReadOnlyList<GuardianDto>>> UpdateStudentGuardiansAsync(Guid id, List<GuardianDto> guardians, CancellationToken ct = default);
    Task<Result<IReadOnlyList<StudentNoteDto>>> GetStudentNotesAsync(Guid id, CancellationToken ct = default);
    Task<Result<StudentNoteDto>> CreateStudentNoteAsync(Guid id, CreateStudentNoteRequest request, CancellationToken ct = default);
    Task<Result> DeleteStudentNoteAsync(Guid noteId, CancellationToken ct = default);
    Task<Result<StudentHistoryResponse>> GetStudentHistoryAsync(Guid id, CancellationToken ct = default);
    Task<Result<CheckDuplicateResponse>> CheckDuplicateAsync(CheckDuplicateRequest request, CancellationToken ct = default);
    Task<Result<IReadOnlyList<UnassignedStudentResponse>>> GetUnassignedStudentsAsync(CancellationToken ct = default);
    Task<Result<StudentStatsResponse>> GetStudentStatsAsync(CancellationToken ct = default);
}
