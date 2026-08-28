namespace GiaoLy.Domain.Entities;

public class StudentScore
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid StudentId { get; set; }
    public string ClassName { get; set; } = string.Empty; // Liên kết với lớp hiện tại của học sinh
    
    // Điểm số
    public double? Semester1 { get; set; }
    public double? Semester2 { get; set; }
    
    // Tính toán trung bình
    public double? FinalScore { get; set; }
    
    public string? Remarks { get; set; } // Nhận xét của GLV

    // Navigation property
    public Student? Student { get; set; }
}
