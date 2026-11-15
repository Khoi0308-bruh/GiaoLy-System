using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Identity.Dtos;

namespace GiaoLy.Application.Identity.Contracts;

public interface IAuthService
{
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<Result<AuthResponse>> RefreshTokenAsync(string rawRefreshToken, string? ipAddress, string? userAgent, CancellationToken ct = default);
    Task<Result> LogoutAsync(string? rawRefreshToken, CancellationToken ct = default);
    Task<Result> ChangePasswordAsync(ChangePasswordRequest request, CancellationToken ct = default);
    Task<Result<UserProfileResponse>> GetCurrentUserProfileAsync(CancellationToken ct = default);
    Task<Result<UserProfileResponse>> UpdateProfileAsync(UpdateProfileRequest request, CancellationToken ct = default);
    Task<Result<string>> UpdateAvatarAsync(string avatarPath, CancellationToken ct = default);
}

public interface IUserService
{
    Task<Result<PagedList<UserResponse>>> GetUsersAsync(PagingRequest paging, string? roleCode, int? branchId, bool? isActive, CancellationToken ct = default);
    Task<Result<UserResponse>> GetUserByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<(UserResponse User, string TemporaryPassword)>> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<Result<UserResponse>> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default);
    Task<Result> AssignRoleAsync(Guid id, AssignRoleRequest request, CancellationToken ct = default);
    Task<Result<ResetPasswordResponse>> ResetPasswordAsync(Guid id, CancellationToken ct = default);
    Task<Result> DeactivateUserAsync(Guid id, CancellationToken ct = default);
    Task<Result> ActivateUserAsync(Guid id, CancellationToken ct = default);
}

public interface IRoleService
{
    Task<Result<IReadOnlyList<RoleResponse>>> GetRolesAsync(CancellationToken ct = default);
    Task<Result<IReadOnlyList<PermissionResponse>>> GetPermissionsAsync(CancellationToken ct = default);
    Task<Result<RoleResponse>> CreateRoleAsync(CreateRoleRequest request, CancellationToken ct = default);
    Task<Result<RoleResponse>> UpdateRoleAsync(Guid id, UpdateRoleRequest request, CancellationToken ct = default);
    Task<Result> DeleteRoleAsync(Guid id, CancellationToken ct = default);
    Task<Result> AssignPermissionsAsync(Guid id, AssignPermissionsRequest request, CancellationToken ct = default);
}

public interface IGuardianLinkService
{
    Task<Result<IReadOnlyList<GuardianLinkResponse>>> GetGuardianLinksAsync(Guid? studentId, CancellationToken ct = default);
    Task<Result<GuardianLinkResponse>> CreateGuardianLinkAsync(CreateGuardianLinkRequest request, CancellationToken ct = default);
    Task<Result> DeleteGuardianLinkAsync(Guid id, CancellationToken ct = default);
}
