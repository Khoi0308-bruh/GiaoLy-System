using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Organization.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Organization;

public class BranchService : IBranchService
{
    private readonly AppDbContext _db;

    public BranchService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<IReadOnlyList<BranchResponse>>> GetBranchesAsync(CancellationToken ct = default)
    {
        var branches = await _db.Branches
            .AsNoTracking()
            .OrderBy(b => b.SortOrder)
            .Select(b => new BranchResponse(b.Id, b.Code, b.Name, b.MinAge, b.MaxAge, b.SortOrder, b.IsActive))
            .ToListAsync(ct);

        return Result.Ok<IReadOnlyList<BranchResponse>>(branches);
    }

    public async Task<Result<BranchResponse>> CreateBranchAsync(CreateBranchRequest request, CancellationToken ct = default)
    {
        var code = request.Code.Trim().ToUpperInvariant();
        if (request.MinAge.HasValue && request.MaxAge.HasValue && request.MinAge > request.MaxAge)
        {
            return Result.BadRequest<BranchResponse>(ErrorCodes.ValidationFailed, "Tuổi tối thiểu không được lớn hơn tuổi tối đa.");
        }

        var exists = await _db.Branches.AnyAsync(b => b.Code == code, ct);
        if (exists)
        {
            return Result.Conflict<BranchResponse>(ErrorCodes.ConflictDuplicate, $"Mã ngành '{code}' đã tồn tại.");
        }

        var branch = new Branch
        {
            Code = code,
            Name = request.Name.Trim(),
            MinAge = request.MinAge,
            MaxAge = request.MaxAge,
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Branches.Add(branch);
        await _db.SaveChangesAsync(ct);

        return Result.Ok(new BranchResponse(branch.Id, branch.Code, branch.Name, branch.MinAge, branch.MaxAge, branch.SortOrder, branch.IsActive));
    }

    public async Task<Result<BranchResponse>> UpdateBranchAsync(int id, UpdateBranchRequest request, CancellationToken ct = default)
    {
        var branch = await _db.Branches.FirstOrDefaultAsync(b => b.Id == id, ct);
        if (branch == null) return Result.NotFound<BranchResponse>("Ngành không tồn tại.");

        if (request.MinAge.HasValue && request.MaxAge.HasValue && request.MinAge > request.MaxAge)
        {
            return Result.BadRequest<BranchResponse>(ErrorCodes.ValidationFailed, "Tuổi tối thiểu không được lớn hơn tuổi tối đa.");
        }

        branch.Name = request.Name.Trim();
        branch.MinAge = request.MinAge;
        branch.MaxAge = request.MaxAge;
        branch.SortOrder = request.SortOrder;
        branch.IsActive = request.IsActive;
        branch.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return Result.Ok(new BranchResponse(branch.Id, branch.Code, branch.Name, branch.MinAge, branch.MaxAge, branch.SortOrder, branch.IsActive));
    }
}
