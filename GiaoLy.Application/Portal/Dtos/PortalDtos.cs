using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Portal.Dtos;

public class PortalChildSummaryDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string? Gender { get; set; }
    public DateTime BirthDate { get; set; }
    public string Relationship { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public string? CurrentClassRoom { get; set; }
    public string? CurrentBranch { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class PortalChildDetailDto
{
    public Guid Id { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string? Gender { get; set; }
    public DateTime BirthDate { get; set; }
    public string? Address { get; set; }
    public string? Area { get; set; }
    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public string Relationship { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
    public string? CurrentClassRoom { get; set; }
    public string? CurrentBranch { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<PortalSacramentDto> Sacraments { get; set; } = new();
}

public class PortalSacramentDto
{
    public string SacramentType { get; set; } = string.Empty;
    public DateOnly? ReceivedOn { get; set; }
    public string? Place { get; set; }
    public string? Minister { get; set; }
    public string? Sponsor { get; set; }
}

public class PortalChildGradeDto
{
    public Guid AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public string ClassRoomName { get; set; } = string.Empty;
    public decimal? Oral { get; set; }
    public decimal? SmallTest { get; set; }
    public decimal? BigTest { get; set; }
    public decimal? FinalExam { get; set; }
    public int? TotalSessions { get; set; }
    public int? Absences { get; set; }
    public decimal? ComputedGpa { get; set; }
    public string? ComputedStatus { get; set; }
    public string? Remarks { get; set; }
}

public class PortalChildCertificateDto
{
    public Guid Id { get; set; }
    public string VerificationCode { get; set; } = string.Empty;
    public string CertificateType { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class PortalAnnouncementDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string AnnouncementType { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
    public string Author { get; set; } = string.Empty;
}
