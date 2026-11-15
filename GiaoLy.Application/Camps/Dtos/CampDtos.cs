using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Camps.Dtos;

public class CampEventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public string? BranchName { get; set; }
    public Guid? AcademicYearId { get; set; }
    public string? AcademicYearName { get; set; }
    public DateOnly? RegistrationDeadline { get; set; }
    public int TotalRegistrations { get; set; }
    public decimal TotalCollected { get; set; }
}

public class CreateCampEventRequest
{
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public DateOnly? RegistrationDeadline { get; set; }
}

public class UpdateCampEventRequest
{
    public string Name { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal Fee { get; set; }
    public string? Description { get; set; }
    public int? BranchId { get; set; }
    public Guid? AcademicYearId { get; set; }
    public DateOnly? RegistrationDeadline { get; set; }
}

public class CampRegistrationDto
{
    public Guid Id { get; set; }
    public Guid CampEventId { get; set; }
    public string CampEventName { get; set; } = string.Empty;
    public decimal EventFee { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentHolyName { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;
    public string? ClassRoomName { get; set; }
    public string? TeamNumber { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = "Registered";
    public Guid RegisteredBy { get; set; }
    public string RegisteredByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Financial balance
    public decimal TotalPaid { get; set; }
    public decimal Remaining { get; set; }
    public bool IsOverpaid { get; set; }
    public bool IsSettled { get; set; }

    public List<CampPaymentDto> Payments { get; set; } = new();
}

public class CreateCampRegistrationRequest
{
    public Guid StudentId { get; set; }
    public string? TeamNumber { get; set; }
    public string? Note { get; set; }
}

public class UpdateCampRegistrationRequest
{
    public string? TeamNumber { get; set; }
    public string? Note { get; set; }
}

public class CampPaymentDto
{
    public Guid Id { get; set; }
    public Guid RegistrationId { get; set; }
    public decimal Amount { get; set; }
    public DateOnly PaidOn { get; set; }
    public string? ReceiptNumber { get; set; }
    public Guid ReceivedBy { get; set; }
    public string ReceivedByName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public Guid? ReversesPaymentId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RecordCampPaymentRequest
{
    public decimal Amount { get; set; }
    public DateOnly PaidOn { get; set; }
    public string? ReceiptNumber { get; set; }
    public string? Note { get; set; }
}

public class ReverseCampPaymentRequest
{
    public decimal Amount { get; set; } // Positive or negative in request; will be saved as negative
    public string Reason { get; set; } = string.Empty;
    public string? ReceiptNumber { get; set; }
}

public class CampFinanceSummaryDto
{
    public Guid CampEventId { get; set; }
    public string CampEventName { get; set; } = string.Empty;
    public decimal FeePerStudent { get; set; }
    public int TotalRegistered { get; set; }
    public int TotalCancelled { get; set; }
    public decimal TotalExpected { get; set; }
    public decimal TotalCollected { get; set; }
    public decimal TotalRemaining { get; set; }
    public int FullyPaidCount { get; set; }
    public int PartiallyPaidCount { get; set; }
    public int UnpaidCount { get; set; }
    public int OverpaidCount { get; set; }
}
