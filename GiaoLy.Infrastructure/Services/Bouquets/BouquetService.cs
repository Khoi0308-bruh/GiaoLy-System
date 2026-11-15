using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Bouquets.Contracts;
using GiaoLy.Application.Bouquets.Dtos;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Bouquets;

public class BouquetService : IBouquetService
{
    private const string SettingMaxPointsKey = "Bouquet.MaxPointsPerEntry";

    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;

    public BouquetService(
        AppDbContext context,
        ICurrentUser currentUser,
        IScopeContext scopeContext)
    {
        _context = context;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
    }

    private bool IsParishWide => _currentUser.ScopeType == "All" || _currentUser.IsInRole("Admin") || _currentUser.IsInRole("BanQuanTri");

    public async Task<Result<List<SpiritualBouquetDto>>> GetClassBouquetsAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var canAccess = await _scopeContext.CanAccessClassRoomAsync(classRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<List<SpiritualBouquetDto>>("Bạn không có quyền truy cập hoa thiêng của lớp này");

        var classRoom = await _context.ClassRooms.FindAsync(new object[] { classRoomId }, ct);
        if (classRoom == null || classRoom.DeletedAt != null)
            return Result.NotFound<List<SpiritualBouquetDto>>("Không tìm thấy lớp học");

        var bouquets = await _context.SpiritualBouquets
            .AsNoTracking()
            .Include(b => b.Enrollment)
                .ThenInclude(e => e.Student)
            .Include(b => b.GivenByUser)
            .Where(b => b.Enrollment.ClassRoomId == classRoomId)
            .OrderByDescending(b => b.BouquetDate)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync(ct);

        var dtos = bouquets.Select(b => new SpiritualBouquetDto
        {
            Id = b.Id,
            EnrollmentId = b.EnrollmentId,
            StudentId = b.Enrollment.StudentId,
            StudentCode = b.Enrollment.Student?.Code ?? string.Empty,
            StudentHolyName = b.Enrollment.Student?.HolyName ?? string.Empty,
            StudentFullName = b.Enrollment.Student?.FullName ?? string.Empty,
            BouquetDate = b.BouquetDate,
            BouquetType = b.BouquetType,
            Points = b.Points,
            GivenBy = b.GivenBy,
            GivenByName = b.GivenByUser?.FullName ?? string.Empty,
            Note = b.Note,
            ReversesBouquetId = b.ReversesBouquetId,
            CreatedAt = b.CreatedAt
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<SpiritualBouquetDto>> RecordBouquetAsync(Guid classRoomId, RecordBouquetRequest request, CancellationToken ct = default)
    {
        var canAccess = await _scopeContext.CanAccessClassRoomAsync(classRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<SpiritualBouquetDto>("Bạn không có quyền ghi hoa thiêng cho lớp này");

        if (string.IsNullOrWhiteSpace(request.BouquetType))
            return Result.BadRequest<SpiritualBouquetDto>(ErrorCodes.ValidationFailed, "Loại hoa thiêng không được để trống");

        if (!BouquetRules.ValidatePoints(request.Points))
            return Result.BadRequest<SpiritualBouquetDto>(ErrorCodes.ValidationFailed, "Điểm hoa thiêng phải từ -100 đến 100 và khác 0");

        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .FirstOrDefaultAsync(e => e.Id == request.EnrollmentId && e.ClassRoomId == classRoomId, ct);

        if (enrollment == null)
            return Result.NotFound<SpiritualBouquetDto>("Không tìm thấy thông tin ghi danh của đoàn sinh trong lớp học này");

        if (enrollment.Status != "Active")
            return Result.BadRequest<SpiritualBouquetDto>(ErrorCodes.ValidationFailed, "Đoàn sinh hiện không có trạng thái học tập tích cực trong lớp này");

        // Points threshold enforcement
        if (!IsParishWide)
        {
            var maxPoints = await GetMaxPointsSettingAsync(ct);
            if (!BouquetRules.ValidatePointsThreshold(request.Points, IsParishWide, maxPoints))
            {
                return Result.BadRequest<SpiritualBouquetDto>(
                    ErrorCodes.ValidationFailed,
                    $"Số điểm hoa thiêng mỗi lần ghi không được vượt quá {maxPoints} điểm (theo cấu hình hệ thống)");
            }
        }

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var bouquet = new SpiritualBouquet
        {
            Id = Guid.NewGuid(),
            EnrollmentId = request.EnrollmentId,
            BouquetDate = request.BouquetDate,
            BouquetType = request.BouquetType.Trim(),
            Points = request.Points,
            GivenBy = currentUserId,
            Note = request.Note?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.SpiritualBouquets.Add(bouquet);
        await _context.SaveChangesAsync(ct);

        var givenUser = await _context.Users.FindAsync(new object[] { currentUserId }, ct);

        var dto = new SpiritualBouquetDto
        {
            Id = bouquet.Id,
            EnrollmentId = bouquet.EnrollmentId,
            StudentId = enrollment.StudentId,
            StudentCode = enrollment.Student?.Code ?? string.Empty,
            StudentHolyName = enrollment.Student?.HolyName ?? string.Empty,
            StudentFullName = enrollment.Student?.FullName ?? string.Empty,
            BouquetDate = bouquet.BouquetDate,
            BouquetType = bouquet.BouquetType,
            Points = bouquet.Points,
            GivenBy = bouquet.GivenBy,
            GivenByName = givenUser?.FullName ?? string.Empty,
            Note = bouquet.Note,
            ReversesBouquetId = null,
            CreatedAt = bouquet.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<SpiritualBouquetDto>> ReverseBouquetAsync(Guid bouquetId, ReverseBouquetRequest request, CancellationToken ct = default)
    {
        var original = await _context.SpiritualBouquets
            .Include(b => b.Enrollment)
                .ThenInclude(e => e.Student)
            .FirstOrDefaultAsync(b => b.Id == bouquetId, ct);

        if (original == null)
            return Result.NotFound<SpiritualBouquetDto>("Không tìm thấy bản ghi hoa thiêng gốc");

        var canAccess = await _scopeContext.CanAccessClassRoomAsync(original.Enrollment.ClassRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<SpiritualBouquetDto>("Bạn không có quyền thao tác trên lớp học này");

        if (original.ReversesBouquetId.HasValue)
            return Result.BadRequest<SpiritualBouquetDto>(ErrorCodes.ValidationFailed, "Không thể đảo ngược một dòng đã là dòng đảo ngược");

        var alreadyReversed = await _context.SpiritualBouquets
            .AnyAsync(b => b.ReversesBouquetId == bouquetId, ct);

        if (alreadyReversed)
            return Result.Failure<SpiritualBouquetDto>(409, ErrorCodes.ConflictDuplicate, "Bản ghi hoa thiêng này đã được đảo ngược trước đó");

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var reversal = new SpiritualBouquet
        {
            Id = Guid.NewGuid(),
            EnrollmentId = original.EnrollmentId,
            BouquetDate = DateOnly.FromDateTime(DateTime.UtcNow),
            BouquetType = original.BouquetType,
            Points = -original.Points,
            GivenBy = currentUserId,
            Note = string.IsNullOrWhiteSpace(request.Reason) ? $"Đảo dòng nhầm #{original.Id.ToString()[..8]}" : request.Reason.Trim(),
            ReversesBouquetId = original.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.SpiritualBouquets.Add(reversal);
        await _context.SaveChangesAsync(ct);

        var givenUser = await _context.Users.FindAsync(new object[] { currentUserId }, ct);

        var dto = new SpiritualBouquetDto
        {
            Id = reversal.Id,
            EnrollmentId = reversal.EnrollmentId,
            StudentId = original.Enrollment.StudentId,
            StudentCode = original.Enrollment.Student?.Code ?? string.Empty,
            StudentHolyName = original.Enrollment.Student?.HolyName ?? string.Empty,
            StudentFullName = original.Enrollment.Student?.FullName ?? string.Empty,
            BouquetDate = reversal.BouquetDate,
            BouquetType = reversal.BouquetType,
            Points = reversal.Points,
            GivenBy = reversal.GivenBy,
            GivenByName = givenUser?.FullName ?? string.Empty,
            Note = reversal.Note,
            ReversesBouquetId = reversal.ReversesBouquetId,
            CreatedAt = reversal.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<List<BouquetLeaderboardEntryDto>>> GetLeaderboardAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var canAccess = await _scopeContext.CanAccessClassRoomAsync(classRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<List<BouquetLeaderboardEntryDto>>("Bạn không có quyền truy cập bảng xếp hạng của lớp này");

        var enrollments = await _context.Enrollments
            .AsNoTracking()
            .Include(e => e.Student)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == "Active")
            .ToListAsync(ct);

        var enrollmentIds = enrollments.Select(e => e.Id).ToList();

        var bouquets = await _context.SpiritualBouquets
            .AsNoTracking()
            .Where(b => enrollmentIds.Contains(b.EnrollmentId))
            .ToListAsync(ct);

        var grouped = bouquets
            .GroupBy(b => b.EnrollmentId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var entries = new List<BouquetLeaderboardEntryDto>();

        foreach (var en in enrollments)
        {
            var studentBouquets = grouped.GetValueOrDefault(en.Id, new List<SpiritualBouquet>());
            var totalPoints = studentBouquets.Sum(b => b.Points);

            var pointsByType = studentBouquets
                .GroupBy(b => b.BouquetType)
                .ToDictionary(g => g.Key, g => g.Sum(x => x.Points));

            entries.Add(new BouquetLeaderboardEntryDto
            {
                EnrollmentId = en.Id,
                StudentId = en.StudentId,
                StudentCode = en.Student?.Code ?? string.Empty,
                StudentHolyName = en.Student?.HolyName ?? string.Empty,
                StudentFullName = en.Student?.FullName ?? string.Empty,
                TotalPoints = totalPoints,
                BouquetCount = studentBouquets.Count,
                PointsByType = pointsByType
            });
        }

        // Rank students by total points descending
        entries = entries
            .OrderByDescending(e => e.TotalPoints)
            .ThenBy(e => e.StudentFullName)
            .ToList();

        int rank = 1;
        for (int i = 0; i < entries.Count; i++)
        {
            if (i > 0 && entries[i].TotalPoints < entries[i - 1].TotalPoints)
            {
                rank = i + 1;
            }
            entries[i].Rank = rank;
        }

        return Result.Ok(entries);
    }

    private async Task<int> GetMaxPointsSettingAsync(CancellationToken ct)
    {
        var setting = await _context.SystemSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Key == SettingMaxPointsKey, ct);

        if (setting != null && int.TryParse(setting.Value, out var points) && points > 0)
        {
            return points;
        }

        return BouquetRules.DefaultMaxPointsPerEntry;
    }
}
