namespace GiaoLy.Domain.Entities;

/// <summary>
/// Đề xuất lên lớp cho từng đoàn sinh trong một đợt xét (Mục 6.7 & schema-v3.sql).
/// </summary>
public class PromotionDraft
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BatchId { get; set; }
    public PromotionBatch? Batch { get; set; }

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid FromEnrollmentId { get; set; }
    public Enrollment? FromEnrollment { get; set; }

    public string Outcome { get; set; } = "Promote"; // Promote, Repeat, Graduate, Manual

    public Guid? SuggestedClassRoomId { get; set; }
    public ClassRoom? SuggestedClassRoom { get; set; }

    public string? GradeSnapshot { get; set; } // JSON: { Gpa, AttendanceRate, Status, GradeRowVersion }

    public string? Reason { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Stale, Applied

    public Guid? DecidedBy { get; set; }
    public User? Decider { get; set; }

    public DateTime? DecidedAt { get; set; }

    public Guid? AppliedEnrollmentId { get; set; }
    public Enrollment? AppliedEnrollment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}
