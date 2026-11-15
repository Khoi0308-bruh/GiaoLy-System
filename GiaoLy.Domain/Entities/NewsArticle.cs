using System;

namespace GiaoLy.Domain.Entities;

public class NewsArticle
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? SourceId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string LinkHash { get; set; } = string.Empty; // SHA-256 for deduplication
    public string Summary { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = "General";
    public DateTime PublishedAt { get; set; }
    public DateTime CrawledAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Compatibility properties
    public DateTime PublishedDate { get => PublishedAt; set => PublishedAt = value; }
    public DateTime CrawledDate { get => CrawledAt; set => CrawledAt = value; }

    // Navigation properties
    public NewsSource? Source { get; set; }
}
