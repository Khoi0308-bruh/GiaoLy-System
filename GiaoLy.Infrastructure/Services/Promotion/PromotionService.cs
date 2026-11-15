using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Paging;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.Promotion.Contracts;
using GiaoLy.Application.Promotion.Dtos;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Promotion;

public class PromotionService : IPromotionService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;

    public PromotionService(AppDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Result<IReadOnlyList<PromotionBatchSummaryDto>>> GetBatchesAsync(CancellationToken ct = default)
    {
        var batches = await _context.PromotionBatches.AsNoTracking()
            .Include(b => b.SourceYear)
            .Include(b => b.TargetYear)
            .Include(b => b.Creator)
            .Include(b => b.Applier)
            .Include(b => b.Drafts)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(ct);

        var dtos = batches.Select(MapToSummaryDto).ToList();
        return Result.Ok<IReadOnlyList<PromotionBatchSummaryDto>>(dtos);
    }

    public async Task<Result<PromotionBatchDetailDto>> GetBatchByIdAsync(Guid id, CancellationToken ct = default)
    {
        var batch = await _context.PromotionBatches.AsNoTracking()
            .Include(b => b.SourceYear)
            .Include(b => b.TargetYear)
            .Include(b => b.Creator)
            .Include(b => b.Applier)
            .Include(b => b.Drafts)
            .FirstOrDefaultAsync(b => b.Id == id, ct);

        if (batch == null)
        {
            return Result.NotFound<PromotionBatchDetailDto>("Không tìm thấy đợt xét lên lớp.");
        }

        return Result.Ok(MapToDetailDto(batch));
    }

    public async Task<Result<PromotionBatchDetailDto>> CreateOrGetBatchAsync(
        CreatePromotionBatchRequest request,
        CancellationToken ct = default)
    {
        if (request.SourceYearId == request.TargetYearId)
        {
            return Result.BadRequest<PromotionBatchDetailDto>("Niên khóa nguồn và niên khóa đích không được trùng nhau.");
        }

        var sourceYear = await _context.AcademicYears.FirstOrDefaultAsync(y => y.Id == request.SourceYearId, ct);
        if (sourceYear == null)
        {
            return Result.NotFound<PromotionBatchDetailDto>("Không tìm thấy niên khóa nguồn.");
        }

        if (!string.Equals(sourceYear.Status, AcademicYearStateMachine.StatusClosing, StringComparison.OrdinalIgnoreCase))
        {
            return Result.BadRequest<PromotionBatchDetailDto>(
                $"Niên khóa nguồn phải ở trạng thái Khóa sổ (Closing) để tạo đợt xét lên lớp. Hiện tại là '{sourceYear.Status}'.");
        }

        var targetYear = await _context.AcademicYears.FirstOrDefaultAsync(y => y.Id == request.TargetYearId, ct);
        if (targetYear == null)
        {
            return Result.NotFound<PromotionBatchDetailDto>("Không tìm thấy niên khóa đích.");
        }

        if (string.Equals(targetYear.Status, AcademicYearStateMachine.StatusArchived, StringComparison.OrdinalIgnoreCase))
        {
            return Result.BadRequest<PromotionBatchDetailDto>("Niên khóa đích đã lưu trữ (Archived), không thể chuyển lên.");
        }

        // Kiểm tra xem đã có đợt đang mở giữa cặp niên khóa này hay chưa (Mục 6.7: Tạo lại trả về đợt đang mở)
        var existingOpenBatch = await _context.PromotionBatches
            .Include(b => b.SourceYear)
            .Include(b => b.TargetYear)
            .Include(b => b.Creator)
            .Include(b => b.Applier)
            .Include(b => b.Drafts)
            .FirstOrDefaultAsync(b => b.SourceYearId == request.SourceYearId
                                   && b.TargetYearId == request.TargetYearId
                                   && b.Status != PromotionRules.BatchStatuses.Applied
                                   && b.Status != PromotionRules.BatchStatuses.Cancelled, ct);

        if (existingOpenBatch != null)
        {
            return Result.Ok(MapToDetailDto(existingOpenBatch));
        }

        // Tạo đợt mới
        var batch = new PromotionBatch
        {
            Id = Guid.NewGuid(),
            SourceYearId = request.SourceYearId,
            TargetYearId = request.TargetYearId,
            Status = PromotionRules.BatchStatuses.Draft,
            CreatedBy = _currentUser.UserId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow
        };

        // Lấy tất cả ghi danh Active của niên khóa nguồn
        var sourceEnrollments = await _context.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .Include(e => e.Grade)
            .Where(e => e.AcademicYearId == request.SourceYearId && e.Status == EnrollmentRules.Statuses.Active)
            .ToListAsync(ct);

        // Lấy cấu hình các cấp lớp
        var classLevels = await _context.ClassLevels.AsNoTracking()
            .Include(l => l.NextLevel)
            .ToDictionaryAsync(l => l.Id, ct);

        // Lấy danh sách lớp học ở niên khóa đích
        var targetClassRooms = await _context.ClassRooms.AsNoTracking()
            .Include(c => c.ClassLevel)
            .Where(c => c.AcademicYearId == request.TargetYearId && c.DeletedAt == null)
            .ToListAsync(ct);

        var drafts = new List<PromotionDraft>();

        foreach (var enrollment in sourceEnrollments)
        {
            var student = enrollment.Student;
            var currentClass = enrollment.ClassRoom;
            var currentLevel = currentClass != null && classLevels.TryGetValue(currentClass.ClassLevelId, out var lvl) ? lvl : null;

            var grade = enrollment.Grade;
            decimal? gpa = grade?.ComputedGpa;
            decimal? attRate = grade != null ? GradeRules.CalculateAttendanceRate(grade.TotalSessions, grade.Absences) : null;
            string gradeStatus = grade?.ComputedStatus ?? "Incomplete";

            string outcome = PromotionRules.Outcomes.Manual;
            Guid? suggestedClassId = null;
            string? reason = null;

            if (currentLevel != null)
            {
                if (gradeStatus == "Qualified")
                {
                    if (currentLevel.NextLevelId.HasValue)
                    {
                        outcome = PromotionRules.Outcomes.Promote;
                        var nextLevelId = currentLevel.NextLevelId.Value;

                        // Tìm lớp ở niên khóa đích: ưu tiên cùng phân lớp (Section)
                        var matchedClasses = targetClassRooms
                            .Where(c => c.ClassLevelId == nextLevelId)
                            .ToList();

                        var sameSection = matchedClasses
                            .FirstOrDefault(c => string.Equals(c.Section, currentClass?.Section, StringComparison.OrdinalIgnoreCase));

                        if (sameSection != null)
                        {
                            suggestedClassId = sameSection.Id;
                        }
                        else if (matchedClasses.Count == 1)
                        {
                            suggestedClassId = matchedClasses[0].Id;
                        }
                        else if (matchedClasses.Count == 0)
                        {
                            outcome = PromotionRules.Outcomes.Manual;
                            reason = $"Chưa có lớp học thuộc cấp '{currentLevel.NextLevel?.Name}' ở niên khóa đích";
                        }
                        else
                        {
                            outcome = PromotionRules.Outcomes.Manual;
                            reason = $"Có {matchedClasses.Count} phân lớp thuộc cấp '{currentLevel.NextLevel?.Name}', cần chọn lớp thủ công";
                        }
                    }
                    else
                    {
                        // Cấp cuối cùng -> Tốt nghiệp
                        outcome = PromotionRules.Outcomes.Graduate;
                        suggestedClassId = null;
                    }
                }
                else if (gradeStatus == "NotQualified")
                {
                    outcome = PromotionRules.Outcomes.Repeat;
                    var sameLevelClasses = targetClassRooms
                        .Where(c => c.ClassLevelId == currentLevel.Id)
                        .ToList();

                    var sameSection = sameLevelClasses
                        .FirstOrDefault(c => string.Equals(c.Section, currentClass?.Section, StringComparison.OrdinalIgnoreCase));

                    if (sameSection != null)
                    {
                        suggestedClassId = sameSection.Id;
                    }
                    else if (sameLevelClasses.Count == 1)
                    {
                        suggestedClassId = sameLevelClasses[0].Id;
                    }
                    else
                    {
                        suggestedClassId = null;
                        reason = "Ở lại lớp: cần chọn phân lớp học lại thủ công";
                    }
                }
                else
                {
                    // Incomplete -> Manual, không tự động cho học lại (Mục 6.7)
                    outcome = PromotionRules.Outcomes.Manual;
                    suggestedClassId = null;
                    reason = "Chưa đủ dữ liệu điểm tổng kết, không tự động cho học lại";
                }
            }
            else
            {
                outcome = PromotionRules.Outcomes.Manual;
                reason = "Không xác định được cấp lớp hiện tại của đoàn sinh";
            }

            var snapshot = PromotionRules.SerializeSnapshot(gpa, attRate, gradeStatus, grade?.RowVersion);

            var draft = new PromotionDraft
            {
                Id = Guid.NewGuid(),
                BatchId = batch.Id,
                StudentId = enrollment.StudentId,
                FromEnrollmentId = enrollment.Id,
                Outcome = outcome,
                SuggestedClassRoomId = suggestedClassId,
                GradeSnapshot = snapshot,
                Reason = reason,
                Status = PromotionRules.DraftStatuses.Pending,
                CreatedAt = DateTime.UtcNow
            };

            drafts.Add(draft);
        }

        await _context.PromotionBatches.AddAsync(batch, ct);
        await _context.PromotionDrafts.AddRangeAsync(drafts, ct);
        await _context.SaveChangesAsync(ct);

        return await GetBatchByIdAsync(batch.Id, ct);
    }

    public async Task<Result<PagedList<PromotionDraftDto>>> GetBatchDraftsAsync(
        Guid batchId,
        PromotionDraftFilterRequest request,
        CancellationToken ct = default)
    {
        var batchExists = await _context.PromotionBatches.AnyAsync(b => b.Id == batchId, ct);
        if (!batchExists)
        {
            return Result.NotFound<PagedList<PromotionDraftDto>>("Không tìm thấy đợt xét lên lớp.");
        }

        var query = _context.PromotionDrafts.AsNoTracking()
            .Include(d => d.Student)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.Grade)
            .Include(d => d.SuggestedClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .Include(d => d.Decider)
            .Where(d => d.BatchId == batchId);

        if (request.ClassRoomId.HasValue)
        {
            query = query.Where(d => d.FromEnrollment != null && d.FromEnrollment.ClassRoomId == request.ClassRoomId.Value);
        }

        if (request.BranchId.HasValue)
        {
            query = query.Where(d => d.Student != null && d.Student.BranchId == request.BranchId.Value);
        }

        if (request.ClassLevelId.HasValue)
        {
            query = query.Where(d => d.FromEnrollment != null && d.FromEnrollment.ClassRoom != null && d.FromEnrollment.ClassRoom.ClassLevelId == request.ClassLevelId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            query = query.Where(d => d.Status == request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.Outcome))
        {
            query = query.Where(d => d.Outcome == request.Outcome);
        }

        query = query.OrderBy(d => d.Student != null ? d.Student.FullName : string.Empty);

        var totalCount = await query.CountAsync(ct);
        var page = request.PageNumber < 1 ? 1 : request.PageNumber;
        var pageSize = request.PageSize < 1 ? 50 : (request.PageSize > 200 ? 200 : request.PageSize);

        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        var dtos = items.Select(MapDraftToDto).ToList();
        var pagedList = new PagedList<PromotionDraftDto>(dtos, totalCount, page, pageSize);

        return Result.Ok(pagedList);
    }

    public async Task<Result<PromotionDraftDto>> ApproveDraftAsync(Guid draftId, CancellationToken ct = default)
    {
        var draft = await _context.PromotionDrafts
            .Include(d => d.Batch)
            .Include(d => d.Student)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.Grade)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .Include(d => d.SuggestedClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .FirstOrDefaultAsync(d => d.Id == draftId, ct);

        if (draft == null)
        {
            return Result.NotFound<PromotionDraftDto>("Không tìm thấy đề xuất lên lớp.");
        }

        if (draft.Batch?.Status == PromotionRules.BatchStatuses.Applied || draft.Batch?.Status == PromotionRules.BatchStatuses.Cancelled)
        {
            return Result.BadRequest<PromotionDraftDto>("Đợt xét đã kết thúc hoặc bị hủy, không thể duyệt.");
        }

        // Kiểm tra Stale (Mục 6.7 & F5)
        var currentGrade = draft.FromEnrollment?.Grade;
        var isStale = PromotionRules.IsStale(draft.GradeSnapshot, currentGrade?.RowVersion);
        if (isStale)
        {
            draft.Status = PromotionRules.DraftStatuses.Stale;
            draft.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);

            return Result.Failure<PromotionDraftDto>(
                409,
                ErrorCodes.PromotionStale,
                "Dữ liệu điểm của đoàn sinh đã thay đổi sau khi tạo bản nháp. Đề xuất đã chuyển sang trạng thái Stale, vui lòng rà soát lại.");
        }

        // Đối với Promote hoặc Repeat thì bắt buộc phải có SuggestedClassRoomId
        if (draft.Outcome == PromotionRules.Outcomes.Promote || draft.Outcome == PromotionRules.Outcomes.Repeat)
        {
            if (!draft.SuggestedClassRoomId.HasValue)
            {
                return Result.Failure<PromotionDraftDto>(
                    400,
                    ErrorCodes.PromotionNoTarget,
                    "Chưa chọn lớp học đích cho đề xuất lên lớp/học lại. Vui lòng gán lớp trước khi duyệt.");
            }
        }

        draft.Status = PromotionRules.DraftStatuses.Approved;
        draft.DecidedBy = _currentUser.UserId;
        draft.DecidedAt = DateTime.UtcNow;
        draft.UpdatedAt = DateTime.UtcNow;

        if (draft.Batch != null && draft.Batch.Status == PromotionRules.BatchStatuses.Draft)
        {
            draft.Batch.Status = PromotionRules.BatchStatuses.InReview;
            draft.Batch.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapDraftToDto(draft));
    }

    public async Task<Result<PromotionDraftDto>> RejectDraftAsync(Guid draftId, RejectDraftRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request?.Reason))
        {
            return Result.BadRequest<PromotionDraftDto>("Lý do từ chối không được để trống.");
        }

        var draft = await _context.PromotionDrafts
            .Include(d => d.Batch)
            .Include(d => d.Student)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.Grade)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .Include(d => d.SuggestedClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .FirstOrDefaultAsync(d => d.Id == draftId, ct);

        if (draft == null)
        {
            return Result.NotFound<PromotionDraftDto>("Không tìm thấy đề xuất lên lớp.");
        }

        // Quy tắc F5: Từ chối chỉ khi Pending
        if (draft.Status != PromotionRules.DraftStatuses.Pending)
        {
            return Result.BadRequest<PromotionDraftDto>(
                $"Chỉ có thể từ chối đề xuất đang ở trạng thái Pending. Hiện tại là '{draft.Status}'.");
        }

        draft.Status = PromotionRules.DraftStatuses.Rejected;
        draft.Reason = string.IsNullOrWhiteSpace(draft.Reason)
            ? $"Từ chối: {request.Reason.Trim()}"
            : $"{draft.Reason} | Từ chối: {request.Reason.Trim()}";
        draft.DecidedBy = _currentUser.UserId;
        draft.DecidedAt = DateTime.UtcNow;
        draft.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapDraftToDto(draft));
    }

    public async Task<Result<PromotionDraftDto>> UpdateDraftTargetClassAsync(
        Guid draftId,
        UpdateDraftTargetClassRequest request,
        CancellationToken ct = default)
    {
        var draft = await _context.PromotionDrafts
            .Include(d => d.Batch)
            .Include(d => d.Student)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.Grade)
            .Include(d => d.FromEnrollment)
                .ThenInclude(e => e!.ClassRoom)
                    .ThenInclude(c => c!.ClassLevel)
            .FirstOrDefaultAsync(d => d.Id == draftId, ct);

        if (draft == null)
        {
            return Result.NotFound<PromotionDraftDto>("Không tìm thấy đề xuất lên lớp.");
        }

        if (draft.Status == PromotionRules.DraftStatuses.Applied)
        {
            return Result.BadRequest<PromotionDraftDto>("Đề xuất đã áp dụng, không thể thay đổi lớp đích.");
        }

        var targetClass = await _context.ClassRooms
            .Include(c => c.ClassLevel)
            .FirstOrDefaultAsync(c => c.Id == request.TargetClassRoomId, ct);

        if (targetClass == null)
        {
            return Result.NotFound<PromotionDraftDto>("Lớp học đích không tồn tại.");
        }

        if (draft.Batch != null && targetClass.AcademicYearId != draft.Batch.TargetYearId)
        {
            return Result.BadRequest<PromotionDraftDto>("Lớp học đích phải thuộc niên khóa đích của đợt xét.");
        }

        draft.SuggestedClassRoomId = request.TargetClassRoomId;
        draft.SuggestedClassRoom = targetClass;
        draft.UpdatedAt = DateTime.UtcNow;

        // Nếu trước đó là Manual do thiếu lớp, khi đã gán lớp thì có thể chuyển thành Promote hoặc Repeat tùy cấp
        if (draft.Outcome == PromotionRules.Outcomes.Manual)
        {
            var snapshot = PromotionRules.DeserializeSnapshot(draft.GradeSnapshot);
            if (snapshot?.Status == "Qualified")
            {
                draft.Outcome = PromotionRules.Outcomes.Promote;
            }
            else if (snapshot?.Status == "NotQualified")
            {
                draft.Outcome = PromotionRules.Outcomes.Repeat;
            }
        }

        await _context.SaveChangesAsync(ct);

        return Result.Ok(MapDraftToDto(draft));
    }

    public async Task<Result<int>> ApproveQualifiedDraftsAsync(Guid batchId, CancellationToken ct = default)
    {
        var batch = await _context.PromotionBatches
            .Include(b => b.Drafts)
                .ThenInclude(d => d.FromEnrollment)
                    .ThenInclude(e => e!.Grade)
            .FirstOrDefaultAsync(b => b.Id == batchId, ct);

        if (batch == null)
        {
            return Result.NotFound<int>("Không tìm thấy đợt xét lên lớp.");
        }

        if (batch.Status == PromotionRules.BatchStatuses.Applied || batch.Status == PromotionRules.BatchStatuses.Cancelled)
        {
            return Result.BadRequest<int>("Đợt xét đã kết thúc hoặc bị hủy.");
        }

        var candidates = batch.Drafts
            .Where(d => d.Status == PromotionRules.DraftStatuses.Pending)
            .ToList();

        int approvedCount = 0;
        var now = DateTime.UtcNow;

        foreach (var draft in candidates)
        {
            // Kiểm tra Stale
            var isStale = PromotionRules.IsStale(draft.GradeSnapshot, draft.FromEnrollment?.Grade?.RowVersion);
            if (isStale)
            {
                draft.Status = PromotionRules.DraftStatuses.Stale;
                draft.UpdatedAt = now;
                continue;
            }

            // Đủ điều kiện duyệt:
            // 1. Promote hoặc Repeat: BẮT BUỘC có SuggestedClassRoomId
            // 2. Graduate: không cần SuggestedClassRoomId
            bool canApprove = false;
            if (draft.Outcome == PromotionRules.Outcomes.Graduate)
            {
                canApprove = true;
            }
            else if ((draft.Outcome == PromotionRules.Outcomes.Promote || draft.Outcome == PromotionRules.Outcomes.Repeat)
                  && draft.SuggestedClassRoomId.HasValue)
            {
                canApprove = true;
            }

            if (canApprove)
            {
                draft.Status = PromotionRules.DraftStatuses.Approved;
                draft.DecidedBy = _currentUser.UserId;
                draft.DecidedAt = now;
                draft.UpdatedAt = now;
                approvedCount++;
            }
        }

        if (approvedCount > 0 && batch.Status == PromotionRules.BatchStatuses.Draft)
        {
            batch.Status = PromotionRules.BatchStatuses.InReview;
            batch.UpdatedAt = now;
        }

        await _context.SaveChangesAsync(ct);

        return Result.Ok(approvedCount);
    }

    public async Task<Result<PromotionBatchDetailDto>> ApplyBatchAsync(
        Guid batchId,
        ApplyPromotionBatchRequest request,
        CancellationToken ct = default)
    {
        var batch = await _context.PromotionBatches
            .Include(b => b.SourceYear)
            .Include(b => b.TargetYear)
            .Include(b => b.Drafts)
                .ThenInclude(d => d.Student)
            .Include(b => b.Drafts)
                .ThenInclude(d => d.FromEnrollment)
            .Include(b => b.Drafts)
                .ThenInclude(d => d.SuggestedClassRoom)
            .FirstOrDefaultAsync(b => b.Id == batchId, ct);

        if (batch == null)
        {
            return Result.NotFound<PromotionBatchDetailDto>("Không tìm thấy đợt xét lên lớp.");
        }

        if (batch.Status == PromotionRules.BatchStatuses.Applied)
        {
            return Result.BadRequest<PromotionBatchDetailDto>("Đợt xét này đã được áp dụng trước đó.");
        }

        if (batch.Status == PromotionRules.BatchStatuses.Cancelled)
        {
            return Result.BadRequest<PromotionBatchDetailDto>("Đợt xét đã bị hủy, không thể áp dụng.");
        }

        var unapprovedDrafts = batch.Drafts
            .Where(d => d.Status == PromotionRules.DraftStatuses.Pending || d.Status == PromotionRules.DraftStatuses.Stale)
            .ToList();

        if (unapprovedDrafts.Any() && !request.SkipPending)
        {
            return Result.BadRequest<PromotionBatchDetailDto>(
                $"Còn {unapprovedDrafts.Count} đề xuất chưa được xử lý (Pending/Stale). Vui lòng duyệt hoặc từ chối hết, hoặc chọn bỏ qua để áp dụng cho các em đã được duyệt.");
        }

        var approvedDrafts = batch.Drafts
            .Where(d => d.Status == PromotionRules.DraftStatuses.Approved)
            .ToList();

        if (!approvedDrafts.Any())
        {
            return Result.BadRequest<PromotionBatchDetailDto>("Không có đề xuất nào ở trạng thái Approved để áp dụng.");
        }

        var targetStartDate = batch.TargetYear?.StartDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var sourceEndDate = batch.SourceYear?.EndDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        // Chạy trong Transaction duy nhất (Mục 6.7)
        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        var newEnrollments = new List<Enrollment>();

        foreach (var draft in approvedDrafts)
        {
            // 1. Cập nhật ghi danh cũ
            if (draft.FromEnrollment != null)
            {
                draft.FromEnrollment.Status = draft.Outcome switch
                {
                    PromotionRules.Outcomes.Promote => EnrollmentRules.Statuses.Promoted,
                    PromotionRules.Outcomes.Repeat => EnrollmentRules.Statuses.Repeated,
                    PromotionRules.Outcomes.Graduate => EnrollmentRules.Statuses.Graduated,
                    _ => draft.FromEnrollment.Status
                };
                draft.FromEnrollment.EndDate = sourceEndDate;
                draft.FromEnrollment.UpdatedAt = DateTime.UtcNow;
            }

            // 2. Xử lý Tốt nghiệp
            if (draft.Outcome == PromotionRules.Outcomes.Graduate)
            {
                if (draft.Student != null)
                {
                    draft.Student.Status = "Graduated";
                    draft.Student.UpdatedAt = DateTime.UtcNow;
                }
            }
            // 3. Xử lý Lên lớp hoặc Học lại
            else if (draft.Outcome == PromotionRules.Outcomes.Promote || draft.Outcome == PromotionRules.Outcomes.Repeat)
            {
                if (draft.SuggestedClassRoomId.HasValue)
                {
                    var newEnrollment = new Enrollment
                    {
                        Id = Guid.NewGuid(),
                        StudentId = draft.StudentId,
                        ClassRoomId = draft.SuggestedClassRoomId.Value,
                        AcademicYearId = batch.TargetYearId,
                        Status = EnrollmentRules.Statuses.Active,
                        StartDate = targetStartDate,
                        Note = $"Xét lên lớp ({draft.Outcome}): {batch.SourceYear?.Name} -> {batch.TargetYear?.Name}",
                        CreatedAt = DateTime.UtcNow
                    };

                    newEnrollments.Add(newEnrollment);
                    draft.AppliedEnrollmentId = newEnrollment.Id;
                }
            }

            draft.Status = PromotionRules.DraftStatuses.Applied;
            draft.UpdatedAt = DateTime.UtcNow;
        }

        if (newEnrollments.Any())
        {
            await _context.Enrollments.AddRangeAsync(newEnrollments, ct);
        }

        batch.Status = PromotionRules.BatchStatuses.Applied;
        batch.AppliedAt = DateTime.UtcNow;
        batch.AppliedBy = _currentUser.UserId;
        batch.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);

        return await GetBatchByIdAsync(batch.Id, ct);
    }

    public async Task<Result> CancelBatchAsync(Guid batchId, CancellationToken ct = default)
    {
        var batch = await _context.PromotionBatches.FirstOrDefaultAsync(b => b.Id == batchId, ct);
        if (batch == null)
        {
            return Result.NotFound("Không tìm thấy đợt xét lên lớp.");
        }

        if (batch.Status == PromotionRules.BatchStatuses.Applied)
        {
            return Result.BadRequest("Đợt xét đã áp dụng, không thể hủy.");
        }

        batch.Status = PromotionRules.BatchStatuses.Cancelled;
        batch.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok();
    }

    private static PromotionBatchSummaryDto MapToSummaryDto(PromotionBatch b)
    {
        var drafts = b.Drafts ?? Array.Empty<PromotionDraft>();
        return new PromotionBatchSummaryDto
        {
            Id = b.Id,
            SourceYearId = b.SourceYearId,
            SourceYearName = b.SourceYear?.Name ?? string.Empty,
            TargetYearId = b.TargetYearId,
            TargetYearName = b.TargetYear?.Name ?? string.Empty,
            Status = b.Status,
            CreatedBy = b.CreatedBy,
            CreatorName = b.Creator?.FullName ?? b.Creator?.Username,
            CreatedAt = b.CreatedAt,
            AppliedAt = b.AppliedAt,
            ApplierName = b.Applier?.FullName ?? b.Applier?.Username,
            TotalStudents = drafts.Count,
            PendingCount = drafts.Count(d => d.Status == PromotionRules.DraftStatuses.Pending),
            ApprovedCount = drafts.Count(d => d.Status == PromotionRules.DraftStatuses.Approved),
            RejectedCount = drafts.Count(d => d.Status == PromotionRules.DraftStatuses.Rejected),
            StaleCount = drafts.Count(d => d.Status == PromotionRules.DraftStatuses.Stale),
            AppliedCount = drafts.Count(d => d.Status == PromotionRules.DraftStatuses.Applied),
            RowVersion = b.RowVersion != null ? Convert.ToBase64String(b.RowVersion) : string.Empty
        };
    }

    private static PromotionBatchDetailDto MapToDetailDto(PromotionBatch b)
    {
        var summary = MapToSummaryDto(b);
        var drafts = b.Drafts ?? Array.Empty<PromotionDraft>();

        var breakdown = drafts
            .GroupBy(d => d.Outcome)
            .ToDictionary(g => g.Key, g => g.Count());

        return new PromotionBatchDetailDto
        {
            Id = summary.Id,
            SourceYearId = summary.SourceYearId,
            SourceYearName = summary.SourceYearName,
            TargetYearId = summary.TargetYearId,
            TargetYearName = summary.TargetYearName,
            Status = summary.Status,
            CreatedBy = summary.CreatedBy,
            CreatorName = summary.CreatorName,
            CreatedAt = summary.CreatedAt,
            AppliedAt = summary.AppliedAt,
            ApplierName = summary.ApplierName,
            TotalStudents = summary.TotalStudents,
            PendingCount = summary.PendingCount,
            ApprovedCount = summary.ApprovedCount,
            RejectedCount = summary.RejectedCount,
            StaleCount = summary.StaleCount,
            AppliedCount = summary.AppliedCount,
            RowVersion = summary.RowVersion,
            OutcomeBreakdown = breakdown
        };
    }

    private static PromotionDraftDto MapDraftToDto(PromotionDraft d)
    {
        var snapshot = PromotionRules.DeserializeSnapshot(d.GradeSnapshot);
        var fromClass = d.FromEnrollment?.ClassRoom;
        var fromLevel = fromClass?.ClassLevel;
        var isStale = d.Status == PromotionRules.DraftStatuses.Stale ||
                      PromotionRules.IsStale(d.GradeSnapshot, d.FromEnrollment?.Grade?.RowVersion);

        return new PromotionDraftDto
        {
            Id = d.Id,
            BatchId = d.BatchId,
            StudentId = d.StudentId,
            StudentCode = d.Student?.Code ?? string.Empty,
            HolyName = d.Student?.HolyName,
            FullName = d.Student?.FullName ?? string.Empty,
            FromEnrollmentId = d.FromEnrollmentId,
            FromClassRoomId = fromClass?.Id ?? Guid.Empty,
            FromClassRoomName = fromClass?.ClassName ?? string.Empty,
            FromClassLevelId = fromLevel?.Id ?? 0,
            FromClassLevelName = fromLevel?.Name ?? string.Empty,
            Outcome = d.Outcome,
            SuggestedClassRoomId = d.SuggestedClassRoomId,
            SuggestedClassRoomName = d.SuggestedClassRoom?.ClassName,
            Gpa = snapshot?.Gpa,
            AttendanceRate = snapshot?.AttendanceRate,
            GradeStatus = snapshot?.Status,
            Reason = d.Reason,
            Status = d.Status,
            IsStale = isStale,
            DecidedByName = d.Decider?.FullName ?? d.Decider?.Username,
            DecidedAt = d.DecidedAt,
            AppliedEnrollmentId = d.AppliedEnrollmentId,
            RowVersion = d.RowVersion != null ? Convert.ToBase64String(d.RowVersion) : string.Empty
        };
    }
}
