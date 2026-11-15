using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Organization;

public class AcademicYearService : IAcademicYearService
{
    private readonly AppDbContext _db;
    private readonly ILogger<AcademicYearService> _logger;

    public AcademicYearService(AppDbContext db, ILogger<AcademicYearService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<AcademicYearResponse>>> GetAcademicYearsAsync(CancellationToken ct = default)
    {
        var years = await _db.AcademicYears
            .AsNoTracking()
            .OrderByDescending(y => y.StartDate)
            .Select(y => new AcademicYearResponse(
                y.Id,
                y.Name,
                y.StartDate,
                y.EndDate,
                y.Status,
                y.ActivatedAt,
                y.ClosedAt,
                y.ArchivedAt,
                y.ReopenedAt,
                y.ReopenReason,
                y.ClassRooms.Count(c => c.DeletedAt == null)
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<AcademicYearResponse>>(years);
    }

    public async Task<Result<AcademicYearResponse>> GetActiveAcademicYearAsync(CancellationToken ct = default)
    {
        var year = await _db.AcademicYears
            .AsNoTracking()
            .Where(y => y.Status == AcademicYearStateMachine.StatusActive)
            .Select(y => new AcademicYearResponse(
                y.Id,
                y.Name,
                y.StartDate,
                y.EndDate,
                y.Status,
                y.ActivatedAt,
                y.ClosedAt,
                y.ArchivedAt,
                y.ReopenedAt,
                y.ReopenReason,
                y.ClassRooms.Count(c => c.DeletedAt == null)
            ))
            .FirstOrDefaultAsync(ct);

        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound("Không tìm thấy niên khóa đang hoạt động.");
        }

        return Result<AcademicYearResponse>.Ok(year);
    }

    public async Task<Result<AcademicYearResponse>> GetAcademicYearByIdAsync(Guid id, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears
            .AsNoTracking()
            .Where(y => y.Id == id)
            .Select(y => new AcademicYearResponse(
                y.Id,
                y.Name,
                y.StartDate,
                y.EndDate,
                y.Status,
                y.ActivatedAt,
                y.ClosedAt,
                y.ArchivedAt,
                y.ReopenedAt,
                y.ReopenReason,
                y.ClassRooms.Count(c => c.DeletedAt == null)
            ))
            .FirstOrDefaultAsync(ct);

        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        return Result<AcademicYearResponse>.Ok(year);
    }

    public async Task<Result<AcademicYearResponse>> CreateAcademicYearAsync(CreateAcademicYearRequest request, CancellationToken ct = default)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result<AcademicYearResponse>.Validation("Tên niên khóa không được để trống.", "Name");
        }

        if (request.StartDate >= request.EndDate)
        {
            return Result<AcademicYearResponse>.Validation("Ngày bắt đầu phải trước ngày kết thúc.", "StartDate");
        }

        var exists = await _db.AcademicYears.AnyAsync(y => y.Name == name, ct);
        if (exists)
        {
            return Result<AcademicYearResponse>.Conflict($"Niên khóa với tên '{name}' đã tồn tại.");
        }

        var year = new AcademicYear
        {
            Id = Guid.NewGuid(),
            Name = name,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = AcademicYearStateMachine.StatusPlanned,
            CreatedAt = DateTime.UtcNow
        };

        _db.AcademicYears.Add(year);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã tạo niên khóa mới: {Name} ({Id}) ở trạng thái Planned", year.Name, year.Id);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result<AcademicYearResponse>> UpdateAcademicYearAsync(Guid id, UpdateAcademicYearRequest request, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result<AcademicYearResponse>.Validation("Tên niên khóa không được để trống.", "Name");
        }

        if (request.StartDate >= request.EndDate)
        {
            return Result<AcademicYearResponse>.Validation("Ngày bắt đầu phải trước ngày kết thúc.", "StartDate");
        }

        var duplicate = await _db.AcademicYears.AnyAsync(y => y.Id != id && y.Name == name, ct);
        if (duplicate)
        {
            return Result<AcademicYearResponse>.Conflict($"Niên khóa với tên '{name}' đã tồn tại.");
        }

        year.Name = name;
        year.StartDate = request.StartDate;
        year.EndDate = request.EndDate;
        year.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật thông tin niên khóa: {Name} ({Id})", year.Name, year.Id);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result> DeleteAcademicYearAsync(Guid id, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        var classCount = await _db.ClassRooms.CountAsync(c => c.AcademicYearId == id && c.DeletedAt == null, ct);
        if (!AcademicYearStateMachine.CanDelete(year, classCount, out var err))
        {
            return Result.Validation(err!);
        }

        _db.AcademicYears.Remove(year);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã xóa niên khóa: {Name} ({Id})", year.Name, year.Id);
        return Result.Ok();
    }

    public async Task<Result<AcademicYearResponse>> ActivateAcademicYearAsync(Guid id, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        var hasOtherActive = await _db.AcademicYears.AnyAsync(y => y.Id != id && y.Status == AcademicYearStateMachine.StatusActive, ct);
        var classCount = await _db.ClassRooms.CountAsync(c => c.AcademicYearId == id && c.DeletedAt == null, ct);

        if (!AcademicYearStateMachine.CanActivate(year, hasOtherActive, classCount, out var err))
        {
            return Result<AcademicYearResponse>.Validation(err!);
        }

        year.Status = AcademicYearStateMachine.StatusActive;
        year.ActivatedAt = DateTime.UtcNow;
        year.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Kích hoạt niên khóa thành công: {Name} ({Id})", year.Name, year.Id);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result<AcademicYearResponse>> CloseAcademicYearAsync(Guid id, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        if (!AcademicYearStateMachine.CanClose(year, out var err))
        {
            return Result<AcademicYearResponse>.Validation(err!);
        }

        year.Status = AcademicYearStateMachine.StatusClosing;
        year.ClosedAt = DateTime.UtcNow;
        year.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Chốt niên khóa thành công (khóa sổ điểm): {Name} ({Id})", year.Name, year.Id);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result<AcademicYearResponse>> ArchiveAcademicYearAsync(Guid id, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        var hasOpenBatches = await _db.PromotionBatches.AnyAsync(
            b => b.SourceYearId == id && b.Status != "Applied" && b.Status != "Cancelled",
            ct);
        if (!AcademicYearStateMachine.CanArchive(year, hasOpenBatches, out var err))
        {
            return Result<AcademicYearResponse>.Validation(err!);
        }

        year.Status = AcademicYearStateMachine.StatusArchived;
        year.ArchivedAt = DateTime.UtcNow;
        year.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Lưu trữ niên khóa thành công: {Name} ({Id})", year.Name, year.Id);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result<AcademicYearResponse>> ReopenAcademicYearAsync(Guid id, ReopenAcademicYearRequest request, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == id, ct);
        if (year == null)
        {
            return Result<AcademicYearResponse>.NotFound($"Không tìm thấy niên khóa với Id '{id}'.");
        }

        var hasOtherActive = await _db.AcademicYears.AnyAsync(y => y.Id != id && y.Status == AcademicYearStateMachine.StatusActive, ct);
        if (!AcademicYearStateMachine.CanReopen(year, request.Reason, hasOtherActive, out var err))
        {
            return Result<AcademicYearResponse>.Validation(err!);
        }

        year.Status = AcademicYearStateMachine.StatusActive;
        year.ReopenedAt = DateTime.UtcNow;
        year.ReopenReason = request.Reason.Trim();
        year.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogWarning("Mở lại niên khóa {Name} ({Id}). Lý do: {Reason}", year.Name, year.Id, request.Reason);

        return await GetAcademicYearByIdAsync(year.Id, ct);
    }

    public async Task<Result<int>> CloneStructureAsync(Guid targetYearId, CloneStructureRequest request, CancellationToken ct = default)
    {
        var targetYear = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == targetYearId, ct);
        if (targetYear == null)
        {
            return Result<int>.NotFound($"Không tìm thấy niên khóa đích với Id '{targetYearId}'.");
        }

        if (targetYear.Status != AcademicYearStateMachine.StatusPlanned)
        {
            return Result<int>.Validation($"Chỉ có thể sao chép cơ cấu vào niên khóa đang ở trạng thái '{AcademicYearStateMachine.StatusPlanned}'. Trạng thái hiện tại: '{targetYear.Status}'.");
        }

        if (targetYearId == request.SourceAcademicYearId)
        {
            return Result<int>.Validation("Niên khóa nguồn và niên khóa đích không được trùng nhau.");
        }

        var sourceYear = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == request.SourceAcademicYearId, ct);
        if (sourceYear == null)
        {
            return Result<int>.NotFound($"Không tìm thấy niên khóa nguồn với Id '{request.SourceAcademicYearId}'.");
        }

        var sourceClasses = await _db.ClassRooms
            .Where(c => c.AcademicYearId == request.SourceAcademicYearId && c.DeletedAt == null)
            .ToListAsync(ct);

        if (sourceClasses.Count == 0)
        {
            return Result<int>.Validation("Niên khóa nguồn không có lớp học nào để sao chép.");
        }

        var existingClasses = await _db.ClassRooms
            .Where(c => c.AcademicYearId == targetYearId && c.DeletedAt == null)
            .ToListAsync(ct);

        var existingKeys = new HashSet<string>(
            existingClasses.Select(c => $"{c.ClassLevelId}#{(c.Section ?? string.Empty).Trim().ToUpperInvariant()}"),
            StringComparer.OrdinalIgnoreCase
        );

        var addedCount = 0;
        foreach (var sc in sourceClasses)
        {
            var key = $"{sc.ClassLevelId}#{(sc.Section ?? string.Empty).Trim().ToUpperInvariant()}";
            if (!existingKeys.Contains(key))
            {
                var newClass = new ClassRoom
                {
                    Id = Guid.NewGuid(),
                    AcademicYearId = targetYearId,
                    ClassLevelId = sc.ClassLevelId,
                    Section = sc.Section ?? string.Empty,
                    RoomName = sc.RoomName,
                    CreatedAt = DateTime.UtcNow
                };

                _db.ClassRooms.Add(newClass);
                existingKeys.Add(key);
                addedCount++;
            }
        }

        if (addedCount > 0)
        {
            await _db.SaveChangesAsync(ct);
            _logger.LogInformation("Sao chép thành công {Count} lớp học từ niên khóa {Source} sang {Target}", addedCount, sourceYear.Name, targetYear.Name);
        }

        return Result<int>.Ok(addedCount);
    }
}
