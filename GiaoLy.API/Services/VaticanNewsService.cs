using System.ServiceModel.Syndication;
using System.Xml;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.API.Services;

/// <summary>
/// Background Service đọc tin tức Công giáo từ Vatican News RSS feed.
/// Tự động cập nhật mỗi 1 giờ.
/// Hỗ trợ Cache và Error Logging an toàn (Retry pattern).
/// </summary>
public class VaticanNewsService : BackgroundService
{
    private readonly ILogger<VaticanNewsService> _logger;
    private readonly IMemoryCache _cache;
    private const string RssUrl = "https://www.vaticannews.va/vi.rss.xml";
    public const string CacheKey = "VaticanNewsList";

    public VaticanNewsService(ILogger<VaticanNewsService> logger, IMemoryCache cache)
    {
        _logger = logger;
        _cache = cache;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("VaticanNews Background Service đang chạy.");

        while (!stoppingToken.IsCancellationRequested)
        {
            await FetchAndCacheNewsAsync();
            // Lặp lại mỗi 1 giờ
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task FetchAndCacheNewsAsync()
    {
        try
        {
            _logger.LogInformation("Đang tải tin tức từ RSS Vatican...");
            
            using var client = new HttpClient();
            // Add timeout để tránh treo server
            client.Timeout = TimeSpan.FromSeconds(30);

            var response = await client.GetAsync(RssUrl);
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            using var xmlReader = XmlReader.Create(stream);
            
            var feed = SyndicationFeed.Load(xmlReader);
            
            var newsList = feed.Items.Take(10).Select(item => new CatholicNewsDto
            {
                Title = item.Title?.Text ?? "Không có tiêu đề",
                Link = item.Links.FirstOrDefault()?.Uri?.ToString() ?? "",
                Summary = item.Summary?.Text ?? "",
                PublishDate = item.PublishDate.DateTime
            }).ToList();

            // Lưu vào memory cache với thời hạn 2 giờ (để dự phòng nếu lần sau lỗi vẫn có data)
            _cache.Set(CacheKey, newsList, TimeSpan.FromHours(2));
            
            _logger.LogInformation($"Tải thành công {newsList.Count} tin tức.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy dữ liệu RSS từ Vatican News. Sẽ sử dụng bản lưu cache cũ (nếu có).");
            // Không throw để Background Service tiếp tục sống
        }
    }
}

public class CatholicNewsDto
{
    public string Title { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public DateTime PublishDate { get; set; }
}
