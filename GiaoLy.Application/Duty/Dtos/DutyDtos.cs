using System;

namespace GiaoLy.Application.Duty.Dtos;

public class DutyAssignmentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public Guid ClassRoomId { get; set; }
    public string ClassRoomName { get; set; } = string.Empty;
    public DateOnly DutyDate { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateDutyAssignmentRequest
{
    public Guid UserId { get; set; }
    public Guid ClassRoomId { get; set; }
    public DateOnly DutyDate { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class UpdateDutyAssignmentRequest
{
    public Guid UserId { get; set; }
    public Guid ClassRoomId { get; set; }
    public DateOnly DutyDate { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Note { get; set; }
}
