namespace GiaoLy.Domain.Entities;

/// <summary>
/// Entity Điểm số của một ghi danh (Mục 6.6 & schema-v3.sql).
/// Điểm của 1 ghi danh mang tính độc lập theo từng niên khóa và lớp học.
/// </summary>
public class Grade
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid EnrollmentId { get; set; }
    public Enrollment? Enrollment { get; set; }

    // Điểm thành phần từ 0 đến 10, null là chưa nhập (khác 0)
    public decimal? Oral { get; set; }
    public decimal? SmallTest { get; set; }
    public decimal? BigTest { get; set; }
    public decimal? FinalExam { get; set; }

    // Chuyên cần
    public int? TotalSessions { get; set; }
    public int? Absences { get; set; }

    // Thuộc tính tính toán được lưu DB để query và lọc
    public decimal? ComputedGpa { get; set; }
    public string? ComputedStatus { get; set; } // Incomplete, Qualified, NotQualified
    public DateTime? ComputedAt { get; set; }
    public string? Remarks { get; set; }

    public Guid? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    // Backward compatibility helper properties for legacy controllers
    public Guid StudentId => Enrollment?.StudentId ?? Guid.Empty;
    public Guid ClassRoomId => Enrollment?.ClassRoomId ?? Guid.Empty;
    public double GPA => (double)(ComputedGpa ?? 0m);
    public bool IsQualified => ComputedStatus == "Qualified";
    public double AttendanceRate => (TotalSessions ?? 0) > 0
        ? Math.Round((double)(TotalSessions!.Value - (Absences ?? 0)) / TotalSessions.Value, 4)
        : 1.0;

    /// <summary>
    /// Tính toán và gán giá trị GPA và Trạng thái theo quy tắc miền thuần.
    /// </summary>
    public void Calculate()
    {
        ComputedGpa = Rules.GradeRules.CalculateGpa(Oral, SmallTest, BigTest, FinalExam);
        var attendance = Rules.GradeRules.CalculateAttendanceRate(TotalSessions, Absences);
        var (status, _) = Rules.GradeRules.DetermineStatus(
            ComputedGpa,
            attendance,
            FinalExam.HasValue,
            requireFinalExam: true,
            requireAttendance: true);
        ComputedStatus = status;
        ComputedAt = DateTime.UtcNow;
    }
}
