using System;

namespace GiaoLy.Domain.Entities;

public class LiturgicalEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateOnly EventDate { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Color { get; set; } = "Green"; // Green, Red, White, Purple, Rose
    public string Level { get; set; } = "Thường"; // Lễ Trọng, Lễ Kính, Lễ Nhớ, Thường
    public string? Description { get; set; }
    public bool IsOverride { get; set; } = false;
    public string? WordOfGodOverride { get; set; }
    public string? WordOfGodReference { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Compatibility properties
    public DateTime Date
    {
        get => EventDate.ToDateTime(TimeOnly.MinValue);
        set => EventDate = DateOnly.FromDateTime(value);
    }
}
