using System;
using System.Collections.Generic;

namespace GiaoLy.Domain.Entities;

public class CampRegistration
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CampEventId { get; set; }
    public Guid StudentId { get; set; }
    public string? TeamNumber { get; set; }
    public string? Note { get; set; }
    public Guid RegisteredBy { get; set; }
    public string Status { get; set; } = "Registered"; // 'Registered', 'Cancelled'
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Compatibility property
    public bool IsPaid => Payments != null && Payments.Sum(p => p.Amount) >= (CampEvent?.Fee ?? 0);

    // Navigation properties
    public CampEvent CampEvent { get; set; } = null!;
    public Student Student { get; set; } = null!;
    public User RegisteredByUser { get; set; } = null!;
    public ICollection<CampPayment> Payments { get; set; } = new List<CampPayment>();
}
