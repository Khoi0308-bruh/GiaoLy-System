using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Enrollments.Contracts;
using GiaoLy.Application.Enrollments.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Enrollments;

public class EnrollmentService : IEnrollmentService
{
    private readonly AppDbContext _context;

    public EnrollmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<IReadOnlyList<EnrollmentDto>>> GetClassRoomEnrollmentsAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var classExists = await _context.ClassRooms.AnyAsync(c => c.Id == classRoomId, ct);
        if (!classExists)
        {
            return Result.NotFound<IReadOnlyList<EnrollmentDto>>("Lớp học không tồn tại.");
        }

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .Where(e => e.ClassRoomId == classRoomId)
            .OrderBy(e => e.Student != null ? e.Student.FullName : string.Empty)
            .ToListAsync(ct);

        var dtos = enrollments.Select(MapToDto).ToList();
        return Result.Ok<IReadOnlyList<EnrollmentDto>>(dtos);
    }

    public async Task<Result<IReadOnlyList<EnrollmentDto>>> EnrollStudentsAsync(
        Guid classRoomId,
        EnrollStudentsRequest request,
        CancellationToken ct = default)
    {
        if (request.StudentIds == null || !request.StudentIds.Any())
        {
            return Result.BadRequest<IReadOnlyList<EnrollmentDto>>("Danh sách đoàn sinh xếp lớp không được để trống.");
        }

        var classRoom = await _context.ClassRooms
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId, ct);

        if (classRoom == null)
        {
            return Result.NotFound<IReadOnlyList<EnrollmentDto>>("Lớp học không tồn tại.");
        }

        if (string.Equals(classRoom.AcademicYear?.Status, AcademicYearStateMachine.StatusArchived, StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure<IReadOnlyList<EnrollmentDto>>(
                400,
                ErrorCodes.YearLocked,
                "Niên khóa đã lưu trữ (Archived), không thể ghi danh mới.");
        }

        var distinctStudentIds = request.StudentIds.Distinct().ToList();

        var students = await _context.Students
            .Where(s => distinctStudentIds.Contains(s.Id) && s.DeletedAt == null)
            .ToDictionaryAsync(s => s.Id, ct);

        var existingActiveStudentIds = await _context.Enrollments
            .Where(e => distinctStudentIds.Contains(e.StudentId)
                     && e.AcademicYearId == classRoom.AcademicYearId
                     && e.Status == EnrollmentRules.Statuses.Active)
            .Select(e => e.StudentId)
            .ToListAsync(ct);

        if (existingActiveStudentIds.Any())
        {
            var conflictStudent = students.TryGetValue(existingActiveStudentIds.First(), out var s) ? s.FullName : existingActiveStudentIds.First().ToString();
            return Result.Failure<IReadOnlyList<EnrollmentDto>>(
                409,
                ErrorCodes.EnrollmentExists,
                $"Đoàn sinh '{conflictStudent}' đã có ghi danh đang học trong niên khóa {classRoom.AcademicYear?.Name}. Vui lòng chuyển lớp thay vì xếp thêm.");
        }

        var newEnrollments = new List<Enrollment>();
        var defaultStartDate = request.StartDate ?? classRoom.AcademicYear?.StartDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        foreach (var studentId in distinctStudentIds)
        {
            if (!students.TryGetValue(studentId, out var student))
            {
                return Result.NotFound<IReadOnlyList<EnrollmentDto>>($"Không tìm thấy đoàn sinh với mã {studentId}.");
            }

            if (!EnrollmentRules.CanEnrollStudent(student.Status))
            {
                return Result.BadRequest<IReadOnlyList<EnrollmentDto>>(
                    $"Không thể xếp lớp cho đoàn sinh '{student.FullName}' vì trạng thái hiện tại là '{student.Status}'.");
            }

            var enrollment = new Enrollment
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                ClassRoomId = classRoomId,
                AcademicYearId = classRoom.AcademicYearId,
                Status = EnrollmentRules.Statuses.Active,
                StartDate = defaultStartDate,
                Note = request.Note,
                CreatedAt = DateTime.UtcNow
            };

            newEnrollments.Add(enrollment);
        }

        await _context.Enrollments.AddRangeAsync(newEnrollments, ct);
        await _context.SaveChangesAsync(ct);

        // Load navigations to map cleanly
        var createdIds = newEnrollments.Select(e => e.Id).ToList();
        var reloaded = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .Where(e => createdIds.Contains(e.Id))
            .ToListAsync(ct);

        var dtos = reloaded.Select(MapToDto).ToList();
        return Result.Created<IReadOnlyList<EnrollmentDto>>(dtos);
    }

    public async Task<Result<EnrollmentDto>> TransferEnrollmentAsync(
        Guid enrollmentId,
        TransferEnrollmentRequest request,
        CancellationToken ct = default)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId, ct);

        if (enrollment == null)
        {
            return Result.NotFound<EnrollmentDto>("Không tìm thấy hồ sơ ghi danh.");
        }

        if (enrollment.Status != EnrollmentRules.Statuses.Active)
        {
            return Result.BadRequest<EnrollmentDto>("Chỉ có thể chuyển lớp đối với ghi danh đang học (Active).");
        }

        if (string.Equals(enrollment.AcademicYear?.Status, AcademicYearStateMachine.StatusArchived, StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure<EnrollmentDto>(400, ErrorCodes.YearLocked, "Niên khóa đã lưu trữ, không thể chuyển lớp.");
        }

        if (enrollment.ClassRoomId == request.TargetClassRoomId)
        {
            return Result.BadRequest<EnrollmentDto>("Lớp chuyển đến trùng với lớp hiện tại.");
        }

        var targetClass = await _context.ClassRooms
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == request.TargetClassRoomId, ct);

        if (targetClass == null)
        {
            return Result.NotFound<EnrollmentDto>("Không tìm thấy lớp học đích.");
        }

        if (targetClass.AcademicYearId != enrollment.AcademicYearId)
        {
            return Result.BadRequest<EnrollmentDto>("Chuyển lớp chỉ được phép trong cùng một niên khóa.");
        }

        var transferDate = request.TransferDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        // 1. Cập nhật ghi danh cũ
        enrollment.Status = EnrollmentRules.Statuses.Transferred;
        enrollment.EndDate = transferDate;
        var transferNote = string.IsNullOrWhiteSpace(request.Reason)
            ? $"Chuyển sang lớp {targetClass.ClassName}"
            : $"Chuyển sang lớp {targetClass.ClassName}: {request.Reason}";
        enrollment.Note = string.IsNullOrWhiteSpace(enrollment.Note)
            ? transferNote
            : $"{enrollment.Note} | {transferNote}";
        enrollment.UpdatedAt = DateTime.UtcNow;

        // 2. Tạo ghi danh mới ở lớp đích
        var newEnrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            StudentId = enrollment.StudentId,
            ClassRoomId = request.TargetClassRoomId,
            AcademicYearId = enrollment.AcademicYearId,
            Status = EnrollmentRules.Statuses.Active,
            StartDate = transferDate,
            Note = string.IsNullOrWhiteSpace(request.Reason)
                ? $"Chuyển từ lớp {enrollment.ClassRoom?.ClassName}"
                : $"Chuyển từ lớp {enrollment.ClassRoom?.ClassName}: {request.Reason}",
            CreatedAt = DateTime.UtcNow
        };

        await _context.Enrollments.AddAsync(newEnrollment, ct);
        await _context.SaveChangesAsync(ct);

        var reloaded = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .FirstAsync(e => e.Id == newEnrollment.Id, ct);

        return Result.Ok(MapToDto(reloaded));
    }

    public async Task<Result<EnrollmentDto>> WithdrawEnrollmentAsync(
        Guid enrollmentId,
        WithdrawEnrollmentRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Reason))
        {
            return Result.BadRequest<EnrollmentDto>("Lý do rút lớp không được để trống.");
        }

        var enrollment = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId, ct);

        if (enrollment == null)
        {
            return Result.NotFound<EnrollmentDto>("Không tìm thấy hồ sơ ghi danh.");
        }

        if (enrollment.Status != EnrollmentRules.Statuses.Active)
        {
            return Result.BadRequest<EnrollmentDto>("Chỉ có thể rút lớp đối với ghi danh đang học (Active).");
        }

        var withdrawDate = request.WithdrawDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        enrollment.Status = EnrollmentRules.Statuses.DropOut;
        enrollment.EndDate = withdrawDate;
        var withdrawNote = $"Rút khỏi lớp: {request.Reason.Trim()}";
        enrollment.Note = string.IsNullOrWhiteSpace(enrollment.Note)
            ? withdrawNote
            : $"{enrollment.Note} | {withdrawNote}";
        enrollment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapToDto(enrollment));
    }

    public async Task<Result<IReadOnlyList<EnrollmentDto>>> GetStudentEnrollmentsAsync(Guid studentId, CancellationToken ct = default)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId && s.DeletedAt == null, ct);
        if (!studentExists)
        {
            return Result.NotFound<IReadOnlyList<EnrollmentDto>>("Không tìm thấy đoàn sinh.");
        }

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
            .Include(e => e.AcademicYear)
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.AcademicYear != null ? e.AcademicYear.StartDate : DateOnly.MinValue)
            .ThenByDescending(e => e.StartDate)
            .ToListAsync(ct);

        var dtos = enrollments.Select(MapToDto).ToList();
        return Result.Ok<IReadOnlyList<EnrollmentDto>>(dtos);
    }

    private static EnrollmentDto MapToDto(Enrollment e)
    {
        return new EnrollmentDto
        {
            Id = e.Id,
            StudentId = e.StudentId,
            StudentCode = e.Student?.Code ?? string.Empty,
            HolyName = e.Student?.HolyName,
            FullName = e.Student?.FullName ?? string.Empty,
            ClassRoomId = e.ClassRoomId,
            ClassRoomName = e.ClassRoom?.ClassName ?? string.Empty,
            AcademicYearId = e.AcademicYearId,
            AcademicYearName = e.AcademicYear?.Name ?? string.Empty,
            Status = e.Status,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Note = e.Note,
            CreatedAt = e.CreatedAt,
            RowVersion = e.RowVersion != null ? Convert.ToBase64String(e.RowVersion) : string.Empty
        };
    }
}
