using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.News.Contracts;
using GiaoLy.Application.News.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class NewsController : ControllerBase
{
    private readonly INewsService _newsService;

    public NewsController(INewsService newsService)
    {
        _newsService = newsService;
    }

    [HttpGet("api/v1/public/news")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicNews(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] Guid? sourceId = null,
        CancellationToken ct = default)
    {
        var result = await _newsService.GetPublicNewsAsync(page, pageSize, sourceId, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/public/news/image")]
    [AllowAnonymous]
    public async Task<IActionResult> ProxyImage([FromQuery] string url, CancellationToken ct)
    {
        var result = await _newsService.ProxyImageAsync(url, ct);
        if (result.IsFailure)
            return result.ToActionResult();

        var dto = result.Value!;
        return File(dto.ImageStream, dto.ContentType);
    }

    [HttpGet("api/v1/news/sources")]
    [RequirePermission(Permissions.News.View)]
    public async Task<IActionResult> GetNewsSources(CancellationToken ct)
    {
        var result = await _newsService.GetNewsSourcesAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/news/sources")]
    [RequirePermission(Permissions.News.Create)]
    public async Task<IActionResult> CreateNewsSource([FromBody] CreateNewsSourceRequest request, CancellationToken ct)
    {
        var result = await _newsService.CreateNewsSourceAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/news/sources/{id:guid}")]
    [RequirePermission(Permissions.News.Update)]
    public async Task<IActionResult> UpdateNewsSource(Guid id, [FromBody] UpdateNewsSourceRequest request, CancellationToken ct)
    {
        var result = await _newsService.UpdateNewsSourceAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpDelete("api/v1/news/sources/{id:guid}")]
    [RequirePermission(Permissions.News.Delete)]
    public async Task<IActionResult> DeleteNewsSource(Guid id, CancellationToken ct)
    {
        var result = await _newsService.DeleteNewsSourceAsync(id, ct);
        return result.ToActionResult();
    }

    public record SetArticleActiveRequest(bool IsActive);

    [HttpPut("api/v1/news/articles/{id:guid}")]
    [RequirePermission(Permissions.News.Update)]
    public async Task<IActionResult> SetArticleActive(Guid id, [FromBody] SetArticleActiveRequest request, CancellationToken ct)
    {
        var result = await _newsService.SetArticleActiveAsync(id, request.IsActive, ct);
        return result.ToActionResult();
    }
}
