using System;

namespace GiaoLy.Domain.Entities;

public class SpiritualBouquet
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid ClassRoomId { get; set; }
    public DateTime Date { get; set; }
    public string Type { get; set; } = string.Empty; // "Mass", "Prayer", "Charity"
    public int Points { get; set; }
    public string Note { get; set; } = string.Empty;
}
