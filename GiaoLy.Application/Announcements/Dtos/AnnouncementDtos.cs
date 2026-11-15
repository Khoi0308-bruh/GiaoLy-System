using System;

namespace GiaoLy.Application.Announcements.Dtos;

public class AnnouncementDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string AnnouncementType { get; set; } = "Normal";
    public string Audience { get; set; } = "Public";
    public int? BranchId { get; set; }
    public string? BranchName { get; set; }
    public Guid? ClassRoomId { get; set; }
    public string? ClassRoomName { get; set; }
    public Guid AuthorUserId { get; set; }
    public string AuthorFullName { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAnnouncementRequest
{
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string AnnouncementType { get; set; } = "Normal";
    public string Audience { get; set; } = "Public";
    public int? BranchId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class UpdateAnnouncementRequest
{
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string AnnouncementType { get; set; } = "Normal";
    public string Audience { get; set; } = "Public";
    public int? BranchId { get; set; }
    public Guid? ClassRoomId { get; set; }
    public DateTime? ExpiresAt { get; set; }
}
