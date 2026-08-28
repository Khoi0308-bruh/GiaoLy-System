using System;

namespace GiaoLy.Domain.Entities;

public class CampRegistration
{
    public Guid Id { get; set; }
    public Guid CampEventId { get; set; }
    public Guid StudentId { get; set; }
    public bool IsPaid { get; set; }
    public string TeamNumber { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty; // e.g. Dị ứng thức ăn
}
