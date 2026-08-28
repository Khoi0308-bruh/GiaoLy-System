using System;

namespace GiaoLy.Domain.Entities;

public class LessonPlan
{
    public Guid Id { get; set; }
    public Guid AuthorId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? LastModified { get; set; }
    public string Tags { get; set; } = string.Empty;
}
