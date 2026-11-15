using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace GiaoLy.Domain.Rules;

public static partial class VietnameseNormalizer
{
    private static readonly Regex MultipleSpacesRegex = MyMultipleSpacesRegex();

    public static string NormalizeName(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        // Collapse multiple spaces and trim
        var collapsed = MultipleSpacesRegex.Replace(text.Trim(), " ");

        // Unaccent, convert 'đ'/'Đ' to 'd', and convert to lower case
        return RemoveDiacritics(collapsed).ToLowerInvariant();
    }

    public static string CleanDisplay(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        return MultipleSpacesRegex.Replace(text.Trim(), " ");
    }

    public static string RemoveDiacritics(string text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;

        // Custom replacement for Vietnamese specific letter 'đ'/'Đ'
        var sb = new StringBuilder();
        foreach (var ch in text)
        {
            if (ch == 'đ' || ch == 'Đ')
                sb.Append('d');
            else
                sb.Append(ch);
        }

        var normalizedString = sb.ToString().Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder(normalizedString.Length);

        for (int i = 0; i < normalizedString.Length; i++)
        {
            char c = normalizedString[i];
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex MyMultipleSpacesRegex();
}
