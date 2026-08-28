namespace GiaoLy.Domain.Entities;

public enum DocumentAccessLevel { Public, Internal }

public class Document
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;       // Tên hiển thị
    public string FilePath { get; set; } = string.Empty;       // Đường dẫn lưu server
    public string Category { get; set; } = "Giáo án";         // Giáo án, Nhạc đoàn, Văn bản, Tài liệu học
    public int Branch { get; set; }                            // 0: Chung, 1-4: từng ngành
    public string SchoolYear { get; set; } = "2025-2026";      // Niên khóa (text label)
    public Guid? AcademicYearId { get; set; }                  // FK Niên khóa (nếu có)
    public DocumentAccessLevel AccessLevel { get; set; } = DocumentAccessLevel.Public;
    public string Tags { get; set; } = string.Empty;           // Tag phân tách bằng dấu phẩy
    public DateTime UploadDate { get; set; } = DateTime.Now;
    public long FileSize { get; set; }
    public string UploadedBy { get; set; } = string.Empty;     // Ai upload
}