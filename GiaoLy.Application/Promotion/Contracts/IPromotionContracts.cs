using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Promotion.Dtos;

namespace GiaoLy.Application.Promotion.Contracts;

public interface IPromotionService
{
    Task<Result<IReadOnlyList<PromotionBatchSummaryDto>>> GetBatchesAsync(CancellationToken ct = default);
    Task<Result<PromotionBatchDetailDto>> GetBatchByIdAsync(Guid id, CancellationToken ct = default);
    Task<Result<PromotionBatchDetailDto>> CreateOrGetBatchAsync(CreatePromotionBatchRequest request, CancellationToken ct = default);
    Task<Result<PagedList<PromotionDraftDto>>> GetBatchDraftsAsync(Guid batchId, PromotionDraftFilterRequest request, CancellationToken ct = default);
    Task<Result<PromotionDraftDto>> ApproveDraftAsync(Guid draftId, CancellationToken ct = default);
    Task<Result<PromotionDraftDto>> RejectDraftAsync(Guid draftId, RejectDraftRequest request, CancellationToken ct = default);
    Task<Result<PromotionDraftDto>> UpdateDraftTargetClassAsync(Guid draftId, UpdateDraftTargetClassRequest request, CancellationToken ct = default);
    Task<Result<int>> ApproveQualifiedDraftsAsync(Guid batchId, CancellationToken ct = default);
    Task<Result<PromotionBatchDetailDto>> ApplyBatchAsync(Guid batchId, ApplyPromotionBatchRequest request, CancellationToken ct = default);
    Task<Result> CancelBatchAsync(Guid batchId, CancellationToken ct = default);
}
