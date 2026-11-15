using System;

namespace GiaoLy.Application.Leaders.Dtos;

public class PublicLeaderDto
{
    public Guid Id { get; set; }
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int Level { get; set; }
    public string Term { get; set; } = string.Empty;
    public string? AvatarPath { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public string? BranchName { get; set; }
}

public class LeaderDto : PublicLeaderDto
{
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateLeaderRequest
{
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int Level { get; set; } = 0;
    public string Term { get; set; } = "2023-2026";
    public string? AvatarPath { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateLeaderRequest
{
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int Level { get; set; }
    public string Term { get; set; } = string.Empty;
    public string? AvatarPath { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public bool IsActive { get; set; }
}
