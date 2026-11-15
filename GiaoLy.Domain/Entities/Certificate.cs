namespace GiaoLy.Domain.Entities;

/// <summary>
/// Chứng chỉ bí tích đã cấp: ảnh chụp bất biến, mã xác thực dài, thu hồi thay vì xóa (Mục 6.8 & schema-v3.sql).
/// </summary>
public class Certificate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid StudentSacramentId { get; set; }
    public StudentSacrament? StudentSacrament { get; set; }

    public string CertificateType { get; set; } = string.Empty; // Baptism, FirstCommunion, Confirmation

    public string VerificationCode { get; set; } = string.Empty; // CERT-{TYPE}-{YEAR}-XXXX-XXXX-XXXX

    public string Snapshot { get; set; } = string.Empty; // JSON snapshot bất biến

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    public Guid IssuedBy { get; set; }
    public User? Issuer { get; set; }

    public string? SignedBy { get; set; } = "Cha Chánh Xứ";

    public string Status { get; set; } = "Issued"; // Issued, Revoked

    public DateTime? RevokedAt { get; set; }
    public Guid? RevokedBy { get; set; }
    public User? Revoker { get; set; }
    public string? RevokeReason { get; set; }

    public string? PdfSha256 { get; set; } // SHA-256 hash của PDF khi phát hành

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    // Backward compatibility helper properties
    public string Celebrant { get; set; } = string.Empty;
    public string Godparent { get; set; } = string.Empty;
    public DateTime IssueDate { get => IssuedAt; set => IssuedAt = value; }
}
