using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Services;

/// <summary>
/// Ghi nhật ký mỗi lượt chạy của background service vào bảng <c>BackgroundJobRuns</c>,
/// dùng chung một nguồn dữ liệu với các tác vụ chạy tay qua <c>/api/v1/system/jobs</c>
/// để màn hình “Tác vụ nền” thấy được cả lượt chạy tự động.
/// </summary>
internal static class BackgroundJobRunRecorder
{
    public const string Running = "Running";
    public const string Succeeded = "Succeeded";
    public const string Failed = "Failed";
    public const string Skipped = "Skipped";

    private const int MaxMessageLength = 1000;

    public static async Task<BackgroundJobRun> StartAsync(
        AppDbContext context, string jobName, string lockedBy, CancellationToken ct)
    {
        var run = new BackgroundJobRun
        {
            Id = Guid.NewGuid(),
            JobName = jobName,
            StartedAt = DateTime.UtcNow,
            Status = Running,
            LockedBy = lockedBy
        };

        context.BackgroundJobRuns.Add(run);
        await context.SaveChangesAsync(ct);
        return run;
    }

    /// <summary>
    /// Kết thúc một lượt chạy. Luôn ghi với <see cref="CancellationToken.None"/> để bản ghi
    /// không bị mất khi ứng dụng đang tắt dở (lúc đó token nghiệp vụ đã bị huỷ).
    /// </summary>
    public static async Task FinishAsync(
        AppDbContext context, BackgroundJobRun run, string status, string? message)
    {
        run.Status = status;
        run.Message = Truncate(message);
        run.FinishedAt = DateTime.UtcNow;

        // Nếu lượt chạy thất bại giữa đường, ChangeTracker có thể còn entity hỏng (ví dụ bài viết
        // vi phạm unique index) khiến SaveChanges luôn ném lại lỗi cũ. Chỉ giữ lại bản ghi run
        // để trạng thái thất bại vẫn được ghi xuống DB.
        var entry = context.Entry(run);
        if (entry.State == EntityState.Detached)
        {
            context.Attach(run);
        }

        entry.State = EntityState.Modified;

        foreach (var other in context.ChangeTracker.Entries().ToList())
        {
            if (!ReferenceEquals(other.Entity, run))
            {
                other.State = EntityState.Detached;
            }
        }

        await context.SaveChangesAsync(CancellationToken.None);
    }

    private static string? Truncate(string? message)
    {
        if (string.IsNullOrWhiteSpace(message)) return message;
        return message.Length <= MaxMessageLength
            ? message
            : message[..(MaxMessageLength - 3)] + "...";
    }
}
