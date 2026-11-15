using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Application.Platform.Dtos;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Platform;

public class BackgroundJobService : IBackgroundJobService
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<BackgroundJobService> _logger;

    public BackgroundJobService(
        AppDbContext context,
        IHttpClientFactory httpClientFactory,
        ILogger<BackgroundJobService> logger)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<Result<PagedJobRunsResultDto>> GetJobRunsAsync(int page = 1, int pageSize = 20, string? jobName = null, CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.BackgroundJobRuns.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(jobName))
        {
            query = query.Where(j => j.JobName == jobName.Trim());
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(j => j.StartedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(j => new BackgroundJobRunDto
            {
                Id = j.Id,
                JobName = j.JobName,
                StartedAt = j.StartedAt,
                FinishedAt = j.FinishedAt,
                Status = j.Status,
                Message = j.Message,
                LockedBy = j.LockedBy
            })
            .ToListAsync(ct);

        return Result.Ok(new PagedJobRunsResultDto
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    public async Task<Result<RunJobResultDto>> RunJobAsync(string jobName, string triggeredBy, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(jobName))
            return Result.Validation<RunJobResultDto>("Tên tác vụ không được để trống.", nameof(jobName));

        var cleanName = jobName.Trim();
        if (!BackgroundJobNames.All.Contains(cleanName, StringComparer.OrdinalIgnoreCase))
        {
            return Result.Validation<RunJobResultDto>($"Tác vụ '{cleanName}' không hợp lệ. Các tác vụ được hỗ trợ: {string.Join(", ", BackgroundJobNames.All)}", nameof(jobName));
        }

        // Concurrency Check: If already running within the last 30 minutes, skip
        var isRunning = await _context.BackgroundJobRuns
            .AnyAsync(j => j.JobName == cleanName && j.Status == "Running" && j.StartedAt > DateTime.UtcNow.AddMinutes(-30), ct);

        if (isRunning)
        {
            return Result.Conflict<RunJobResultDto>($"Tác vụ '{cleanName}' đang trong tiến trình xử lý bởi một phiên khác.");
        }

        var jobRun = new BackgroundJobRun
        {
            Id = Guid.NewGuid(),
            JobName = cleanName,
            StartedAt = DateTime.UtcNow,
            Status = "Running",
            LockedBy = string.IsNullOrWhiteSpace(triggeredBy) ? "System" : triggeredBy
        };

        _context.BackgroundJobRuns.Add(jobRun);
        await _context.SaveChangesAsync(ct);

        try
        {
            string message;
            switch (cleanName)
            {
                case BackgroundJobNames.GradebookCloser:
                    message = await ExecuteGradebookCloserAsync(ct);
                    break;
                case BackgroundJobNames.NewsCrawler:
                    message = await ExecuteNewsCrawlerAsync(ct);
                    break;
                case BackgroundJobNames.TokenCleanup:
                    message = await ExecuteTokenCleanupAsync(ct);
                    break;
                case BackgroundJobNames.GradeUnlockExpiry:
                    message = await ExecuteGradeUnlockExpiryAsync(ct);
                    break;
                case BackgroundJobNames.AuditRetention:
                    message = await ExecuteAuditRetentionAsync(ct);
                    break;
                default:
                    throw new NotSupportedException($"Tác vụ '{cleanName}' chưa được cấu hình hàm xử lý.");
            }

            jobRun.Status = "Succeeded";
            jobRun.FinishedAt = DateTime.UtcNow;
            jobRun.Message = message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi thực thi tác vụ nền {JobName}", cleanName);
            jobRun.Status = "Failed";
            jobRun.FinishedAt = DateTime.UtcNow;
            jobRun.Message = $"Lỗi: {ex.Message}";
        }

        await _context.SaveChangesAsync(ct);

        return Result.Ok(new RunJobResultDto
        {
            JobName = jobRun.JobName,
            Status = jobRun.Status,
            Message = jobRun.Message,
            StartedAt = jobRun.StartedAt,
            FinishedAt = jobRun.FinishedAt
        });
    }

    private async Task<string> ExecuteGradebookCloserAsync(CancellationToken ct)
    {
        // 01:00 AM VN time (UTC+7) -> DateOnly in VN
        var today = DateOnly.FromDateTime(DateTime.UtcNow.AddHours(7));

        var expiredYears = await _context.AcademicYears
            .Where(y => y.Status == "Active" && y.EndDate < today)
            .ToListAsync(ct);

        if (!expiredYears.Any())
            return "Không có niên khóa Active nào quá hạn EndDate cần khóa sổ.";

        foreach (var year in expiredYears)
        {
            year.Status = "Closing"; // Chuyển sang trạng thái khóa sổ điểm (theo Bảng 6.1 Blueprint V3)
            year.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(ct);
        return $"Đã tự động chuyển {expiredYears.Count} niên khóa sang trạng thái Closing (khóa sổ điểm): {string.Join(", ", expiredYears.Select(y => y.Name))}.";
    }

    private async Task<string> ExecuteNewsCrawlerAsync(CancellationToken ct)
    {
        var sources = await _context.NewsSources
            .Where(s => s.IsActive)
            .ToListAsync(ct);

        if (!sources.Any())
            return "Không có nguồn tin RSS nào đang kích hoạt.";

        var httpClient = _httpClientFactory.CreateClient();
        httpClient.Timeout = TimeSpan.FromSeconds(15);
        int totalNewArticles = 0;

        foreach (var source in sources)
        {
            try
            {
                if (!SafeUrlValidator.TryValidateAndGetSafeUri(source.RssUrl, out _, out var errorMsg))
                {
                    _logger.LogWarning("Bỏ qua nguồn tin {Source}: URL không an toàn ({Reason})", source.Name, errorMsg);
                    continue;
                }

                using var response = await httpClient.GetAsync(source.RssUrl, ct);
                if (!response.IsSuccessStatusCode) continue;

                await using var stream = await response.Content.ReadAsStreamAsync(ct);
                using var reader = XmlReader.Create(stream);
                var feed = SyndicationFeed.Load(reader);
                if (feed == null) continue;

                var items = feed.Items.Take(15).ToList();
                foreach (var item in items)
                {
                    var link = item.Links.FirstOrDefault()?.Uri.ToString() ?? "";
                    if (string.IsNullOrWhiteSpace(link)) continue;

                    var linkHash = ComputeSha256(link);
                    var exists = await _context.NewsArticles.AnyAsync(a => a.LinkHash == linkHash, ct);
                    if (exists) continue;

                    var title = item.Title?.Text ?? "Tin tức Công giáo";
                    var summary = item.Summary?.Text ?? "";
                    if (summary.Length > 2000) summary = summary[..1997] + "...";

                    var imageUrl = ExtractImageUrl(item);
                    var pubDate = item.PublishDate.UtcDateTime;
                    if (pubDate == default) pubDate = DateTime.UtcNow;

                    var article = new NewsArticle
                    {
                        SourceId = source.Id,
                        Title = title,
                        Link = link,
                        LinkHash = linkHash,
                        Summary = summary,
                        ImageUrl = imageUrl,
                        Category = source.Name,
                        PublishedAt = pubDate,
                        CrawledAt = DateTime.UtcNow,
                        IsActive = true
                    };

                    _context.NewsArticles.Add(article);
                    totalNewArticles++;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Lỗi cào RSS nguồn {Source}", source.Name);
            }
        }

        await _context.SaveChangesAsync(ct);
        return $"Đã cào thành công {totalNewArticles} bài viết mới từ {sources.Count} nguồn tin.";
    }

    private async Task<string> ExecuteTokenCleanupAsync(CancellationToken ct)
    {
        var cutoff = DateTime.UtcNow.AddDays(-30);
        var oldTokens = await _context.RefreshTokens
            .Where(t => t.IsRevoked || t.ExpiresAt < cutoff)
            .ToListAsync(ct);

        if (!oldTokens.Any())
            return "Không có refresh token nào quá hạn 30 ngày cần dọn dẹp.";

        _context.RefreshTokens.RemoveRange(oldTokens);
        await _context.SaveChangesAsync(ct);
        return $"Đã dọn dẹp thành công {oldTokens.Count} refresh token đã thu hồi hoặc quá hạn 30 ngày.";
    }

    private async Task<string> ExecuteGradeUnlockExpiryAsync(CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var expiredUnlocks = await _context.GradeUnlocks
            .Where(u => u.ExpiresAt < now && u.ClosedAt == null)
            .ToListAsync(ct);

        if (!expiredUnlocks.Any())
            return "Không có đợt mở khóa sổ điểm nào hết hạn lúc này.";

        foreach (var unlock in expiredUnlocks)
        {
            unlock.ClosedAt = now;
        }

        await _context.SaveChangesAsync(ct);
        return $"Đã đóng {expiredUnlocks.Count} lần mở khóa sổ điểm đã hết hạn.";
    }

    private async Task<string> ExecuteAuditRetentionAsync(CancellationToken ct)
    {
        var cutoff = DateTime.UtcNow.AddMonths(-24);
        var oldAuditLogs = await _context.AuditLogs
            .Where(a => a.OccurredAt < cutoff)
            .Take(5000)
            .ToListAsync(ct);

        if (!oldAuditLogs.Any())
            return "Không có nhật ký kiểm toán nào quá hạn 24 tháng cần dọn dẹp.";

        _context.AuditLogs.RemoveRange(oldAuditLogs);
        await _context.SaveChangesAsync(ct);
        return $"Đã dọn dẹp/lưu trữ {oldAuditLogs.Count} dòng nhật ký kiểm toán quá hạn 24 tháng.";
    }

    private static string ComputeSha256(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private static string? ExtractImageUrl(SyndicationItem item)
    {
        foreach (var link in item.Links)
        {
            if (link.MediaType?.StartsWith("image/", StringComparison.OrdinalIgnoreCase) == true)
                return link.Uri.ToString();
        }

        var match = Regex.Match(item.Summary?.Text ?? "", "<img[^>]+src=[\"']([^\"']+)[\"']", RegexOptions.IgnoreCase);
        if (match.Success)
            return match.Groups[1].Value;

        return null;
    }
}
