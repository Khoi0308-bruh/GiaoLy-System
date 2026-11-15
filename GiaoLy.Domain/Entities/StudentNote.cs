namespace GiaoLy.Domain.Entities;

public class StudentNote
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid AuthorId { get; set; }
    public User? Author { get; set; }

    public string Content { get; set; } = string.Empty;
    public bool IsPrivate { get; set; } = false; // true: chỉ tác giả (hoặc SystemAdmin) thấy

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}
