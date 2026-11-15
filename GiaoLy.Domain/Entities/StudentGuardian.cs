namespace GiaoLy.Domain.Entities;

public class StudentGuardian
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid GuardianId { get; set; }
    public Guardian? Guardian { get; set; }

    public string Relationship { get; set; } = string.Empty; // "Father", "Mother", "Godparent", "Sponsor", "Other"
    public bool IsPrimary { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
