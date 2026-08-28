namespace GiaoLy.Domain.Entities;

public enum AnnouncementType { Normal, Urgent, Event }
public enum TargetAudience { All, LeadersOnly, BranchSpecific }

public class Announcement
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    public AnnouncementType Type { get; set; } = AnnouncementType.Normal;
    public TargetAudience TargetAudience { get; set; } = TargetAudience.All;

    public int Branch { get; set; } // 0: Chung, 1: Ấu, 2: Thiếu...
    public DateTime CreatedDate { get; set; } = DateTime.Now;
    public string Author { get; set; } = "Ban Giáo Lý";
    public bool IsUrgent { get; set; } = false; // Kept for compatibility
    public DateTime? ExpiryDate { get; set; } // Tự ẩn sau ngày này
}