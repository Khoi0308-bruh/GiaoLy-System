using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Sacraments.Dtos;

namespace GiaoLy.Application.Sacraments.Contracts;

public interface ISacramentService
{
    Task<Result<IReadOnlyList<StudentSacramentDto>>> GetStudentSacramentsAsync(Guid studentId, CancellationToken ct = default);
    Task<Result<StudentSacramentDto>> UpsertStudentSacramentAsync(Guid studentId, string sacramentType, UpsertSacramentRequest request, CancellationToken ct = default);
    Task<Result> DeleteStudentSacramentAsync(Guid studentId, string sacramentType, CancellationToken ct = default);

    Task<Result<IReadOnlyList<SacramentRequirementDto>>> GetSacramentRequirementsAsync(string? sacramentType = null, CancellationToken ct = default);
    Task<Result<SacramentRequirementDto>> CreateSacramentRequirementAsync(CreateSacramentRequirementRequest request, CancellationToken ct = default);
    Task<Result<SacramentRequirementDto>> UpdateSacramentRequirementAsync(Guid id, UpdateSacramentRequirementRequest request, CancellationToken ct = default);

    Task<Result<IReadOnlyList<StudentRequirementProgressDto>>> GetStudentRequirementProgressAsync(Guid studentId, string? sacramentType = null, CancellationToken ct = default);
    Task<Result<StudentRequirementProgressDto>> UpdateStudentRequirementProgressAsync(Guid studentId, Guid requirementId, UpdateRequirementProgressRequest request, CancellationToken ct = default);
}
