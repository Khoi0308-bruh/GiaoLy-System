using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Dtos;

namespace GiaoLy.Application.Organization.Contracts;

public interface IBranchService
{
    Task<Result<IReadOnlyList<BranchResponse>>> GetBranchesAsync(CancellationToken ct = default);
    Task<Result<BranchResponse>> CreateBranchAsync(CreateBranchRequest request, CancellationToken ct = default);
    Task<Result<BranchResponse>> UpdateBranchAsync(int id, UpdateBranchRequest request, CancellationToken ct = default);
}

public interface IClassLevelService
{
    Task<Result<IReadOnlyList<ClassLevelResponse>>> GetClassLevelsAsync(CancellationToken ct = default);
    Task<Result<ClassLevelResponse>> CreateClassLevelAsync(CreateClassLevelRequest request, CancellationToken ct = default);
    Task<Result<ClassLevelResponse>> UpdateClassLevelAsync(int id, UpdateClassLevelRequest request, CancellationToken ct = default);
}

public interface IAcademicYearService
{
    Task<Result<IReadOnlyList<AcademicYearResponse>>> GetAcademicYearsAsync(CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> GetActiveAcademicYearAsync(CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> GetAcademicYearByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> CreateAcademicYearAsync(CreateAcademicYearRequest request, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> UpdateAcademicYearAsync(Guid id, UpdateAcademicYearRequest request, CancellationToken ct = default);
    Task<Result> DeleteAcademicYearAsync(Guid id, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> ActivateAcademicYearAsync(Guid id, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> CloseAcademicYearAsync(Guid id, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> ArchiveAcademicYearAsync(Guid id, CancellationToken ct = default);
    Task<Result<AcademicYearResponse>> ReopenAcademicYearAsync(Guid id, ReopenAcademicYearRequest request, CancellationToken ct = default);
    Task<Result<int>> CloneStructureAsync(Guid targetYearId, CloneStructureRequest request, CancellationToken ct = default);
}

public interface IClassRoomService
{
    Task<Result<IReadOnlyList<ClassRoomResponse>>> GetClassRoomsByYearAsync(Guid yearId, CancellationToken ct = default);
    Task<Result<ClassRoomResponse>> GetClassRoomByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<ClassRoomResponse>> CreateClassRoomAsync(Guid yearId, CreateClassRoomRequest request, CancellationToken ct = default);
    Task<Result<ClassRoomResponse>> UpdateClassRoomAsync(Guid id, UpdateClassRoomRequest request, CancellationToken ct = default);
    Task<Result> DeleteClassRoomAsync(Guid id, CancellationToken ct = default);
    Task<Result> AssignTeachersAsync(Guid id, AssignTeachersRequest request, CancellationToken ct = default);
    Task<Result<ClassRosterResponse>> GetClassRosterAsync(Guid id, CancellationToken ct = default);
}

public interface IFamilyService
{
    Task<Result<IReadOnlyList<FamilyResponse>>> GetFamiliesAsync(Guid? classRoomId, CancellationToken ct = default);
    Task<Result<FamilyResponse>> CreateFamilyAsync(CreateFamilyRequest request, CancellationToken ct = default);
    Task<Result<FamilyResponse>> UpdateFamilyAsync(Guid id, UpdateFamilyRequest request, CancellationToken ct = default);
    Task<Result> DeleteFamilyAsync(Guid id, CancellationToken ct = default);
    Task<Result> AssignFamilyMembersAsync(Guid id, AssignFamilyMembersRequest request, CancellationToken ct = default);
}
