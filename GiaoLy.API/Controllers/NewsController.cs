using GiaoLy.API.Services;
using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;
    private readonly IHttpClientFactory _httpClientFactory;

    // Static fallback client (used only if IHttpClientFactory is not available).
    // Reused across requests to avoid socket exhaustion.
    private static readonly HttpClient _staticHttpClient = new HttpClient
    {
        Timeout = TimeSpan.FromSeconds(5)
    };

    public NewsController(AppDbContext context, IMemoryCache cache, IHttpClientFactory httpClientFactory)
    {
        _context           = context;
        _cache             = cache;
        _httpClientFactory = httpClientFactory;
    }

    // ── GET /api/news/catholic ────────────────────────────────────────────────

    [HttpGet("catholic")]
    public async Task<IActionResult> GetCatholicNews(
        [FromQuery] Guid?   sourceId,
        [FromQuery] string? category,
        [FromQuery] string  sort  = "newest",
        [FromQuery] int     limit = 10)
    {
        var query = _context.NewsArticles
            .Include(n => n.Source)
            .AsNoTracking()
            .Where(n => n.IsActive);

        if (sourceId.HasValue)
            query = query.Where(n => n.SourceId == sourceId.Value);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(n => n.Category != null && n.Category.ToLower() == category.ToLower());

        query = sort.ToLower() == "oldest"
            ? query.OrderBy(n => n.PublishedDate)
            : query.OrderByDescending(n => n.PublishedDate);

        var news = await query.Take(limit).Select(n => new
        {
            n.Id,
            n.Title,
            n.Link,
            n.Summary,
            n.ImageUrl,
            SourceName = n.Source != null ? n.Source.Name : "Unknown",
            n.Category,
            n.PublishedDate
        }).ToListAsync();

        return Ok(news);
    }

    // ── GET /api/news/image-proxy?url=<encoded_url> ───────────────────────────

    /// <summary>
    /// Proxies an external image URL so the browser can load it regardless of
    /// the source site's CORS / hotlink-protection rules.
    /// Responses are cached in IMemoryCache for 4 hours (key = url).
    /// Returns 204 No Content if the upstream fetch fails.
    /// </summary>
    [HttpGet("image-proxy")]
    public async Task<IActionResult> ImageProxy([FromQuery] string url)
    {
        // ── 1. Validate ───────────────────────────────────────────────────────
        if (string.IsNullOrWhiteSpace(url))
            return BadRequest("Missing 'url' query parameter.");

        if (!Uri.TryCreate(url, UriKind.Absolute, out var parsedUri) ||
            (parsedUri.Scheme != Uri.UriSchemeHttp && parsedUri.Scheme != Uri.UriSchemeHttps))
        {
            return BadRequest("Only http:// and https:// URLs are accepted.");
        }

        // ── 2. Cache hit ──────────────────────────────────────────────────────
        var cacheKey = $"img_proxy:{url}";
        if (_cache.TryGetValue(cacheKey, out CachedImage? cached) && cached is not null)
        {
            return File(cached.Data, cached.ContentType);
        }

        // ── 3. Fetch upstream ─────────────────────────────────────────────────
        try
        {
            var client = _httpClientFactory.CreateClient("ImageProxy");

            using var request = new HttpRequestMessage(HttpMethod.Get, parsedUri);
            request.Headers.TryAddWithoutValidation("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                "AppleWebKit/537.36 (KHTML, like Gecko) " +
                "Chrome/124.0.0.0 Safari/537.36");
            request.Headers.TryAddWithoutValidation("Referer", $"{parsedUri.Scheme}://{parsedUri.Host}/");
            request.Headers.TryAddWithoutValidation("Accept", "image/webp,image/apng,image/*,*/*;q=0.8");

            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

            if (!response.IsSuccessStatusCode)
                return NoContent();

            var contentType = response.Content.Headers.ContentType?.MediaType ?? "image/jpeg";

            // Only proxy actual image responses
            if (!contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                return NoContent();

            var imageBytes = await response.Content.ReadAsByteArrayAsync();

            // ── 4. Cache the result ───────────────────────────────────────────
            var entry = new CachedImage(imageBytes, contentType);
            _cache.Set(cacheKey, entry, TimeSpan.FromHours(4));

            return File(imageBytes, contentType);
        }
        catch (Exception)
        {
            // Network error, timeout, DNS failure, etc. → silent 204
            return NoContent();
        }
    }

    // ── Helper record ─────────────────────────────────────────────────────────

    private sealed record CachedImage(byte[] Data, string ContentType);
}

