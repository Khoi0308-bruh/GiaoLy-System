namespace GiaoLy.Domain.Entities;

public class StudentRequirementProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid RequirementId { get; set; }
    public SacramentRequirement? Requirement { get; set; }

    public bool IsCompleted { get; set; } = false;
    public DateOnly? CompletedOn { get; set; }

    public Guid? EvaluatorUserId { get; set; }
    public User? Evaluator { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
