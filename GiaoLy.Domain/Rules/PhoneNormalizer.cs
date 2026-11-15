using System.Text.RegularExpressions;

namespace GiaoLy.Domain.Rules;

public static partial class PhoneNormalizer
{
    private static readonly Regex NonDigitsRegex = MyNonDigitsRegex();
    private static readonly Regex VietnamPhoneRegex = MyVietnamPhoneRegex();

    public static string Normalize(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return string.Empty;

        var trimmed = phone.Trim();

        // Handle +84 prefix
        if (trimmed.StartsWith("+84", StringComparison.Ordinal))
        {
            trimmed = "0" + trimmed[3..];
        }
        else if (trimmed.StartsWith("84", StringComparison.Ordinal) && trimmed.Length >= 11)
        {
            trimmed = "0" + trimmed[2..];
        }

        // Strip non-digits
        var digits = NonDigitsRegex.Replace(trimmed, "");

        // If Excel lost leading 0 and length is 9 digits, prepend 0
        if (digits.Length == 9 && (digits.StartsWith('3') || digits.StartsWith('5') || digits.StartsWith('7') || digits.StartsWith('8') || digits.StartsWith('9')))
        {
            digits = "0" + digits;
        }

        return digits;
    }

    public static bool IsValidVietnamPhone(string? phone)
    {
        var normalized = Normalize(phone);
        return !string.IsNullOrEmpty(normalized) && VietnamPhoneRegex.IsMatch(normalized);
    }

    [GeneratedRegex(@"[^\d]")]
    private static partial Regex MyNonDigitsRegex();

    [GeneratedRegex(@"^0[35789]\d{8}$")]
    private static partial Regex MyVietnamPhoneRegex();
}
