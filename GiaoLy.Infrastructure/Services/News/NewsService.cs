using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.News.Contracts;
using GiaoLy.Application.News.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.News;

public class NewsService : INewsService
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;

    public NewsService(
        AppDbContext context,
        IHttpClientFactory httpClientFactory,
        IMemoryCache cache)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _cache = cache;
    }

    public async Task<Result<List<NewsArticleDto>>> GetPublicNewsAsync(int page = 1, int pageSize = 20, Guid? sourceId = null, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 20;

        var query = _context.NewsArticles
            .AsNoTracking()
            .Include(a => a.Source)
            .Where(a => a.IsActive)
            .AsQueryable();

        if (sourceId.HasValue)
            query = query.Where(a => a.SourceId == sourceId.Value);

        var list = await query
            .OrderByDescending(a => a.PublishedAt)
            .ThenByDescending(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = list.Select(a => new NewsArticleDto
        {
            Id = a.Id,
            SourceId = a.SourceId,
            SourceName = a.Source?.Name,
            Title = a.Title,
            Link = a.Link,
            Summary = a.Summary,
            ImageUrl = a.ImageUrl,
            Category = a.Category,
            PublishedAt = a.PublishedAt,
            IsActive = a.IsActive
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<PagedList<NewsArticleDto>>> GetAdminNewsAsync(
        int page = 1,
        int pageSize = 20,
        Guid? sourceId = null,
        bool? isActive = null,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.NewsArticles
            .AsNoTracking()
            .Include(a => a.Source)
            .AsQueryable();

        if (sourceId.HasValue)
            query = query.Where(a => a.SourceId == sourceId.Value);

        if (isActive.HasValue)
            query = query.Where(a => a.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(ct);

        var list = await query
            .OrderByDescending(a => a.PublishedAt)
            .ThenByDescending(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = list.Select(a => new NewsArticleDto
        {
            Id = a.Id,
            SourceId = a.SourceId,
            SourceName = a.Source?.Name,
            Title = a.Title,
            Link = a.Link,
            Summary = a.Summary,
            ImageUrl = a.ImageUrl,
            Category = a.Category,
            PublishedAt = a.PublishedAt,
            IsActive = a.IsActive
        }).ToList();

        return Result.Ok(new PagedList<NewsArticleDto>(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<ProxyImageResultDto>> ProxyImageAsync(string imageUrl, CancellationToken ct = default)
    {
        if (!SafeUrlValidator.TryValidateAndGetSafeUri(imageUrl, out var safeUri, out var validationError))
        {
            return Result.Failure<ProxyImageResultDto>(400, ErrorCodes.UrlBlocked, validationError ?? "Địa chỉ ảnh bị chặn do chính sách bảo mật SSRF");
        }

        var cacheKey = $"ProxyImg_{imageUrl}";
        if (_cache.TryGetValue(cacheKey, out byte[]? cachedBytes))
        {
            var memoryStream = new MemoryStream(cachedBytes!);
            return Result.Ok(new ProxyImageResultDto
            {
                ImageStream = memoryStream,
                ContentType = "image/jpeg",
                ContentLength = cachedBytes!.Length
            });
        }

        // Use safe client with 5s timeout & no redirects
        using var handler = new SocketsHttpHandler
        {
            AllowAutoRedirect = false,
            ConnectTimeout = TimeSpan.FromSeconds(5)
        };
        using var client = new HttpClient(handler)
        {
            Timeout = TimeSpan.FromSeconds(5)
        };

        client.DefaultRequestHeaders.Add("User-Agent", "GiaoLySystem-SafeProxy/1.0");

        try
        {
            using var response = await client.GetAsync(safeUri, HttpCompletionOption.ResponseHeadersRead, ct);

            if (!response.IsSuccessStatusCode)
            {
                return Result.BadRequest<ProxyImageResultDto>(ErrorCodes.UploadInvalid, $"Không thể tải ảnh từ máy chủ nguồn (HTTP {(int)response.StatusCode})");
            }

            var contentType = response.Content.Headers.ContentType?.MediaType ?? "image/jpeg";
            if (!contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return Result.BadRequest<ProxyImageResultDto>(ErrorCodes.UploadInvalid, "Nội dung trả về không phải là tệp hình ảnh hợp lệ");
            }

            var contentLength = response.Content.Headers.ContentLength;
            if (contentLength.HasValue && contentLength.Value > ContentRules.DefaultMaxImageSizeBytes)
            {
                return Result.BadRequest<ProxyImageResultDto>(ErrorCodes.UploadInvalid, "Dung lượng ảnh vượt quá giới hạn tối đa cho phép (2 MB)");
            }

            var bytes = await response.Content.ReadAsByteArrayAsync(ct);
            if (bytes.Length > ContentRules.DefaultMaxImageSizeBytes)
            {
                return Result.BadRequest<ProxyImageResultDto>(ErrorCodes.UploadInvalid, "Dung lượng ảnh tải về vượt quá giới hạn tối đa cho phép (2 MB)");
            }

            // Cache safe image for 1 hour
            _cache.Set(cacheKey, bytes, TimeSpan.FromHours(1));

            var resultStream = new MemoryStream(bytes);
            return Result.Ok(new ProxyImageResultDto
            {
                ImageStream = resultStream,
                ContentType = contentType,
                ContentLength = bytes.Length
            });
        }
        catch (Exception ex)
        {
            return Result.BadRequest<ProxyImageResultDto>(ErrorCodes.UploadInvalid, $"Lỗi kết nối tải ảnh: {ex.Message}");
        }
    }

    public async Task<Result<List<NewsSourceDto>>> GetNewsSourcesAsync(CancellationToken ct = default)
    {
        var list = await _context.NewsSources
            .AsNoTracking()
            .Include(s => s.NewsArticles)
            .OrderBy(s => s.Name)
            .ToListAsync(ct);

        var dtos = list.Select(s => new NewsSourceDto
        {
            Id = s.Id,
            Name = s.Name,
            RssUrl = s.RssUrl,
            IsActive = s.IsActive,
            ArticleCount = s.NewsArticles.Count,
            CreatedAt = s.CreatedAt
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<NewsSourceDto>> CreateNewsSourceAsync(CreateNewsSourceRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Result.BadRequest<NewsSourceDto>(ErrorCodes.ValidationFailed, "Tên nguồn tin không được để trống");

        if (string.IsNullOrWhiteSpace(request.RssUrl))
            return Result.BadRequest<NewsSourceDto>(ErrorCodes.ValidationFailed, "Đường dẫn RSS không được để trống");

        var url = request.RssUrl.Trim();
        var exists = await _context.NewsSources.AnyAsync(s => s.RssUrl == url, ct);
        if (exists)
            return Result.Failure<NewsSourceDto>(409, ErrorCodes.ConflictDuplicate, $"Đường dẫn RSS '{url}' đã tồn tại");

        var source = new NewsSource
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            RssUrl = url,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.NewsSources.Add(source);
        await _context.SaveChangesAsync(ct);

        var dto = new NewsSourceDto
        {
            Id = source.Id,
            Name = source.Name,
            RssUrl = source.RssUrl,
            IsActive = source.IsActive,
            ArticleCount = 0,
            CreatedAt = source.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<NewsSourceDto>> UpdateNewsSourceAsync(Guid id, UpdateNewsSourceRequest request, CancellationToken ct = default)
    {
        var source = await _context.NewsSources
            .Include(s => s.NewsArticles)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

        if (source == null)
            return Result.NotFound<NewsSourceDto>("Không tìm thấy nguồn tin");

        if (string.IsNullOrWhiteSpace(request.Name))
            return Result.BadRequest<NewsSourceDto>(ErrorCodes.ValidationFailed, "Tên nguồn tin không được để trống");

        var url = request.RssUrl.Trim();
        var exists = await _context.NewsSources.AnyAsync(s => s.Id != id && s.RssUrl == url, ct);
        if (exists)
            return Result.Failure<NewsSourceDto>(409, ErrorCodes.ConflictDuplicate, $"Đường dẫn RSS '{url}' đã được dùng cho nguồn tin khác");

        source.Name = request.Name.Trim();
        source.RssUrl = url;
        source.IsActive = request.IsActive;
        source.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        var dto = new NewsSourceDto
        {
            Id = source.Id,
            Name = source.Name,
            RssUrl = source.RssUrl,
            IsActive = source.IsActive,
            ArticleCount = source.NewsArticles.Count,
            CreatedAt = source.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<bool>> DeleteNewsSourceAsync(Guid id, CancellationToken ct = default)
    {
        var source = await _context.NewsSources.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (source == null)
            return Result.NotFound<bool>("Không tìm thấy nguồn tin");

        _context.NewsSources.Remove(source);
        await _context.SaveChangesAsync(ct);
        return Result.Ok(true);
    }

    public async Task<Result<bool>> SetArticleActiveAsync(Guid id, bool isActive, CancellationToken ct = default)
    {
        var article = await _context.NewsArticles.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (article == null)
            return Result.NotFound<bool>("Không tìm thấy bài viết");

        article.IsActive = isActive;
        article.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok(true);
    }
}
