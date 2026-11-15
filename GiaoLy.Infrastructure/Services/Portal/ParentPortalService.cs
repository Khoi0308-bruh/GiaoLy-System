using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Certificates.Contracts;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Imports.Dtos;
using GiaoLy.Application.Portal.Contracts;
using GiaoLy.Application.Portal.Dtos;
using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Portal;

public class ParentPortalService : IParentPortalService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly ICertificateService _certificateService;

    public ParentPortalService(
        AppDbContext context,
        ICurrentUser currentUser,
        ICertificateService certificateService)
    {
        _context = context;
        _currentUser = currentUser;
        _certificateService = certificateService;
    }

    private async Task<bool> IsChildLinkedToCurrentParentAsync(Guid childId, CancellationToken ct)
    {
        if (_currentUser.UserId == null)
            return false;

        // Verify that the student is linked to this specific guardian user
        return await _context.GuardianLinks
            .AsNoTracking()
            .AnyAsync(l => l.UserId == _currentUser.UserId.Value && l.StudentId == childId, ct);
    }

    public async Task<Result<List<PortalChildSummaryDto>>> GetMyChildrenAsync(CancellationToken ct = default)
    {
        if (_currentUser.UserId == null)
        {
            return Result.Forbidden<List<PortalChildSummaryDto>>("Yêu cầu đăng nhập tài khoản phụ huynh.");
        }

        var links = await _context.GuardianLinks
            .AsNoTracking()
            .Include(l => l.Student)
                .ThenInclude(s => s!.Enrollments)
                    .ThenInclude(e => e.ClassRoom)
                        .ThenInclude(c => c!.ClassLevel)
                            .ThenInclude(cl => cl!.Branch)
            .Where(l => l.UserId == _currentUser.UserId.Value && l.Student != null && l.Student.DeletedAt == null)
            .ToListAsync(ct);

        var result = new List<PortalChildSummaryDto>();

        foreach (var link in links)
        {
            var student = link.Student!;
            var activeEnrollment = student.Enrollments?
                .OrderByDescending(e => e.CreatedAt)
                .FirstOrDefault();

            result.Add(new PortalChildSummaryDto
            {
                Id = student.Id,
                StudentCode = student.Code,
                FullName = student.FullName,
                HolyName = student.HolyName,
                Gender = student.Gender,
                BirthDate = student.BirthDate,
                Relationship = link.Relationship,
                IsVerified = link.VerifiedAt.HasValue,
                CurrentClassRoom = activeEnrollment?.ClassRoom?.ClassName,
                CurrentBranch = activeEnrollment?.ClassRoom?.ClassLevel?.Branch?.Name,
                Status = student.Status
            });
        }

        return Result.Ok(result);
    }

    public async Task<Result<PortalChildDetailDto>> GetChildDetailAsync(Guid childId, CancellationToken ct = default)
    {
        // Enforce: Parent can ONLY access their own children. Trying other IDs returns 404 (Not Found).
        if (!await IsChildLinkedToCurrentParentAsync(childId, ct))
        {
            return Result.NotFound<PortalChildDetailDto>("Không tìm thấy thông tin đoàn sinh hoặc bạn không có quyền truy cập hồ sơ này.");
        }

        var link = await _context.GuardianLinks
            .AsNoTracking()
            .FirstOrDefaultAsync(l => l.UserId == _currentUser.UserId!.Value && l.StudentId == childId, ct);

        // Explicitly load student WITHOUT StudentNotes (privacy guarantee)
        var student = await _context.Students
            .AsNoTracking()
            .Include(s => s.Sacraments)
            .Include(s => s.Enrollments)
                .ThenInclude(e => e.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
                        .ThenInclude(cl => cl!.Branch)
            .FirstOrDefaultAsync(s => s.Id == childId && s.DeletedAt == null, ct);

        if (student == null)
        {
            return Result.NotFound<PortalChildDetailDto>("Không tìm thấy thông tin đoàn sinh.");
        }

        var activeEnrollment = student.Enrollments?
            .OrderByDescending(e => e.CreatedAt)
            .FirstOrDefault();

        var sacraments = student.Sacraments?
            .Select(s => new PortalSacramentDto
            {
                SacramentType = s.SacramentType,
                ReceivedOn = s.ReceivedOn,
                Place = s.Place,
                Minister = s.Minister,
                Sponsor = s.Sponsor
            })
            .ToList() ?? new List<PortalSacramentDto>();

        var dto = new PortalChildDetailDto
        {
            Id = student.Id,
            StudentCode = student.Code,
            FullName = student.FullName,
            HolyName = student.HolyName,
            Gender = student.Gender,
            BirthDate = student.BirthDate,
            Address = student.Address,
            Area = student.Area,
            BloodType = student.BloodType,
            Allergies = student.Allergies,
            Relationship = link?.Relationship ?? "Phụ huynh",
            IsVerified = link?.VerifiedAt.HasValue == true,
            CurrentClassRoom = activeEnrollment?.ClassRoom?.ClassName,
            CurrentBranch = activeEnrollment?.ClassRoom?.ClassLevel?.Branch?.Name,
            Status = student.Status,
            Sacraments = sacraments
        };

        return Result.Ok(dto);
    }

    public async Task<Result<List<PortalChildGradeDto>>> GetChildGradesAsync(Guid childId, CancellationToken ct = default)
    {
        // Enforce 404 on unlinked access
        if (!await IsChildLinkedToCurrentParentAsync(childId, ct))
        {
            return Result.NotFound<List<PortalChildGradeDto>>("Không tìm thấy thông tin điểm của đoàn sinh.");
        }

        var grades = await _context.Grades
            .AsNoTracking()
            .Include(g => g.Enrollment)
                .ThenInclude(e => e!.AcademicYear)
            .Include(g => g.Enrollment)
                .ThenInclude(e => e!.ClassRoom)
            .Where(g => g.Enrollment != null && g.Enrollment.StudentId == childId)
            .OrderByDescending(g => g.Enrollment!.AcademicYear != null ? g.Enrollment.AcademicYear.StartDate : DateOnly.MinValue)
            .ToListAsync(ct);

        var result = grades.Select(g => new PortalChildGradeDto
        {
            AcademicYearId = g.Enrollment!.AcademicYearId,
            AcademicYearName = g.Enrollment.AcademicYear?.Name ?? "Niên khóa",
            ClassRoomName = g.Enrollment.ClassRoom?.ClassName ?? "Lớp học",
            Oral = g.Oral,
            SmallTest = g.SmallTest,
            BigTest = g.BigTest,
            FinalExam = g.FinalExam,
            TotalSessions = g.TotalSessions,
            Absences = g.Absences,
            ComputedGpa = g.ComputedGpa,
            ComputedStatus = g.ComputedStatus,
            Remarks = g.Remarks
        }).ToList();

        return Result.Ok(result);
    }

    public async Task<Result<List<PortalChildCertificateDto>>> GetChildCertificatesAsync(Guid childId, CancellationToken ct = default)
    {
        // Enforce 404 on unlinked access
        if (!await IsChildLinkedToCurrentParentAsync(childId, ct))
        {
            return Result.NotFound<List<PortalChildCertificateDto>>("Không tìm thấy chứng chỉ của đoàn sinh.");
        }

        var certificates = await _context.Certificates
            .AsNoTracking()
            .Where(c => c.StudentId == childId)
            .OrderByDescending(c => c.IssuedAt)
            .ToListAsync(ct);

        var result = certificates.Select(c => new PortalChildCertificateDto
        {
            Id = c.Id,
            VerificationCode = c.VerificationCode,
            CertificateType = c.CertificateType,
            IssuedAt = c.IssuedAt,
            Status = c.Status
        }).ToList();

        return Result.Ok(result);
    }

    public async Task<Result<ExportFileResult>> GetChildCertificatePdfAsync(Guid childId, Guid certificateId, CancellationToken ct = default)
    {
        // Enforce 404 on unlinked access
        if (!await IsChildLinkedToCurrentParentAsync(childId, ct))
        {
            return Result.NotFound<ExportFileResult>("Không tìm thấy chứng chỉ hoặc bạn không có quyền truy cập.");
        }

        var certExists = await _context.Certificates
            .AsNoTracking()
            .AnyAsync(c => c.Id == certificateId && c.StudentId == childId, ct);

        if (!certExists)
        {
            return Result.NotFound<ExportFileResult>("Không tìm thấy chứng chỉ yêu cầu.");
        }

        return await _certificateService.GetCertificatePdfAsync(certificateId, ct);
    }

    public async Task<Result<List<PortalAnnouncementDto>>> GetParentAnnouncementsAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        var announcements = await _context.Announcements
            .AsNoTracking()
            .Where(a => a.DeletedAt == null)
            .Where(a => a.Audience == "Guardians" || a.Audience == "Public")
            .Where(a => a.ExpiresAt == null || a.ExpiresAt > now)
            .OrderByDescending(a => a.PublishedAt)
            .Take(50)
            .Select(a => new PortalAnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                ContentHtml = a.ContentHtml,
                AnnouncementType = a.AnnouncementType,
                PublishedAt = a.PublishedAt,
                Author = a.Author
            })
            .ToListAsync(ct);

        return Result.Ok(announcements);
    }
}
