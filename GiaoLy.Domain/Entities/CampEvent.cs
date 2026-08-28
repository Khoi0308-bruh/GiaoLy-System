using System;

namespace GiaoLy.Domain.Entities;

public class CampEvent
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal Fee { get; set; }
    public string Description { get; set; } = string.Empty;
}
