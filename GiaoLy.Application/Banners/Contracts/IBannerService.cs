using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Banners.Dtos;
using GiaoLy.Application.Common.Results;

namespace GiaoLy.Application.Banners.Contracts;

public interface IBannerService
{
    Task<Result<List<BannerDto>>> GetPublicBannersAsync(CancellationToken ct = default);
    Task<Result<List<BannerDto>>> GetAllBannersAsync(CancellationToken ct = default);
    Task<Result<BannerDto>> GetBannerByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<BannerDto>> CreateBannerAsync(CreateBannerRequest request, CancellationToken ct = default);
    Task<Result<BannerDto>> UpdateBannerAsync(Guid id, UpdateBannerRequest request, CancellationToken ct = default);
    Task<Result<bool>> DeleteBannerAsync(Guid id, CancellationToken ct = default);
}
