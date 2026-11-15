using System;
using System.Collections.Generic;

namespace GiaoLy.Application.Bouquets.Dtos;

public class SpiritualBouquetDto
{
    public Guid Id { get; set; }
    public Guid EnrollmentId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentHolyName { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;
    public DateOnly BouquetDate { get; set; }
    public string BouquetType { get; set; } = string.Empty;
    public int Points { get; set; }
    public Guid GivenBy { get; set; }
    public string GivenByName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public Guid? ReversesBouquetId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RecordBouquetRequest
{
    public Guid EnrollmentId { get; set; }
    public DateOnly BouquetDate { get; set; }
    public string BouquetType { get; set; } = string.Empty;
    public int Points { get; set; }
    public string? Note { get; set; }
}

public class ReverseBouquetRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class BouquetLeaderboardEntryDto
{
    public int Rank { get; set; }
    public Guid StudentId { get; set; }
    public Guid EnrollmentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string StudentHolyName { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;
    public int TotalPoints { get; set; }
    public int BouquetCount { get; set; }
    public Dictionary<string, int> PointsByType { get; set; } = new();
}
