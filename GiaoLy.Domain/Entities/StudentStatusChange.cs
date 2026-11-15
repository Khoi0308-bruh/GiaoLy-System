namespace GiaoLy.Domain.Entities;

public class StudentStatusChange
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public string? OldStatus { get; set; }
    public string NewStatus { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;

    public Guid? ChangedBy { get; set; }
    public User? Changer { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
