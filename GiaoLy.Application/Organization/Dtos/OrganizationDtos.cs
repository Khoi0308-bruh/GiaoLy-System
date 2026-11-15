namespace GiaoLy.Application.Organization.Dtos;

// ── 1. Branches ─────────────────────────────────────────────────────────────
public record BranchResponse(
    int Id,
    string Code,
    string Name,
    byte? MinAge,
    byte? MaxAge,
    int SortOrder,
    bool IsActive
);

public record CreateBranchRequest(
    string Code,
    string Name,
    byte? MinAge,
    byte? MaxAge,
    int SortOrder = 0
);

public record UpdateBranchRequest(
    string Name,
    byte? MinAge,
    byte? MaxAge,
    int SortOrder,
    bool IsActive
);

// ── 2. Class Levels ─────────────────────────────────────────────────────────
public record ClassLevelResponse(
    int Id,
    int BranchId,
    string BranchName,
    string Code,
    string Name,
    byte LevelKey,
    int? NextLevelId,
    string? NextLevelName,
    int SortOrder
);

public record CreateClassLevelRequest(
    int BranchId,
    string Code,
    string Name,
    byte LevelKey,
    int? NextLevelId,
    int SortOrder = 0
);

public record UpdateClassLevelRequest(
    string Name,
    byte LevelKey,
    int? NextLevelId,
    int SortOrder
);

// ── 3. Academic Years ───────────────────────────────────────────────────────
public record AcademicYearResponse(
    Guid Id,
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    string Status,
    DateTime? ActivatedAt,
    DateTime? ClosedAt,
    DateTime? ArchivedAt,
    DateTime? ReopenedAt,
    string? ReopenReason,
    int ClassRoomCount
);

public record CreateAcademicYearRequest(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate
);

public record UpdateAcademicYearRequest(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate
);

public record ReopenAcademicYearRequest(string Reason);

public record CloneStructureRequest(Guid SourceAcademicYearId);

// ── 4. ClassRooms ───────────────────────────────────────────────────────────
public record TeacherSummaryResponse(
    Guid UserId,
    string Username,
    string FullName,
    string? ChristianName,
    bool IsLead
);

public record ClassRoomResponse(
    Guid Id,
    Guid AcademicYearId,
    string AcademicYearName,
    int ClassLevelId,
    string ClassLevelCode,
    string ClassLevelName,
    int BranchId,
    string Section,
    string ClassName,
    string? RoomName,
    TeacherSummaryResponse? LeadTeacher,
    IReadOnlyList<TeacherSummaryResponse> AssistantTeachers,
    int StudentCount
);

public record CreateClassRoomRequest(
    int ClassLevelId,
    string? Section,
    string? RoomName
);

public record UpdateClassRoomRequest(
    string? Section,
    string? RoomName
);

public record AssignTeachersRequest(
    Guid? LeadTeacherUserId,
    List<Guid>? AssistantTeacherUserIds
);

public record StudentRosterItem(
    Guid StudentId,
    string FullName,
    string? ChristianName,
    DateOnly? BirthDate,
    string? Gender,
    string Status
);

public record ClassRosterResponse(
    Guid ClassRoomId,
    string ClassName,
    IReadOnlyList<StudentRosterItem> Students
);

// ── 5. Families ─────────────────────────────────────────────────────────────
public record FamilyResponse(
    Guid Id,
    string Name,
    string? PatronSaint,
    Guid ClassRoomId,
    string ClassName,
    string? Description,
    int MemberCount
);

public record CreateFamilyRequest(
    Guid ClassRoomId,
    string Name,
    string? PatronSaint,
    string? Description
);

public record UpdateFamilyRequest(
    string Name,
    string? PatronSaint,
    string? Description
);

public record AssignFamilyMembersRequest(List<Guid> StudentIds);
