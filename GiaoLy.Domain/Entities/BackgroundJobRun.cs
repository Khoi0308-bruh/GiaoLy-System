using System;

namespace GiaoLy.Domain.Entities;

public class BackgroundJobRun
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string JobName { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? FinishedAt { get; set; }
    public string Status { get; set; } = "Running"; // 'Running','Succeeded','Failed','Skipped'
    public string? Message { get; set; }
    public string? LockedBy { get; set; }
}
