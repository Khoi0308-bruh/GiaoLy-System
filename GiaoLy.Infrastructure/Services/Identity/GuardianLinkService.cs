using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Identity.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Identity;

public class GuardianLinkService : IGuardianLinkService
{
    private readonly AppDbContext _db;
    private readonly ICurrentUser _currentUser;

    public GuardianLinkService(AppDbContext db, ICurrentUser currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public async Task<Result<IReadOnlyList<GuardianLinkResponse>>> GetGuardianLinksAsync(Guid? studentId, CancellationToken ct = default)
    {
        var query = _db.GuardianLinks
            .Include(gl => gl.User)
            .Include(gl => gl.Student)
            .Include(gl => gl.Verifier)
            .AsNoTracking();

        if (studentId.HasValue)
        {
            query = query.Where(gl => gl.StudentId == studentId.Value);
        }

        var list = await query
            .OrderByDescending(gl => gl.CreatedAt)
            .Select(gl => new GuardianLinkResponse(
                gl.Id,
                gl.UserId,
                gl.User != null ? gl.User.Username : string.Empty,
                gl.User != null ? gl.User.FullName : string.Empty,
                gl.StudentId,
                gl.Student != null ? gl.Student.FullName : string.Empty,
                gl.Relationship,
                gl.VerifiedAt,
                gl.Verifier != null ? gl.Verifier.FullName : null,
                gl.CreatedAt
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<GuardianLinkResponse>>(list);
    }

    public async Task<Result<GuardianLinkResponse>> CreateGuardianLinkAsync(CreateGuardianLinkRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, ct);
        if (user == null) return Result.NotFound<GuardianLinkResponse>("Không tìm thấy tài khoản phụ huynh.");

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == request.StudentId, ct);
        if (student == null) return Result.NotFound<GuardianLinkResponse>("Không tìm thấy thông tin đoàn sinh.");

        var exists = await _db.GuardianLinks.AnyAsync(gl => gl.UserId == request.UserId && gl.StudentId == request.StudentId, ct);
        if (exists)
        {
            return Result.Conflict<GuardianLinkResponse>(ErrorCodes.ConflictDuplicate, "Tài khoản phụ huynh đã được liên kết với đoàn sinh này.");
        }

        var link = new GuardianLink
        {
            UserId = user.Id,
            StudentId = student.Id,
            Relationship = request.Relationship.Trim(),
            VerifiedAt = DateTime.UtcNow,
            VerifiedBy = _currentUser.UserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.GuardianLinks.Add(link);
        await _db.SaveChangesAsync(ct);

        return Result.Ok(new GuardianLinkResponse(
            link.Id,
            user.Id,
            user.Username,
            user.FullName,
            student.Id,
            student.FullName,
            link.Relationship,
            link.VerifiedAt,
            _currentUser.FullName,
            link.CreatedAt
        ));
    }

    public async Task<Result> DeleteGuardianLinkAsync(Guid id, CancellationToken ct = default)
    {
        var link = await _db.GuardianLinks.FirstOrDefaultAsync(gl => gl.Id == id, ct);
        if (link == null) return Result.NotFound("Liên kết không tồn tại.");

        _db.GuardianLinks.Remove(link);
        await _db.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
