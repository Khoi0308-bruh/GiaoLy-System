using System;

namespace GiaoLy.Domain.Entities;

public class LessonPlan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AuthorUserId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string Visibility { get; set; } = "Class"; // 'Private', 'Class', 'Branch', 'All'
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    // Backward compatibility properties
    public Guid AuthorId { get => AuthorUserId; set => AuthorUserId = value; }
    public DateTime CreatedDate { get => CreatedAt; set => CreatedAt = value; }
    public DateTime? LastModified { get => UpdatedAt; set => UpdatedAt = value; }

    // Navigation properties
    public User AuthorUser { get; set; } = null!;
    public ClassRoom? ClassRoom { get; set; }
}
