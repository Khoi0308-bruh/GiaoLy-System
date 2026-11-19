namespace GiaoLy.Domain.Entities;

public class AuditLog
{
    /// <summary>
    /// Độ dài tối đa của cột EntityId. Khoá chính ghép (ví dụ StudentGuardian) được ghi
    /// dưới dạng "StudentId=…;GuardianId=…" nên phải rộng hơn một GUID đơn.
    /// </summary>
    public const int EntityIdMaxLength = 400;

    public long Id { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? CorrelationId { get; set; }
}
