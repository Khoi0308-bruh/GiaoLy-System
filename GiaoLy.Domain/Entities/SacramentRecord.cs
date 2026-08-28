using System;

namespace GiaoLy.Domain.Entities;

public class SacramentRecord
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid SacramentRequirementId { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }
    public Guid? EvaluatorId { get; set; }
    public string Note { get; set; } = string.Empty;
}
