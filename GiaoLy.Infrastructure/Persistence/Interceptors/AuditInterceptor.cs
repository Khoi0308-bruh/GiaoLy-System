using System.Security.Claims;
using System.Text.Json;
using GiaoLy.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace GiaoLy.Infrastructure.Persistence.Interceptors;

public class AuditInterceptor : SaveChangesInterceptor
{
    // Chỉ phụ thuộc singleton (IHttpContextAccessor) để có thể đăng ký Singleton và dùng
    // an toàn với AddDbContextPool. Nếu inject ICurrentUser (scoped) thì DbContext pool
    // không resolve được từ root provider và toàn bộ API sẽ lỗi 500 khi khởi động.
    private readonly IHttpContextAccessor _httpContextAccessor;
    private static readonly HashSet<string> SensitiveProperties = new(StringComparer.OrdinalIgnoreCase)
    {
        "PasswordHash",
        "TokenHash",
        "RowVersion"
    };

    public AuditInterceptor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;
        if (context is null)
        {
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        var httpContext = _httpContextAccessor.HttpContext;
        var correlationId = httpContext?.Items["CorrelationId"]?.ToString();
        var ipAddress = httpContext?.Connection.RemoteIpAddress?.ToString();
        var userAgent = httpContext?.Request.Headers.UserAgent.ToString();

        var principal = httpContext?.User;
        var userId = ParseGuid(
            principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? principal?.FindFirst("sub")?.Value);
        var userName = principal?.FindFirst(ClaimTypes.Name)?.Value
                       ?? principal?.Identity?.Name;

        var auditLogs = new List<AuditLog>();

        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog || entry.State is EntityState.Detached or EntityState.Unchanged)
            {
                continue;
            }

            var action = entry.State switch
            {
                EntityState.Added => "Create",
                EntityState.Modified => "Update",
                EntityState.Deleted => "Delete",
                _ => entry.State.ToString()
            };

            var entityType = entry.Metadata.ClrType.Name;
            var entityId = GetPrimaryKeyValue(entry);

            string? oldValues = null;
            string? newValues = null;

            if (entry.State == EntityState.Added)
            {
                var newDict = new Dictionary<string, object?>();
                foreach (var prop in entry.Properties)
                {
                    if (SensitiveProperties.Contains(prop.Metadata.Name)) continue;
                    newDict[prop.Metadata.Name] = prop.CurrentValue;
                }
                newValues = JsonSerializer.Serialize(newDict);
            }
            else if (entry.State == EntityState.Deleted)
            {
                var oldDict = new Dictionary<string, object?>();
                foreach (var prop in entry.Properties)
                {
                    if (SensitiveProperties.Contains(prop.Metadata.Name)) continue;
                    oldDict[prop.Metadata.Name] = prop.OriginalValue;
                }
                oldValues = JsonSerializer.Serialize(oldDict);
            }
            else if (entry.State == EntityState.Modified)
            {
                var oldDict = new Dictionary<string, object?>();
                var newDict = new Dictionary<string, object?>();

                foreach (var prop in entry.Properties)
                {
                    if (SensitiveProperties.Contains(prop.Metadata.Name)) continue;

                    if (prop.IsModified)
                    {
                        oldDict[prop.Metadata.Name] = prop.OriginalValue;
                        newDict[prop.Metadata.Name] = prop.CurrentValue;
                    }
                }

                if (oldDict.Count > 0)
                {
                    oldValues = JsonSerializer.Serialize(oldDict);
                    newValues = JsonSerializer.Serialize(newDict);
                }
            }

            auditLogs.Add(new AuditLog
            {
                OccurredAt = DateTime.UtcNow,
                UserId = userId,
                UserName = userName,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                OldValues = oldValues,
                NewValues = newValues,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                CorrelationId = correlationId
            });
        }

        if (auditLogs.Count > 0)
        {
            context.Set<AuditLog>().AddRange(auditLogs);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static Guid? ParseGuid(string? value)
        => Guid.TryParse(value, out var id) ? id : null;

    private static string? GetPrimaryKeyValue(EntityEntry entry)
    {
        var keyProps = entry.Properties.Where(p => p.Metadata.IsPrimaryKey()).ToList();
        if (keyProps.Count == 1)
        {
            return keyProps[0].CurrentValue?.ToString();
        }
        if (keyProps.Count > 1)
        {
            return string.Join(";", keyProps.Select(p => $"{p.Metadata.Name}={p.CurrentValue}"));
        }
        return null;
    }
}
