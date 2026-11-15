using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Duty.Contracts;
using GiaoLy.Application.Duty.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Duty;

public class DutyService : IDutyService
{
    private readonly AppDbContext _context;
    private readonly IScopeContext _scopeContext;

    public DutyService(AppDbContext context, IScopeContext scopeContext)
    {
        _context = context;
        _scopeContext = scopeContext;
    }

    public async Task<Result<List<DutyAssignmentDto>>> GetAssignmentsAsync(
        Guid? classRoomId,
        DateOnly? fromDate,
        DateOnly? toDate,
        Guid? userId,
        CancellationToken ct = default)
    {
        var query = _context.DutyAssignments
            .AsNoTracking()
            .Include(d => d.User)
            .Include(d => d.ClassRoom)
                .ThenInclude(c => c.ClassLevel)
            .AsQueryable();

        if (classRoomId.HasValue)
        {
            var canAccess = await _scopeContext.CanAccessClassRoomAsync(classRoomId.Value, ct);
            if (!canAccess)
                return Result.Forbidden<List<DutyAssignmentDto>>("Bạn không có quyền truy cập lớp học này");

            query = query.Where(d => d.ClassRoomId == classRoomId.Value);
        }
        else
        {
            query = _scopeContext.ClassRooms(_context.ClassRooms)
                .Join(query, c => c.Id, d => d.ClassRoomId, (c, d) => d);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(d => d.DutyDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(d => d.DutyDate <= toDate.Value);
        }

        if (userId.HasValue)
        {
            query = query.Where(d => d.UserId == userId.Value);
        }

        var list = await query
            .OrderBy(d => d.DutyDate)
            .ThenBy(d => d.RoleName)
            .ToListAsync(ct);

        var dtos = list.Select(d => new DutyAssignmentDto
        {
            Id = d.Id,
            UserId = d.UserId,
            UserFullName = d.User?.FullName ?? string.Empty,
            ClassRoomId = d.ClassRoomId,
            ClassRoomName = d.ClassRoom?.ClassName ?? string.Empty,
            DutyDate = d.DutyDate,
            RoleName = d.RoleName,
            Note = d.Note,
            CreatedAt = d.CreatedAt
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<DutyAssignmentDto>> GetAssignmentByIdAsync(Guid id, CancellationToken ct = default)
    {
        var d = await _context.DutyAssignments
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.ClassRoom)
                .ThenInclude(c => c.ClassLevel)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (d == null)
            return Result.NotFound<DutyAssignmentDto>("Không tìm thấy phân công trực");

        var canAccess = await _scopeContext.CanAccessClassRoomAsync(d.ClassRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<DutyAssignmentDto>("Bạn không có quyền xem phân công của lớp này");

        var dto = new DutyAssignmentDto
        {
            Id = d.Id,
            UserId = d.UserId,
            UserFullName = d.User?.FullName ?? string.Empty,
            ClassRoomId = d.ClassRoomId,
            ClassRoomName = d.ClassRoom?.ClassName ?? string.Empty,
            DutyDate = d.DutyDate,
            RoleName = d.RoleName,
            Note = d.Note,
            CreatedAt = d.CreatedAt
        };

        return Result.Ok(dto);
    }

    public async Task<Result<DutyAssignmentDto>> CreateAssignmentAsync(CreateDutyAssignmentRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.RoleName))
            return Result.BadRequest<DutyAssignmentDto>(ErrorCodes.ValidationFailed, "Vai trò trực không được để trống");

        var canAccess = await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<DutyAssignmentDto>("Bạn không có quyền phân công cho lớp học này");

        var user = await _context.Users.FindAsync(new object[] { request.UserId }, ct);
        if (user == null)
            return Result.NotFound<DutyAssignmentDto>("Không tìm thấy huynh trưởng / giáo lý viên");

        var classRoom = await _context.ClassRooms.FindAsync(new object[] { request.ClassRoomId }, ct);
        if (classRoom == null || classRoom.DeletedAt != null)
            return Result.NotFound<DutyAssignmentDto>("Không tìm thấy lớp học");

        // Check unique slot constraint (UserId, ClassRoomId, DutyDate, RoleName)
        var exists = await _context.DutyAssignments.AnyAsync(d =>
            d.UserId == request.UserId &&
            d.ClassRoomId == request.ClassRoomId &&
            d.DutyDate == request.DutyDate &&
            d.RoleName == request.RoleName.Trim(), ct);

        if (exists)
        {
            return Result.Failure<DutyAssignmentDto>(409, ErrorCodes.ConflictDuplicate,
                "Giáo lý viên này đã được phân công vai trò này cho lớp vào ngày đã chọn");
        }

        var assignment = new DutyAssignment
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ClassRoomId = request.ClassRoomId,
            DutyDate = request.DutyDate,
            RoleName = request.RoleName.Trim(),
            Note = request.Note?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.DutyAssignments.Add(assignment);
        await _context.SaveChangesAsync(ct);

        return await GetAssignmentByIdAsync(assignment.Id, ct);
    }

    public async Task<Result<DutyAssignmentDto>> UpdateAssignmentAsync(Guid id, UpdateDutyAssignmentRequest request, CancellationToken ct = default)
    {
        var d = await _context.DutyAssignments.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (d == null)
            return Result.NotFound<DutyAssignmentDto>("Không tìm thấy phân công trực");

        var canAccessCurrent = await _scopeContext.CanAccessClassRoomAsync(d.ClassRoomId, ct);
        if (!canAccessCurrent)
            return Result.Forbidden<DutyAssignmentDto>("Bạn không có quyền sửa phân công của lớp này");

        var canAccessTarget = await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId, ct);
        if (!canAccessTarget)
            return Result.Forbidden<DutyAssignmentDto>("Bạn không có quyền chuyển phân công sang lớp này");

        if (string.IsNullOrWhiteSpace(request.RoleName))
            return Result.BadRequest<DutyAssignmentDto>(ErrorCodes.ValidationFailed, "Vai trò trực không được để trống");

        var user = await _context.Users.FindAsync(new object[] { request.UserId }, ct);
        if (user == null)
            return Result.NotFound<DutyAssignmentDto>("Không tìm thấy huynh trưởng / giáo lý viên");

        // Check uniqueness excluding self
        var exists = await _context.DutyAssignments.AnyAsync(x =>
            x.Id != id &&
            x.UserId == request.UserId &&
            x.ClassRoomId == request.ClassRoomId &&
            x.DutyDate == request.DutyDate &&
            x.RoleName == request.RoleName.Trim(), ct);

        if (exists)
        {
            return Result.Failure<DutyAssignmentDto>(409, ErrorCodes.ConflictDuplicate,
                "Phân công này bị trùng với một phân công trực khác đã có");
        }

        d.UserId = request.UserId;
        d.ClassRoomId = request.ClassRoomId;
        d.DutyDate = request.DutyDate;
        d.RoleName = request.RoleName.Trim();
        d.Note = request.Note?.Trim();
        d.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetAssignmentByIdAsync(d.Id, ct);
    }

    public async Task<Result<bool>> DeleteAssignmentAsync(Guid id, CancellationToken ct = default)
    {
        var d = await _context.DutyAssignments.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (d == null)
            return Result.NotFound<bool>("Không tìm thấy phân công trực");

        var canAccess = await _scopeContext.CanAccessClassRoomAsync(d.ClassRoomId, ct);
        if (!canAccess)
            return Result.Forbidden<bool>("Bạn không có quyền xóa phân công của lớp này");

        _context.DutyAssignments.Remove(d);
        await _context.SaveChangesAsync(ct);
        return Result.Ok(true);
    }
}
