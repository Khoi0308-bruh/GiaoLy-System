using System.Text.Json;

namespace GiaoLy.Domain.Rules;

/// <summary>
/// Quy tắc nghiệp vụ cho Xét lên lớp (Mục 6.7 Blueprint V3).
/// </summary>
public static class PromotionRules
{
    public static class BatchStatuses
    {
        public const string Draft = "Draft";
        public const string InReview = "InReview";
        public const string Applied = "Applied";
        public const string Cancelled = "Cancelled";

        public static readonly string[] All = [Draft, InReview, Applied, Cancelled];
    }

    public static class DraftStatuses
    {
        public const string Pending = "Pending";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
        public const string Stale = "Stale";
        public const string Applied = "Applied";

        public static readonly string[] All = [Pending, Approved, Rejected, Stale, Applied];
    }

    public static class Outcomes
    {
        public const string Promote = "Promote";
        public const string Repeat = "Repeat";
        public const string Graduate = "Graduate";
        public const string Manual = "Manual";

        public static readonly string[] All = [Promote, Repeat, Graduate, Manual];
    }

    public class GradeSnapshotData
    {
        public decimal? Gpa { get; set; }
        public decimal? AttendanceRate { get; set; }
        public string Status { get; set; } = "Incomplete";
        public string? GradeRowVersion { get; set; }
    }

    public static string SerializeSnapshot(decimal? gpa, decimal? attendanceRate, string status, byte[]? gradeRowVersion)
    {
        var data = new GradeSnapshotData
        {
            Gpa = gpa,
            AttendanceRate = attendanceRate,
            Status = status,
            GradeRowVersion = gradeRowVersion != null ? Convert.ToBase64String(gradeRowVersion) : null
        };
        return JsonSerializer.Serialize(data);
    }

    public static GradeSnapshotData? DeserializeSnapshot(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try
        {
            return JsonSerializer.Deserialize<GradeSnapshotData>(json);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Kiểm tra xem đề xuất có bị Stale (điểm đã đổi sau khi tạo bản nháp) hay không.
    /// </summary>
    public static bool IsStale(string? snapshotJson, byte[]? currentGradeRowVersion)
    {
        var snapshot = DeserializeSnapshot(snapshotJson);
        if (snapshot == null) return false;

        var currentVersionStr = currentGradeRowVersion != null ? Convert.ToBase64String(currentGradeRowVersion) : null;
        return !string.Equals(snapshot.GradeRowVersion, currentVersionStr, StringComparison.Ordinal);
    }
}
