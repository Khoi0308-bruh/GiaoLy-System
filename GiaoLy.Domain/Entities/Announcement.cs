using System;

namespace GiaoLy.Domain.Entities;

public enum AnnouncementType { Normal, Urgent, Event }
public enum TargetAudience { All, LeadersOnly, BranchSpecific, Class, Guardians }

public class Announcement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string AnnouncementType { get; set; } = "Normal"; // 'Normal', 'Urgent', 'Event'
    public string Audience { get; set; } = "Public"; // 'Public', 'Leaders', 'Branch', 'Class', 'Guardians'
    public int? BranchId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public Guid AuthorUserId { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Compatibility properties
    public string Content { get => ContentHtml; set => ContentHtml = value; }
    public string Author { get; set; } = "Ban Giáo Lý";
    public DateTime CreatedDate { get => PublishedAt; set => PublishedAt = value; }
    public DateTime? ExpiryDate { get => ExpiresAt; set => ExpiresAt = value; }
    public bool IsUrgent
    {
        get => string.Equals(AnnouncementType, "Urgent", StringComparison.OrdinalIgnoreCase);
        set { if (value) AnnouncementType = "Urgent"; }
    }
    public int Branch
    {
        get => BranchId ?? 0;
        set => BranchId = value > 0 ? value : null;
    }
    public AnnouncementType Type
    {
        get => Enum.TryParse<AnnouncementType>(AnnouncementType, true, out var t) ? t : Entities.AnnouncementType.Normal;
        set => AnnouncementType = value.ToString();
    }
    public TargetAudience TargetAudience
    {
        get => Audience switch
        {
            "Leaders" => TargetAudience.LeadersOnly,
            "Branch" => TargetAudience.BranchSpecific,
            _ => TargetAudience.All
        };
        set => Audience = value switch
        {
            TargetAudience.LeadersOnly => "Leaders",
            TargetAudience.BranchSpecific => "Branch",
            _ => "Public"
        };
    }

    // Navigation properties
    public Branch? BranchEntity { get; set; }
    public ClassRoom? ClassRoom { get; set; }
    public User? AuthorUser { get; set; }
}
