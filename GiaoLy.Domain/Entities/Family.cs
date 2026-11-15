namespace GiaoLy.Domain.Entities;

public class Family
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? PatronSaint { get; set; }
    
    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }
    
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
