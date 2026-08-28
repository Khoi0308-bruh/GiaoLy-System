namespace GiaoLy.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // Sẽ dùng BCrypt để mã hóa
    public string FullName { get; set; } = string.Empty;

    // Bổ sung thông tin mở rộng cho Profile
    public string ChristianName { get; set; } = string.Empty; // Tên Thánh
    public string AvatarPath { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;

    // Phân quyền: Admin (Toàn quyền), Mod (Huynh trưởng ngành), Viewer (Đoàn sinh/Phụ huynh)
    // TODO: Sẽ gỡ bỏ thuộc tính này sau khi hoàn tất migration sang RoleId
    public string Role { get; set; } = "Viewer";

    // Phân quyền chuẩn RBAC mới (Chạy song song)
    public Guid? RoleId { get; set; }
    public Role? RoleEntity { get; set; }

    // Nếu là Mod, ghi nhận họ thuộc ngành nào (1: Ấu, 2: Thiếu, 3: Nghĩa, 4: Hiệp)
    public int? Branch { get; set; }

    // Lưu thời gian tạo theo UTC — múi giờ sẽ được xử lý tại tầng Application
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}