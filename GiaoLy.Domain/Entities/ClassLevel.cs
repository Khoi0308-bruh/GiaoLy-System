namespace GiaoLy.Domain.Entities;

public class ClassLevel
{
    public int Id { get; set; }
    public int BranchId { get; set; }
    public Branch? Branch { get; set; }

    public string Code { get; set; } = string.Empty; // AU1, AU2, THIEU1, etc.
    public string Name { get; set; } = string.Empty; // Ấu 1, Ấu 2, etc.
    public byte LevelKey { get; set; } // Continuous key: 1 (AU1) to 11 (HIEP2)

    public int? NextLevelId { get; set; }
    public ClassLevel? NextLevel { get; set; }

    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<ClassRoom> ClassRooms { get; set; } = new List<ClassRoom>();
}
