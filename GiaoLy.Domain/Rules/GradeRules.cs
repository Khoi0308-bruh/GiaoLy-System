namespace GiaoLy.Domain.Rules;

/// <summary>
/// Quy tắc thuần cho Điểm số và Chuyên cần (Mục 6.6 Blueprint V3).
/// Không phụ thuộc EF Core, DbContext, hay HTTP.
/// </summary>
public static class GradeRules
{
    public const decimal DefaultMinGpa = 5.0m;
    public const decimal DefaultMinAttendance = 80.0m;

    /// <summary>
    /// Công thức tính GPA:
    /// GPA = (Oral*1 + SmallTest*1 + BigTest*2 + FinalExam*3) / tổng hệ số các ô đã nhập
    /// Làm tròn nửa lên (AwayFromZero) một chữ số thập phân.
    /// Ô trống (null) là chưa nhập, KHÔNG tính vào tổng hệ số, khác với điểm 0.
    /// </summary>
    public static decimal? CalculateGpa(decimal? oral, decimal? smallTest, decimal? bigTest, decimal? finalExam)
    {
        decimal weightedSum = 0m;
        int totalWeight = 0;

        if (oral.HasValue)
        {
            weightedSum += oral.Value * 1m;
            totalWeight += 1;
        }

        if (smallTest.HasValue)
        {
            weightedSum += smallTest.Value * 1m;
            totalWeight += 1;
        }

        if (bigTest.HasValue)
        {
            weightedSum += bigTest.Value * 2m;
            totalWeight += 2;
        }

        if (finalExam.HasValue)
        {
            weightedSum += finalExam.Value * 3m;
            totalWeight += 3;
        }

        if (totalWeight == 0)
        {
            return null;
        }

        decimal rawGpa = weightedSum / totalWeight;
        return Math.Round(rawGpa, 1, MidpointRounding.AwayFromZero);
    }

    /// <summary>
    /// Chuyên cần = (tổng buổi − buổi vắng) ÷ tổng buổi × 100, làm tròn một chữ số.
    /// Dữ liệu không hợp lệ (tổng buổi không dương, vắng âm hoặc lớn hơn tổng) cho kết quả null, không ném lỗi.
    /// </summary>
    public static decimal? CalculateAttendanceRate(int? totalSessions, int? absences)
    {
        if (!totalSessions.HasValue || !absences.HasValue)
        {
            return null;
        }

        if (totalSessions.Value <= 0 || absences.Value < 0 || absences.Value > totalSessions.Value)
        {
            return null;
        }

        decimal rate = ((decimal)(totalSessions.Value - absences.Value) / totalSessions.Value) * 100m;
        return Math.Round(rate, 1, MidpointRounding.AwayFromZero);
    }

    /// <summary>
    /// Xác định trạng thái kết quả điểm theo Bảng 6.6:
    /// - Thi kết khóa (bắt buộc theo cài đặt)
    /// - Chuyên cần hợp lệ (bắt buộc theo cài đặt)
    /// - GPA >= ngưỡng
    /// - Chuyên cần >= ngưỡng
    /// Kết quả: Incomplete | NotQualified | Qualified
    /// </summary>
    public static (string Status, string? Reason) DetermineStatus(
        decimal? gpa,
        decimal? attendanceRate,
        bool hasFinalExam,
        bool requireFinalExam = true,
        bool requireAttendance = true,
        decimal minGpa = DefaultMinGpa,
        decimal minAttendance = DefaultMinAttendance)
    {
        if (requireFinalExam && !hasFinalExam)
        {
            return ("Incomplete", "Chưa có điểm thi kết khóa");
        }

        if (requireAttendance && !attendanceRate.HasValue)
        {
            return ("Incomplete", "Chưa có dữ liệu chuyên cần hợp lệ");
        }

        if (!gpa.HasValue)
        {
            return ("Incomplete", "Chưa đủ điểm số để tính trung bình");
        }

        if (gpa.Value < minGpa)
        {
            return ("NotQualified", $"Điểm trung bình {gpa.Value:F1} dưới ngưỡng ({minGpa:F1})");
        }

        if (requireAttendance && attendanceRate.HasValue && attendanceRate.Value < minAttendance)
        {
            return ("NotQualified", $"Chuyên cần {attendanceRate.Value:F1}% dưới ngưỡng ({minAttendance:F1}%)");
        }

        return ("Qualified", null);
    }

    /// <summary>
    /// Kiểm tra điểm có nằm trong khoảng hợp lệ từ 0 đến 10 với tối đa 2 chữ số thập phân.
    /// </summary>
    public static bool IsScoreValid(decimal? score)
    {
        if (!score.HasValue) return true;
        if (score.Value < 0m || score.Value > 10m) return false;

        // Tối đa 2 chữ số thập phân
        return decimal.Round(score.Value, 2) == score.Value;
    }

    /// <summary>
    /// Kiểm tra buổi chuyên cần hợp lệ
    /// </summary>
    public static bool IsSessionValid(int? totalSessions, int? absences)
    {
        if (!totalSessions.HasValue && !absences.HasValue) return true;

        if (totalSessions.HasValue && totalSessions.Value <= 0) return false;
        if (absences.HasValue && absences.Value < 0) return false;

        if (totalSessions.HasValue && absences.HasValue && absences.Value > totalSessions.Value)
            return false;

        return true;
    }
}
