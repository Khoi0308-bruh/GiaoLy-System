using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Platform.Dtos;

public class MigrationPhaseResultDto
{
    public int Phase { get; set; }
    public string PhaseName { get; set; } = string.Empty;
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
    public int AffectedRecords { get; set; }
}

public class ReconciliationReportDto
{
    public DateTime CheckedAt { get; set; } = DateTime.UtcNow;
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalStudents { get; set; }
    public int ActiveStudents { get; set; }
    public int TotalGuardians { get; set; }
    public int TotalSacraments { get; set; }
    public int TotalEnrollments { get; set; }
    public int TotalGrades { get; set; }
    public int QualifiedGrades { get; set; }
    public int TotalCertificates { get; set; }
    public int IssuedCertificates { get; set; }

    // Invariants check (All must be 0)
    public int OrphanGradesCount { get; set; }
    public int InvalidStatusYearsCount { get; set; }
    public int MissingCertCodesCount { get; set; }
    public int DuplicateStudentsCount { get; set; }

    public bool IsReconciled =>
        OrphanGradesCount == 0 &&
        InvalidStatusYearsCount == 0 &&
        MissingCertCodesCount == 0 &&
        DuplicateStudentsCount == 0;
}
