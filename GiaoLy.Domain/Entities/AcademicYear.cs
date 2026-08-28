namespace GiaoLy.Domain.Entities;

/// <summary>
/// Entity Niên khóa Giáo lý.
/// IsLocked: Khi đã khóa, sổ điểm không thể sửa nữa (tự động set khi quá EndDate).
/// IsArchived: Niên học được lưu trữ vĩnh viễn sau khi đã xử lý xong.
/// </summary>
public class AcademicYear
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty; // Ví dụ: 2025-2026
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    /// <summary>Niên học hiện hành đang hoạt động (chỉ 1 niên học IsActive=true tại một thời điểm).</summary>
    public bool IsActive { get; set; } = false;

    /// <summary>
    /// Sổ điểm đã bị khóa — không cho phép sửa điểm nữa.
    /// Tự động set = true bởi GradebookFinalizerService khi vượt quá EndDate.
    /// </summary>
    public bool IsLocked { get; set; } = false;

    /// <summary>
    /// Niên học đã được lưu trữ — hiển thị trong mục lịch sử, ẩn khỏi danh sách hoạt động.
    /// Tự động set = true cùng lúc với IsLocked.
    /// </summary>
    public bool IsArchived { get; set; } = false;
}