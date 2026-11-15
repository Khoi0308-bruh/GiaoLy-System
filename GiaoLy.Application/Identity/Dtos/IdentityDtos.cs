namespace GiaoLy.Application.Identity.Dtos;

public record LoginRequest(string Username, string Password);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserSummaryResponse User
);

public record UserSummaryResponse(
    Guid Id,
    string Username,
    string FullName,
    string? ChristianName,
    string? AvatarPath,
    string RoleCode,
    string ScopeType,
    int? BranchId,
    bool MustChangePassword
);

public record ChangePasswordRequest(string OldPassword, string NewPassword);

public record UserProfileResponse(
    Guid Id,
    string Username,
    string FullName,
    string? ChristianName,
    string? Email,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Address,
    string? Bio,
    string? AvatarPath,
    string RoleCode,
    string RoleName,
    string ScopeType,
    int? BranchId,
    IReadOnlySet<string> Permissions
);

public record UpdateProfileRequest(
    string FullName,
    string? ChristianName,
    string? Email,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Address,
    string? Bio
);

public record UserResponse(
    Guid Id,
    string Username,
    string FullName,
    string? ChristianName,
    string? Email,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Address,
    string? Bio,
    string? AvatarPath,
    Guid RoleId,
    string RoleCode,
    string RoleName,
    string ScopeType,
    int? BranchId,
    bool IsActive,
    bool MustChangePassword,
    DateTime? LastLoginAt,
    DateTime CreatedAt
);

public record CreateUserRequest(
    string Username,
    string FullName,
    string? ChristianName,
    string? Email,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Address,
    Guid RoleId,
    int? BranchId
);

public record UpdateUserRequest(
    string FullName,
    string? ChristianName,
    string? Email,
    string? PhoneNumber,
    DateOnly? DateOfBirth,
    string? Address,
    string? Bio
);

public record AssignRoleRequest(Guid RoleId, int? BranchId);

public record ResetPasswordResponse(string TemporaryPassword);

public record RoleResponse(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    bool IsSystem,
    string ScopeType,
    DateTime CreatedAt,
    IReadOnlyList<string> Permissions
);

public record CreateRoleRequest(
    string Code,
    string Name,
    string? Description,
    string ScopeType,
    List<string>? Permissions
);

public record UpdateRoleRequest(
    string Name,
    string? Description,
    string ScopeType
);

public record AssignPermissionsRequest(List<string> Permissions);

public record PermissionResponse(
    Guid Id,
    string Code,
    string Name,
    string Module,
    string? Description
);

public record GuardianLinkResponse(
    Guid Id,
    Guid UserId,
    string UserName,
    string UserFullName,
    Guid StudentId,
    string StudentFullName,
    string Relationship,
    DateTime? VerifiedAt,
    string? VerifiedByName,
    DateTime CreatedAt
);

public record CreateGuardianLinkRequest(
    Guid UserId,
    Guid StudentId,
    string Relationship
);
