namespace GiaoLy.Application.Common.Interfaces;

public interface IPermissionProvider
{
    Task<IReadOnlySet<string>> GetPermissionsForRoleAsync(Guid roleId, CancellationToken ct = default);
    Task<bool> HasPermissionAsync(Guid roleId, string permission, CancellationToken ct = default);
    void InvalidateRoleCache(Guid roleId);
}
