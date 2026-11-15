using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Banners.Contracts;
using GiaoLy.Application.Banners.Dtos;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Results;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Banners;

public class BannerService : IBannerService
{
    private readonly AppDbContext _context;

    public BannerService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<BannerDto>>> GetPublicBannersAsync(CancellationToken ct = default)
    {
        var list = await _context.Banners
            .AsNoTracking()
            .Where(b => b.IsActive)
            .OrderBy(b => b.OrderIndex)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<List<BannerDto>>> GetAllBannersAsync(CancellationToken ct = default)
    {
        var list = await _context.Banners
            .AsNoTracking()
            .OrderBy(b => b.OrderIndex)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<BannerDto>> GetBannerByIdAsync(Guid id, CancellationToken ct = default)
    {
        var b = await _context.Banners
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (b == null)
            return Result.NotFound<BannerDto>("Không tìm thấy banner");

        return Result.Ok(MapToDto(b));
    }

    public async Task<Result<BannerDto>> CreateBannerAsync(CreateBannerRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<BannerDto>(ErrorCodes.ValidationFailed, "Tiêu đề banner không được để trống");

        if (string.IsNullOrWhiteSpace(request.ImageUrl))
            return Result.BadRequest<BannerDto>(ErrorCodes.ValidationFailed, "Đường dẫn ảnh banner không được để trống");

        var banner = new Banner
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            ImageUrl = request.ImageUrl.Trim(),
            LinkUrl = request.LinkUrl?.Trim(),
            OrderIndex = request.OrderIndex,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Banners.Add(banner);
        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapToDto(banner));
    }

    public async Task<Result<BannerDto>> UpdateBannerAsync(Guid id, UpdateBannerRequest request, CancellationToken ct = default)
    {
        var b = await _context.Banners.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (b == null)
            return Result.NotFound<BannerDto>("Không tìm thấy banner");

        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<BannerDto>(ErrorCodes.ValidationFailed, "Tiêu đề banner không được để trống");

        if (string.IsNullOrWhiteSpace(request.ImageUrl))
            return Result.BadRequest<BannerDto>(ErrorCodes.ValidationFailed, "Đường dẫn ảnh banner không được để trống");

        b.Title = request.Title.Trim();
        b.ImageUrl = request.ImageUrl.Trim();
        b.LinkUrl = request.LinkUrl?.Trim();
        b.OrderIndex = request.OrderIndex;
        b.IsActive = request.IsActive;
        b.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Result.Ok(MapToDto(b));
    }

    public async Task<Result<bool>> DeleteBannerAsync(Guid id, CancellationToken ct = default)
    {
        var b = await _context.Banners.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (b == null)
            return Result.NotFound<bool>("Không tìm thấy banner");

        b.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
        return Result.Ok(true);
    }

    private static BannerDto MapToDto(Banner b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        ImageUrl = b.ImageUrl,
        LinkUrl = b.LinkUrl,
        OrderIndex = b.OrderIndex,
        IsActive = b.IsActive,
        CreatedAt = b.CreatedAt
    };
}
