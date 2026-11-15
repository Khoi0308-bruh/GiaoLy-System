using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Platform.Dtos;

public class SystemSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateSystemSettingRequest
{
    public string Value { get; set; } = string.Empty;
}

public class BackgroundJobRunDto
{
    public Guid Id { get; set; }
    public string JobName { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Message { get; set; }
    public string? LockedBy { get; set; }
}

public class PagedJobRunsResultDto
{
    public List<BackgroundJobRunDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalCount / PageSize) : 0;
}

public class RunJobResultDto
{
    public string JobName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Message { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
}
