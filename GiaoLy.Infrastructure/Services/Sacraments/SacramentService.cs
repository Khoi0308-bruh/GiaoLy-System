using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Sacraments.Contracts;
using GiaoLy.Application.Sacraments.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GiaoLy.Infrastructure.Services.Sacraments;

public class SacramentService : ISacramentService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;
    private readonly ILogger<SacramentService> _logger;

    public SacramentService(
        AppDbContext db,
        ICurrentUser currentUser,
        IScopeContext scopeContext,
        ILogger<SacramentService> logger)
    {
        _db = db;
        _currentUser = currentUser;
        _scopeContext = scopeContext;
        _logger = logger;
    }

    public async Task<Result<IReadOnlyList<StudentSacramentDto>>> GetStudentSacramentsAsync(Guid studentId, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(studentId, ct))
        {
            return Result.NotFound<IReadOnlyList<StudentSacramentDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var sacraments = await _db.StudentSacraments
            .AsNoTracking()
            .Include(ss => ss.Verifier)
            .Where(ss => ss.StudentId == studentId)
            .OrderBy(ss => ss.SacramentType == SacramentRules.Baptism ? 1 : (ss.SacramentType == SacramentRules.FirstCommunion ? 2 : 3))
            .Select(ss => new StudentSacramentDto(
                ss.Id,
                ss.StudentId,
                ss.SacramentType,
                ss.ReceivedOn,
                ss.Place,
                ss.Minister,
                ss.Sponsor,
                ss.BookNumber,
                ss.Note,
                ss.VerifiedBy,
                ss.Verifier != null ? ss.Verifier.FullName : null,
                ss.VerifiedAt,
                ss.RowVersion
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<StudentSacramentDto>>(sacraments);
    }

    public async Task<Result<StudentSacramentDto>> UpsertStudentSacramentAsync(Guid studentId, string sacramentType, UpsertSacramentRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(studentId, ct))
        {
            return Result.NotFound<StudentSacramentDto>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var type = SacramentRules.NormalizeSacramentType(sacramentType);
        if (type == null)
        {
            return Result.Validation<StudentSacramentDto>($"Loại bí tích '{sacramentType}' không hợp lệ. Hệ thống chỉ hỗ trợ Baptism, FirstCommunion, Confirmation.", "SacramentType");
        }

        var student = await _db.Students
            .Include(s => s.Sacraments)
            .FirstOrDefaultAsync(s => s.Id == studentId, ct);

        if (student == null)
        {
            return Result.NotFound<StudentSacramentDto>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var birthDate = DateOnly.FromDateTime(student.BirthDate);

        var existingBaptism = student.Sacraments.FirstOrDefault(s => s.SacramentType == SacramentRules.Baptism)?.ReceivedOn;
        var existingCommunion = student.Sacraments.FirstOrDefault(s => s.SacramentType == SacramentRules.FirstCommunion)?.ReceivedOn;
        var existingConfirmation = student.Sacraments.FirstOrDefault(s => s.SacramentType == SacramentRules.Confirmation)?.ReceivedOn;

        var targetBaptism = type == SacramentRules.Baptism ? request.ReceivedOn : existingBaptism;
        var targetCommunion = type == SacramentRules.FirstCommunion ? request.ReceivedOn : existingCommunion;
        var targetConfirmation = type == SacramentRules.Confirmation ? request.ReceivedOn : existingConfirmation;

        if (!SacramentRules.ValidateOrder(birthDate, targetBaptism, targetCommunion, targetConfirmation, out var orderError))
        {
            return Result.Validation<StudentSacramentDto>(orderError!);
        }

        var sacrament = student.Sacraments.FirstOrDefault(s => s.SacramentType == type);
        if (sacrament == null)
        {
            sacrament = new StudentSacrament
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                SacramentType = type,
                CreatedAt = DateTime.UtcNow
            };
            _db.StudentSacraments.Add(sacrament);
        }
        else
        {
            sacrament.UpdatedAt = DateTime.UtcNow;
        }

        sacrament.ReceivedOn = request.ReceivedOn;
        sacrament.Place = request.Place?.Trim();
        sacrament.Minister = request.Minister?.Trim();
        sacrament.Sponsor = request.Sponsor?.Trim();
        sacrament.BookNumber = request.BookNumber?.Trim();
        sacrament.Note = request.Note?.Trim();

        if (request.IsVerified && _currentUser.UserId.HasValue)
        {
            sacrament.VerifiedBy = _currentUser.UserId.Value;
            sacrament.VerifiedAt = DateTime.UtcNow;
        }

        // Synchronize legacy flat fields on Student
        if (type == SacramentRules.Baptism)
        {
            student.BaptismDate = request.ReceivedOn?.ToDateTime(TimeOnly.MinValue);
            student.BaptismPlace = request.Place?.Trim();
            student.BaptismGodparent = request.Sponsor?.Trim();
            student.BaptismPriest = request.Minister?.Trim();
        }
        else if (type == SacramentRules.FirstCommunion)
        {
            student.CommunionDate = request.ReceivedOn?.ToDateTime(TimeOnly.MinValue);
            student.CommunionPriest = request.Minister?.Trim();
        }
        else if (type == SacramentRules.Confirmation)
        {
            student.ConfirmationDate = request.ReceivedOn?.ToDateTime(TimeOnly.MinValue);
            student.ConfirmationGodparent = request.Sponsor?.Trim();
            student.ConfirmationBishop = request.Minister?.Trim();
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật bí tích {Type} cho đoàn sinh {StudentId}", type, studentId);

        var verifierName = sacrament.VerifiedBy.HasValue
            ? await _db.Users.Where(u => u.Id == sacrament.VerifiedBy.Value).Select(u => u.FullName).FirstOrDefaultAsync(ct)
            : null;

        return Result.Ok(new StudentSacramentDto(
            sacrament.Id,
            sacrament.StudentId,
            sacrament.SacramentType,
            sacrament.ReceivedOn,
            sacrament.Place,
            sacrament.Minister,
            sacrament.Sponsor,
            sacrament.BookNumber,
            sacrament.Note,
            sacrament.VerifiedBy,
            verifierName,
            sacrament.VerifiedAt,
            sacrament.RowVersion
        ));
    }

    public async Task<Result> DeleteStudentSacramentAsync(Guid studentId, string sacramentType, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(studentId, ct))
        {
            return Result.NotFound("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var type = SacramentRules.NormalizeSacramentType(sacramentType);
        if (type == null)
        {
            return Result.Validation($"Loại bí tích '{sacramentType}' không hợp lệ.");
        }

        // Check if certificate has been issued
        var certType = type == SacramentRules.Baptism ? "Baptism" : (type == SacramentRules.FirstCommunion ? "Communion" : "Confirmation");
        var hasIssuedCert = await _db.Certificates
            .AnyAsync(c => c.StudentId == studentId && c.Status == "Issued" && c.CertificateType == certType, ct);

        if (hasIssuedCert)
        {
            return Result.Validation("Không thể xóa ghi nhận bí tích này vì đoàn sinh đã được cấp chứng chỉ bí tích hợp lệ. Vui lòng thu hồi chứng chỉ trước khi xóa ghi nhận bí tích.");
        }

        var sacrament = await _db.StudentSacraments
            .FirstOrDefaultAsync(ss => ss.StudentId == studentId && ss.SacramentType == type, ct);

        if (sacrament != null)
        {
            _db.StudentSacraments.Remove(sacrament);
        }

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == studentId, ct);
        if (student != null)
        {
            if (type == SacramentRules.Baptism)
            {
                student.BaptismDate = null;
                student.BaptismPlace = null;
                student.BaptismGodparent = null;
                student.BaptismPriest = null;
            }
            else if (type == SacramentRules.FirstCommunion)
            {
                student.CommunionDate = null;
                student.CommunionPriest = null;
            }
            else if (type == SacramentRules.Confirmation)
            {
                student.ConfirmationDate = null;
                student.ConfirmationGodparent = null;
                student.ConfirmationBishop = null;
            }
        }

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã xóa ghi nhận bí tích {Type} của đoàn sinh {StudentId}", type, studentId);

        return Result.Ok();
    }

    public async Task<Result<IReadOnlyList<SacramentRequirementDto>>> GetSacramentRequirementsAsync(string? sacramentType = null, CancellationToken ct = default)
    {
        var query = _db.SacramentRequirements
            .AsNoTracking()
            .Where(r => r.IsActive);

        if (!string.IsNullOrWhiteSpace(sacramentType))
        {
            var type = SacramentRules.NormalizeSacramentType(sacramentType);
            if (type != null)
            {
                query = query.Where(r => r.SacramentType == type);
            }
        }

        var list = await query
            .OrderBy(r => r.SacramentType)
            .ThenBy(r => r.SortOrder)
            .ThenBy(r => r.Name)
            .Select(r => new SacramentRequirementDto(
                r.Id,
                r.SacramentType,
                r.Name,
                r.Description,
                r.SortOrder,
                r.IsActive
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<SacramentRequirementDto>>(list);
    }

    public async Task<Result<SacramentRequirementDto>> CreateSacramentRequirementAsync(CreateSacramentRequirementRequest request, CancellationToken ct = default)
    {
        var type = SacramentRules.NormalizeSacramentType(request.SacramentType);
        if (type == null)
        {
            return Result.Validation<SacramentRequirementDto>($"Loại bí tích '{request.SacramentType}' không hợp lệ.", "SacramentType");
        }

        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Validation<SacramentRequirementDto>("Tên yêu cầu không được để trống.", "Name");
        }

        var req = new SacramentRequirement
        {
            Id = Guid.NewGuid(),
            SacramentType = type,
            Name = name,
            Description = request.Description?.Trim(),
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.SacramentRequirements.Add(req);
        await _db.SaveChangesAsync(ct);

        _logger.LogInformation("Đã tạo yêu cầu chuẩn bị bí tích: {Name} ({Type})", req.Name, req.SacramentType);

        return Result.Ok(new SacramentRequirementDto(
            req.Id,
            req.SacramentType,
            req.Name,
            req.Description,
            req.SortOrder,
            req.IsActive
        ));
    }

    public async Task<Result<SacramentRequirementDto>> UpdateSacramentRequirementAsync(Guid id, UpdateSacramentRequirementRequest request, CancellationToken ct = default)
    {
        var req = await _db.SacramentRequirements.FirstOrDefaultAsync(r => r.Id == id, ct);
        if (req == null)
        {
            return Result.NotFound<SacramentRequirementDto>($"Không tìm thấy yêu cầu chuẩn bị bí tích với Id '{id}'.");
        }

        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result.Validation<SacramentRequirementDto>("Tên yêu cầu không được để trống.", "Name");
        }

        req.Name = name;
        req.Description = request.Description?.Trim();
        req.SortOrder = request.SortOrder;
        req.IsActive = request.IsActive;
        req.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật yêu cầu chuẩn bị bí tích {Id}: {Name}", req.Id, req.Name);

        return Result.Ok(new SacramentRequirementDto(
            req.Id,
            req.SacramentType,
            req.Name,
            req.Description,
            req.SortOrder,
            req.IsActive
        ));
    }

    public async Task<Result<IReadOnlyList<StudentRequirementProgressDto>>> GetStudentRequirementProgressAsync(Guid studentId, string? sacramentType = null, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(studentId, ct))
        {
            return Result.NotFound<IReadOnlyList<StudentRequirementProgressDto>>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var reqQuery = _db.SacramentRequirements.AsNoTracking().Where(r => r.IsActive);
        if (!string.IsNullOrWhiteSpace(sacramentType))
        {
            var type = SacramentRules.NormalizeSacramentType(sacramentType);
            if (type != null) reqQuery = reqQuery.Where(r => r.SacramentType == type);
        }

        var requirements = await reqQuery
            .OrderBy(r => r.SacramentType)
            .ThenBy(r => r.SortOrder)
            .ToListAsync(ct);

        var reqIds = requirements.Select(r => r.Id).ToList();

        var progresses = await _db.StudentRequirementProgresses
            .AsNoTracking()
            .Include(p => p.Evaluator)
            .Where(p => p.StudentId == studentId && reqIds.Contains(p.RequirementId))
            .ToDictionaryAsync(p => p.RequirementId, ct);

        var result = new List<StudentRequirementProgressDto>();
        foreach (var req in requirements)
        {
            if (progresses.TryGetValue(req.Id, out var prog))
            {
                result.Add(new StudentRequirementProgressDto(
                    prog.Id,
                    studentId,
                    req.Id,
                    req.Name,
                    req.SacramentType,
                    prog.IsCompleted,
                    prog.CompletedOn,
                    prog.EvaluatorUserId,
                    prog.Evaluator?.FullName,
                    prog.Note
                ));
            }
            else
            {
                result.Add(new StudentRequirementProgressDto(
                    Guid.Empty,
                    studentId,
                    req.Id,
                    req.Name,
                    req.SacramentType,
                    false,
                    null,
                    null,
                    null,
                    null
                ));
            }
        }

        return Result.Ok<IReadOnlyList<StudentRequirementProgressDto>>(result);
    }

    public async Task<Result<StudentRequirementProgressDto>> UpdateStudentRequirementProgressAsync(Guid studentId, Guid requirementId, UpdateRequirementProgressRequest request, CancellationToken ct = default)
    {
        if (!await _scopeContext.CanAccessStudentAsync(studentId, ct))
        {
            return Result.NotFound<StudentRequirementProgressDto>("Không tìm thấy hồ sơ đoàn sinh.");
        }

        var requirement = await _db.SacramentRequirements.FirstOrDefaultAsync(r => r.Id == requirementId, ct);
        if (requirement == null)
        {
            return Result.NotFound<StudentRequirementProgressDto>($"Không tìm thấy yêu cầu bí tích với Id '{requirementId}'.");
        }

        var prog = await _db.StudentRequirementProgresses
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.RequirementId == requirementId, ct);

        if (prog == null)
        {
            prog = new StudentRequirementProgress
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                RequirementId = requirementId,
                CreatedAt = DateTime.UtcNow
            };
            _db.StudentRequirementProgresses.Add(prog);
        }
        else
        {
            prog.UpdatedAt = DateTime.UtcNow;
        }

        prog.IsCompleted = request.IsCompleted;
        prog.CompletedOn = request.CompletedOn ?? (request.IsCompleted ? DateOnly.FromDateTime(DateTime.UtcNow) : null);
        prog.Note = request.Note?.Trim();
        prog.EvaluatorUserId = _currentUser.UserId;

        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Đã cập nhật tiến độ yêu cầu {ReqName} của em {StudentId}: {Completed}", requirement.Name, studentId, prog.IsCompleted);

        var evaluatorName = prog.EvaluatorUserId.HasValue
            ? await _db.Users.Where(u => u.Id == prog.EvaluatorUserId.Value).Select(u => u.FullName).FirstOrDefaultAsync(ct)
            : null;

        return Result.Ok(new StudentRequirementProgressDto(
            prog.Id,
            prog.StudentId,
            requirement.Id,
            requirement.Name,
            requirement.SacramentType,
            prog.IsCompleted,
            prog.CompletedOn,
            prog.EvaluatorUserId,
            evaluatorName,
            prog.Note
        ));
    }
}
