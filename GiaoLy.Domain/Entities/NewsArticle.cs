namespace GiaoLy.Domain.Entities;

public class NewsArticle
{
    public Guid Id { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty; // Original URL
    public string Summary { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty; // Absolute URL to bypass download
    
    public Guid? SourceId { get; set; }
    public NewsSource? Source { get; set; }
    
    public string Category { get; set; } = "General"; // Nhan, TheGioi, VietNam
    
    public DateTime PublishedDate { get; set; }
    public DateTime CrawledDate { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;
}
