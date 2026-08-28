using System;

namespace GiaoLy.Domain.Entities;

public class Certificate
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    public string CertificateType { get; set; } = string.Empty; // Baptism, Communion, Confirmation

    // Ví dụ: CERT-BAP-2026-X8R2 (Dễ gõ, khó đoán)
    public string VerificationCode { get; set; } = string.Empty;

    public string Celebrant { get; set; } = string.Empty; // Linh mục ban
    public string Godparent { get; set; } = string.Empty; // Người đỡ đầu
    public DateTime IssueDate { get; set; }
    public string SignedBy { get; set; } = "Cha Chánh Xứ";
}
