using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Infrastructure.Services.News;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GiaoLy.API.Services;

/// <summary>
/// Chỉ chịu trách nhiệm lịch chạy (02:00 giờ Việt Nam) và ghi nhật ký lượt chạy.
/// Toàn bộ logic cào/dedupe nằm trong <see cref="NewsCrawler"/> để job chạy tay dùng lại.
/// </summary>
public class CatholicNewsCrawlerService : BackgroundService
{
    private readonly ILogger<CatholicNewsCrawlerService> _logger;
    private readonly IServiceProvider _serviceProvider;

    // Vietnam Standard Time (UTC+7). Falls back to a fixed +7 offset on systems
    // that don't carry the IANA timezone database (e.g. some Linux Docker images).
    private static readonly TimeZoneInfo _vietnamTz = GetVietnamTimeZone();

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
        var nowVn = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, _vietnamTz);

        // Target: 2:00 AM today (VN)
        var target2AmToday = new DateTime(nowVn.Year, nowVn.Month, nowVn.Day, 2, 0, 0, DateTimeKind.Unspecified);

        // If we're already past 2:00 AM → schedule for tomorrow
        if (nowVn >= target2AmToday)
            target2AmToday = target2AmToday.AddDays(1);

        // Convert target back to UTC so we can compute the delay
        var targetUtc = TimeZoneInfo.ConvertTimeToUtc(target2AmToday, _vietnamTz);
        var delay = targetUtc - nowUtc;

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

    private async Task CrawlNewsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var crawler = scope.ServiceProvider.GetRequiredService<NewsCrawler>();

        // Ghi nhận lượt chạy để màn hình "Tác vụ nền" thấy được cả cron tự động.
        var run = await BackgroundJobRunRecorder.StartAsync(
            dbContext, BackgroundJobNames.NewsCrawler, nameof(CatholicNewsCrawlerService), stoppingToken);

        try
        {
            var result = await crawler.CrawlAsync(stoppingToken);

            var message = result.Sources == 0
                ? "Không có nguồn tin RSS nào đang kích hoạt."
                : $"Đã lưu {result.Saved} bài mới từ {result.Sources - result.FailedSources}/{result.Sources} nguồn tin"
                  + (result.FailedSources > 0 ? $" ({result.FailedSources} nguồn lỗi)." : ".");

            await BackgroundJobRunRecorder.FinishAsync(
                dbContext, run, BackgroundJobRunRecorder.Succeeded, message);
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            // Ứng dụng đang tắt: ghi lại trạng thái rồi thoát êm, không coi là lỗi.
            await BackgroundJobRunRecorder.FinishAsync(
                dbContext, run, BackgroundJobRunRecorder.Skipped, "Lượt chạy bị huỷ do ứng dụng dừng.");
        }
        catch (Exception ex)
        {
            await BackgroundJobRunRecorder.FinishAsync(
                dbContext, run, BackgroundJobRunRecorder.Failed, $"Lỗi: {ex.Message}");
            throw;
        }
    }
}
