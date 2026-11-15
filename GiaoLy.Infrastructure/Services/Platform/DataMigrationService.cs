using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Application.Platform.Dtos;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Platform;

public class DataMigrationService : IDataMigrationService
{
    private readonly AppDbContext _context;
    private readonly ILogger<DataMigrationService> _logger;

    public DataMigrationService(AppDbContext context, ILogger<DataMigrationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<MigrationPhaseResultDto>> RunPhaseAsync(int phase, CancellationToken ct = default)
    {
        if (phase < 1 || phase > 4)
        {
            return Result.BadRequest<MigrationPhaseResultDto>("Giai đoạn chuyển đổi không hợp lệ. Chỉ chấp nhận đợt 1 đến 4.");
        }

        string phaseName = phase switch
        {
            1 => "Đợt 1: Danh tính và Tổ chức (Identity & Organization)",
            2 => "Đợt 2: Đoàn sinh, Phụ huynh và Bí tích (Students, Guardians & Sacraments)",
            3 => "Đợt 3: Điểm số, Lên lớp và Chứng chỉ (Grades, Promotion & Certificates)",
            4 => "Đợt 4: Hoạt động, Tài liệu và Dọn dẹp (Activities, Documents & Cleanup)",
            _ => $"Đợt {phase}"
        };

        var scriptPath = FindEtlScriptPath(phase);
        if (string.IsNullOrEmpty(scriptPath) || !File.Exists(scriptPath))
        {
            _logger.LogError("Không tìm thấy tệp kịch bản ETL cho Đợt {Phase}", phase);
            return Result.BadRequest<MigrationPhaseResultDto>($"Không tìm thấy tệp script ETL cho Đợt {phase}. Vui lòng kiểm tra thư mục database/etl.");
        }

        try
        {
            _logger.LogInformation("Bắt đầu thực thi ETL {PhaseName} từ file: {Path}", phaseName, scriptPath);
            var sql = await File.ReadAllTextAsync(scriptPath, ct);

            // T-SQL execution with CommandTimeout extended for large migration batches
            _context.Database.SetCommandTimeout(300); // 5 minutes timeout
            int affected = await _context.Database.ExecuteSqlRawAsync(sql, ct);

            _logger.LogInformation("Hoàn tất thực thi ETL {PhaseName}. Số dòng ảnh hưởng: {Affected}", phaseName, affected);

            return Result.Ok(new MigrationPhaseResultDto
            {
                Phase = phase,
                PhaseName = phaseName,
                IsSuccess = true,
                Message = $"Chuyển đổi thành công {phaseName}.",
                AffectedRecords = affected,
                ExecutedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi xảy ra trong quá trình thực thi ETL {PhaseName}", phaseName);
            return Result.BadRequest<MigrationPhaseResultDto>($"Lỗi thực thi {phaseName}: {ex.Message}");
        }
    }

    public async Task<Result<ReconciliationReportDto>> GetReconciliationReportAsync(CancellationToken ct = default)
    {
        try
        {
            var report = new ReconciliationReportDto
            {
                CheckedAt = DateTime.UtcNow,
                TotalUsers = await _context.Users.CountAsync(ct),
                ActiveUsers = await _context.Users.CountAsync(u => u.IsActive, ct),
                TotalStudents = await _context.Students.CountAsync(ct),
                ActiveStudents = await _context.Students.CountAsync(s => s.Status == "Active", ct),
                TotalGuardians = await _context.Guardians.CountAsync(ct),
                TotalSacraments = await _context.StudentSacraments.CountAsync(ct),
                TotalEnrollments = await _context.Enrollments.CountAsync(ct),
                TotalGrades = await _context.Grades.CountAsync(ct),
                QualifiedGrades = await _context.Grades.CountAsync(g => g.ComputedStatus == "Qualified", ct),
                TotalCertificates = await _context.Certificates.CountAsync(ct),
                IssuedCertificates = await _context.Certificates.CountAsync(c => c.Status == "Issued", ct)
            };

            // Invariant 1: Điểm số mồ côi (EnrollmentId không tồn tại)
            var validEnrollmentIds = _context.Enrollments.Select(e => e.Id);
            report.OrphanGradesCount = await _context.Grades
                .Where(g => !validEnrollmentIds.Contains(g.EnrollmentId))
                .CountAsync(ct);

            // Invariant 2: Niên khóa có Status sai quy tắc
            var allowedStatuses = new[] { "Planning", "Active", "Closing", "Archived" };
            report.InvalidStatusYearsCount = await _context.AcademicYears
                .Where(y => string.IsNullOrEmpty(y.Status) || !allowedStatuses.Contains(y.Status))
                .CountAsync(ct);

            // Invariant 3: Chứng chỉ thiếu mã xác thực (>= 12 ký tự) hoặc Snapshot rỗng
            report.MissingCertCodesCount = await _context.Certificates
                .Where(c => string.IsNullOrEmpty(c.VerificationCode) || c.VerificationCode.Length < 12 || string.IsNullOrEmpty(c.Snapshot))
                .CountAsync(ct);

            // Invariant 4: Đoàn sinh bị trùng mã Code
            report.DuplicateStudentsCount = await _context.Students
                .Where(s => !string.IsNullOrEmpty(s.Code))
                .GroupBy(s => s.Code)
                .Where(g => g.Count() > 1)
                .CountAsync(ct);

            return Result.Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi đối chiếu dữ liệu đối soát ETL");
            return Result.BadRequest<ReconciliationReportDto>($"Lỗi đối soát dữ liệu: {ex.Message}");
        }
    }

    private static string? FindEtlScriptPath(int phase)
    {
        var pattern = $"0{phase}_*ETL.sql";
        var candidateDirs = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "database", "etl"),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "database", "etl"),
            Path.Combine(Directory.GetCurrentDirectory(), "database", "etl"),
            @"C:\GiaoLy\database\etl"
        };

        foreach (var dir in candidateDirs)
        {
            try
            {
                if (Directory.Exists(dir))
                {
                    var files = Directory.GetFiles(dir, pattern);
                    if (files.Length > 0) return files[0];
                }
            }
            catch
            {
                // Ignore permission or invalid path exceptions during search
            }
        }

        return null;
    }
}
