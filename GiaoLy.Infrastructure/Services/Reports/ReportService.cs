using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ClosedXML.Excel;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Reports.Contracts;
using GiaoLy.Application.Reports.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Reports;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;

    public ReportService(AppDbContext context, ICurrentUser currentUser, IScopeContext scopeContext)
    {
        _context = context;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
    }

    // Dữ liệu thật dùng "Nam"/"Nữ", dữ liệu import cũ dùng "M"/"F" hoặc "Male"/"Female".
    private static bool IsMale(string? gender) =>
        string.Equals(gender, "Male", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(gender, "Nam", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(gender, "M", StringComparison.OrdinalIgnoreCase);

    private static bool IsFemale(string? gender) =>
        string.Equals(gender, "Female", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(gender, "Nữ", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(gender, "F", StringComparison.OrdinalIgnoreCase);

    private async Task<List<Guid>> GetAllowedClassRoomIdsAsync(CancellationToken ct)
    {
        if (_currentUser.ScopeType == "All" || string.IsNullOrEmpty(_currentUser.ScopeType))
        {
            return new List<Guid>();
        }

        if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            return await _context.ClassRooms
                .Include(c => c.ClassLevel)
                .Where(c => (c.ClassLevel != null && c.ClassLevel.BranchId == _currentUser.BranchId.Value) && c.DeletedAt == null)
                .Select(c => c.Id)
                .ToListAsync(ct);
        }

        if (_currentUser.ScopeType == "Classroom" && _currentUser.UserId.HasValue)
        {
            return await _context.ClassRoomTeachers
                .Where(t => t.UserId == _currentUser.UserId.Value)
                .Select(t => t.ClassRoomId)
                .ToListAsync(ct);
        }

        return new List<Guid>();
    }

    private async Task<AcademicYearInfo> ResolveAcademicYearAsync(Guid? academicYearId, CancellationToken ct)
    {
        if (academicYearId.HasValue)
        {
            var year = await _context.AcademicYears.FirstOrDefaultAsync(y => y.Id == academicYearId.Value, ct);
            if (year != null)
                return new AcademicYearInfo(year.Id, year.Name);
        }

        var activeYear = await _context.AcademicYears
            .OrderByDescending(y => y.Status == "Active")
            .ThenByDescending(y => y.StartDate)
            .FirstOrDefaultAsync(ct);

        if (activeYear != null)
            return new AcademicYearInfo(activeYear.Id, activeYear.Name);

        return new AcademicYearInfo(Guid.Empty, "Chưa thiết lập niên khóa");
    }

    private record AcademicYearInfo(Guid Id, string Name);

    public async Task<Result<DashboardReportDto>> GetDashboardAsync(CancellationToken ct = default)
    {
        var yearInfo = await ResolveAcademicYearAsync(null, ct);
        var allowedClasses = await GetAllowedClassRoomIdsAsync(ct);
        var isScoped = _currentUser.ScopeType != "All" && !string.IsNullOrEmpty(_currentUser.ScopeType);

        var classQuery = _context.ClassRooms
            .AsNoTracking()
            .Include(c => c.ClassLevel)
            .Where(c => c.AcademicYearId == yearInfo.Id && c.DeletedAt == null);

        if (isScoped)
        {
            classQuery = classQuery.Where(c => allowedClasses.Contains(c.Id));
        }

        var classes = await classQuery
            .Select(c => new { c.Id, BranchId = c.ClassLevel != null ? c.ClassLevel.BranchId : 0 })
            .ToListAsync(ct);

        var classIds = classes.Select(c => c.Id).ToList();

        var totalTeachers = await _context.ClassRoomTeachers
            .AsNoTracking()
            .Where(t => classIds.Contains(t.ClassRoomId))
            .Select(t => t.UserId)
            .Distinct()
            .CountAsync(ct);

        // Attendance avg from grades
        var attendanceAvg = 0.0;
        var gradesWithSessions = await _context.Grades
            .AsNoTracking()
            .Where(g => g.Enrollment != null && g.Enrollment.AcademicYearId == yearInfo.Id && classIds.Contains(g.Enrollment.ClassRoomId) && g.TotalSessions > 0)
            .Select(g => new { g.TotalSessions, g.Absences })
            .ToListAsync(ct);

        if (gradesWithSessions.Any())
        {
            var rates = gradesWithSessions.Select(g => (double)(g.TotalSessions!.Value - (g.Absences ?? 0)) / g.TotalSessions.Value * 100);
            attendanceAvg = Math.Round(rates.Average(), 1);
        }

        // Số liệu đoàn sinh lấy từ bảng Students (cùng nguồn và cách lọc phạm vi với
        // GET /students, /students/stats) để bảng điều khiển và danh sách không lệch nhau.
        var students = await _scopeContext.Students(_context.Students.AsNoTracking())
            .Select(s => new { s.Status, s.BranchId, s.FatherPhone, s.MotherPhone })
            .ToListAsync(ct);

        var totalStudents = students.Count;
        var totalActive = students.Count(s => s.Status == StudentStateMachine.StatusActive);

        // Missing contacts
        var missingContactCount = students.Count(s => string.IsNullOrEmpty(s.FatherPhone) && string.IsNullOrEmpty(s.MotherPhone));

        // Pending promotion count
        var pendingPromotion = await _context.PromotionDrafts
            .AsNoTracking()
            .Where(d => d.Batch != null && d.Batch.SourceYearId == yearInfo.Id && (d.Status == "Pending" || d.Outcome == "Manual"))
            .CountAsync(ct);

        // Branches breakdown
        var branches = await _context.Branches.AsNoTracking().OrderBy(b => b.Id).ToListAsync(ct);
        var branchStats = new List<BranchStatDto>();

        foreach (var branch in branches)
        {
            if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue && _currentUser.BranchId.Value != branch.Id)
                continue;

            var bClassIds = classes.Where(c => c.BranchId == branch.Id).Select(c => c.Id).ToList();
            var bStudents = students.Count(s => s.BranchId == branch.Id);

            branchStats.Add(new BranchStatDto
            {
                BranchId = branch.Id,
                BranchName = branch.Name,
                StudentCount = bStudents,
                ClassRoomCount = bClassIds.Count
            });
        }

        var dto = new DashboardReportDto
        {
            TotalStudents = totalStudents,
            TotalActiveStudents = totalActive,
            TotalClassRooms = classes.Count,
            TotalTeachers = totalTeachers,
            AverageAttendanceRate = attendanceAvg,
            MissingContactCount = missingContactCount,
            PendingPromotionCount = pendingPromotion,
            BranchStats = branchStats
        };

        return Result.Ok(dto);
    }

    public async Task<Result<StudentsByBranchReportDto>> GetStudentsByBranchAsync(Guid? academicYearId = null, CancellationToken ct = default)
    {
        var yearInfo = await ResolveAcademicYearAsync(academicYearId, ct);
        var allowedClasses = await GetAllowedClassRoomIdsAsync(ct);
        var isScoped = _currentUser.ScopeType != "All" && !string.IsNullOrEmpty(_currentUser.ScopeType);

        // Nguồn số liệu là HỒ SƠ đoàn sinh — cùng định nghĩa với danh sách và dashboard.
        // Đếm theo ghi danh chỉ ra số em đã xếp lớp của niên khóa nên lệch hẳn với hai màn hình kia.
        var students = await _scopeContext.Students(
                _context.Students.AsNoTracking().Where(s => s.DeletedAt == null))
            .Select(s => new { s.BranchId, s.Status, s.Gender })
            .ToListAsync(ct);

        // Ghi danh của niên khóa chỉ còn dùng cho bảng chi tiết theo lớp.
        var query = _context.Enrollments
            .AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
                    .ThenInclude(cl => cl!.Branch)
            .Where(e => e.AcademicYearId == yearInfo.Id);

        if (isScoped)
        {
            query = query.Where(e => allowedClasses.Contains(e.ClassRoomId));
        }

        var enrollments = await query.ToListAsync(ct);

        var branches = await _context.Branches.AsNoTracking().OrderBy(b => b.Id).ToListAsync(ct);
        var result = new StudentsByBranchReportDto
        {
            AcademicYearId = yearInfo.Id,
            AcademicYearName = yearInfo.Name,
            GrandTotal = students.Count,
            UnassignedCount = students.Count(s => s.BranchId == null)
        };

        foreach (var b in branches)
        {
            if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue && _currentUser.BranchId.Value != b.Id)
                continue;

            var bStudents = students.Where(s => s.BranchId == b.Id).ToList();
            if (isScoped && bStudents.Count == 0)
                continue;

            var bEnrollments = enrollments.Where(e => e.ClassRoom?.ClassLevel?.BranchId == b.Id).ToList();

            var bDetail = new BranchDetailDto
            {
                BranchId = b.Id,
                BranchName = b.Name,
                TotalStudents = bStudents.Count,
                ActiveCount = bStudents.Count(s => s.Status == StudentStateMachine.StatusActive),
                SuspendedCount = bStudents.Count(s => s.Status == StudentStateMachine.StatusPaused),
                DropoutCount = bStudents.Count(s => s.Status == StudentStateMachine.StatusLeft),
                GraduatedCount = bStudents.Count(s => s.Status == StudentStateMachine.StatusGraduated),
                // Trạng thái "chuyển ngành" không thuộc vòng đời hồ sơ; chuyển lớp được ghi ở Ghi danh.
                TransferredCount = 0,
                MaleCount = bStudents.Count(s => IsMale(s.Gender)),
                FemaleCount = bStudents.Count(s => IsFemale(s.Gender))
            };

            var classGroups = bEnrollments
                .Where(e => e.ClassRoom != null)
                .GroupBy(e => new { e.ClassRoomId, ClassName = e.ClassRoom!.ClassName, LevelName = e.ClassRoom.ClassLevel?.Name ?? "" })
                .OrderBy(g => g.Key.ClassName);

            foreach (var cg in classGroups)
            {
                bDetail.Classes.Add(new ClassRoomStudentStatDto
                {
                    ClassRoomId = cg.Key.ClassRoomId,
                    ClassRoomName = cg.Key.ClassName,
                    LevelName = cg.Key.LevelName,
                    TotalStudents = cg.Count(),
                    MaleCount = cg.Count(e => IsMale(e.Student?.Gender)),
                    FemaleCount = cg.Count(e => IsFemale(e.Student?.Gender))
                });
            }

            result.Branches.Add(bDetail);
        }

        return Result.Ok(result);
    }

    public async Task<Result<MissingDataReportDto>> GetMissingDataAsync(int? branchId = null, Guid? classRoomId = null, CancellationToken ct = default)
    {
        var yearInfo = await ResolveAcademicYearAsync(null, ct);
        var allowedClasses = await GetAllowedClassRoomIdsAsync(ct);
        var isScoped = _currentUser.ScopeType != "All" && !string.IsNullOrEmpty(_currentUser.ScopeType);

        var query = _context.Enrollments
            .AsNoTracking()
            .Include(e => e.Student)
                .ThenInclude(s => s!.Sacraments)
            .Include(e => e.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
                    .ThenInclude(cl => cl!.Branch)
            .Where(e => e.AcademicYearId == yearInfo.Id && e.Status == "Active");

        if (branchId.HasValue)
        {
            query = query.Where(e => e.ClassRoom != null && e.ClassRoom.ClassLevel != null && e.ClassRoom.ClassLevel.BranchId == branchId.Value);
        }

        if (classRoomId.HasValue)
        {
            query = query.Where(e => e.ClassRoomId == classRoomId.Value);
        }

        if (isScoped)
        {
            query = query.Where(e => allowedClasses.Contains(e.ClassRoomId));
        }

        var enrollments = await query.ToListAsync(ct);
        var result = new MissingDataReportDto();

        foreach (var en in enrollments)
        {
            var student = en.Student;
            if (student == null) continue;

            var missing = new List<string>();

            if (string.IsNullOrWhiteSpace(student.FatherPhone) && string.IsNullOrWhiteSpace(student.MotherPhone))
            {
                missing.Add("Thiếu số điện thoại phụ huynh (cha/mẹ)");
            }

            if (student.BirthDate == default || student.BirthDate.Year < 1950)
            {
                missing.Add("Chưa cập nhật ngày tháng năm sinh hợp lệ");
            }

            if (string.IsNullOrWhiteSpace(student.Address))
            {
                missing.Add("Chưa có địa chỉ thường trú");
            }

            // Sacraments check based on standard ecclesiastical age/branch
            var currentBranchId = en.ClassRoom?.ClassLevel?.BranchId ?? 0;
            var sacraments = student.Sacraments ?? new List<StudentSacrament>();

            // All students should have Baptism
            if (!sacraments.Any(s => string.Equals(s.SacramentType, SacramentRules.Baptism, StringComparison.OrdinalIgnoreCase)))
            {
                missing.Add("Thiếu thông tin Bí tích Rửa Tội");
            }

            // Thiếu Nhi (Branch 2) and above should have First Communion
            if (currentBranchId >= 2)
            {
                if (!sacraments.Any(s => string.Equals(s.SacramentType, SacramentRules.FirstCommunion, StringComparison.OrdinalIgnoreCase)))
                {
                    missing.Add("Thiếu thông tin Bí tích Rước Lễ Lần Đầu (ngành Thiếu/Nghĩa/Hiệp)");
                }
            }

            // Nghĩa Sĩ (Branch 3) and above should have Confirmation
            if (currentBranchId >= 3)
            {
                if (!sacraments.Any(s => string.Equals(s.SacramentType, SacramentRules.Confirmation, StringComparison.OrdinalIgnoreCase)))
                {
                    missing.Add("Thiếu thông tin Bí tích Thêm Sức (ngành Nghĩa/Hiệp)");
                }
            }

            if (missing.Any())
            {
                result.Students.Add(new MissingDataStudentDto
                {
                    StudentId = student.Id,
                    StudentCode = student.Code,
                    FullName = student.FullName,
                    HolyName = student.HolyName,
                    BranchName = en.ClassRoom?.ClassLevel?.Branch?.Name ?? "",
                    ClassRoomName = en.ClassRoom?.ClassName ?? "",
                    MissingReasons = missing
                });
            }
        }

        result.TotalMissing = result.Students.Count;
        return Result.Ok(result);
    }

    public async Task<Result<PromotionSummaryReportDto>> GetPromotionSummaryAsync(Guid? academicYearId = null, int? branchId = null, CancellationToken ct = default)
    {
        var yearInfo = await ResolveAcademicYearAsync(academicYearId, ct);
        var allowedClasses = await GetAllowedClassRoomIdsAsync(ct);
        var isScoped = _currentUser.ScopeType != "All" && !string.IsNullOrEmpty(_currentUser.ScopeType);

        var draftQuery = _context.PromotionDrafts
            .AsNoTracking()
            .Include(d => d.FromEnrollment)
                .ThenInclude(fe => fe!.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .Include(d => d.Batch)
            .Where(d => d.Batch != null && d.Batch.SourceYearId == yearInfo.Id);

        if (branchId.HasValue)
        {
            draftQuery = draftQuery.Where(d => d.FromEnrollment != null && d.FromEnrollment.ClassRoom != null && d.FromEnrollment.ClassRoom.ClassLevel != null && d.FromEnrollment.ClassRoom.ClassLevel.BranchId == branchId.Value);
        }

        if (isScoped)
        {
            draftQuery = draftQuery.Where(d => d.FromEnrollment != null && allowedClasses.Contains(d.FromEnrollment.ClassRoomId));
        }

        var drafts = await draftQuery.ToListAsync(ct);

        var result = new PromotionSummaryReportDto
        {
            AcademicYearId = yearInfo.Id,
            AcademicYearName = yearInfo.Name,
            TotalStudents = drafts.Count,
            PromotedCount = drafts.Count(d => d.Outcome == "Promote"),
            RetainedCount = drafts.Count(d => d.Outcome == "Repeat"),
            GraduatedCount = drafts.Count(d => d.Outcome == "Graduate"),
            PendingCount = drafts.Count(d => d.Outcome == "Manual" || d.Status == "Pending")
        };

        var classGroups = drafts
            .Where(d => d.FromEnrollment?.ClassRoom != null)
            .GroupBy(d => new { d.FromEnrollment!.ClassRoomId, ClassName = d.FromEnrollment.ClassRoom!.ClassName });

        foreach (var cg in classGroups)
        {
            result.ClassSummaries.Add(new ClassPromotionSummaryDto
            {
                ClassRoomId = cg.Key.ClassRoomId,
                ClassRoomName = cg.Key.ClassName,
                TotalStudents = cg.Count(),
                PromotedCount = cg.Count(d => d.Outcome == "Promote"),
                RetainedCount = cg.Count(d => d.Outcome == "Repeat"),
                GraduatedCount = cg.Count(d => d.Outcome == "Graduate"),
                PendingCount = cg.Count(d => d.Outcome == "Manual" || d.Status == "Pending")
            });
        }

        return Result.Ok(result);
    }

    public async Task<Result<GradesSummaryReportDto>> GetGradesSummaryAsync(Guid? academicYearId = null, Guid? classRoomId = null, CancellationToken ct = default)
    {
        var yearInfo = await ResolveAcademicYearAsync(academicYearId, ct);
        var allowedClasses = await GetAllowedClassRoomIdsAsync(ct);
        var isScoped = _currentUser.ScopeType != "All" && !string.IsNullOrEmpty(_currentUser.ScopeType);

        var minGpa = 5.0;
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == SystemSettingsRules.SettingKeys.PromotionMinGpa, ct);
        if (setting != null && double.TryParse(setting.Value, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var parsedMin))
        {
            minGpa = parsedMin;
        }

        var query = _context.Grades
            .AsNoTracking()
            .Include(g => g.Enrollment)
                .ThenInclude(e => e!.Student)
            .Include(g => g.Enrollment)
                .ThenInclude(e => e!.ClassRoom)
            .Where(g => g.Enrollment != null && g.Enrollment.AcademicYearId == yearInfo.Id);

        if (classRoomId.HasValue)
        {
            query = query.Where(g => g.Enrollment!.ClassRoomId == classRoomId.Value);
        }

        if (isScoped)
        {
            query = query.Where(g => g.Enrollment != null && allowedClasses.Contains(g.Enrollment.ClassRoomId));
        }

        var grades = await query.ToListAsync(ct);

        var result = new GradesSummaryReportDto
        {
            AcademicYearId = yearInfo.Id,
            AcademicYearName = yearInfo.Name,
            ClassRoomId = classRoomId,
            TotalStudents = grades.Count
        };

        if (classRoomId.HasValue && grades.Any())
        {
            result.ClassRoomName = grades.First().Enrollment?.ClassRoom?.ClassName;
        }

        var validAverages = grades
            .Where(g => g.ComputedGpa.HasValue)
            .Select(g => (double)g.ComputedGpa!.Value)
            .ToList();

        if (validAverages.Any())
        {
            result.AverageGpa = Math.Round(validAverages.Average(), 2);
            result.MaxGpa = Math.Round(validAverages.Max(), 2);
            result.MinGpa = Math.Round(validAverages.Min(), 2);
        }

        var belowThreshold = grades
            .Where(g => g.ComputedGpa.HasValue && (double)g.ComputedGpa.Value < minGpa)
            .OrderBy(g => g.ComputedGpa)
            .ToList();

        result.BelowThresholdCount = belowThreshold.Count;
        foreach (var b in belowThreshold)
        {
            var en = b.Enrollment;
            if (en?.Student == null) continue;

            result.BelowThresholdStudents.Add(new StudentBelowThresholdDto
            {
                StudentId = en.StudentId,
                StudentCode = en.Student.Code,
                FullName = en.Student.FullName,
                ClassRoomName = en.ClassRoom?.ClassName ?? "",
                Semester1 = b.Oral,
                Semester2 = b.BigTest,
                FinalExam = b.FinalExam,
                AttendanceScore = (b.TotalSessions ?? 0) > 0 ? (decimal?)(b.TotalSessions!.Value - (b.Absences ?? 0)) : null,
                AverageScore = b.ComputedGpa,
                Status = b.ComputedStatus ?? en.Status
            });
        }

        return Result.Ok(result);
    }

    public async Task<Result<ExportReportResultDto>> ExportReportAsync(ExportReportRequest request, CancellationToken ct = default)
    {
        using var workbook = new XLWorkbook();

        switch (request.ReportType)
        {
            case "StudentsByBranch":
            {
                var data = await GetStudentsByBranchAsync(request.AcademicYearId, ct);
                if (data.IsFailure) return Result.Failure<ExportReportResultDto>(data.StatusCode, data.ErrorCode ?? "Error", data.Message ?? "Error");

                var ws = workbook.Worksheets.Add("Thong_Ke_Theo_Nganh");
                ws.Cell(1, 1).Value = "BÁO CÁO THỐNG KÊ ĐOÀN SINH THEO NGÀNH";
                ws.Cell(1, 1).Style.Font.Bold = true;
                ws.Cell(1, 1).Style.Font.FontSize = 14;

                ws.Cell(2, 1).Value = $"Niên khóa: {data.Value!.AcademicYearName} | Tổng đoàn sinh: {data.Value.GrandTotal}";

                int row = 4;
                ws.Cell(row, 1).Value = "Ngành";
                ws.Cell(row, 2).Value = "Lớp";
                ws.Cell(row, 3).Value = "Cấp lớp";
                ws.Cell(row, 4).Value = "Tổng số";
                ws.Cell(row, 5).Value = "Nam";
                ws.Cell(row, 6).Value = "Nữ";
                ws.Row(row).Style.Font.Bold = true;
                ws.Row(row).Style.Fill.BackgroundColor = XLColor.LightGray;

                foreach (var branch in data.Value.Branches)
                {
                    foreach (var c in branch.Classes)
                    {
                        row++;
                        ws.Cell(row, 1).Value = branch.BranchName;
                        ws.Cell(row, 2).Value = c.ClassRoomName;
                        ws.Cell(row, 3).Value = c.LevelName;
                        ws.Cell(row, 4).Value = c.TotalStudents;
                        ws.Cell(row, 5).Value = c.MaleCount;
                        ws.Cell(row, 6).Value = c.FemaleCount;
                    }
                }

                ws.Columns().AdjustToContents();
                break;
            }

            case "MissingData":
            {
                var data = await GetMissingDataAsync(request.BranchId, request.ClassRoomId, ct);
                if (data.IsFailure) return Result.Failure<ExportReportResultDto>(data.StatusCode, data.ErrorCode ?? "Error", data.Message ?? "Error");

                var ws = workbook.Worksheets.Add("Ho_So_Con_Thieu");
                ws.Cell(1, 1).Value = "DANH SÁCH ĐOÀN SINH CÒN THIẾU HỒ SƠ";
                ws.Cell(1, 1).Style.Font.Bold = true;
                ws.Cell(1, 1).Style.Font.FontSize = 14;

                int row = 3;
                ws.Cell(row, 1).Value = "STT";
                ws.Cell(row, 2).Value = "Mã đoàn sinh";
                ws.Cell(row, 3).Value = "Tên thánh";
                ws.Cell(row, 4).Value = "Họ và tên";
                ws.Cell(row, 5).Value = "Ngành";
                ws.Cell(row, 6).Value = "Lớp";
                ws.Cell(row, 7).Value = "Các thông tin còn thiếu";
                ws.Row(row).Style.Font.Bold = true;
                ws.Row(row).Style.Fill.BackgroundColor = XLColor.LightGray;

                int idx = 1;
                foreach (var s in data.Value!.Students)
                {
                    row++;
                    ws.Cell(row, 1).Value = idx++;
                    ws.Cell(row, 2).Value = s.StudentCode;
                    ws.Cell(row, 3).Value = s.HolyName ?? "";
                    ws.Cell(row, 4).Value = s.FullName;
                    ws.Cell(row, 5).Value = s.BranchName;
                    ws.Cell(row, 6).Value = s.ClassRoomName;
                    ws.Cell(row, 7).Value = string.Join("; ", s.MissingReasons);
                }

                ws.Columns().AdjustToContents();
                break;
            }

            case "GradesSummary":
            {
                var data = await GetGradesSummaryAsync(request.AcademicYearId, request.ClassRoomId, ct);
                if (data.IsFailure) return Result.Failure<ExportReportResultDto>(data.StatusCode, data.ErrorCode ?? "Error", data.Message ?? "Error");

                var ws = workbook.Worksheets.Add("Tong_Hop_Diem");
                ws.Cell(1, 1).Value = "BÁO CÁO TỔNG HỢP ĐIỂM VÀ ĐOÀN SINH DƯỚI NGƯỠNG";
                ws.Cell(1, 1).Style.Font.Bold = true;
                ws.Cell(1, 1).Style.Font.FontSize = 14;

                ws.Cell(2, 1).Value = $"Niên khóa: {data.Value!.AcademicYearName} | Lớp: {data.Value.ClassRoomName ?? "Tất cả"} | Điểm TB: {data.Value.AverageGpa}";

                int row = 4;
                ws.Cell(row, 1).Value = "STT";
                ws.Cell(row, 2).Value = "Mã đoàn sinh";
                ws.Cell(row, 3).Value = "Họ và tên";
                ws.Cell(row, 4).Value = "Lớp";
                ws.Cell(row, 5).Value = "Miệng";
                ws.Cell(row, 6).Value = "Thi học kỳ";
                ws.Cell(row, 7).Value = "Thi cuối khóa";
                ws.Cell(row, 8).Value = "Điểm TB (GPA)";
                ws.Row(row).Style.Font.Bold = true;
                ws.Row(row).Style.Fill.BackgroundColor = XLColor.LightGray;

                int idx = 1;
                foreach (var s in data.Value.BelowThresholdStudents)
                {
                    row++;
                    ws.Cell(row, 1).Value = idx++;
                    ws.Cell(row, 2).Value = s.StudentCode;
                    ws.Cell(row, 3).Value = s.FullName;
                    ws.Cell(row, 4).Value = s.ClassRoomName;
                    ws.Cell(row, 5).Value = s.Semester1?.ToString("F1") ?? "-";
                    ws.Cell(row, 6).Value = s.Semester2?.ToString("F1") ?? "-";
                    ws.Cell(row, 7).Value = s.FinalExam?.ToString("F1") ?? "-";
                    ws.Cell(row, 8).Value = s.AverageScore?.ToString("F1") ?? "-";
                }

                ws.Columns().AdjustToContents();
                break;
            }

            default:
            {
                var data = await GetPromotionSummaryAsync(request.AcademicYearId, request.BranchId, ct);
                if (data.IsFailure) return Result.Failure<ExportReportResultDto>(data.StatusCode, data.ErrorCode ?? "Error", data.Message ?? "Error");

                var ws = workbook.Worksheets.Add("Ket_Qua_Xet_Len_Lop");
                ws.Cell(1, 1).Value = "BÁO CÁO TỔNG HỢP KẾT QUẢ XÉT LÊN LỚP";
                ws.Cell(1, 1).Style.Font.Bold = true;
                ws.Cell(1, 1).Style.Font.FontSize = 14;

                int row = 3;
                ws.Cell(row, 1).Value = "Lớp";
                ws.Cell(row, 2).Value = "Tổng đoàn sinh";
                ws.Cell(row, 3).Value = "Lên lớp";
                ws.Cell(row, 4).Value = "Ở lại";
                ws.Cell(row, 5).Value = "Tốt nghiệp";
                ws.Cell(row, 6).Value = "Chưa xét / Cần duyệt";
                ws.Row(row).Style.Font.Bold = true;
                ws.Row(row).Style.Fill.BackgroundColor = XLColor.LightGray;

                foreach (var c in data.Value!.ClassSummaries)
                {
                    row++;
                    ws.Cell(row, 1).Value = c.ClassRoomName;
                    ws.Cell(row, 2).Value = c.TotalStudents;
                    ws.Cell(row, 3).Value = c.PromotedCount;
                    ws.Cell(row, 4).Value = c.RetainedCount;
                    ws.Cell(row, 5).Value = c.GraduatedCount;
                    ws.Cell(row, 6).Value = c.PendingCount;
                }

                ws.Columns().AdjustToContents();
                break;
            }
        }

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);

        return Result.Ok(new ExportReportResultDto
        {
            Content = memoryStream.ToArray(),
            ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            FileName = $"BaoCao_{request.ReportType}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx"
        });
    }
}
