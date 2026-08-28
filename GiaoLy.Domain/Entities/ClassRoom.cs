namespace GiaoLy.Domain.Entities;

/// <summary>
/// Entity Lớp học trong một Niên khóa.
/// LeaderId: ID của Huynh trưởng phụ trách lớp — dùng để xác thực quyền ABAC.
///   Không dùng MainTeacher (string) để so sánh vì chuỗi tên có thể trùng, sai chính tả.
///   Phải dùng Guid liên kết trực tiếp đến bảng Users để đảm bảo chính xác tuyệt đối.
/// </summary>
public class ClassRoom
{
    public Guid Id { get; set; }
    public string ClassName { get; set; } = string.Empty; // Ví dụ: Khối Ấu 1 - Lớp A
    public Guid AcademicYearId { get; set; }
    public AcademicYear? AcademicYear { get; set; }

    public int Branch { get; set; } // Ngành (1: Ấu, 2: Thiếu, 3: Nghĩa, 4: Hiệp)
    public string MainTeacher { get; set; } = string.Empty; // Tên GLV Chủ nhiệm (giữ lại cho hiển thị UI)

    /// <summary>
    /// ID của Huynh trưởng phụ trách lớp (liên kết bảng Users).
    /// Dùng bởi IsClassTeacherHandler để so sánh với userId trong JWT Token.
    /// Nullable: Lớp chưa được phân công GLV thì để null.
    /// </summary>
    public Guid? LeaderId { get; set; }

    /// <summary>Navigation property đến User — dùng khi cần Include thông tin GLV.</summary>
    public User? Leader { get; set; }

    public string RoomName { get; set; } = string.Empty;
}