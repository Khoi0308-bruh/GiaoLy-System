using System.Net;
using System.Security.Cryptography;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.News;

/// <summary>
/// Kết quả một lượt cào tin, dùng chung cho cron và tác vụ chạy tay.
/// </summary>
public readonly record struct NewsCrawlResult(int Sources, int Saved, int FailedSources);

/// <summary>
/// Cào RSS cho tất cả nguồn đang kích hoạt. Đây là nơi duy nhất chứa logic dedupe,
/// retry và cắt độ dài field; cron và job chạy tay chỉ gọi lại service này.
/// </summary>
public sealed class NewsCrawler
{
    public const string HttpClientName = "NewsCrawler";

    /// <summary>Số bài tối đa lưu cho mỗi nguồn trong một lượt cào.</summary>
    public const int MaxArticlesPerSource = 50;

    // Chặn trên số item đọc từ một feed để không dựng entity vô hạn với feed bất thường.
    private const int MaxFeedItems = 500;

    private const int MaxFeedFetchAttempts = 3;

    // Thời gian chờ cơ sở cho backoff lũy thừa: 2s → 4s (kèm jitter ngẫu nhiên)
    private static readonly TimeSpan FeedRetryBaseDelay = TimeSpan.FromSeconds(2);

    private static readonly Regex HtmlTagRegex = new(
        "<.*?>", RegexOptions.Singleline | RegexOptions.Compiled);

    private static readonly Regex ImgSrcRegex = new(
        "<img[^>]+src\\s*=\\s*[\"']([^\"']+)[\"']",
        RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Compiled);

    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<NewsCrawler> _logger;

    public NewsCrawler(
        AppDbContext context,
        IHttpClientFactory httpClientFactory,
        ILogger<NewsCrawler> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<NewsCrawlResult> CrawlAsync(CancellationToken ct = default)
    {
        var sources = await _context.NewsSources
            .AsNoTracking()
            .Where(s => s.IsActive)
            .ToListAsync(ct);

        if (sources.Count == 0)
            return new NewsCrawlResult(0, 0, 0);

        var httpClient = _httpClientFactory.CreateClient(HttpClientName);

        // Trùng trong cùng một lượt chưa nằm trong DB nên phải chặn bằng HashSet,
        // nếu không SaveChanges sẽ vi phạm UQ_NewsArticles_LinkHash và mất cả nguồn.
        var seenHashes = new HashSet<string>(StringComparer.Ordinal);

        var saved = 0;
        var failed = 0;

        foreach (var source in sources)
        {
            if (ct.IsCancellationRequested) break;

            try
            {
                if (!SafeUrlValidator.TryValidateAndGetSafeUri(source.RssUrl, out var feedUri, out var errorMessage))
                {
                    failed++;
                    _logger.LogWarning(
                        "Bỏ qua nguồn tin {Source}: URL không an toàn ({Reason})",
                        source.Name, errorMessage);
                    continue;
                }

                using var stream = await FetchFeedWithRetryAsync(httpClient, feedUri!.ToString(), ct);
                if (stream is null)
                {
                    failed++;
                    continue;
                }

                using var xmlReader = XmlReader.Create(stream, new XmlReaderSettings
                {
                    DtdProcessing = DtdProcessing.Ignore
                });
                var feed = SyndicationFeed.Load(xmlReader);

                var candidates = CollectCandidates(feed, source, seenHashes);
                if (candidates.Count == 0)
                {
                    _logger.LogInformation("Không có tin mới từ {Source}.", source.Name);
                    continue;
                }

                // Một query cho cả lô: loại các bài đã có trong DB (kể cả do lượt chạy khác vừa ghi).
                var hashes = candidates.Select(a => a.LinkHash).ToList();
                var existingHashes = await _context.NewsArticles
                    .Where(a => hashes.Contains(a.LinkHash))
                    .Select(a => a.LinkHash)
                    .ToListAsync(ct);

                if (existingHashes.Count > 0)
                {
                    var existing = existingHashes.ToHashSet(StringComparer.Ordinal);
                    candidates.RemoveAll(a => existing.Contains(a.LinkHash));
                }

                // Cap sau khi loại bài đã có: nếu cap trước, một feed mà 50 item đầu đều đã
                // tồn tại sẽ không bao giờ cào tới các item mới phía sau.
                if (candidates.Count > MaxArticlesPerSource)
                    candidates = candidates.Take(MaxArticlesPerSource).ToList();

                if (candidates.Count == 0)
                {
                    _logger.LogInformation("Không có tin mới từ {Source}.", source.Name);
                    continue;
                }

                _context.NewsArticles.AddRange(candidates);
                await _context.SaveChangesAsync(ct);
                saved += candidates.Count;

                _logger.LogInformation(
                    "Đã lưu {Count}/{Max} tin tức mới từ {Source}.",
                    candidates.Count, MaxArticlesPerSource, source.Name);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (DbUpdateException ex)
            {
                DetachPendingArticles();
                failed++;
                _logger.LogWarning(
                    ex, "Không lưu được tin từ {Source} (có thể trùng với lượt chạy khác).", source.Name);
            }
            catch (Exception ex)
            {
                DetachPendingArticles();
                failed++;
                _logger.LogWarning(ex, "Không thể tải RSS từ {Source}.", source.Name);
            }
        }

        // Dừng giữa các nguồn vì app shutdown: để cron ghi trạng thái Skipped thay vì Succeeded một phần.
        ct.ThrowIfCancellationRequested();

        return new NewsCrawlResult(sources.Count, saved, failed);
    }

    private static List<NewsArticle> CollectCandidates(
        SyndicationFeed feed, NewsSource source, HashSet<string> seenHashes)
    {
        var candidates = new List<NewsArticle>();

        foreach (var item in feed.Items)
        {
            if (candidates.Count >= MaxFeedItems) break;

            var link = item.Links.FirstOrDefault()?.Uri?.ToString()?.Trim();
            if (string.IsNullOrEmpty(link)) continue;

            if (link.Length > NewsArticle.LinkMaxLength)
                continue; // URL quá dài: bỏ qua, không để SaveChanges làm hỏng cả nguồn.

            var linkHash = ComputeSha256(link);
            if (!seenHashes.Add(linkHash)) continue;

            var publishedAt = item.PublishDate.UtcDateTime;
            if (publishedAt == default) publishedAt = DateTime.UtcNow;

            candidates.Add(new NewsArticle
            {
                Id = Guid.NewGuid(),
                SourceId = source.Id,
                Title = TruncateText(item.Title?.Text, NewsArticle.TitleMaxLength, "Không tiêu đề"),
                Link = link,
                LinkHash = linkHash,
                Summary = TruncateText(StripHtml(item.Summary?.Text), NewsArticle.SummaryMaxLength),
                ImageUrl = LimitOrNull(ExtractImageUrl(item), NewsArticle.ImageUrlMaxLength),
                Category = TruncateText(source.Name, NewsArticle.CategoryMaxLength, "General"),
                PublishedAt = publishedAt,
                CrawledAt = DateTime.UtcNow,
                IsActive = true
            });
        }

        return candidates;
    }

    /// <summary>
    /// Lấy nội dung RSS với retry + backoff lũy thừa (jitter) cho các lỗi tạm thời.
    /// Trả về <c>null</c> khi mọi lần thử đều thất bại hoặc lỗi không thể phục hồi (4xx).
    /// </summary>
    private async Task<Stream?> FetchFeedWithRetryAsync(
        HttpClient httpClient, string url, CancellationToken ct)
    {
        for (var attempt = 1; attempt <= MaxFeedFetchAttempts; attempt++)
        {
            try
            {
                using var response = await httpClient.GetAsync(
                    url, HttpCompletionOption.ResponseHeadersRead, ct);

                if (response.IsSuccessStatusCode)
                {
                    await using var body = await response.Content.ReadAsStreamAsync(ct);
                    var buffer = new MemoryStream();
                    await body.CopyToAsync(buffer, ct);
                    buffer.Position = 0;
                    return buffer;
                }

                if (!IsTransient(response.StatusCode))
                {
                    _logger.LogWarning(
                        "Nguồn tin {Url} trả về HTTP {Status} — không thử lại.",
                        url, (int)response.StatusCode);
                    return null;
                }

                _logger.LogWarning(
                    "Lỗi tạm thời HTTP {Status} khi lấy {Url} (lần {Attempt}/{Max}).",
                    (int)response.StatusCode, url, attempt, MaxFeedFetchAttempts);
            }
            catch (OperationCanceledException) when (ct.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex) when (ex is HttpRequestException or IOException or TaskCanceledException)
            {
                _logger.LogWarning(
                    ex, "Không lấy được RSS {Url} (lần {Attempt}/{Max}).",
                    url, attempt, MaxFeedFetchAttempts);
            }

            if (attempt >= MaxFeedFetchAttempts) break;

            var delay = FeedRetryBaseDelay * Math.Pow(2, attempt - 1)
                        + TimeSpan.FromMilliseconds(Random.Shared.Next(0, 250));
            await Task.Delay(delay, ct);
        }

        return null;
    }

    private static bool IsTransient(HttpStatusCode status)
        => (int)status >= 500
           || status is HttpStatusCode.RequestTimeout or HttpStatusCode.TooManyRequests;

    /// <summary>
    /// Gỡ các bài chưa ghi được, giữ nguyên các entity khác (ví dụ bản ghi BackgroundJobRun)
    /// để lỗi một nguồn không lan sang SaveChanges kế tiếp.
    /// </summary>
    private void DetachPendingArticles()
    {
        foreach (var entry in _context.ChangeTracker.Entries<NewsArticle>().ToList())
        {
            if (entry.State != EntityState.Unchanged)
                entry.State = EntityState.Detached;
        }
    }

    /// <summary>
    /// Tries to extract an image URL from a syndication item using three strategies:
    /// 1. RSS enclosure link with media type starting with "image"
    /// 2. &lt;media:content&gt; or &lt;media:thumbnail&gt; element extensions
    /// 3. First &lt;img src&gt; attribute found inside the summary/description HTML
    /// </summary>
    private static string? ExtractImageUrl(SyndicationItem item)
    {
        // Chỉ nhận enclosure là ảnh; enclosure audio/video không được dùng làm ImageUrl.
        var enclosure = item.Links.FirstOrDefault(
            l => l.MediaType != null &&
                 l.MediaType.StartsWith("image", StringComparison.OrdinalIgnoreCase));

        if (enclosure?.Uri != null)
            return enclosure.Uri.ToString();

        foreach (var ext in item.ElementExtensions)
        {
            try
            {
                var el = ext.GetObject<XElement>();

                bool isMediaNamespace = el.Name.NamespaceName.Contains(
                    "media", StringComparison.OrdinalIgnoreCase);
                if (!isMediaNamespace) continue;

                bool isContentOrThumb =
                    el.Name.LocalName.Equals("content", StringComparison.OrdinalIgnoreCase) ||
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

        var summaryHtml = item.Summary?.Text ?? string.Empty;
        if (!string.IsNullOrEmpty(summaryHtml))
        {
            var imgMatch = ImgSrcRegex.Match(summaryHtml);
            if (imgMatch.Success)
                return imgMatch.Groups[1].Value;
        }

        return null;
    }

    private static string StripHtml(string? html)
        => string.IsNullOrWhiteSpace(html)
            ? string.Empty
            : HtmlTagRegex.Replace(html, string.Empty).Trim();

    /// <summary>
    /// Cắt chuỗi về đúng giới hạn cột trong DB. Domain model là nguồn giới hạn duy nhất;
    /// crawler không được ghi chuỗi dài hơn để tránh SaveChanges ném lỗi.
    /// </summary>
    private static string TruncateText(string? value, int maxLength, string fallback = "")
    {
        var text = string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
        if (text.Length <= maxLength) return text;
        return maxLength <= 3 ? text[..maxLength] : text[..(maxLength - 3)] + "...";
    }

    /// <summary>
    /// Ảnh không hợp lệ còn tệ hơn không có ảnh: URL dài hơn cột sẽ bị bỏ (null)
    /// thay vì cắt thành một địa chỉ sai.
    /// </summary>
    private static string? LimitOrNull(string? value, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var text = value.Trim();
        return text.Length <= maxLength ? text : null;
    }

    private static string ComputeSha256(string input)
        => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(input))).ToLowerInvariant();
}
