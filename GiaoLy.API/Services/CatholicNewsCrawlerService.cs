using System.ServiceModel.Syndication;
using System.Xml;
using System.Xml.Linq;
using System.Text.RegularExpressions;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Services;

public class CatholicNewsCrawlerService : BackgroundService
{
    private readonly ILogger<CatholicNewsCrawlerService> _logger;
    private readonly IServiceProvider _serviceProvider;

    // Vietnam Standard Time (UTC+7). Falls back to a fixed +7 offset on systems
    // that don't carry the IANA timezone database (e.g. some Linux Docker images).
    private static readonly TimeZoneInfo _vietnamTz = GetVietnamTimeZone();

    private static readonly HttpClient _httpClient = new HttpClient(
        new HttpClientHandler
        {
            AutomaticDecompression =
                System.Net.DecompressionMethods.GZip |
                System.Net.DecompressionMethods.Deflate
        })
    {
        Timeout = TimeSpan.FromSeconds(30)
    };

    // Maximum articles saved per source per crawl run
    private const int MaxArticlesPerSource = 50;

    public CatholicNewsCrawlerService(
        ILogger<CatholicNewsCrawlerService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    // ── Scheduling ────────────────────────────────────────────────────────────

    /// <summary>
    /// Calculates how long to wait until the next 2:00 AM Vietnam time.
    /// </summary>
    private static TimeSpan GetDelayUntilNext2AmVietnam()
    {
        var nowUtc = DateTime.UtcNow;
        var nowVn  = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, _vietnamTz);

        // Target: 2:00 AM today (VN)
        var target2AmToday = new DateTime(nowVn.Year, nowVn.Month, nowVn.Day, 2, 0, 0, DateTimeKind.Unspecified);

        // If we're already past 2:00 AM → schedule for tomorrow
        if (nowVn >= target2AmToday)
            target2AmToday = target2AmToday.AddDays(1);

        // Convert target back to UTC so we can compute the delay
        var targetUtc = TimeZoneInfo.ConvertTimeToUtc(target2AmToday, _vietnamTz);
        var delay     = targetUtc - nowUtc;

        // Guard against negative delay due to clock skew
        return delay < TimeSpan.Zero ? TimeSpan.Zero : delay;
    }

    private static TimeZoneInfo GetVietnamTimeZone()
    {
        // Windows uses "SE Asia Standard Time"; Linux/macOS use "Asia/Ho_Chi_Minh"
        foreach (var id in new[] { "Asia/Ho_Chi_Minh", "SE Asia Standard Time" })
        {
            if (TimeZoneInfo.TryFindSystemTimeZoneById(id, out var tz))
                return tz;
        }
        // Fallback: create a custom UTC+7 timezone
        return TimeZoneInfo.CreateCustomTimeZone(
            "UTC+7", TimeSpan.FromHours(7), "Vietnam (UTC+7)", "Vietnam (UTC+7)");
    }

    // ── BackgroundService entry point ─────────────────────────────────────────

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("CatholicNewsCrawlerService bắt đầu hoạt động. " +
                               "Lịch chạy: mỗi ngày lúc 02:00 SA (giờ Việt Nam).");

        // Run once on startup so data is fresh immediately after a deploy,
        // then settle into the 2 AM schedule.
        await RunCrawlSafeAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = GetDelayUntilNext2AmVietnam();
            _logger.LogInformation(
                "Lần cào tiếp theo lúc 02:00 SA giờ VN — chờ {Hours}h {Minutes}m.",
                (int)delay.TotalHours, delay.Minutes);

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }

            await RunCrawlSafeAsync(stoppingToken);
        }
    }

    private async Task RunCrawlSafeAsync(CancellationToken stoppingToken)
    {
        try
        {
            await CrawlNewsAsync(stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình cào tin tức.");
        }
    }

    // ── Core crawl logic ──────────────────────────────────────────────────────

    private async Task CrawlNewsAsync(CancellationToken stoppingToken)
    {
        using var scope     = _serviceProvider.CreateScope();
        var       dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var feeds = await dbContext.NewsSources
            .Where(s => s.IsActive)
            .ToListAsync(stoppingToken);

        foreach (var feed in feeds)
        {
            if (stoppingToken.IsCancellationRequested) break;

            _logger.LogInformation("Đang lấy tin tức từ {Source}...", feed.Name);

            try
            {
                using var stream          = await _httpClient.GetStreamAsync(feed.RssUrl, stoppingToken);
                using var xmlReader       = XmlReader.Create(stream, new XmlReaderSettings { DtdProcessing = DtdProcessing.Ignore });
                var       syndicationFeed = SyndicationFeed.Load(xmlReader);

                int savedCount = 0;

                foreach (var item in syndicationFeed.Items)
                {
                    // Honour the per-source cap
                    if (savedCount >= MaxArticlesPerSource) break;

                    string link = item.Links.FirstOrDefault()?.Uri?.ToString() ?? string.Empty;
                    if (string.IsNullOrEmpty(link)) continue;

                    // Skip duplicates
                    if (await dbContext.NewsArticles.AnyAsync(n => n.Link == link, stoppingToken))
                        continue;

                    string imageUrl = ExtractImageUrl(item);

                    var news = new NewsArticle
                    {
                        Id            = Guid.NewGuid(),
                        Title         = item.Title?.Text ?? "Không tiêu đề",
                        Summary       = StripHtml(item.Summary?.Text ?? string.Empty),
                        Link          = link,
                        ImageUrl      = imageUrl,
                        SourceId      = feed.Id,
                        Category      = "General",
                        PublishedDate = item.PublishDate.UtcDateTime,
                        CrawledDate   = DateTime.UtcNow,
                        IsActive      = true
                    };

                    dbContext.NewsArticles.Add(news);
                    savedCount++;
                }

                if (savedCount > 0)
                {
                    await dbContext.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation(
                        "Đã lưu {Count}/{Max} tin tức mới từ {Source}.",
                        savedCount, MaxArticlesPerSource, feed.Name);
                }
                else
                {
                    _logger.LogInformation("Không có tin mới từ {Source}.", feed.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể tải RSS từ {Source}. Lỗi: {Message}", feed.Name, ex.Message);
            }
        }

        // Force garbage collection after crawling all feeds to free up memory on low-RAM servers
        GC.Collect();
        GC.WaitForPendingFinalizers();
    }

    // ── Image extraction ──────────────────────────────────────────────────────

    /// <summary>
    /// Tries to extract an image URL from a syndication item using three strategies:
    /// 1. RSS enclosure link with media type starting with "image"
    /// 2. &lt;media:content&gt; or &lt;media:thumbnail&gt; element extensions
    /// 3. First &lt;img src&gt; attribute found inside the summary/description HTML
    /// </summary>
    private static string ExtractImageUrl(SyndicationItem item)
    {
        // ── Strategy 1: enclosure / image link ───────────────────────────────
        var enclosure = item.Links.FirstOrDefault(
            l => l.RelationshipType == "enclosure" ||
                 (l.MediaType != null && l.MediaType.StartsWith("image", StringComparison.OrdinalIgnoreCase)));

        if (enclosure?.Uri != null)
            return enclosure.Uri.ToString();

        // ── Strategy 2: <media:content url="…"> / <media:thumbnail url="…"> ──
        // SyndicationItem stores unknown XML elements in ElementExtensions.
        foreach (var ext in item.ElementExtensions)
        {
            try
            {
                var el = ext.GetObject<XElement>();

                bool isMediaNamespace = el.Name.NamespaceName.Contains("media", StringComparison.OrdinalIgnoreCase);
                if (!isMediaNamespace) continue;

                bool isContentOrThumb =
                    el.Name.LocalName.Equals("content",   StringComparison.OrdinalIgnoreCase) ||
                    el.Name.LocalName.Equals("thumbnail", StringComparison.OrdinalIgnoreCase);

                if (isContentOrThumb)
                {
                    var url = el.Attribute("url")?.Value;
                    if (!string.IsNullOrWhiteSpace(url))
                        return url;
                }
            }
            catch
            {
                // Extension might not be parseable XML — skip
            }
        }

        // ── Strategy 3: first <img src="…"> in summary HTML ──────────────────
        var summaryHtml = item.Summary?.Text ?? string.Empty;
        if (!string.IsNullOrEmpty(summaryHtml))
        {
            var imgMatch = Regex.Match(
                summaryHtml,
                @"<img[^>]+src\s*=\s*[""']([^""']+)[""']",
                RegexOptions.IgnoreCase | RegexOptions.Singleline);

            if (imgMatch.Success)
                return imgMatch.Groups[1].Value;
        }

        return string.Empty;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static string StripHtml(string html) =>
        Regex.Replace(html, "<.*?>", string.Empty, RegexOptions.Singleline).Trim();
}
