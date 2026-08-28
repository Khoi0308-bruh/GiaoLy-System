namespace GiaoLy.Domain.Entities;

public class Enrollment
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid ClassRoomId { get; set; }
    public ClassRoom? ClassRoom { get; set; }

    public string Status { get; set; } = "Active"; // Active, DropOut, Graduated
    public string Note { get; set; } = string.Empty;
}