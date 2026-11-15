using System;

namespace GiaoLy.Domain.Entities;

public class CampPayment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RegistrationId { get; set; }
    public decimal Amount { get; set; } // Positive for payment, negative for reversal/refund
    public DateOnly PaidOn { get; set; }
    public string? ReceiptNumber { get; set; }
    public Guid ReceivedBy { get; set; }
    public string? Note { get; set; }
    public Guid? ReversesPaymentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public CampRegistration Registration { get; set; } = null!;
    public User ReceivedByUser { get; set; } = null!;
    public CampPayment? ReversesPayment { get; set; }
}
