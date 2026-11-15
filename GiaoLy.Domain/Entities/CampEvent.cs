using System;
using System.Collections.Generic;

namespace GiaoLy.Domain.Entities;

public class CampEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public DateOnly? RegistrationDeadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public Branch? Branch { get; set; }
    public AcademicYear? AcademicYear { get; set; }
    public ICollection<CampRegistration> Registrations { get; set; } = new List<CampRegistration>();
}
