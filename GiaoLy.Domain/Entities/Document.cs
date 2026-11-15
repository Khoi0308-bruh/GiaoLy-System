using System;

namespace GiaoLy.Domain.Entities;

public class Document
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string Category { get; set; } = "Giáo án";
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string AccessLevel { get; set; } = "Internal"; // 'Public', 'Internal'
    public string? Tags { get; set; }
    public long FileSize { get; set; }
    public string ContentType { get; set; } = "application/octet-stream";
    public string Sha256 { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Compatibility properties
    public string FilePath { get => StoredFileName; set => StoredFileName = value; }
    public int Branch => BranchId ?? 0;
    public DateTime UploadDate => CreatedAt;

    // Navigation properties
    public Branch? BranchEntity { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public User? UploadedByUser { get; set; }
}
