using System.Security.Cryptography;
using System.Text.Json;

namespace GiaoLy.Domain.Rules;

/// <summary>
/// Quy tắc miền cho Chứng chỉ bí tích (Mục 6.8 Blueprint V3).
/// </summary>
public static class CertificateRules
{
    public static class Types
    {
        public const string Baptism = "Baptism";
        public const string FirstCommunion = "FirstCommunion";
        public const string Confirmation = "Confirmation";

        public static readonly string[] All = [Baptism, FirstCommunion, Confirmation];
    }

    public static class Statuses
    {
        public const string Issued = "Issued";
        public const string Revoked = "Revoked";
    }

    /// <summary>
    /// Bộ 32 ký hiệu không gây nhầm lẫn (loại bỏ 0, 1, I, O).
    /// 32^12 = 2^60 bit entropy an toàn mật mã.
    /// </summary>
    public const string Alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

    public static string GetPrefix(string certificateType)
    {
        return certificateType switch
        {
            Types.Baptism => "BAP",
            Types.FirstCommunion => "COM",
            Types.Confirmation => "CON",
            _ => "OTH"
        };
    }

    public static string GetTypeNameVi(string certificateType)
    {
        return certificateType switch
        {
            Types.Baptism => "Rửa Tội",
            Types.FirstCommunion => "Rước Lễ Lần Đầu",
            Types.Confirmation => "Thêm Sức",
            _ => certificateType
        };
    }

    /// <summary>
    /// Sinh mã xác thực chuẩn: CERT-{BAP|COM|CON}-{năm}-XXXX-XXXX-XXXX
    /// </summary>
    public static string GenerateVerificationCode(string certificateType, int year)
    {
        var prefix = GetPrefix(certificateType);
        var randomBytes = new byte[12];
        RandomNumberGenerator.Fill(randomBytes);

        var chars = new char[12];
        for (int i = 0; i < 12; i++)
        {
            chars[i] = Alphabet[randomBytes[i] % Alphabet.Length];
        }

        var part1 = new string(chars, 0, 4);
        var part2 = new string(chars, 4, 4);
        var part3 = new string(chars, 8, 4);

        return $"CERT-{prefix}-{year}-{part1}-{part2}-{part3}";
    }

    /// <summary>
    /// Che tên khi xác thực công khai: "Nguyễn Văn An" -> "Nguyễn V*** A***"
    /// Không làm lộ toàn bộ họ tên đầy đủ (Quy tắc F6 & V1).
    /// </summary>
    public static string MaskStudentName(string? fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName)) return string.Empty;

        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length <= 1)
        {
            var single = parts[0];
            return single.Length <= 2 ? single : $"{single[0]}***";
        }

        var masked = new List<string> { parts[0] }; // Họ giữ nguyên

        for (int i = 1; i < parts.Length; i++)
        {
            var p = parts[i];
            masked.Add($"{p[0]}***");
        }

        return string.Join(" ", masked);
    }

    public class CertificateSnapshot
    {
        public Guid StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string? HolyName { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateOnly BirthDate { get; set; }
        public string SacramentType { get; set; } = string.Empty;
        public DateOnly? ReceivedOn { get; set; }
        public string? Place { get; set; }
        public string? Minister { get; set; }
        public string? Sponsor { get; set; }
        public string? BookNumber { get; set; }
        public string Parish { get; set; } = "Giáo Xứ";
        public string Diocese { get; set; } = "Giáo Phận";
    }

    public static string SerializeSnapshot(CertificateSnapshot snapshot)
    {
        return JsonSerializer.Serialize(snapshot);
    }

    public static CertificateSnapshot? DeserializeSnapshot(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try
        {
            return JsonSerializer.Deserialize<CertificateSnapshot>(json);
        }
        catch
        {
            return null;
        }
    }
}
