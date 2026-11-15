using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Banners.Contracts;
using GiaoLy.Application.Banners.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class BannersController : ControllerBase
{
    private readonly IBannerService _bannerService;

    public BannersController(IBannerService bannerService)
    {
        _bannerService = bannerService;
    }

    [HttpGet("api/v1/public/banners")]
    [HttpGet("api/banners/active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicBanners(CancellationToken ct)
    {
        var result = await _bannerService.GetPublicBannersAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/banners")]
    [HttpGet("api/banners")]
    [RequirePermission(Permissions.Content.BannersManage)]
    public async Task<IActionResult> GetAllBanners(CancellationToken ct)
    {
        var result = await _bannerService.GetAllBannersAsync(ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/banners/{id:guid}")]
    [RequirePermission(Permissions.Content.BannersManage)]
    public async Task<IActionResult> GetBannerById(Guid id, CancellationToken ct)
    {
        var result = await _bannerService.GetBannerByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/banners")]
    [HttpPost("api/banners")]
    [RequirePermission(Permissions.Content.BannersManage)]
    public async Task<IActionResult> CreateBanner([FromBody] CreateBannerRequest request, CancellationToken ct)
    {
        var result = await _bannerService.CreateBannerAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/banners/{id:guid}")]
    [HttpPut("api/banners/{id:guid}")]
    [RequirePermission(Permissions.Content.BannersManage)]
    public async Task<IActionResult> UpdateBanner(Guid id, [FromBody] UpdateBannerRequest request, CancellationToken ct)
    {
        var result = await _bannerService.UpdateBannerAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/banners/{id:guid}")]
    [HttpDelete("api/banners/{id:guid}")]
    [RequirePermission(Permissions.Content.BannersManage)]
    public async Task<IActionResult> DeleteBanner(Guid id, CancellationToken ct)
    {
        var result = await _bannerService.DeleteBannerAsync(id, ct);
        return result.ToActionResult();
    }
}
