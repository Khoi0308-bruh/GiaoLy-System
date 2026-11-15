using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Leaders.Contracts;
using GiaoLy.Application.Leaders.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Leaders;

public class LeaderService : ILeaderService
{
    private readonly AppDbContext _context;

    public LeaderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<PublicLeaderDto>>> GetPublicLeadersAsync(CancellationToken ct = default)
    {
        var list = await _context.Leaders
            .AsNoTracking()
            .Include(l => l.BranchEntity)
            .Where(l => l.IsActive)
            .OrderBy(l => l.Level)
            .ThenBy(l => l.FullName)
            .ToListAsync(ct);

        // Security rule: NO phone, NO address in public payload
        var dtos = list.Select(l => new PublicLeaderDto
        {
            Id = l.Id,
            HolyName = l.HolyName,
            FullName = l.FullName,
            Position = l.Position,
            Level = l.Level,
            Term = l.Term,
            AvatarPath = l.AvatarPath,
            Description = l.Description,
            BranchId = l.BranchId,
            BranchName = l.BranchEntity?.Name
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<List<LeaderDto>>> GetAllLeadersAsync(int? branchId, bool? isActive, CancellationToken ct = default)
    {
        var query = _context.Leaders
            .AsNoTracking()
            .Include(l => l.BranchEntity)
            .AsQueryable();

        if (branchId.HasValue)
            query = query.Where(l => l.BranchId == branchId.Value);

        if (isActive.HasValue)
            query = query.Where(l => l.IsActive == isActive.Value);

        var list = await query
            .OrderBy(l => l.Level)
            .ThenBy(l => l.FullName)
            .ToListAsync(ct);

        var dtos = list.Select(MapToAdminDto).ToList();
        return Result.Ok(dtos);
    }

    public async Task<Result<LeaderDto>> GetLeaderByIdAsync(Guid id, CancellationToken ct = default)
    {
        var l = await _context.Leaders
            .AsNoTracking()
            .Include(x => x.BranchEntity)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (l == null)
            return Result.NotFound<LeaderDto>("Không tìm thấy huynh trưởng");

        return Result.Ok(MapToAdminDto(l));
    }

    public async Task<Result<LeaderDto>> CreateLeaderAsync(CreateLeaderRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Họ và tên không được để trống");

        if (string.IsNullOrWhiteSpace(request.Position))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Chức vụ không được để trống");

        if (string.IsNullOrWhiteSpace(request.Term))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Nhiệm kỳ không được để trống");

        var leader = new Leader
        {
            Id = Guid.NewGuid(),
            HolyName = request.HolyName?.Trim(),
            FullName = request.FullName.Trim(),
            Position = request.Position.Trim(),
            Level = request.Level,
            Term = request.Term.Trim(),
            AvatarPath = request.AvatarPath?.Trim(),
            Description = request.Description?.Trim(),
            BranchId = request.BranchId,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Leaders.Add(leader);
        await _context.SaveChangesAsync(ct);

        return await GetLeaderByIdAsync(leader.Id, ct);
    }

    public async Task<Result<LeaderDto>> UpdateLeaderAsync(Guid id, UpdateLeaderRequest request, CancellationToken ct = default)
    {
        var l = await _context.Leaders.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (l == null)
            return Result.NotFound<LeaderDto>("Không tìm thấy huynh trưởng");

        if (string.IsNullOrWhiteSpace(request.FullName))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Họ và tên không được để trống");

        if (string.IsNullOrWhiteSpace(request.Position))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Chức vụ không được để trống");

        if (string.IsNullOrWhiteSpace(request.Term))
            return Result.BadRequest<LeaderDto>(ErrorCodes.ValidationFailed, "Nhiệm kỳ không được để trống");

        l.HolyName = request.HolyName?.Trim();
        l.FullName = request.FullName.Trim();
        l.Position = request.Position.Trim();
        l.Level = request.Level;
        l.Term = request.Term.Trim();
        l.AvatarPath = request.AvatarPath?.Trim();
        l.Description = request.Description?.Trim();
        l.BranchId = request.BranchId;
        l.IsActive = request.IsActive;
        l.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetLeaderByIdAsync(l.Id, ct);
    }

    public async Task<Result<bool>> DeleteLeaderAsync(Guid id, CancellationToken ct = default)
    {
        var l = await _context.Leaders.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (l == null)
            return Result.NotFound<bool>("Không tìm thấy huynh trưởng");

        l.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return Result.Ok(true);
    }

    private static LeaderDto MapToAdminDto(Leader l) => new()
    {
        Id = l.Id,
        HolyName = l.HolyName,
        FullName = l.FullName,
        Position = l.Position,
        Level = l.Level,
        Term = l.Term,
        AvatarPath = l.AvatarPath,
        Description = l.Description,
        BranchId = l.BranchId,
        BranchName = l.BranchEntity?.Name,
        IsActive = l.IsActive,
        CreatedAt = l.CreatedAt,
        UpdatedAt = l.UpdatedAt
    };
}
