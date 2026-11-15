using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Audit.Contracts;
using GiaoLy.Application.Audit.Dtos;
using GiaoLy.Application.Common.Results;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Audit;

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _context;

    public AuditLogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedAuditLogResultDto>> GetAuditLogsAsync(AuditLogFilterRequest filter, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var pageSize = Math.Clamp(filter.PageSize, 1, 100);

        var query = _context.AuditLogs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.EntityType))
        {
            query = query.Where(a => a.EntityType == filter.EntityType.Trim());
        }

        if (!string.IsNullOrWhiteSpace(filter.EntityId))
        {
            query = query.Where(a => a.EntityId == filter.EntityId.Trim());
        }

        if (!string.IsNullOrWhiteSpace(filter.Action))
        {
            query = query.Where(a => a.Action == filter.Action.Trim());
        }

        if (filter.UserId.HasValue)
        {
            query = query.Where(a => a.UserId == filter.UserId.Value);
        }

        if (filter.FromDate.HasValue)
        {
            query = query.Where(a => a.OccurredAt >= filter.FromDate.Value);
        }

        if (filter.ToDate.HasValue)
        {
            query = query.Where(a => a.OccurredAt <= filter.ToDate.Value);
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(a => a.OccurredAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AuditLogDto
            {
                Id = a.Id,
                OccurredAt = a.OccurredAt,
                UserId = a.UserId,
                UserName = a.UserName,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                OldValues = a.OldValues,
                NewValues = a.NewValues,
                IpAddress = a.IpAddress,
                UserAgent = a.UserAgent,
                CorrelationId = a.CorrelationId
            })
            .ToListAsync(ct);

        return Result.Ok(new PagedAuditLogResultDto
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }
}
