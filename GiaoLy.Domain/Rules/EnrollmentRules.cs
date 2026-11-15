namespace GiaoLy.Domain.Rules;

/// <summary>
/// Quy tắc miền cho Ghi danh (Mục 6.5 Blueprint V3).
/// </summary>
public static class EnrollmentRules
{
    public static class Statuses
    {
        public const string Active = "Active";
        public const string Promoted = "Promoted";
        public const string Repeated = "Repeated";
        public const string Graduated = "Graduated";
        public const string DropOut = "DropOut";
        public const string Transferred = "Transferred";

        public static readonly string[] All =
        [
            Active,
            Promoted,
            Repeated,
            Graduated,
            DropOut,
            Transferred
        ];
    }

    public static bool IsValidStatus(string status)
    {
        return Statuses.All.Contains(status, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Không cho phép xếp lớp cho học sinh đã nghỉ học (Left) hoặc đã tốt nghiệp (Graduated).
    /// </summary>
    public static bool CanEnrollStudent(string studentStatus)
    {
        if (string.Equals(studentStatus, "Left", StringComparison.OrdinalIgnoreCase))
            return false;

        if (string.Equals(studentStatus, "Graduated", StringComparison.OrdinalIgnoreCase))
            return false;

        return true;
    }
}
