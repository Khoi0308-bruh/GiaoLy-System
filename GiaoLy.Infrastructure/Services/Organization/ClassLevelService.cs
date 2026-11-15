using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Organization;

public class ClassLevelService : IClassLevelService
{
    private readonly AppDbContext _db;

    public ClassLevelService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<IReadOnlyList<ClassLevelResponse>>> GetClassLevelsAsync(CancellationToken ct = default)
    {
        var levels = await _db.ClassLevels
            .Include(cl => cl.Branch)
            .Include(cl => cl.NextLevel)
            .AsNoTracking()
            .OrderBy(cl => cl.LevelKey)
            .Select(cl => new ClassLevelResponse(
                cl.Id,
                cl.BranchId,
                cl.Branch != null ? cl.Branch.Name : string.Empty,
                cl.Code,
                cl.Name,
                cl.LevelKey,
                cl.NextLevelId,
                cl.NextLevel != null ? cl.NextLevel.Name : null,
                cl.SortOrder
            ))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<ClassLevelResponse>>(levels);
    }

    public async Task<Result<ClassLevelResponse>> CreateClassLevelAsync(CreateClassLevelRequest request, CancellationToken ct = default)
    {
        var branch = await _db.Branches.FirstOrDefaultAsync(b => b.Id == request.BranchId, ct);
        if (branch == null) return Result.NotFound<ClassLevelResponse>("Ngành được chọn không tồn tại.");

        var code = request.Code.Trim().ToUpperInvariant();
        var existsCode = await _db.ClassLevels.AnyAsync(cl => cl.Code == code, ct);
        if (existsCode) return Result.Conflict<ClassLevelResponse>(ErrorCodes.ConflictDuplicate, $"Mã cấp lớp '{code}' đã tồn tại.");

        var existsKey = await _db.ClassLevels.AnyAsync(cl => cl.LevelKey == request.LevelKey, ct);
        if (existsKey) return Result.Conflict<ClassLevelResponse>(ErrorCodes.ConflictDuplicate, $"Thứ tự cấp lớp (LevelKey {request.LevelKey}) đã tồn tại.");

        var classLevel = new ClassLevel
        {
            BranchId = branch.Id,
            Code = code,
            Name = request.Name.Trim(),
            LevelKey = request.LevelKey,
            NextLevelId = request.NextLevelId,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
        };

        _db.ClassLevels.Add(classLevel);
        await _db.SaveChangesAsync(ct);

        return Result.Ok(new ClassLevelResponse(
            classLevel.Id,
            branch.Id,
            branch.Name,
            classLevel.Code,
            classLevel.Name,
            classLevel.LevelKey,
            classLevel.NextLevelId,
            null,
            classLevel.SortOrder
        ));
    }

    public async Task<Result<ClassLevelResponse>> UpdateClassLevelAsync(int id, UpdateClassLevelRequest request, CancellationToken ct = default)
    {
        var level = await _db.ClassLevels
            .Include(cl => cl.Branch)
            .Include(cl => cl.NextLevel)
            .FirstOrDefaultAsync(cl => cl.Id == id, ct);

        if (level == null) return Result.NotFound<ClassLevelResponse>("Cấp lớp không tồn tại.");

        if (level.LevelKey != request.LevelKey)
        {
            var existsKey = await _db.ClassLevels.AnyAsync(cl => cl.Id != id && cl.LevelKey == request.LevelKey, ct);
            if (existsKey) return Result.Conflict<ClassLevelResponse>(ErrorCodes.ConflictDuplicate, $"Thứ tự cấp lớp (LevelKey {request.LevelKey}) đã được sử dụng.");
        }

        level.Name = request.Name.Trim();
        level.LevelKey = request.LevelKey;
        level.NextLevelId = request.NextLevelId;
        level.SortOrder = request.SortOrder;
        level.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return Result.Ok(new ClassLevelResponse(
            level.Id,
            level.BranchId,
            level.Branch?.Name ?? string.Empty,
            level.Code,
            level.Name,
            level.LevelKey,
            level.NextLevelId,
            level.NextLevel?.Name,
            level.SortOrder
        ));
    }
}
