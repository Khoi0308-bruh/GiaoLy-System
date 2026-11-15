using GiaoLy.Application.Common.Paging;

namespace GiaoLy.Application.Students.Dtos;

public class StudentFilterRequest : PagingRequest
{
    public int? BranchId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public string? Status { get; set; }
}

public record GuardianDto(
    Guid? GuardianId,
    string FullName,
    string Phone,
    string Relationship,
    bool IsPrimary,
    string? Occupation = null,
    string? Religion = null,
    string? Email = null
);

public record StudentSummaryResponse(
    Guid Id,
    string Code,
    string HolyName,
    string FullName,
    DateOnly BirthDate,
    string? Gender,
    string Status,
    int? BranchId,
    string? BranchName,
    Guid? ClassRoomId,
    string? ClassName,
    string? PrimaryGuardianName,
    string? PrimaryGuardianPhone,
    string? PhotoUrl
);

public record StudentDetailResponse(
    Guid Id,
    string Code,
    string HolyName,
    string FullName,
    DateOnly BirthDate,
    string? Gender,
    string Status,
    DateOnly? JoinedOn,
    DateOnly? LeftOn,
    int? BranchId,
    string? BranchName,
    Guid? ClassRoomId,
    string? ClassName,
    Guid? FamilyId,
    string? FamilyName,
    string? PhotoUrl,
    string? Area,
    string? Address,
    string? BloodType,
    string? Allergies,
    string? HealthNotes,
    DateTime? GuardianConsentAt,
    bool HasPhotoConsent,
    IReadOnlyList<GuardianDto> Guardians,
    byte[]? RowVersion
);

public record CreateStudentRequest(
    string? HolyName,
    string FullName,
    DateOnly BirthDate,
    string? Gender,
    int? BranchId,
    string? Area,
    string? Address,
    string? BloodType,
    string? Allergies,
    string? HealthNotes,
    bool HasPhotoConsent,
    Guid? ClassRoomId,
    List<GuardianDto>? Guardians,
    bool ConfirmWarning = false,
    string? OverrideDuplicateReason = null
);

public record UpdateStudentRequest(
    string? HolyName,
    string? FullName,
    DateOnly? BirthDate,
    string? Gender,
    int? BranchId,
    string? Area,
    string? Address,
    string? BloodType,
    string? Allergies,
    string? HealthNotes,
    bool? HasPhotoConsent,
    string? Notes,
    byte[]? RowVersion
);

public record ChangeStudentStatusRequest(
    string TargetStatus,
    string Reason
);

public record StudentNoteDto(
    Guid Id,
    Guid StudentId,
    Guid AuthorId,
    string AuthorName,
    string Content,
    bool IsPrivate,
    DateTime CreatedAt
);

public record CreateStudentNoteRequest(
    string Content,
    bool IsPrivate = false
);

public record EnrollmentHistoryItem(
    Guid Id,
    Guid AcademicYearId,
    string AcademicYearName,
    Guid ClassRoomId,
    string ClassName,
    string Status,
    DateTime? CreatedAt
);

public record StatusChangeHistoryItem(
    Guid Id,
    string? OldStatus,
    string NewStatus,
    string Reason,
    string? ChangedByName,
    DateTime ChangedAt
);

public record StudentHistoryResponse(
    Guid StudentId,
    string FullName,
    IReadOnlyList<EnrollmentHistoryItem> Enrollments,
    IReadOnlyList<StatusChangeHistoryItem> StatusChanges
);

public record CheckDuplicateRequest(
    string FullName,
    DateOnly BirthDate,
    List<string>? GuardianPhones
);

public record CheckDuplicateResponse(
    string Level,
    string? Message,
    Guid? ExistingStudentId,
    string? ExistingStudentCode,
    string? ExistingStudentFullName
);

public record BranchStudentStats(
    int BranchId,
    string BranchName,
    int ActiveCount,
    int TotalCount
);

public record ClassStudentStats(
    Guid ClassRoomId,
    string ClassName,
    int StudentCount
);

public record StudentStatsResponse(
    int TotalActive,
    int TotalPaused,
    int TotalLeft,
    int TotalGraduated,
    IReadOnlyList<BranchStudentStats> ByBranch,
    IReadOnlyList<ClassStudentStats> ByClass
);

public record UnassignedStudentResponse(
    Guid Id,
    string Code,
    string HolyName,
    string FullName,
    DateOnly BirthDate,
    string? Gender,
    int? BranchId,
    string? BranchName
);
