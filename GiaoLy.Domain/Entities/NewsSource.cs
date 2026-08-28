namespace GiaoLy.Domain.Entities;

public class NewsSource
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty; // e.g., Vatican News, HDGM VN
    public string RssUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public ICollection<NewsArticle> NewsArticles { get; set; } = new List<NewsArticle>();
}
