namespace GiaoLy.Domain.Entities;

public class Leader
{
    public Guid Id { get; set; }
    public string HolyName { get; set; } = string.Empty; // Tên Thánh
    public string FullName { get; set; } = string.Empty; // Họ và Tên
    public string Position { get; set; } = string.Empty; // Chức vụ (Xứ đoàn trưởng, Thư ký...)

    // Cấp bậc hiển thị (1: Cha Tuyên úy, 2: Ban quản trị, 3: Trưởng ngành...)
    // Cái này giúp hệ thống tự động sắp xếp vị trí trên giao diện
    public int Level { get; set; }

    public string Term { get; set; } = "2023-2026"; // Nhiệm kỳ
    public string? AvatarPath { get; set; } // Đường dẫn ảnh chân dung
    public string? Description { get; set; } // Châm ngôn hoặc lời giới thiệu

    public bool IsActive { get; set; } = true;
    public int Branch { get; set; } // Thuộc ngành nào (0: Toàn đoàn, 1: Ấu...)
}