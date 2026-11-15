namespace GiaoLy.Domain.Entities;

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsSystem { get; set; } = false;
    public string ScopeType { get; set; } = "All"; // All, Branch, Classroom, Guardian
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
