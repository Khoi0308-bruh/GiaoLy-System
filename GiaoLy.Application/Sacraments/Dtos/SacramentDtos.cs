namespace GiaoLy.Application.Sacraments.Dtos;

public record StudentSacramentDto(
    Guid Id,
    Guid StudentId,
    string SacramentType,
    DateOnly? ReceivedOn,
    string? Place,
    string? Minister,
    string? Sponsor,
    string? BookNumber,
    string? Note,
    Guid? VerifiedBy,
    string? VerifierName,
    DateTime? VerifiedAt,
    byte[]? RowVersion
);

public record UpsertSacramentRequest(
    DateOnly? ReceivedOn,
    string? Place,
    string? Minister,
    string? Sponsor,
    string? BookNumber,
    string? Note,
    bool IsVerified = false
);

public record SacramentRequirementDto(
    Guid Id,
    string SacramentType,
    string Name,
    string? Description,
    int SortOrder,
    bool IsActive
);

public record CreateSacramentRequirementRequest(
    string SacramentType,
    string Name,
    string? Description,
    int SortOrder = 0
);

public record UpdateSacramentRequirementRequest(
    string Name,
    string? Description,
    int SortOrder,
    bool IsActive
);

public record StudentRequirementProgressDto(
    Guid Id,
    Guid StudentId,
    Guid RequirementId,
    string RequirementName,
    string SacramentType,
    bool IsCompleted,
    DateOnly? CompletedOn,
    Guid? EvaluatorUserId,
    string? EvaluatorName,
    string? Note
);

public record UpdateRequirementProgressRequest(
    bool IsCompleted,
    DateOnly? CompletedOn,
    string? Note
);
