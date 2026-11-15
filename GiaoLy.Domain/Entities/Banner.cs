using System;

namespace GiaoLy.Domain.Entities;

public class Banner
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public int OrderIndex { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Compatibility property
    public string? Link { get => LinkUrl; set => LinkUrl = value; }
}
