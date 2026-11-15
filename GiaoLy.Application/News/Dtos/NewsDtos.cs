using System;
using System.IO;

namespace GiaoLy.Application.News.Dtos;

public class NewsArticleDto
{
    public Guid Id { get; set; }
    public Guid? SourceId { get; set; }
    public string? SourceName { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
    public bool IsActive { get; set; }
}

public class NewsSourceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RssUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int ArticleCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateNewsSourceRequest
{
    public string Name { get; set; } = string.Empty;
    public string RssUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class UpdateNewsSourceRequest
{
    public string Name { get; set; } = string.Empty;
    public string RssUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class ProxyImageResultDto
{
    public Stream ImageStream { get; set; } = Stream.Null;
    public string ContentType { get; set; } = "image/jpeg";
    public long ContentLength { get; set; }
}
