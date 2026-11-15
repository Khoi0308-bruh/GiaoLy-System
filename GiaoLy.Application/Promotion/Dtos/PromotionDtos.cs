namespace GiaoLy.Application.Promotion.Dtos;

public class CreatePromotionBatchRequest
{
    public Guid SourceYearId { get; set; }
    public Guid TargetYearId { get; set; }
}

public class PromotionBatchSummaryDto
{
    public Guid Id { get; set; }
    public Guid SourceYearId { get; set; }
    public string SourceYearName { get; set; } = string.Empty;
    public Guid TargetYearId { get; set; }
    public string TargetYearName { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft";
    public Guid CreatedBy { get; set; }
    public string? CreatorName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? AppliedAt { get; set; }
    public string? ApplierName { get; set; }

    // Counts
    public int TotalStudents { get; set; }
    public int PendingCount { get; set; }
    public int ApprovedCount { get; set; }
    public int RejectedCount { get; set; }
    public int StaleCount { get; set; }
    public int AppliedCount { get; set; }

    public string RowVersion { get; set; } = string.Empty;
}

public class PromotionBatchDetailDto : PromotionBatchSummaryDto
{
    public Dictionary<string, int> OutcomeBreakdown { get; set; } = new();
}

public class PromotionDraftDto
{
    public Guid Id { get; set; }
    public Guid BatchId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string? HolyName { get; set; }
    public string FullName { get; set; } = string.Empty;

    public Guid FromEnrollmentId { get; set; }
    public Guid FromClassRoomId { get; set; }
    public string FromClassRoomName { get; set; } = string.Empty;
    public int FromClassLevelId { get; set; }
    public string FromClassLevelName { get; set; } = string.Empty;

    public string Outcome { get; set; } = "Promote";
    public Guid? SuggestedClassRoomId { get; set; }
    public string? SuggestedClassRoomName { get; set; }

    public decimal? Gpa { get; set; }
    public decimal? AttendanceRate { get; set; }
    public string? GradeStatus { get; set; }
    public string? Reason { get; set; }

    public string Status { get; set; } = "Pending";
    public bool IsStale { get; set; }

    public string? DecidedByName { get; set; }
    public DateTime? DecidedAt { get; set; }
    public Guid? AppliedEnrollmentId { get; set; }

    public string RowVersion { get; set; } = string.Empty;
}

public class PromotionDraftFilterRequest
{
    public Guid? ClassRoomId { get; set; }
    public int? BranchId { get; set; }
    public int? ClassLevelId { get; set; }
    public string? Status { get; set; }
    public string? Outcome { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class UpdateDraftTargetClassRequest
{
    public Guid TargetClassRoomId { get; set; }
}

public class RejectDraftRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class ApplyPromotionBatchRequest
{
    public bool SkipPending { get; set; } = false;
}
