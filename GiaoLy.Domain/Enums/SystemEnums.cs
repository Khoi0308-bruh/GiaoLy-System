namespace GiaoLy.Domain.Enums;

public enum UserRole
{
    Admin = 1,
    Secretary = 2, // Thư ký đoàn
    Moderator = 3, // Trưởng ngành
    Viewer = 4     // Giáo lý viên/Phụ huynh
}

public enum HolyBranch
{
    General = 0, // Chung toàn đoàn
    Au = 1,      // Ngành Ấu
    Thieu = 2,   // Ngành Thiếu
    Nghia = 3,   // Ngành Nghĩa
    Hiep = 4     // Ngành Hiệp
}