namespace GiaoLy.Domain.Entities;

public class ClassRoom
{
    private string _legacyClassName = string.Empty;
    private int _legacyBranch;
    private Guid? _legacyLeaderId;
    private string _legacyMainTeacher = string.Empty;

    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AcademicYearId { get; set; }
    public AcademicYear? AcademicYear { get; set; }

    public int ClassLevelId { get; set; }
    public ClassLevel? ClassLevel { get; set; }

    public string Section { get; set; } = string.Empty; // Phân lớp: "A", "B", hoặc rỗng
    public string? RoomName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public byte[]? RowVersion { get; set; }

    public ICollection<ClassRoomTeacher> Teachers { get; set; } = new List<ClassRoomTeacher>();
    public ICollection<Family> Families { get; set; } = new List<Family>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    // Computed / Compatibility properties
    public string Name => ClassName;

    public string ClassName
    {
        get
        {
            if (ClassLevel != null)
            {
                return string.IsNullOrWhiteSpace(Section) ? ClassLevel.Name : $"{ClassLevel.Name} - {Section}";
            }
            return !string.IsNullOrWhiteSpace(_legacyClassName) ? _legacyClassName : string.Empty;
        }
        set => _legacyClassName = value;
    }

    public int Branch
    {
        get => ClassLevel?.BranchId ?? _legacyBranch;
        set => _legacyBranch = value;
    }

    public Guid? LeaderId
    {
        get
        {
            var lead = Teachers.FirstOrDefault(t => t.IsLead);
            return lead?.UserId ?? _legacyLeaderId;
        }
        set => _legacyLeaderId = value;
    }

    public string MainTeacher
    {
        get
        {
            var lead = Teachers.FirstOrDefault(t => t.IsLead);
            return lead?.User?.FullName ?? _legacyMainTeacher;
        }
        set => _legacyMainTeacher = value;
    }
}
