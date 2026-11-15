using System;

namespace GiaoLy.Application.Liturgical.Dtos;

public class LiturgicalEventDto
{
    public Guid Id { get; set; }
    public DateOnly EventDate { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string ColorNameVi { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsOverride { get; set; }
    public string? WordOfGodOverride { get; set; }
    public string? WordOfGodReference { get; set; }
}

public class OverrideLiturgicalDayRequest
{
    public string Title { get; set; } = string.Empty;
    public string Color { get; set; } = "Green";
    public string Level { get; set; } = "Thường";
    public string? Description { get; set; }
    public string? WordOfGodOverride { get; set; }
    public string? WordOfGodReference { get; set; }
}
