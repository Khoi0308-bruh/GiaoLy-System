namespace GiaoLy.Domain.Entities;

public class SacramentRequirement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SacramentType { get; set; } = string.Empty; // "Baptism", "FirstCommunion", "Confirmation"
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public ICollection<StudentRequirementProgress> Progresses { get; set; } = new List<StudentRequirementProgress>();

    // Compatibility property
    public int Order
    {
        get => SortOrder;
        set => SortOrder = value;
    }
}
