using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Stats.Contracts;
using GiaoLy.Application.Stats.Dtos;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.Stats;

public class PublicStatsService : IPublicStatsService
{
    private const string CacheKey = "PublicHomePageStats_V3";

    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;

    public PublicStatsService(AppDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<Result<PublicStatsDto>> GetPublicStatsAsync(CancellationToken ct = default)
    {
        if (_cache.TryGetValue(CacheKey, out PublicStatsDto? cached) && cached != null)
        {
            return Result.Ok(cached);
        }

        var totalStudents = await _context.Students
            .AsNoTracking()
            .CountAsync(s => s.DeletedAt == null, ct);

        var totalCatechists = await _context.Leaders
            .AsNoTracking()
            .CountAsync(l => l.IsActive && l.DeletedAt == null, ct);

        var totalClasses = await _context.ClassRooms
            .AsNoTracking()
            .CountAsync(c => c.DeletedAt == null, ct);

        var activeYears = await _context.AcademicYears
            .AsNoTracking()
            .CountAsync(y => y.Status == "Active", ct);

        var branches = await _context.Branches
            .AsNoTracking()
            .OrderBy(b => b.Id)
            .ToListAsync(ct);

        var branchSummaries = new List<PublicBranchSummaryDto>();

        foreach (var b in branches)
        {
            var classCount = await _context.ClassRooms
                .AsNoTracking()
                .CountAsync(c => c.DeletedAt == null && c.ClassLevel != null && c.ClassLevel.BranchId == b.Id, ct);

            var studentCount = await _context.Enrollments
                .AsNoTracking()
                .CountAsync(e => e.Status == "Active" &&
                                 e.ClassRoom != null &&
                                 e.ClassRoom.DeletedAt == null &&
                                 e.ClassRoom.ClassLevel != null &&
                                 e.ClassRoom.ClassLevel.BranchId == b.Id, ct);

            branchSummaries.Add(new PublicBranchSummaryDto
            {
                BranchId = b.Id,
                BranchName = b.Name,
                ClassCount = classCount,
                StudentCount = studentCount
            });
        }

        var stats = new PublicStatsDto
        {
            TotalStudents = totalStudents,
            TotalCatechists = totalCatechists,
            TotalClasses = totalClasses,
            TotalActiveAcademicYears = activeYears,
            Branches = branchSummaries
        };

        // Cache 15 minutes
        _cache.Set(CacheKey, stats, TimeSpan.FromMinutes(15));

        return Result.Ok(stats);
    }
}
