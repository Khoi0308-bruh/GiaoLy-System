namespace GiaoLy.Domain.Entities;

public class Branch
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty; // AU, THIEU, NGHIA, HIEP
    public string Name { get; set; } = string.Empty; // Ấu Nhi, Thiếu Nhi, Nghĩa Sĩ, Hiệp Sĩ
    public byte? MinAge { get; set; }
    public byte? MaxAge { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<ClassLevel> ClassLevels { get; set; } = new List<ClassLevel>();
}
