namespace GiaoLy.Application.Certificates.Dtos;

public class IssueCertificateRequest
{
    public string CertificateType { get; set; } = string.Empty; // Baptism, FirstCommunion, Confirmation
    public string? SignedBy { get; set; } = "Cha Chánh Xứ";
}

public class RevokeCertificateRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class CertificateDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }

    public string CertificateType { get; set; } = string.Empty;
    public string CertificateTypeName { get; set; } = string.Empty;
    public string VerificationCode { get; set; } = string.Empty;

    public DateOnly? ReceivedOn { get; set; }
    public string? Place { get; set; }
    public string? Minister { get; set; }
    public string? Sponsor { get; set; }
    public string? BookNumber { get; set; }

    public DateTime IssuedAt { get; set; }
    public string? IssuedByName { get; set; }
    public string? SignedBy { get; set; }

    public string Status { get; set; } = "Issued";
    public DateTime? RevokedAt { get; set; }
    public string? RevokedByName { get; set; }
    public string? RevokeReason { get; set; }
    public string? PdfSha256 { get; set; }
}

public class PublicCertificateVerifyDto
{
    public string VerificationCode { get; set; } = string.Empty;
    public string CertificateType { get; set; } = string.Empty;
    public string CertificateTypeName { get; set; } = string.Empty;
    public string MaskedFullName { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public DateOnly? ReceivedOn { get; set; }
    public string? Place { get; set; }
    public string Parish { get; set; } = string.Empty;
    public string Diocese { get; set; } = string.Empty;
    public string Status { get; set; } = "Issued"; // Issued | Revoked
    public DateTime IssuedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
}
