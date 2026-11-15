namespace GiaoLy.Domain.Entities;

public class GuardianLink
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public string Relationship { get; set; } = string.Empty; // Cha, Me, NguoiGiamHo
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }
    public User? Verifier { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
