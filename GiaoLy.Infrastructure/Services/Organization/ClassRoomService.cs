using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Organization;

public class ClassRoomService : IClassRoomService
{
    private readonly AppDbContext _db;
    private readonly IScopeContext _scopeContext;
    private readonly ILogger<ClassRoomService> _logger;

    public ClassRoomService(
        AppDbContext db,
        IScopeContext scopeContext,
        ILogger<ClassRoomService> logger)
    {
        _db = db;
        _scopeContext = scopeContext;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<ClassRoomResponse>>> GetClassRoomsByYearAsync(Guid yearId, CancellationToken ct = default)
    {
        var yearExists = await _db.AcademicYears.AnyAsync(y => y.Id == yearId, ct);
        if (!yearExists)
        {
            return Result.NotFound<IReadOnlyList<ClassRoomResponse>>($"Không tìm thấy niên khóa với Id '{yearId}'.");
        }

        var query = _db.ClassRooms
            .AsNoTracking()
            .Where(c => c.AcademicYearId == yearId && c.DeletedAt == null);

        query = _scopeContext.ClassRooms(query);

        var classrooms = await query
            .Include(c => c.AcademicYear)
            .Include(c => c.ClassLevel)
            .Include(c => c.Teachers)
                .ThenInclude(t => t.User)
            .OrderBy(c => c.ClassLevel != null ? c.ClassLevel.SortOrder : 0)
            .ThenBy(c => c.Section)
            .ToListAsync(ct);

        var classroomIds = classrooms.Select(c => c.Id).ToList();
        var studentCounts = await _db.Enrollments
            .AsNoTracking()
            .Where(e => classroomIds.Contains(e.ClassRoomId) && EnrollmentRules.Statuses.InClass.Contains(e.Status))
            .GroupBy(e => e.ClassRoomId)
            .Select(g => new { ClassRoomId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ClassRoomId, x => x.Count, ct);

        var responses = classrooms.Select(c => MapToResponse(c, studentCounts.GetValueOrDefault(c.Id, 0))).ToList();
        return Result.Ok<IReadOnlyList<ClassRoomResponse>>(responses);
    }

    public async Task<Result<ClassRoomResponse>> GetClassRoomByIdAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(id, ct))
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var classroom = await _db.ClassRooms
            .AsNoTracking()
            .Include(c => c.AcademicYear)
            .Include(c => c.ClassLevel)
            .Include(c => c.Teachers)
                .ThenInclude(t => t.User)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (classroom == null)
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var studentCount = await _db.Enrollments
            .AsNoTracking()
            .CountAsync(e => e.ClassRoomId == id && EnrollmentRules.Statuses.InClass.Contains(e.Status), ct);

        return Result<ClassRoomResponse>.Ok(MapToResponse(classroom, studentCount));
    }

    public async Task<Result<ClassRoomResponse>> CreateClassRoomAsync(Guid yearId, CreateClassRoomRequest request, CancellationToken ct = default)
    {
        var year = await _db.AcademicYears.FirstOrDefaultAsync(y => y.Id == yearId, ct);
        if (year == null)
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy niên khóa với Id '{yearId}'.");
        }

        var level = await _db.ClassLevels.FirstOrDefaultAsync(l => l.Id == request.ClassLevelId, ct);
        if (level == null)
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy cấp lớp với Id '{request.ClassLevelId}'.");
        }

        var section = (request.Section ?? string.Empty).Trim();
        var duplicate = await _db.ClassRooms
            .AnyAsync(c => c.AcademicYearId == yearId && c.ClassLevelId == request.ClassLevelId && c.Section == section && c.DeletedAt == null, ct);

        if (duplicate)
        {
            return Result<ClassRoomResponse>.Conflict($"Lớp '{level.Name}' phân lớp '{section}' đã tồn tại trong niên khóa '{year.Name}'.");
        }

        var classroom = new ClassRoom
        {
            Id = Guid.NewGuid(),
            AcademicYearId = yearId,
            ClassLevelId = request.ClassLevelId,
            Section = section,
            RoomName = request.RoomName?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _db.ClassRooms.Add(classroom);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã tạo lớp học mới: {ClassId} ({LevelName} - {Section}) trong niên khóa {Year}", classroom.Id, level.Name, section, year.Name);

        return await GetClassRoomByIdAsync(classroom.Id, ct);
    }

    public async Task<Result<ClassRoomResponse>> UpdateClassRoomAsync(Guid id, UpdateClassRoomRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(id, ct))
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var classroom = await _db.ClassRooms.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);
        if (classroom == null)
        {
            return Result<ClassRoomResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var section = (request.Section ?? string.Empty).Trim();
        if (classroom.Section != section)
        {
            var duplicate = await _db.ClassRooms
                .AnyAsync(c => c.Id != id && c.AcademicYearId == classroom.AcademicYearId && c.ClassLevelId == classroom.ClassLevelId && c.Section == section && c.DeletedAt == null, ct);

            if (duplicate)
            {
                return Result<ClassRoomResponse>.Conflict($"Phân lớp '{section}' đã tồn tại cho cấp lớp này trong niên khóa.");
            }
            classroom.Section = section;
        }

        classroom.RoomName = request.RoomName?.Trim();
        classroom.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật lớp học: {ClassId}", id);

        return await GetClassRoomByIdAsync(id, ct);
    }

    public async Task<Result> DeleteClassRoomAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(id, ct))
        {
            return Result.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var classroom = await _db.ClassRooms.FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);
        if (classroom == null)
        {
            return Result.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var hasEnrollments = await _db.Enrollments.AnyAsync(e => e.ClassRoomId == id, ct);
        if (hasEnrollments)
        {
            return Result.Validation("Không thể xóa lớp học đã có hồ sơ phân lớp / ghi danh. Vui lòng chuyển hoặc xóa ghi danh trước.");
        }

        classroom.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã xóa mềm lớp học: {ClassId}", id);
        return Result.Ok();
    }

    public async Task<Result> AssignTeachersAsync(Guid id, AssignTeachersRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(id, ct))
        {
            return Result.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var classroom = await _db.ClassRooms
            .Include(c => c.Teachers)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (classroom == null)
        {
            return Result.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var assistantIds = (request.AssistantTeacherUserIds ?? new List<Guid>()).Distinct().ToList();

        if (request.LeadTeacherUserId.HasValue && assistantIds.Contains(request.LeadTeacherUserId.Value))
        {
            return Result.Validation("Giáo lý viên chủ nhiệm không thể đồng thời là giáo lý viên phụ tá trong cùng một lớp.");
        }

        var allTeacherIds = new List<Guid>();
        if (request.LeadTeacherUserId.HasValue)
        {
            allTeacherIds.Add(request.LeadTeacherUserId.Value);
        }
        allTeacherIds.AddRange(assistantIds);

        if (allTeacherIds.Count > 0)
        {
            var validUsers = await _db.Users
                .Where(u => allTeacherIds.Contains(u.Id) && u.IsActive && u.DeletedAt == null)
                .Select(u => u.Id)
                .ToListAsync(ct);

            var missing = allTeacherIds.Except(validUsers).ToList();
            if (missing.Count > 0)
            {
                return Result.Validation($"Không tìm thấy giáo lý viên hợp lệ hoặc tài khoản đang bị khóa cho Id: {string.Join(", ", missing)}");
            }
        }

        _db.ClassRoomTeachers.RemoveRange(classroom.Teachers);

        if (request.LeadTeacherUserId.HasValue)
        {
            _db.ClassRoomTeachers.Add(new ClassRoomTeacher
            {
                ClassRoomId = id,
                UserId = request.LeadTeacherUserId.Value,
                IsLead = true,
                AssignedAt = DateTime.UtcNow
            });
        }

        foreach (var aid in assistantIds)
        {
            _db.ClassRoomTeachers.Add(new ClassRoomTeacher
            {
                ClassRoomId = id,
                UserId = aid,
                IsLead = false,
                AssignedAt = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã phân công giáo lý viên cho lớp: {ClassId}", id);

        return Result.Ok();
    }

    public async Task<Result<ClassRosterResponse>> GetClassRosterAsync(Guid id, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessClassRoomAsync(id, ct))
        {
            return Result<ClassRosterResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var classroom = await _db.ClassRooms
            .AsNoTracking()
            .Include(c => c.ClassLevel)
            .FirstOrDefaultAsync(c => c.Id == id && c.DeletedAt == null, ct);

        if (classroom == null)
        {
            return Result<ClassRosterResponse>.NotFound($"Không tìm thấy lớp học với Id '{id}'.");
        }

        var enrollments = await _db.Enrollments
            .AsNoTracking()
            .Include(e => e.Student)
            .Where(e => e.ClassRoomId == id && EnrollmentRules.Statuses.InClass.Contains(e.Status))
            .OrderBy(e => e.Student != null ? e.Student.FullName : string.Empty)
            .ToListAsync(ct);

        var students = enrollments
            .Where(e => e.Student != null)
            .Select(e => new StudentRosterItem(
                e.StudentId,
                e.Student!.FullName,
                e.Student.HolyName,
                DateOnly.FromDateTime(e.Student.BirthDate),
                e.Student.Gender,
                e.Status
            ))
            .ToList();

        return Result<ClassRosterResponse>.Ok(new ClassRosterResponse(
            classroom.Id,
            classroom.ClassName,
            students
        ));
    }

    private static ClassRoomResponse MapToResponse(ClassRoom c, int studentCount)
    {
        var leadTeacher = c.Teachers.FirstOrDefault(t => t.IsLead);
        var assistants = c.Teachers.Where(t => !t.IsLead).ToList();

        var leadResponse = leadTeacher?.User != null
            ? new TeacherSummaryResponse(
                leadTeacher.User.Id,
                leadTeacher.User.Username,
                leadTeacher.User.FullName,
                leadTeacher.User.ChristianName,
                true)
            : null;

        var assistantResponses = assistants
            .Where(t => t.User != null)
            .Select(t => new TeacherSummaryResponse(
                t.User!.Id,
                t.User.Username,
                t.User.FullName,
                t.User.ChristianName,
                false))
            .ToList();

        return new ClassRoomResponse(
            c.Id,
            c.AcademicYearId,
            c.AcademicYear?.Name ?? string.Empty,
            c.ClassLevelId,
            c.ClassLevel?.Code ?? string.Empty,
            c.ClassLevel?.Name ?? string.Empty,
            c.ClassLevel?.BranchId ?? 0,
            c.Section,
            c.ClassName,
            c.RoomName,
            leadResponse,
            assistantResponses,
            studentCount
        );
    }
}
