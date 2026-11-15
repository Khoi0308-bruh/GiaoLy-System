namespace GiaoLy.Domain.Entities;

public class StudentSacrament
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public string SacramentType { get; set; } = string.Empty; // "Baptism", "FirstCommunion", "Confirmation"
    public DateOnly? ReceivedOn { get; set; }
    public string? Place { get; set; }
    public string? Minister { get; set; }
    public string? Sponsor { get; set; }
    public string? BookNumber { get; set; }
    public string? Note { get; set; }

    public Guid? VerifiedBy { get; set; }
    public User? Verifier { get; set; }
    public DateTime? VerifiedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[]? RowVersion { get; set; }
}
