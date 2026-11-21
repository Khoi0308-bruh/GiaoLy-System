using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Stats.Contracts;
using GiaoLy.Application.Stats.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace GiaoLy.Infrastructure.Services.Stats;

public class PublicStatsService : IPublicStatsService
{
    private const string CacheKey = "PublicHomePageStats_V4";

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

        // Số đoàn sinh công khai là số em CÒN THUỘC LỚP trong niên khóa đang chạy, không phải
        // tổng số hồ sơ: một em học nhiều niên khóa không được tính nhiều lần.
        var year = await _context.AcademicYears
            .AsNoTracking()
            .OrderByDescending(y => y.Status == AcademicYearStateMachine.StatusActive)
            .ThenByDescending(y => y.StartDate)
            .FirstOrDefaultAsync(ct);

        var enrolled = new List<(Guid StudentId, int BranchId)>();
        if (year != null)
        {
            var yearId = year.Id;
            enrolled = (await _context.Enrollments
                    .AsNoTracking()
                    .Where(e => e.AcademicYearId == yearId &&
                                EnrollmentRules.Statuses.InClass.Contains(e.Status) &&
                                // Ghi danh của hồ sơ đã xóa mềm không được tính: trước đây tổng
                                // đoàn sinh đọc từ Students nên đã loại sẵn những hồ sơ này.
                                e.Student != null && e.Student.DeletedAt == null &&
                                e.ClassRoom != null &&
                                e.ClassRoom.ClassLevel != null)
                    .Select(e => new { e.StudentId, e.ClassRoom!.ClassLevel!.BranchId })
                    .Distinct()
                    .ToListAsync(ct))
                .Select(e => (e.StudentId, e.BranchId))
                .ToList();
        }

        var totalStudents = enrolled.Select(e => e.StudentId).Distinct().Count();

        var totalCatechists = await _context.Leaders
            .AsNoTracking()
            .CountAsync(l => l.IsActive && l.DeletedAt == null, ct);

        var totalClasses = await _context.ClassRooms
            .AsNoTracking()
            .CountAsync(c => c.DeletedAt == null, ct);

        var activeYears = await _context.AcademicYears
            .AsNoTracking()
            .CountAsync(y => y.Status == AcademicYearStateMachine.StatusActive, ct);

        var branches = await _context.Branches
            .AsNoTracking()
            .OrderBy(b => b.Id)
            .ToListAsync(ct);

        var studentsByBranch = enrolled
            .GroupBy(e => e.BranchId)
            .ToDictionary(g => g.Key, g => g.Select(e => e.StudentId).Distinct().Count());

        var branchSummaries = new List<PublicBranchSummaryDto>();

        foreach (var b in branches)
        {
            var classCount = await _context.ClassRooms
                .AsNoTracking()
                .CountAsync(c => c.DeletedAt == null && c.ClassLevel != null && c.ClassLevel.BranchId == b.Id, ct);

            branchSummaries.Add(new PublicBranchSummaryDto
            {
                BranchId = b.Id,
                BranchName = b.Name,
                ClassCount = classCount,
                StudentCount = studentsByBranch.GetValueOrDefault(b.Id)
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
