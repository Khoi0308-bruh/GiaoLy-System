using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Enrollments.Dtos;

namespace GiaoLy.Application.Enrollments.Contracts;

public interface IEnrollmentService
{
    Task<Result<IReadOnlyList<EnrollmentDto>>> GetClassRoomEnrollmentsAsync(Guid classRoomId, CancellationToken ct = default);
    Task<Result<IReadOnlyList<EnrollmentDto>>> EnrollStudentsAsync(Guid classRoomId, EnrollStudentsRequest request, CancellationToken ct = default);
    Task<Result<EnrollmentDto>> TransferEnrollmentAsync(Guid enrollmentId, TransferEnrollmentRequest request, CancellationToken ct = default);
    Task<Result<EnrollmentDto>> WithdrawEnrollmentAsync(Guid enrollmentId, WithdrawEnrollmentRequest request, CancellationToken ct = default);
    Task<Result<IReadOnlyList<EnrollmentDto>>> GetStudentEnrollmentsAsync(Guid studentId, CancellationToken ct = default);
}
