namespace GiaoLy.Domain.Entities;

/// <summary>
/// Entity điểm số của đoàn sinh trong một lớp học.
///
/// QUAN TRỌNG — Lý do đổi từ Computed Properties (=>) sang property thường:
///   Entity Framework Core bỏ qua hoàn toàn các thuộc tính chỉ có getter (=>).
///   Chúng KHÔNG được tạo thành cột trong Database.
///   Hệ quả: Câu truy vấn db.Grades.Where(g => g.IsQualified) sẽ CRASH vì
///   SQL Server không có cột "IsQualified" để lọc.
///
/// Giải pháp: Dùng hàm Calculate() — Tính bằng C# code, lưu kết quả vào DB.
///   Hoạt động độc lập với loại Database (SQL Server, PostgreSQL, MySQL).
///   Dễ dàng chuyển đổi DB engine sau này mà không cần sửa Migration.
/// </summary>
public class Grade
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }

    // ─── Các cột điểm thành phần ────────────────────────────────────────────
    public double Oral { get; set; }        // Điểm Miệng (Hệ số 1)
    public double SmallTest { get; set; }   // Điểm 15 phút (Hệ số 1)
    public double BigTest { get; set; }     // Điểm 1 Tiết (Hệ số 2)
    public double FinalExam { get; set; }   // Điểm Thi Học Kỳ (Hệ số 3)

    // ─── Chuyên cần ─────────────────────────────────────────────────────────
    public int Absences { get; set; }               // Số buổi vắng
    public int TotalSessions { get; set; } = 30;    // Mặc định 30 buổi/năm

    // ─── Thuộc tính tính toán — LƯU VÀO DB để có thể QUERY được ────────────
    // Cần { get; set; } để EF Core tạo cột trong Database.
    // Giá trị được cập nhật mỗi khi gọi Calculate().
    public double GPA { get; set; }
    public double AttendanceRate { get; set; }
    public bool IsQualified { get; set; }

    /// <summary>
    /// Tính toán và cập nhật GPA, AttendanceRate, IsQualified.
    /// GỌI HÀM NÀY trước mỗi lần SaveChanges() khi có thay đổi điểm.
    ///
    /// Công thức GPA (theo trọng số):
    ///   GPA = (Miệng + 15p + (1Tiết × 2) + (HK × 3)) / 7
    ///
    /// Điều kiện lên lớp (IsQualified = true):
    ///   - GPA >= 5.0
    ///   - Tỷ lệ chuyên cần >= 80% (không vắng quá 20%)
    /// </summary>
    public void Calculate()
    {
        // Công thức GPA theo trọng số, làm tròn 1 chữ số thập phân
        GPA = Math.Round(
            (Oral + SmallTest + (BigTest * 2) + (FinalExam * 3)) / 7.0,
            1,
            MidpointRounding.AwayFromZero
        );

        // Tỷ lệ chuyên cần = (Tổng - Vắng) / Tổng, làm tròn 4 chữ số
        AttendanceRate = TotalSessions > 0
            ? Math.Round((double)(TotalSessions - Absences) / TotalSessions, 4)
            : 1.0;

        // Học sinh đủ điều kiện lên lớp khi đạt cả 2 tiêu chí
        IsQualified = GPA >= 5.0 && AttendanceRate >= 0.8;
    }
}
