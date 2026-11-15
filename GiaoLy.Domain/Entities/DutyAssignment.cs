using System;

namespace GiaoLy.Domain.Entities;

public class DutyAssignment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid ClassRoomId { get; set; }
    public DateOnly DutyDate { get; set; }
    public string RoleName { get; set; } = string.Empty; // e.g. "Dạy chính", "Phụ tá", "Trực cổng"
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ClassRoom ClassRoom { get; set; } = null!;
}
