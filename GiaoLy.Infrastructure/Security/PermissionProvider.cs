using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Security;

public class PermissionProvider : IPermissionProvider
{
    private readonly AppDbContext _db;
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(30);

    public PermissionProvider(AppDbContext db, IMemoryCache cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<IReadOnlySet<string>> GetPermissionsForRoleAsync(Guid roleId, CancellationToken ct = default)
    {
        var cacheKey = $"RolePerms_{roleId}";
        if (_cache.TryGetValue(cacheKey, out IReadOnlySet<string>? cachedPerms) && cachedPerms != null)
        {
            return cachedPerms;
        }

        var permissions = await _db.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Select(rp => rp.Permission.Code)
            .ToListAsync(ct);

        var permSet = new HashSet<string>(permissions, StringComparer.OrdinalIgnoreCase);
        _cache.Set(cacheKey, permSet, CacheDuration);

        return permSet;
    }

    public async Task<bool> HasPermissionAsync(Guid roleId, string permission, CancellationToken ct = default)
    {
        var perms = await GetPermissionsForRoleAsync(roleId, ct);
        return perms.Contains(permission);
    }

    public void InvalidateRoleCache(Guid roleId)
    {
        _cache.Remove($"RolePerms_{roleId}");
    }
}
