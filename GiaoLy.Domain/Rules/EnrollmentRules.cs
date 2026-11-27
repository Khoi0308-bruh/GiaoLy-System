using GiaoLy.Domain.Entities;

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

        /// <summary>
        /// Ghi danh còn thuộc lớp trong niên khóa — dùng chung cho phạm vi trưởng lớp, sĩ số lớp
        /// và cột "Lớp" của danh sách. Graduated, DropOut, Transferred coi như đã rời lớp.
        /// </summary>
        public static readonly string[] InClass =
        [
            Active,
            Promoted,
            Repeated
        ];
    }

    public static bool IsValidStatus(string status)
    {
        return Statuses.All.Contains(status, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Rút khỏi lớp: chuyển sang DropOut, đóng ngày kết thúc và nối lý do vào ghi chú.
    /// Dùng chung cho rút lớp thủ công và xoá hồ sơ đoàn sinh, để hai đường không lệch nhau.
    /// </summary>
    public static void Withdraw(Enrollment enrollment, DateOnly withdrawDate, string reason)
    {
        var ghiChu = $"Rút khỏi lớp: {reason.Trim()}";

        enrollment.Status = Statuses.DropOut;
        enrollment.EndDate = withdrawDate;
        enrollment.Note = string.IsNullOrWhiteSpace(enrollment.Note)
            ? ghiChu
            : $"{enrollment.Note} | {ghiChu}";
        enrollment.UpdatedAt = DateTime.UtcNow;
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
