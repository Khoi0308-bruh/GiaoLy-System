using System;
using System.Collections.Generic;

namespace GiaoLy.Domain.Entities;

public class NewsSource
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string RssUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<NewsArticle> NewsArticles { get; set; } = new List<NewsArticle>();
}
