using System.Collections.Generic;

namespace GiaoLy.Application.Stats.Dtos;

public class PublicBranchSummaryDto
{
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public int ClassCount { get; set; }
}

public class PublicStatsDto
{
    public int TotalStudents { get; set; }
    public int TotalCatechists { get; set; }
    public int TotalClasses { get; set; }
    public int TotalActiveAcademicYears { get; set; }
    public List<PublicBranchSummaryDto> Branches { get; set; } = new();
}
