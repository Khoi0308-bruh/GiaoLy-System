namespace GiaoLy.Domain.Entities;

public class AcademicYear
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty; // Niên khóa (ví dụ: "2026-2027")
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    // Máy trạng thái vòng đời: Planned, Active, Closing, Archived
    public string Status { get; set; } = "Planned";

    public DateTime? ActivatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public DateTime? ArchivedAt { get; set; }
    public DateTime? ReopenedAt { get; set; }
    public string? ReopenReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    // Compatibility properties
    public bool IsActive
    {
        get => Status == "Active";
        set
        {
            if (value && Status != "Active") Status = "Active";
        }
    }

    public bool IsLocked
    {
        get => Status == "Closing" || Status == "Archived";
        set { }
    }

    public bool IsArchived
    {
        get => Status == "Archived";
        set
        {
            if (value) Status = "Archived";
        }
    }

    public ICollection<ClassRoom> ClassRooms { get; set; } = new List<ClassRoom>();
}
