using GiaoLy.Application.Imports.Dtos;

namespace GiaoLy.Application.Grades.Dtos;

public class GradeDto
{
    public Guid Id { get; set; }
    public Guid EnrollmentId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;

    public decimal? Oral { get; set; }
    public decimal? SmallTest { get; set; }
    public decimal? BigTest { get; set; }
    public decimal? FinalExam { get; set; }

    public int? TotalSessions { get; set; }
    public int? Absences { get; set; }

    public decimal? ComputedGpa { get; set; }
    public string? ComputedStatus { get; set; }
    public decimal? AttendanceRate { get; set; }
    public string? Remarks { get; set; }

    public string RowVersion { get; set; } = string.Empty;
    public DateTime? UpdatedAt { get; set; }
}

public class ClassGradesResponse
{
    public Guid ClassRoomId { get; set; }
    public string ClassRoomName { get; set; } = string.Empty;
    public Guid AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public string AcademicYearStatus { get; set; } = string.Empty;
    public bool IsLocked { get; set; }
    public string? LockReason { get; set; }
    public IReadOnlyList<GradeDto> Grades { get; set; } = Array.Empty<GradeDto>();
}

public class GradeItemUpdateRequest
{
    public Guid EnrollmentId { get; set; }
    public decimal? Oral { get; set; }
    public decimal? SmallTest { get; set; }
    public decimal? BigTest { get; set; }
    public decimal? FinalExam { get; set; }
    public int? TotalSessions { get; set; }
    public int? Absences { get; set; }
    public string? Remarks { get; set; }
    public string? RowVersion { get; set; }
}

public class BulkUpdateGradesRequest
{
    public List<GradeItemUpdateRequest> Grades { get; set; } = new();
}

public class CreateGradeUnlockRequest
{
    public string Reason { get; set; } = string.Empty;
    public int? DurationHours { get; set; }
}

public class GradeUnlockDto
{
    public Guid Id { get; set; }
    public Guid ClassRoomId { get; set; }
    public Guid UnlockedBy { get; set; }
    public string? UnlockedByName { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime UnlockedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public bool IsActive { get; set; }
}
