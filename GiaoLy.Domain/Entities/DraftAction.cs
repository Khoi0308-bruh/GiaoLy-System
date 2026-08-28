namespace GiaoLy.Domain.Entities;

public class DraftAction
{
    public Guid Id { get; set; }
    
    // Niên khóa mới mà dự kiến học sinh sẽ lên lớp/học lại
    public Guid TargetAcademicYearId { get; set; }
    public AcademicYear? TargetAcademicYear { get; set; }

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    // Lớp học dự kiến (nếu đủ điều kiện lên lớp, thường sẽ xếp vào lớp mới. Nếu ở lại, xếp lớp cũ)
    // Có thể null nếu BĐH muốn phân lớp sau.
    public Guid? SuggestedClassRoomId { get; set; }
    public ClassRoom? SuggestedClassRoom { get; set; }

    public bool IsQualified { get; set; } // Tình trạng từ năm cũ: true = Đủ điều kiện, false = Ở lại
    
    public string Reason { get; set; } = string.Empty; // Lý do không được lên lớp (vd: ĐTB < 5, vắng > 20%)
    
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
}
