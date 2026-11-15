namespace GiaoLy.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? ChristianName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public string? AvatarPath { get; set; }

    public Guid RoleId { get; set; }
    public Role? RoleEntity { get; set; }

    // Ngành phụ trách cho vai trò phạm vi Branch (1: Ấu, 2: Thiếu, 3: Nghĩa, 4: Hiệp)
    public int? BranchId { get; set; }

    // Compatibility properties
    public string Role
    {
        get => RoleEntity?.Code ?? "Viewer";
        set { }
    }
    public int? Branch
    {
        get => BranchId;
        set => BranchId = value;
    }

    public bool IsActive { get; set; } = true;
    public bool MustChangePassword { get; set; } = false;
    public int FailedLoginCount { get; set; } = 0;
    public DateTime? LockoutUntil { get; set; }
    public Guid SecurityStamp { get; set; } = Guid.NewGuid();
    public DateTime? PasswordChangedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<GuardianLink> GuardianLinks { get; set; } = new List<GuardianLink>();
}
