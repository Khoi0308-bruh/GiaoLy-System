namespace GiaoLy.Application.Enrollments.Dtos;

public class EnrollmentDto
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public Guid ClassRoomId { get; set; }
    public string ClassRoomName { get; set; } = string.Empty;
    public Guid AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public string RowVersion { get; set; } = string.Empty;
}

public class EnrollStudentsRequest
{
    public List<Guid> StudentIds { get; set; } = new();
    public DateOnly? StartDate { get; set; }
    public string? Note { get; set; }
}

public class TransferEnrollmentRequest
{
    public Guid TargetClassRoomId { get; set; }
    public DateOnly? TransferDate { get; set; }
    public string? Reason { get; set; }
}

public class WithdrawEnrollmentRequest
{
    public DateOnly? WithdrawDate { get; set; }
    public string Reason { get; set; } = string.Empty;
}
