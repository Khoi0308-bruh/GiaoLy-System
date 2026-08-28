namespace GiaoLy.Domain.Entities;

public class Family
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PatronSaint { get; set; } = string.Empty;
    
    public Guid? ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }
    
    public Guid? LeaderId { get; set; } // Liên kết với Giáo Lý Viên phụ trách
    public User? Leader { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
