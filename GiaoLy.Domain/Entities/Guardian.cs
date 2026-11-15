namespace GiaoLy.Domain.Entities;

public class Guardian
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Occupation { get; set; }
    public string? Religion { get; set; }
    public string? Email { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<StudentGuardian> StudentGuardians { get; set; } = new List<StudentGuardian>();
}
