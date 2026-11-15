namespace GiaoLy.Domain.Rules;

public enum DuplicateLevel
{
    None = 0,
    Possible = 1,  // Cùng tên, khác ngày sinh, cùng SĐT phụ huynh
    Probable = 2,  // Cùng ngày sinh và (cùng tên hoặc tên khác đúng 1 ký tự)
    Exact = 3      // Cùng tên, cùng ngày sinh, chung ít nhất 1 phụ huynh
}

public record DuplicateCheckResult(
    DuplicateLevel Level,
    string? Message,
    Guid? ExistingStudentId,
    string? ExistingStudentCode,
    string? ExistingStudentFullName
);

public static class StudentDuplicateChecker
{
    public static DuplicateCheckResult Check(
        string candidateNormalizedName,
        DateOnly candidateBirthDate,
        IEnumerable<string> candidateGuardianPhones,
        string existingNormalizedName,
        DateOnly existingBirthDate,
        IEnumerable<string> existingGuardianPhones,
        Guid existingStudentId,
        string existingStudentCode,
        string existingStudentFullName)
    {
        var candidatePhones = new HashSet<string>(candidateGuardianPhones.Where(p => !string.IsNullOrEmpty(p)));
        var existingPhones = new HashSet<string>(existingGuardianPhones.Where(p => !string.IsNullOrEmpty(p)));

        bool sameName = string.Equals(candidateNormalizedName, existingNormalizedName, StringComparison.OrdinalIgnoreCase);
        bool sameBirthDate = candidateBirthDate == existingBirthDate;
        bool hasCommonPhone = candidatePhones.Overlaps(existingPhones);

        // 1. Exact Duplicate
        if (sameName && sameBirthDate && hasCommonPhone)
        {
            return new DuplicateCheckResult(
                DuplicateLevel.Exact,
                $"Phát hiện hồ sơ trùng khớp tuyệt đối (Exact) với em {existingStudentFullName} (Mã: {existingStudentCode}, sinh ngày {existingBirthDate:dd/MM/yyyy}).",
                existingStudentId,
                existingStudentCode,
                existingStudentFullName
            );
        }

        // 2. Probable Duplicate
        if (sameBirthDate)
        {
            int distance = CalculateLevenshteinDistance(candidateNormalizedName, existingNormalizedName);
            if (sameName || distance <= 1)
            {
                return new DuplicateCheckResult(
                    DuplicateLevel.Probable,
                    $"Phát hiện hồ sơ nghi vấn trùng (Probable) với em {existingStudentFullName} (Mã: {existingStudentCode}, sinh ngày {existingBirthDate:dd/MM/yyyy}). Vui lòng kiểm tra lại để tránh tạo trùng.",
                    existingStudentId,
                    existingStudentCode,
                    existingStudentFullName
                );
            }
        }

        // 3. Possible Duplicate
        if (sameName && !sameBirthDate && hasCommonPhone)
        {
            return new DuplicateCheckResult(
                DuplicateLevel.Possible,
                $"Gợi ý xem lại: Em có cùng họ tên và số điện thoại phụ huynh với em {existingStudentFullName} (Mã: {existingStudentCode}, sinh ngày {existingBirthDate:dd/MM/yyyy}). Có thể đã gõ nhầm năm sinh?",
                existingStudentId,
                existingStudentCode,
                existingStudentFullName
            );
        }

        return new DuplicateCheckResult(DuplicateLevel.None, null, null, null, null);
    }

    public static int CalculateLevenshteinDistance(string s1, string s2)
    {
        if (string.IsNullOrEmpty(s1)) return s2?.Length ?? 0;
        if (string.IsNullOrEmpty(s2)) return s1.Length;

        int n = s1.Length;
        int m = s2.Length;
        int[,] d = new int[n + 1, m + 1];

        for (int i = 0; i <= n; i++) d[i, 0] = i;
        for (int j = 0; j <= m; j++) d[j, 0] = j;

        for (int i = 1; i <= n; i++)
        {
            for (int j = 1; j <= m; j++)
            {
                int cost = (s1[i - 1] == s2[j - 1]) ? 0 : 1;
                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost
                );
            }
        }

        return d[n, m];
    }
}
