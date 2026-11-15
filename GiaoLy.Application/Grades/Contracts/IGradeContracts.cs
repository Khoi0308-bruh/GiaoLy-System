using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Grades.Dtos;
using GiaoLy.Application.Imports.Dtos;

namespace GiaoLy.Application.Grades.Contracts;

public interface IGradeService
{
    Task<Result<ClassGradesResponse>> GetClassRoomGradesAsync(Guid classRoomId, CancellationToken ct = default);
    Task<Result<IReadOnlyList<GradeDto>>> UpdateClassRoomGradesAsync(Guid classRoomId, BulkUpdateGradesRequest request, CancellationToken ct = default);
    Task<Result<GradeDto>> GetEnrollmentGradeAsync(Guid enrollmentId, CancellationToken ct = default);
    Task<Result<GradeUnlockDto>> CreateGradeUnlockAsync(Guid classRoomId, CreateGradeUnlockRequest request, CancellationToken ct = default);
    Task<Result<IReadOnlyList<GradeUnlockDto>>> GetGradeUnlocksAsync(Guid classRoomId, CancellationToken ct = default);
    Task<Result<ExportFileResult>> ExportClassRoomGradesAsync(Guid classRoomId, CancellationToken ct = default);
}
