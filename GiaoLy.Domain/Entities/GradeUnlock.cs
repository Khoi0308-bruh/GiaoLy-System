namespace GiaoLy.Domain.Entities;

/// <summary>
/// Mở khóa sổ điểm một lớp có lý do và thời hạn (Mục 6.6 Blueprint V3).
/// </summary>
public class GradeUnlock
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }

    public Guid UnlockedBy { get; set; }
    public User? User { get; set; }

    public string Reason { get; set; } = string.Empty;

    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public DateTime? ClosedAt { get; set; }

    public bool IsActive(DateTime utcNow) => ClosedAt == null && ExpiresAt > utcNow;
}
