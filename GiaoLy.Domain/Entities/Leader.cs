using System;

namespace GiaoLy.Domain.Entities;

public class Leader
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int Level { get; set; } = 0;
    public string Term { get; set; } = "2023-2026";
    public string? AvatarPath { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Compatibility properties
    public int Branch
    {
        get => BranchId ?? 0;
        set => BranchId = value > 0 ? value : null;
    }

    // Navigation properties
    public Branch? BranchEntity { get; set; }
}
