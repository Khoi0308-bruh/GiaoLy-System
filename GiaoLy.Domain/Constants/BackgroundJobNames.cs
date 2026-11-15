using System;
using System.Collections.Generic;

namespace GiaoLy.Domain.Constants;

public static class BackgroundJobNames
{
    public const string GradebookCloser = "GradebookCloser";
    public const string NewsCrawler = "NewsCrawler";
    public const string TokenCleanup = "TokenCleanup";
    public const string GradeUnlockExpiry = "GradeUnlockExpiry";
    public const string AuditRetention = "AuditRetention";

    public static readonly IReadOnlyList<string> All = new[]
    {
        GradebookCloser,
        NewsCrawler,
        TokenCleanup,
        GradeUnlockExpiry,
        AuditRetention
    };
}
