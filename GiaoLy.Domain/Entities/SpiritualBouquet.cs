using System;

namespace GiaoLy.Domain.Entities;

public class SpiritualBouquet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EnrollmentId { get; set; }
    public DateOnly BouquetDate { get; set; }
    public string BouquetType { get; set; } = string.Empty; // e.g. "Thánh Lễ", "Rước Lễ", "Viếng Chúa", "Hy Sinh", "Kinh Nguyện"
    public int Points { get; set; } // Between -100 and 100, Points != 0
    public Guid GivenBy { get; set; }
    public string? Note { get; set; }
    public Guid? ReversesBouquetId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Backward compatibility properties
    public DateTime Date
    {
        get => BouquetDate.ToDateTime(TimeOnly.MinValue);
        set => BouquetDate = DateOnly.FromDateTime(value);
    }
    public string Type { get => BouquetType; set => BouquetType = value; }

    // Navigation properties
    public Enrollment Enrollment { get; set; } = null!;
    public User GivenByUser { get; set; } = null!;
    public SpiritualBouquet? ReversesBouquet { get; set; }
}
