using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Organization;

public class FamilyService : IFamilyService
{
    private readonly AppDbContext _db;
    private readonly IScopeContext _scopeContext;
    private readonly ILogger<FamilyService> _logger;

    public FamilyService(
        AppDbContext db,
        IScopeContext scopeContext,
        ILogger<FamilyService> logger)
    {
        _db = db;
        _scopeContext = scopeContext;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<FamilyResponse>>> GetFamiliesAsync(Guid? classRoomId, CancellationToken ct = default)
    {
        var query = _db.Families
            .AsNoTracking()
            .Where(f => f.DeletedAt == null);

        if (classRoomId.HasValue)
        {
            if (!await _scopeContext.CanAccessClassRoomAsync(classRoomId.Value, ct))
            {
                return Result.NotFound<IReadOnlyList<FamilyResponse>>($"Không tìm thấy lớp học với Id '{classRoomId.Value}'.");
            }
            query = query.Where(f => f.ClassRoomId == classRoomId.Value);
        }
        else
        {
            var allowedClassIds = _scopeContext.ClassRooms(_db.ClassRooms.AsNoTracking().Where(c => c.DeletedAt == null))
                .Select(c => c.Id);
            query = query.Where(f => allowedClassIds.Contains(f.ClassRoomId));
        }

        var families = await query
            .Include(f => f.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .OrderBy(f => f.Name)
            .Select(f => new FamilyResponse(
                f.Id,
                f.Name,
                f.PatronSaint,
                f.ClassRoomId,
                f.ClassRoom != null ? f.ClassRoom.ClassName : string.Empty,
                f.Description,
                f.Students.Count(s => s.IsActive)
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<FamilyResponse>>(families);
    }

    public async Task<Result<FamilyResponse>> CreateFamilyAsync(CreateFamilyRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId, ct))
        {
            return Result<FamilyResponse>.NotFound($"Không tìm thấy lớp học với Id '{request.ClassRoomId}'.");
        }

        var classroom = await _db.ClassRooms
            .Include(c => c.ClassLevel)
            .FirstOrDefaultAsync(c => c.Id == request.ClassRoomId && c.DeletedAt == null, ct);

        if (classroom == null)
        {
            return Result<FamilyResponse>.NotFound($"Không tìm thấy lớp học với Id '{request.ClassRoomId}'.");
        }

        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result<FamilyResponse>.Validation("Tên gia đình không được để trống.", "Name");
        }

        var duplicate = await _db.Families
            .AnyAsync(f => f.ClassRoomId == request.ClassRoomId && f.Name == name && f.DeletedAt == null, ct);

        if (duplicate)
        {
            return Result<FamilyResponse>.Conflict($"Gia đình với tên '{name}' đã tồn tại trong lớp '{classroom.ClassName}'.");
        }

        var family = new Family
        {
            Id = Guid.NewGuid(),
            Name = name,
            ClassRoomId = request.ClassRoomId,
            PatronSaint = request.PatronSaint?.Trim(),
            Description = request.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _db.Families.Add(family);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã tạo gia đình mới: {FamilyName} ({FamilyId}) thuộc lớp {ClassName}", family.Name, family.Id, classroom.ClassName);

        return Result<FamilyResponse>.Ok(new FamilyResponse(
            family.Id,
            family.Name,
            family.PatronSaint,
            family.ClassRoomId,
            classroom.ClassName,
            family.Description,
            0
        ));
    }

    public async Task<Result<FamilyResponse>> UpdateFamilyAsync(Guid id, UpdateFamilyRequest request, CancellationToken ct = default)
    {
        var family = await _db.Families
            .Include(f => f.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .Include(f => f.Students)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null, ct);

        if (family == null)
        {
            return Result<FamilyResponse>.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        if (!await _scopeContext.CanAccessClassRoomAsync(family.ClassRoomId, ct))
        {
            return Result<FamilyResponse>.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result<FamilyResponse>.Validation("Tên gia đình không được để trống.", "Name");
        }

        if (family.Name != name)
        {
            var duplicate = await _db.Families
                .AnyAsync(f => f.Id != id && f.ClassRoomId == family.ClassRoomId && f.Name == name && f.DeletedAt == null, ct);

            if (duplicate)
            {
                return Result<FamilyResponse>.Conflict($"Gia đình với tên '{name}' đã tồn tại trong lớp này.");
            }
            family.Name = name;
        }

        family.PatronSaint = request.PatronSaint?.Trim();
        family.Description = request.Description?.Trim();
        family.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật gia đình: {FamilyName} ({FamilyId})", family.Name, family.Id);

        return Result<FamilyResponse>.Ok(new FamilyResponse(
            family.Id,
            family.Name,
            family.PatronSaint,
            family.ClassRoomId,
            family.ClassRoom?.ClassName ?? string.Empty,
            family.Description,
            family.Students.Count(s => s.IsActive)
        ));
    }

    public async Task<Result> DeleteFamilyAsync(Guid id, CancellationToken ct = default)
    {
        var family = await _db.Families
            .Include(f => f.Students)
            .FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null, ct);

        if (family == null)
        {
            return Result.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        if (!await _scopeContext.CanAccessClassRoomAsync(family.ClassRoomId, ct))
        {
            return Result.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        family.DeletedAt = DateTime.UtcNow;

        // Reset FamilyId for associated students
        foreach (var student in family.Students)
        {
            student.FamilyId = null;
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã xóa mềm gia đình: {FamilyId}", id);

        return Result.Ok();
    }

    public async Task<Result> AssignFamilyMembersAsync(Guid id, AssignFamilyMembersRequest request, CancellationToken ct = default)
    {
        var family = await _db.Families.FirstOrDefaultAsync(f => f.Id == id && f.DeletedAt == null, ct);
        if (family == null)
        {
            return Result.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        if (!await _scopeContext.CanAccessClassRoomAsync(family.ClassRoomId, ct))
        {
            return Result.NotFound($"Không tìm thấy gia đình với Id '{id}'.");
        }

        var studentIds = (request.StudentIds ?? new List<Guid>()).Distinct().ToList();

        if (studentIds.Count > 0)
        {
            // Verify all students are active members of this classroom
            var enrolledStudentIds = await _db.Enrollments
                .Where(e => e.ClassRoomId == family.ClassRoomId && e.Status == "Active" && studentIds.Contains(e.StudentId))
                .Select(e => e.StudentId)
                .ToListAsync(ct);

            var notEnrolled = studentIds.Except(enrolledStudentIds).ToList();
            if (notEnrolled.Count > 0)
            {
                return Result.Validation($"Có đoàn sinh không thuộc danh sách đang học tại lớp này: {string.Join(", ", notEnrolled)}");
            }
        }

        // Remove previous members
        var currentMembers = await _db.Students.Where(s => s.FamilyId == id).ToListAsync(ct);
        foreach (var s in currentMembers)
        {
            s.FamilyId = null;
        }

        // Assign new members
        if (studentIds.Count > 0)
        {
            var newMembers = await _db.Students.Where(s => studentIds.Contains(s.Id)).ToListAsync(ct);
            foreach (var s in newMembers)
            {
                s.FamilyId = id;
            }
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã gán {Count} đoàn sinh vào gia đình {FamilyId}", studentIds.Count, id);

        return Result.Ok();
    }
}
