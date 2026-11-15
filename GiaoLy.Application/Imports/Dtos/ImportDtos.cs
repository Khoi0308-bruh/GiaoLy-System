namespace GiaoLy.Application.Imports.Dtos;

public record ImportJobSummaryResponse(
    Guid Id,
    string ImportType,
    string FileName,
    string Status,
    int TotalRows,
    int ValidRows,
    int WarningRows,
    int ErrorRows,
    DateTime? AppliedAt,
    DateTime CreatedAt
);

public record ImportRowReportDto(
    int RowIndex,
    string Status, // "Valid", "Warning", "Error"
    string? StudentCode,
    string? FullName,
    string? BirthDate,
    string? ClassLevelCode,
    string? Section,
    List<string> Errors,
    List<string> Warnings
);

public record ImportJobDetailResponse(
    Guid Id,
    string ImportType,
    string FileName,
    string FileSha256,
    string Status,
    int TotalRows,
    int ValidRows,
    int WarningRows,
    int ErrorRows,
    IReadOnlyList<ImportRowReportDto> RowReports,
    DateTime? AppliedAt,
    DateTime CreatedAt
);

public record ApplyImportResult(
    Guid JobId,
    int InsertedCount,
    int UpdatedCount,
    int EnrolledCount,
    string Message
);

public record ExportFileResult(
    byte[] Content,
    string ContentType,
    string FileName
);
