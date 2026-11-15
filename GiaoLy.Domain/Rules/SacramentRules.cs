namespace GiaoLy.Domain.Rules;

public static class SacramentRules
{
    public const string Baptism = "Baptism";
    public const string FirstCommunion = "FirstCommunion";
    public const string Confirmation = "Confirmation";

    public static readonly HashSet<string> AllSacramentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        Baptism, FirstCommunion, Confirmation
    };

    public static string? NormalizeSacramentType(string? rawType)
    {
        if (string.IsNullOrWhiteSpace(rawType)) return null;

        var clean = rawType.Trim().ToLowerInvariant()
            .Replace("-", "")
            .Replace("_", "")
            .Replace(" ", "");

        if (clean is "baptism" or "ruatoi") return Baptism;
        if (clean is "firstcommunion" or "communion" or "ruocle" or "eucharist") return FirstCommunion;
        if (clean is "confirmation" or "themsuc") return Confirmation;

        return null;
    }

    public static bool ValidateOrder(
        DateOnly? birthDate,
        DateOnly? baptismDate,
        DateOnly? communionDate,
        DateOnly? confirmationDate,
        out string? errorMessage)
    {
        if (birthDate.HasValue && baptismDate.HasValue && baptismDate.Value < birthDate.Value)
        {
            errorMessage = $"Ngày lãnh Bí tích Rửa tội ({baptismDate.Value:dd/MM/yyyy}) không thể trước ngày sinh ({birthDate.Value:dd/MM/yyyy}).";
            return false;
        }

        if (baptismDate.HasValue && communionDate.HasValue && communionDate.Value < baptismDate.Value)
        {
            errorMessage = $"Ngày lãnh Bí tích Rước lễ lần đầu ({communionDate.Value:dd/MM/yyyy}) không thể trước ngày Rửa tội ({baptismDate.Value:dd/MM/yyyy}).";
            return false;
        }

        if (communionDate.HasValue && confirmationDate.HasValue && confirmationDate.Value < communionDate.Value)
        {
            errorMessage = $"Ngày lãnh Bí tích Thêm sức ({confirmationDate.Value:dd/MM/yyyy}) không thể trước ngày Rước lễ lần đầu ({communionDate.Value:dd/MM/yyyy}).";
            return false;
        }

        if (baptismDate.HasValue && confirmationDate.HasValue && confirmationDate.Value < baptismDate.Value)
        {
            errorMessage = $"Ngày lãnh Bí tích Thêm sức ({confirmationDate.Value:dd/MM/yyyy}) không thể trước ngày Rửa tội ({baptismDate.Value:dd/MM/yyyy}).";
            return false;
        }

        errorMessage = null;
        return true;
    }
}
