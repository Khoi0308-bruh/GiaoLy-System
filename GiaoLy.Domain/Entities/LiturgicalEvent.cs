using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GiaoLy.Domain.Entities;

[Table("LiturgicalEvents")]
public class LiturgicalEvent
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Color { get; set; } = "Green"; // Green, Red, White, Purple, Rose

    [MaxLength(100)]
    public string Level { get; set; } = "Thường"; // Lễ Trọng, Lễ Kính, Lễ Nhớ, Thường

    public string? Description { get; set; }

    /// <summary>
    /// Đánh dấu xem event này là do Admin tự đè/chỉnh sửa hay chỉ là import thông thường
    /// </summary>
    public bool IsOverride { get; set; } = false;

    public string? WordOfGodOverride { get; set; }
    public string? WordOfGodReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
