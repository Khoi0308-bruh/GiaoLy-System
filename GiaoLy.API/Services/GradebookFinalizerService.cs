using GiaoLy.API.Helpers;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Services;

/// <summary>
/// Background Service — Tự động khóa sổ điểm khi niên học kết thúc.
///
/// Cơ chế "Tỉnh giấc tự quét" (Wake-up Self-scan):
///   Vấn đề với Free Host (Render/Railway): Server bị "ngủ" (Idling) sau 15-30 phút không có traffic.
///   Khi đó, mọi cron job đều bị dừng. Giải pháp:
///   1. Chạy kiểm tra NGAY khi server khởi động (sau 10 giây buffer cho DB sẵn sàng).
///   2. Tiếp tục chạy định kỳ mỗi 6 tiếng khi server đang hoạt động.
///   → Dù server có bị "ngủ" bao lâu, lần tỉnh giấc đầu tiên sẽ tự quét ngay lập tức.
///
/// Luồng xử lý:
///   1. Tìm các AcademicYear có IsActive=true, IsLocked=false, EndDate < Hôm nay (giờ VN)
///   2. Tự động set IsLocked=true, IsActive=false, IsArchived=true
///   3. Ghi log để Admin biết
///
/// Service chạy độc lập với luồng xử lý request → Người dùng không bị ảnh hưởng.
/// </summary>
public class GradebookFinalizerService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<GradebookFinalizerService> _logger;

    // Chạy kiểm tra mỗi 6 tiếng khi server đang hoạt động
    private static readonly TimeSpan CheckInterval = TimeSpan.FromHours(6);

    // Buffer thời gian khởi động để chờ DB, Seeder và các service khác sẵn sàng
    private static readonly TimeSpan StartupDelay = TimeSpan.FromSeconds(15);

    public GradebookFinalizerService(
        IServiceScopeFactory scopeFactory,
        ILogger<GradebookFinalizerService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[GradebookFinalizer] Đã khởi động. Sẽ tự quét sau {Delay} giây.", StartupDelay.TotalSeconds);

        // Chờ các service khác khởi động xong (đặc biệt là DbSeeder)
        await Task.Delay(StartupDelay, stoppingToken);

        // LẦN ĐẦU: Quét ngay lập tức — cơ chế "Tỉnh giấc tự quét"
        _logger.LogInformation("[GradebookFinalizer] Đang chạy lượt quét đầu tiên (Startup Scan)...");
        await CheckAndFinalizeAsync();

        // SAU ĐÓ: Lặp lại định kỳ mỗi 6 tiếng
        using var timer = new PeriodicTimer(CheckInterval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CheckAndFinalizeAsync();
        }
    }

    /// <summary>
    /// Quét DB và khóa các niên học đã hết hạn.
    /// Sử dụng IServiceScopeFactory vì DbContext là Scoped service,
    /// không thể inject trực tiếp vào Singleton BackgroundService.
    /// </summary>
    private async Task CheckAndFinalizeAsync()
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var today = DateTimeHelper.GetVnToday();

            // Tìm niên học cần khóa: đang hoạt động, chưa khóa, đã quá EndDate
            var expiredYears = await context.AcademicYears
                .Where(y => y.IsActive && !y.IsLocked && y.EndDate.Date < today)
                .ToListAsync();

            if (!expiredYears.Any())
            {
                _logger.LogDebug("[GradebookFinalizer] Không có niên học nào cần khóa lúc {Time}.", DateTimeHelper.GetVnNow());
                return;
            }

            foreach (var year in expiredYears)
            {
                year.IsLocked = true;       // Khóa sổ điểm
                year.IsActive = false;      // Vô hiệu hóa niên học
                year.IsArchived = true;     // Chuyển sang trạng thái lưu trữ

                _logger.LogWarning(
                    "[GradebookFinalizer] ✅ Đã tự động khóa sổ điểm niên học: '{Name}' (EndDate: {EndDate})",
                    year.Name,
                    year.EndDate.ToString("dd/MM/yyyy"));
            }

            await context.SaveChangesAsync();
            _logger.LogInformation("[GradebookFinalizer] Đã xử lý {Count} niên học.", expiredYears.Count);
        }
        catch (Exception ex)
        {
            // Log lỗi nhưng KHÔNG throw — không muốn crash toàn bộ Background Service
            _logger.LogError(ex, "[GradebookFinalizer] Lỗi khi kiểm tra khóa sổ điểm.");
        }
    }
}
