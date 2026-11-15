namespace GiaoLy.Domain.Entities;

/// <summary>
/// Đợt xét lên lớp từ niên khóa nguồn sang niên khóa đích (Mục 6.7 & schema-v3.sql).
/// </summary>
public class PromotionBatch
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SourceYearId { get; set; }
    public AcademicYear? SourceYear { get; set; }

    public Guid TargetYearId { get; set; }
    public AcademicYear? TargetYear { get; set; }

    public string Status { get; set; } = "Draft"; // Draft, InReview, Applied, Cancelled

    public Guid CreatedBy { get; set; }
    public User? Creator { get; set; }

    public DateTime? AppliedAt { get; set; }
    public Guid? AppliedBy { get; set; }
    public User? Applier { get; set; }

    public string? Summary { get; set; } // JSON statistics

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public ICollection<PromotionDraft> Drafts { get; set; } = new List<PromotionDraft>();
}
