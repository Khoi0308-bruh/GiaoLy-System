using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Reports.Dtos;

public class DashboardReportDto
{
    public int TotalStudents { get; set; }
    public int TotalActiveStudents { get; set; }
    public int TotalClassRooms { get; set; }
    public int TotalTeachers { get; set; }
    public double AverageAttendanceRate { get; set; }
    public int MissingContactCount { get; set; }
    public int PendingPromotionCount { get; set; }
    public List<BranchStatDto> BranchStats { get; set; } = new();
}

public class BranchStatDto
{
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public int ClassRoomCount { get; set; }
}

public class StudentsByBranchReportDto
{
    public Guid? AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public int GrandTotal { get; set; }
    /// <summary>Hồ sơ chưa gán ngành — GrandTotal = tổng các ngành + UnassignedCount.</summary>
    public int UnassignedCount { get; set; }
    public List<BranchDetailDto> Branches { get; set; } = new();
}

public class BranchDetailDto
{
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int ActiveCount { get; set; }
    public int SuspendedCount { get; set; }
    public int DropoutCount { get; set; }
    public int GraduatedCount { get; set; }
    public int MaleCount { get; set; }
    public int FemaleCount { get; set; }
    public List<ClassRoomStudentStatDto> Classes { get; set; } = new();
}

public class ClassRoomStudentStatDto
{
    public Guid ClassRoomId { get; set; }
    public string ClassRoomName { get; set; } = string.Empty;
    public string LevelName { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int MaleCount { get; set; }
    public int FemaleCount { get; set; }
}

public class MissingDataReportDto
{
    public int TotalMissing { get; set; }
    public List<MissingDataStudentDto> Students { get; set; } = new();
}

public class MissingDataStudentDto
{
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string ClassRoomName { get; set; } = string.Empty;
    public List<string> MissingReasons { get; set; } = new();
}

public class PromotionSummaryReportDto
{
    public Guid? AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int PromotedCount { get; set; }
    public int RetainedCount { get; set; }
    public int GraduatedCount { get; set; }
    public int PendingCount { get; set; }
    public List<ClassPromotionSummaryDto> ClassSummaries { get; set; } = new();
}

public class ClassPromotionSummaryDto
{
    public Guid ClassRoomId { get; set; }
    public string ClassRoomName { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int PromotedCount { get; set; }
    public int RetainedCount { get; set; }
    public int GraduatedCount { get; set; }
    public int PendingCount { get; set; }
}

public class GradesSummaryReportDto
{
    public Guid? AcademicYearId { get; set; }
    public string AcademicYearName { get; set; } = string.Empty;
    public Guid? ClassRoomId { get; set; }
    public string? ClassRoomName { get; set; }
    public int TotalStudents { get; set; }
    public double AverageGpa { get; set; }
    public double MaxGpa { get; set; }
    public double MinGpa { get; set; }
    public int BelowThresholdCount { get; set; }
    public List<StudentBelowThresholdDto> BelowThresholdStudents { get; set; } = new();
}

public class StudentBelowThresholdDto
{
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string ClassRoomName { get; set; } = string.Empty;
    public decimal? Semester1 { get; set; }
    public decimal? Semester2 { get; set; }
    public decimal? FinalExam { get; set; }
    public decimal? AttendanceScore { get; set; }
    public decimal? AverageScore { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class ExportReportRequest
{
    public string ReportType { get; set; } = "StudentsByBranch"; // 'StudentsByBranch', 'MissingData', 'PromotionSummary', 'GradesSummary'
    public Guid? AcademicYearId { get; set; }
    public int? BranchId { get; set; }
    public Guid? ClassRoomId { get; set; }
}

public class ExportReportResultDto
{
    public byte[] Content { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public string FileName { get; set; } = "BaoCao.xlsx";
}
