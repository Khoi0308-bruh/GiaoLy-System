using System;

namespace GiaoLy.Application.LessonPlans.Dtos;

public class LessonPlanDto
{
    public Guid Id { get; set; }
    public Guid AuthorUserId { get; set; }
    public string AuthorFullName { get; set; } = string.Empty;
    public Guid? ClassRoomId { get; set; }
    public string? ClassRoomName { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string Visibility { get; set; } = "Class";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public byte[]? RowVersion { get; set; }
}

public class LessonPlanDetailDto : LessonPlanDto
{
    public string ContentHtml { get; set; } = string.Empty;
}

public class CreateLessonPlanRequest
{
    public Guid? ClassRoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string Visibility { get; set; } = "Class";
}

public class UpdateLessonPlanRequest
{
    public Guid? ClassRoomId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? Tags { get; set; }
    public string Visibility { get; set; } = "Class";
    public byte[]? RowVersion { get; set; }
}
