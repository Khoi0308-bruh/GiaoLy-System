using ClosedXML.Excel;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Grades.Contracts;
using GiaoLy.Application.Grades.Dtos;
using GiaoLy.Application.Imports.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using GiaoLy.Infrastructure.Services.Imports;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Grades;

public class GradeService : IGradeService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;

    public GradeService(AppDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<ClassGradesResponse>> GetClassRoomGradesAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var classRoom = await _context.ClassRooms.AsNoTracking()
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId, ct);

        if (classRoom == null)
        {
            return Result.NotFound<ClassGradesResponse>("Lớp học không tồn tại.");
        }

        var (isLocked, lockReason) = await EvaluateLockStatusAsync(classRoomId, classRoom.AcademicYear?.Status, ct);

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == EnrollmentRules.Statuses.Active)
            .OrderBy(e => e.Student != null ? e.Student.FullName : string.Empty)
            .ToListAsync(ct);

        var gradeDtos = enrollments.Select(e => MapToDto(e, e.Grade)).ToList();

        var response = new ClassGradesResponse
        {
            ClassRoomId = classRoom.Id,
            ClassRoomName = classRoom.ClassName,
            AcademicYearId = classRoom.AcademicYearId,
            AcademicYearName = classRoom.AcademicYear?.Name ?? string.Empty,
            AcademicYearStatus = classRoom.AcademicYear?.Status ?? string.Empty,
            IsLocked = isLocked,
            LockReason = lockReason,
            Grades = gradeDtos
        };

        return Result.Ok(response);
    }

    public async Task<Result<IReadOnlyList<GradeDto>>> UpdateClassRoomGradesAsync(
        Guid classRoomId,
        BulkUpdateGradesRequest request,
        CancellationToken ct = default)
    {
        if (request?.Grades == null || !request.Grades.Any())
        {
            return Result.BadRequest<IReadOnlyList<GradeDto>>("Dữ liệu cập nhật điểm không được để trống.");
        }

        var classRoom = await _context.ClassRooms
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId, ct);

        if (classRoom == null)
        {
            return Result.NotFound<IReadOnlyList<GradeDto>>("Lớp học không tồn tại.");
        }

        // Kiểm tra khóa sổ điểm (Mục 6.6 & F1)
        var (isLocked, lockReason) = await EvaluateLockStatusAsync(classRoomId, classRoom.AcademicYear?.Status, ct);
        if (isLocked)
        {
            return Result.Failure<IReadOnlyList<GradeDto>>(
                400,
                ErrorCodes.YearLocked,
                lockReason ?? "Sổ điểm lớp học đã bị khóa.");
        }

        // Lấy tất cả ghi danh Active thuộc lớp trong URL
        var activeEnrollments = await _context.Enrollments
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == EnrollmentRules.Statuses.Active)
            .ToDictionaryAsync(e => e.Id, ct);

        // Đọc cấu hình xét điểm từ SystemSettings
        var settings = await _context.SystemSettings.AsNoTracking()
            .Where(s => s.Key.StartsWith("Promotion."))
            .ToDictionaryAsync(s => s.Key, s => s.Value, ct);

        decimal minGpa = GradeRules.DefaultMinGpa;
        if (settings.TryGetValue("Promotion.MinGpa", out var gpaStr) && decimal.TryParse(gpaStr, out var parsedGpa))
            minGpa = parsedGpa;

        decimal minAttendance = GradeRules.DefaultMinAttendance;
        if (settings.TryGetValue("Promotion.MinAttendancePercent", out var attStr) && decimal.TryParse(attStr, out var parsedAtt))
            minAttendance = parsedAtt;

        bool reqFinal = true;
        if (settings.TryGetValue("Promotion.RequireFinalExam", out var reqFinalStr) && bool.TryParse(reqFinalStr, out var parsedReqFinal))
            reqFinal = parsedReqFinal;

        bool reqAtt = true;
        if (settings.TryGetValue("Promotion.RequireAttendance", out var reqAttStr) && bool.TryParse(reqAttStr, out var parsedReqAtt))
            reqAtt = parsedReqAtt;

        var validationErrors = new Dictionary<string, string[]>();
        var updatedGrades = new List<Grade>();

        foreach (var item in request.Grades)
        {
            if (!activeEnrollments.TryGetValue(item.EnrollmentId, out var enrollment))
            {
                validationErrors[$"Enrollment_{item.EnrollmentId}"] =
                    new[] { $"Ghi danh mã {item.EnrollmentId} không thuộc lớp {classRoom.ClassName} hoặc không ở trạng thái đang học (Active)." };
                continue;
            }

            // Kiểm tra điểm hợp lệ 0..10
            if (!GradeRules.IsScoreValid(item.Oral) ||
                !GradeRules.IsScoreValid(item.SmallTest) ||
                !GradeRules.IsScoreValid(item.BigTest) ||
                !GradeRules.IsScoreValid(item.FinalExam))
            {
                validationErrors[$"Enrollment_{item.EnrollmentId}_Scores"] =
                    new[] { $"Điểm số của đoàn sinh {enrollment.Student?.FullName} phải từ 0 đến 10 với tối đa 2 chữ số thập phân." };
                continue;
            }

            // Kiểm tra chuyên cần hợp lệ
            if (!GradeRules.IsSessionValid(item.TotalSessions, item.Absences))
            {
                validationErrors[$"Enrollment_{item.EnrollmentId}_Sessions"] =
                    new[] { $"Số buổi chuyên cần của đoàn sinh {enrollment.Student?.FullName} không hợp lệ (tổng buổi phải > 0, vắng >= 0 và <= tổng buổi)." };
                continue;
            }

            var grade = enrollment.Grade;

            // Kiểm tra xung đột phiên bản (Optimistic Concurrency)
            if (grade != null && !string.IsNullOrWhiteSpace(item.RowVersion))
            {
                var existingRowVersion = Convert.ToBase64String(grade.RowVersion);
                if (!string.Equals(existingRowVersion, item.RowVersion, StringComparison.Ordinal))
                {
                    return Result.Failure<IReadOnlyList<GradeDto>>(
                        409,
                        ErrorCodes.ConflictVersion,
                        $"Dữ liệu điểm của đoàn sinh '{enrollment.Student?.FullName}' đã bị chỉnh sửa bởi người khác. Vui lòng tải lại dữ liệu mới nhất.");
                }
            }

            if (grade == null)
            {
                grade = new Grade
                {
                    Id = Guid.NewGuid(),
                    EnrollmentId = enrollment.Id,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Grades.AddAsync(grade, ct);
                enrollment.Grade = grade;
            }

            // Cập nhật giá trị
            grade.Oral = item.Oral;
            grade.SmallTest = item.SmallTest;
            grade.BigTest = item.BigTest;
            grade.FinalExam = item.FinalExam;
            grade.TotalSessions = item.TotalSessions;
            grade.Absences = item.Absences;
            grade.Remarks = item.Remarks;
            grade.UpdatedBy = _currentUser.UserId;
            grade.UpdatedAt = DateTime.UtcNow;

            // Tính toán GPA và trạng thái theo quy tắc miền thuần
            grade.ComputedGpa = GradeRules.CalculateGpa(grade.Oral, grade.SmallTest, grade.BigTest, grade.FinalExam);
            var attRate = GradeRules.CalculateAttendanceRate(grade.TotalSessions, grade.Absences);
            var (status, _) = GradeRules.DetermineStatus(
                grade.ComputedGpa,
                attRate,
                grade.FinalExam.HasValue,
                requireFinalExam: reqFinal,
                requireAttendance: reqAtt,
                minGpa: minGpa,
                minAttendance: minAttendance);

            grade.ComputedStatus = status;
            grade.ComputedAt = DateTime.UtcNow;

            updatedGrades.Add(grade);
        }

        if (validationErrors.Any())
        {
            return Result.ValidationFailure<IReadOnlyList<GradeDto>>(validationErrors, "Dữ liệu điểm không hợp lệ.");
        }

        await _context.SaveChangesAsync(ct);

        // Reload fresh versions with student info
        var resultDtos = activeEnrollments.Values
            .Select(e => MapToDto(e, e.Grade))
            .OrderBy(d => d.FullName)
            .ToList();

        return Result.Ok<IReadOnlyList<GradeDto>>(resultDtos);
    }

    public async Task<Result<GradeDto>> GetEnrollmentGradeAsync(Guid enrollmentId, CancellationToken ct = default)
    {
        var enrollment = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Include(e => e.ClassRoom)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId, ct);

        if (enrollment == null)
        {
            return Result.NotFound<GradeDto>("Không tìm thấy hồ sơ ghi danh.");
        }

        return Result.Ok(MapToDto(enrollment, enrollment.Grade));
    }

    public async Task<Result<GradeUnlockDto>> CreateGradeUnlockAsync(
        Guid classRoomId,
        CreateGradeUnlockRequest request,
        CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request?.Reason))
        {
            return Result.BadRequest<GradeUnlockDto>("Lý do mở khóa sổ điểm không được để trống.");
        }

        var classRoom = await _context.ClassRooms
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId, ct);

        if (classRoom == null)
        {
            return Result.NotFound<GradeUnlockDto>("Lớp học không tồn tại.");
        }

        var yearStatus = classRoom.AcademicYear?.Status;
        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusActive, StringComparison.OrdinalIgnoreCase))
        {
            return Result.BadRequest<GradeUnlockDto>("Niên khóa đang hoạt động bình thường (Active), không cần mở khóa sổ điểm.");
        }

        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusArchived, StringComparison.OrdinalIgnoreCase))
        {
            return Result.Failure<GradeUnlockDto>(
                400,
                ErrorCodes.YearLocked,
                "Niên khóa đã lưu trữ (Archived), không thể mở khóa sổ điểm. Cần mở lại niên khóa nếu muốn sửa điểm.");
        }

        if (!string.Equals(yearStatus, AcademicYearStateMachine.StatusClosing, StringComparison.OrdinalIgnoreCase))
        {
            return Result.BadRequest<GradeUnlockDto>($"Chỉ có thể mở khóa sổ điểm khi niên khóa đang ở trạng thái Khóa sổ (Closing). Hiện tại là '{yearStatus}'.");
        }

        int durationHours = request.DurationHours ?? 72;
        if (durationHours <= 0 || durationHours > 720) // Tối đa 30 ngày
        {
            durationHours = 72;
        }

        var unlock = new GradeUnlock
        {
            Id = Guid.NewGuid(),
            ClassRoomId = classRoomId,
            UnlockedBy = _currentUser.UserId ?? Guid.Empty,
            Reason = request.Reason.Trim(),
            UnlockedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(durationHours)
        };

        await _context.GradeUnlocks.AddAsync(unlock, ct);
        await _context.SaveChangesAsync(ct);

        var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == unlock.UnlockedBy, ct);

        var dto = new GradeUnlockDto
        {
            Id = unlock.Id,
            ClassRoomId = unlock.ClassRoomId,
            UnlockedBy = unlock.UnlockedBy,
            UnlockedByName = user?.FullName ?? user?.Username,
            Reason = unlock.Reason,
            UnlockedAt = unlock.UnlockedAt,
            ExpiresAt = unlock.ExpiresAt,
            ClosedAt = unlock.ClosedAt,
            IsActive = unlock.IsActive(DateTime.UtcNow)
        };

        return Result.Created(dto);
    }

    public async Task<Result<IReadOnlyList<GradeUnlockDto>>> GetGradeUnlocksAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var classExists = await _context.ClassRooms.AnyAsync(c => c.Id == classRoomId, ct);
        if (!classExists)
        {
            return Result.NotFound<IReadOnlyList<GradeUnlockDto>>("Lớp học không tồn tại.");
        }

        var utcNow = DateTime.UtcNow;
        var unlocks = await _context.GradeUnlocks.AsNoTracking()
            .Include(u => u.User)
            .Where(u => u.ClassRoomId == classRoomId)
            .OrderByDescending(u => u.UnlockedAt)
            .ToListAsync(ct);

        var dtos = unlocks.Select(u => new GradeUnlockDto
        {
            Id = u.Id,
            ClassRoomId = u.ClassRoomId,
            UnlockedBy = u.UnlockedBy,
            UnlockedByName = u.User?.FullName ?? u.User?.Username,
            Reason = u.Reason,
            UnlockedAt = u.UnlockedAt,
            ExpiresAt = u.ExpiresAt,
            ClosedAt = u.ClosedAt,
            IsActive = u.IsActive(utcNow)
        }).ToList();

        return Result.Ok<IReadOnlyList<GradeUnlockDto>>(dtos);
    }

    public async Task<Result<ExportFileResult>> ExportClassRoomGradesAsync(Guid classRoomId, CancellationToken ct = default)
    {
        var classRoom = await _context.ClassRooms.AsNoTracking()
            .Include(c => c.AcademicYear)
            .FirstOrDefaultAsync(c => c.Id == classRoomId, ct);

        if (classRoom == null)
        {
            return Result.NotFound<ExportFileResult>("Lớp học không tồn tại.");
        }

        var enrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Grade)
            .Where(e => e.ClassRoomId == classRoomId && e.Status == EnrollmentRules.Statuses.Active)
            .OrderBy(e => e.Student != null ? e.Student.FullName : string.Empty)
            .ToListAsync(ct);

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("BangDiem");

        // Headers
        var headers = new[]
        {
            "STT",
            "Mã đoàn sinh",
            "Tên Thánh",
            "Họ và Tên",
            "Điểm Miệng",
            "Điểm 15 Phút",
            "Điểm 1 Tiết",
            "Thi Kết Khóa",
            "Tổng Buổi",
            "Vắng",
            "Chuyên Cần (%)",
            "ĐTB",
            "Kết Quả",
            "Ghi Chú"
        };

        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cell(1, i + 1).Value = headers[i];
        }

        var headerRow = worksheet.Row(1);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.LightSteelBlue;

        int rowIdx = 2;
        int stt = 1;

        foreach (var e in enrollments)
        {
            var s = e.Student;
            var g = e.Grade;

            decimal? attRate = g != null ? GradeRules.CalculateAttendanceRate(g.TotalSessions, g.Absences) : null;

            worksheet.Cell(rowIdx, 1).Value = stt;
            worksheet.Cell(rowIdx, 2).Value = StudentExcelColumns.SanitizeForExport(s?.Code);
            worksheet.Cell(rowIdx, 3).Value = StudentExcelColumns.SanitizeForExport(s?.HolyName);
            worksheet.Cell(rowIdx, 4).Value = StudentExcelColumns.SanitizeForExport(s?.FullName);

            if (g?.Oral != null) worksheet.Cell(rowIdx, 5).Value = g.Oral.Value;
            if (g?.SmallTest != null) worksheet.Cell(rowIdx, 6).Value = g.SmallTest.Value;
            if (g?.BigTest != null) worksheet.Cell(rowIdx, 7).Value = g.BigTest.Value;
            if (g?.FinalExam != null) worksheet.Cell(rowIdx, 8).Value = g.FinalExam.Value;

            if (g?.TotalSessions != null) worksheet.Cell(rowIdx, 9).Value = g.TotalSessions.Value;
            if (g?.Absences != null) worksheet.Cell(rowIdx, 10).Value = g.Absences.Value;
            if (attRate != null) worksheet.Cell(rowIdx, 11).Value = attRate.Value;
            if (g?.ComputedGpa != null) worksheet.Cell(rowIdx, 12).Value = g.ComputedGpa.Value;

            worksheet.Cell(rowIdx, 13).Value = StudentExcelColumns.SanitizeForExport(g?.ComputedStatus ?? "Incomplete");
            worksheet.Cell(rowIdx, 14).Value = StudentExcelColumns.SanitizeForExport(g?.Remarks);

            rowIdx++;
            stt++;
        }

        worksheet.Columns().AdjustToContents();

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);

        var safeClassName = classRoom.ClassName.Replace(" ", "_").Replace("/", "-");
        var fileName = $"BangDiem_{safeClassName}_{DateTime.UtcNow:yyyyMMdd}.xlsx";

        var result = new ExportFileResult(
            memoryStream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName);

        return Result.Ok(result);
    }

    private async Task<(bool IsLocked, string? Reason)> EvaluateLockStatusAsync(
        Guid classRoomId,
        string? yearStatus,
        CancellationToken ct)
    {
        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusActive, StringComparison.OrdinalIgnoreCase))
        {
            return (false, null);
        }

        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusPlanned, StringComparison.OrdinalIgnoreCase))
        {
            return (true, "Niên khóa chưa chính thức bắt đầu (Planned). Sổ điểm tạm khóa.");
        }

        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusArchived, StringComparison.OrdinalIgnoreCase))
        {
            return (true, "Niên khóa đã lưu trữ (Archived). Sổ điểm đã đóng vĩnh viễn và không thể chỉnh sửa.");
        }

        if (string.Equals(yearStatus, AcademicYearStateMachine.StatusClosing, StringComparison.OrdinalIgnoreCase))
        {
            // Kiểm tra xem lớp học có lệnh mở khóa sổ điểm còn hiệu lực hay không
            var now = DateTime.UtcNow;
            var hasActiveUnlock = await _context.GradeUnlocks.AnyAsync(
                u => u.ClassRoomId == classRoomId && u.ClosedAt == null && u.ExpiresAt > now,
                ct);

            if (hasActiveUnlock)
            {
                return (false, null);
            }

            return (true, "Niên khóa đang ở trạng thái Khóa sổ (Closing). Cần mở khóa sổ điểm (GradeUnlock) để chỉnh sửa điểm.");
        }

        return (true, $"Trạng thái niên khóa '{yearStatus}' không cho phép ghi nhận điểm số.");
    }

    private static GradeDto MapToDto(Enrollment e, Grade? g)
    {
        var attRate = g != null ? GradeRules.CalculateAttendanceRate(g.TotalSessions, g.Absences) : null;

        return new GradeDto
        {
            Id = g?.Id ?? Guid.Empty,
            EnrollmentId = e.Id,
            StudentId = e.StudentId,
            StudentCode = e.Student?.Code ?? string.Empty,
            HolyName = e.Student?.HolyName,
            FullName = e.Student?.FullName ?? string.Empty,
            Oral = g?.Oral,
            SmallTest = g?.SmallTest,
            BigTest = g?.BigTest,
            FinalExam = g?.FinalExam,
            TotalSessions = g?.TotalSessions,
            Absences = g?.Absences,
            ComputedGpa = g?.ComputedGpa,
            ComputedStatus = g?.ComputedStatus ?? "Incomplete",
            AttendanceRate = attRate,
            Remarks = g?.Remarks,
            RowVersion = g?.RowVersion != null ? Convert.ToBase64String(g.RowVersion) : string.Empty,
            UpdatedAt = g?.UpdatedAt
        };
    }
}
