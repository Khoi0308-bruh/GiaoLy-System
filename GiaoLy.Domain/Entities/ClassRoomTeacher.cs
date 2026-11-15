namespace GiaoLy.Domain.Entities;

public class ClassRoomTeacher
{
    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public bool IsLead { get; set; } = false; // true = Chủ nhiệm, false = Phụ tá
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
