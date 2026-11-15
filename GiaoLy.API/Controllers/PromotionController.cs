using GiaoLy.API.Authorization;
using GiaoLy.API.Common;
using GiaoLy.Application.Promotion.Contracts;
using GiaoLy.Application.Promotion.Dtos;
using GiaoLy.Domain.Constants;
using Microsoft.AspNetCore.Mvc;

namespace GiaoLy.API.Controllers;

[ApiController]
public class PromotionController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet("api/v1/promotion-batches")]
    [HttpGet("api/promotion-batches")]
    [RequirePermission(Permissions.Promotion.View)]
    public async Task<IActionResult> GetBatches(CancellationToken ct)
    {
        var result = await _promotionService.GetBatchesAsync(ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-batches")]
    [HttpPost("api/promotion-batches")]
    [RequirePermission(Permissions.Promotion.Create)]
    public async Task<IActionResult> CreateOrGetBatch([FromBody] CreatePromotionBatchRequest request, CancellationToken ct)
    {
        var result = await _promotionService.CreateOrGetBatchAsync(request, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/promotion-batches/{id:guid}")]
    [HttpGet("api/promotion-batches/{id:guid}")]
    [RequirePermission(Permissions.Promotion.View)]
    public async Task<IActionResult> GetBatchById(Guid id, CancellationToken ct)
    {
        var result = await _promotionService.GetBatchByIdAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpGet("api/v1/promotion-batches/{id:guid}/drafts")]
    [HttpGet("api/promotion-batches/{id:guid}/drafts")]
    [RequirePermission(Permissions.Promotion.View)]
    public async Task<IActionResult> GetBatchDrafts(
        Guid id,
        [FromQuery] PromotionDraftFilterRequest request,
        CancellationToken ct)
    {
        var result = await _promotionService.GetBatchDraftsAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-drafts/{id:guid}/approve")]
    [HttpPost("api/promotion-drafts/{id:guid}/approve")]
    [RequirePermission(Permissions.Promotion.Decide)]
    public async Task<IActionResult> ApproveDraft(Guid id, CancellationToken ct)
    {
        var result = await _promotionService.ApproveDraftAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-drafts/{id:guid}/reject")]
    [HttpPost("api/promotion-drafts/{id:guid}/reject")]
    [RequirePermission(Permissions.Promotion.Decide)]
    public async Task<IActionResult> RejectDraft(
        Guid id,
        [FromBody] RejectDraftRequest request,
        CancellationToken ct)
    {
        var result = await _promotionService.RejectDraftAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPut("api/v1/promotion-drafts/{id:guid}/target-class")]
    [HttpPut("api/promotion-drafts/{id:guid}/target-class")]
    [RequirePermission(Permissions.Promotion.Decide)]
    public async Task<IActionResult> UpdateDraftTargetClass(
        Guid id,
        [FromBody] UpdateDraftTargetClassRequest request,
        CancellationToken ct)
    {
        var result = await _promotionService.UpdateDraftTargetClassAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-batches/{id:guid}/approve-qualified")]
    [HttpPost("api/promotion-batches/{id:guid}/approve-qualified")]
    [RequirePermission(Permissions.Promotion.Decide)]
    public async Task<IActionResult> ApproveQualifiedDrafts(Guid id, CancellationToken ct)
    {
        var result = await _promotionService.ApproveQualifiedDraftsAsync(id, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-batches/{id:guid}/apply")]
    [HttpPost("api/promotion-batches/{id:guid}/apply")]
    [RequirePermission(Permissions.Promotion.Apply)]
    public async Task<IActionResult> ApplyBatch(
        Guid id,
        [FromBody] ApplyPromotionBatchRequest request,
        CancellationToken ct)
    {
        var result = await _promotionService.ApplyBatchAsync(id, request, ct);
        return result.ToActionResult();
    }

    [HttpPost("api/v1/promotion-batches/{id:guid}/cancel")]
    [HttpPost("api/promotion-batches/{id:guid}/cancel")]
    [RequirePermission(Permissions.Promotion.Create)]
    public async Task<IActionResult> CancelBatch(Guid id, CancellationToken ct)
    {
        var result = await _promotionService.CancelBatchAsync(id, ct);
        return result.ToActionResult();
    }
}
