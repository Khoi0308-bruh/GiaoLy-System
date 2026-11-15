namespace GiaoLy.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }

    public Guid AcademicYearId { get; set; }
    public AcademicYear? AcademicYear { get; set; }

    public string Status { get; set; } = "Active"; // Active, Promoted, Repeated, Graduated, DropOut, Transferred
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public Grade? Grade { get; set; }
}
