namespace GiaoLy.Domain.Entities;

public class ImportJob
{
    public const string StatusValidated = "Validated";
    public const string StatusApplied = "Applied";

    public Guid Id { get; set; } = Guid.NewGuid();
    public string ImportType { get; set; } = "Students";
    public string FileName { get; set; } = string.Empty;
    public string FileSha256 { get; set; } = string.Empty;

    public Guid UploadedBy { get; set; }
    public User? Uploader { get; set; }

    public string Status { get; set; } = StatusValidated;

    public int TotalRows { get; set; } = 0;
    public int ValidRows { get; set; } = 0;
    public int WarningRows { get; set; } = 0;
    public int ErrorRows { get; set; } = 0;

    public string? ReportJson { get; set; }
    public DateTime? AppliedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
