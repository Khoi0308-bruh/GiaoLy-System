using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ganss.Xss;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Application.LessonPlans.Contracts;
using GiaoLy.Application.LessonPlans.Dtos;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.LessonPlans;

public class LessonPlanService : ILessonPlanService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;
    private readonly HtmlSanitizer _htmlSanitizer;

    public LessonPlanService(
        AppDbContext context,
        ICurrentUser currentUser,
        IScopeContext scopeContext)
    {
        _context = context;
        _currentUser = currentUser;
        _scopeContext = scopeContext;

        _htmlSanitizer = new HtmlSanitizer();
        _htmlSanitizer.AllowedSchemes.Add("data");
        _htmlSanitizer.AllowedAttributes.Add("class");
        _htmlSanitizer.AllowedAttributes.Add("style");
    }

    private bool IsParishWide => _currentUser.ScopeType == "All" || _currentUser.IsInRole("Admin") || _currentUser.IsInRole("BanQuanTri");

    public async Task<Result<List<LessonPlanDto>>> GetLessonPlansAsync(
        Guid? classRoomId,
        int? branchId,
        string? visibility,
        CancellationToken ct = default)
    {
        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var query = _context.LessonPlans
            .AsNoTracking()
            .Include(l => l.AuthorUser)
            .Include(l => l.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .AsQueryable();

        if (classRoomId.HasValue)
        {
            query = query.Where(l => l.ClassRoomId == classRoomId.Value);
        }

        if (branchId.HasValue)
        {
            query = query.Where(l => l.ClassRoom != null && l.ClassRoom.ClassLevel != null && l.ClassRoom.ClassLevel.BranchId == branchId.Value);
        }

        if (!string.IsNullOrWhiteSpace(visibility))
        {
            query = query.Where(l => l.Visibility == visibility);
        }

        var allPlans = await query
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync(ct);

        var userAssignedClassRoomIds = new HashSet<Guid>();
        if (!IsParishWide)
        {
            var userClasses = await _scopeContext.ClassRooms(_context.ClassRooms).Select(c => c.Id).ToListAsync(ct);
            userAssignedClassRoomIds = new HashSet<Guid>(userClasses);
        }

        var userAssignedBranchIds = new HashSet<int>();
        if (_currentUser.BranchId.HasValue)
        {
            userAssignedBranchIds.Add(_currentUser.BranchId.Value);
        }

        // Filter by visibility rules
        var accessiblePlans = allPlans.Where(l =>
        {
            var planBranchId = l.ClassRoom?.ClassLevel?.BranchId;
            return LessonPlanRules.CanView(
                l.Visibility,
                l.AuthorUserId,
                currentUserId,
                l.ClassRoomId,
                userAssignedClassRoomIds,
                planBranchId,
                userAssignedBranchIds,
                IsParishWide);
        }).ToList();

        var dtos = accessiblePlans.Select(l => new LessonPlanDto
        {
            Id = l.Id,
            AuthorUserId = l.AuthorUserId,
            AuthorFullName = l.AuthorUser?.FullName ?? string.Empty,
            ClassRoomId = l.ClassRoomId,
            ClassRoomName = l.ClassRoom?.ClassName,
            Title = l.Title,
            Tags = l.Tags,
            Visibility = l.Visibility,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt,
            RowVersion = l.RowVersion
        }).ToList();

        return Result.Ok(dtos);
    }

    public async Task<Result<LessonPlanDetailDto>> GetLessonPlanByIdAsync(Guid id, CancellationToken ct = default)
    {
        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var l = await _context.LessonPlans
            .AsNoTracking()
            .Include(x => x.AuthorUser)
            .Include(x => x.ClassRoom)
                .ThenInclude(c => c!.ClassLevel)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (l == null)
            return Result.NotFound<LessonPlanDetailDto>("Không tìm thấy giáo án");

        var userAssignedClassRoomIds = new HashSet<Guid>();
        if (!IsParishWide)
        {
            var userClasses = await _scopeContext.ClassRooms(_context.ClassRooms).Select(c => c.Id).ToListAsync(ct);
            userAssignedClassRoomIds = new HashSet<Guid>(userClasses);
        }

        var userAssignedBranchIds = new HashSet<int>();
        if (_currentUser.BranchId.HasValue)
        {
            userAssignedBranchIds.Add(_currentUser.BranchId.Value);
        }

        var planBranchId = l.ClassRoom?.ClassLevel?.BranchId;
        var canView = LessonPlanRules.CanView(
            l.Visibility,
            l.AuthorUserId,
            currentUserId,
            l.ClassRoomId,
            userAssignedClassRoomIds,
            planBranchId,
            userAssignedBranchIds,
            IsParishWide);

        if (!canView)
            return Result.Forbidden<LessonPlanDetailDto>("Bạn không có quyền xem giáo án này");

        var dto = new LessonPlanDetailDto
        {
            Id = l.Id,
            AuthorUserId = l.AuthorUserId,
            AuthorFullName = l.AuthorUser?.FullName ?? string.Empty,
            ClassRoomId = l.ClassRoomId,
            ClassRoomName = l.ClassRoom?.ClassName,
            Title = l.Title,
            ContentHtml = l.ContentHtml,
            Tags = l.Tags,
            Visibility = l.Visibility,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt,
            RowVersion = l.RowVersion
        };

        return Result.Ok(dto);
    }

    public async Task<Result<LessonPlanDetailDto>> CreateLessonPlanAsync(CreateLessonPlanRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, "Tiêu đề giáo án không được để trống");

        if (string.IsNullOrWhiteSpace(request.ContentHtml))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, "Nội dung giáo án không được để trống");

        var visibility = string.IsNullOrWhiteSpace(request.Visibility) ? LessonPlanRules.VisibilityClass : request.Visibility.Trim();
        if (!LessonPlanRules.IsValidVisibility(visibility))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, $"Phạm vi hiển thị '{visibility}' không hợp lệ. Cho phép: Private, Class, Branch, All");

        if (request.ClassRoomId.HasValue)
        {
            var canAccess = await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId.Value, ct);
            if (!canAccess)
                return Result.Forbidden<LessonPlanDetailDto>("Bạn không có quyền tạo giáo án cho lớp học này");
        }

        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        // XSS sanitization
        var sanitizedHtml = _htmlSanitizer.Sanitize(request.ContentHtml.Trim());

        var lessonPlan = new LessonPlan
        {
            Id = Guid.NewGuid(),
            AuthorUserId = currentUserId,
            ClassRoomId = request.ClassRoomId,
            Title = request.Title.Trim(),
            ContentHtml = sanitizedHtml,
            Tags = request.Tags?.Trim(),
            Visibility = visibility,
            CreatedAt = DateTime.UtcNow
        };

        _context.LessonPlans.Add(lessonPlan);
        await _context.SaveChangesAsync(ct);

        return await GetLessonPlanByIdAsync(lessonPlan.Id, ct);
    }

    public async Task<Result<LessonPlanDetailDto>> UpdateLessonPlanAsync(Guid id, UpdateLessonPlanRequest request, CancellationToken ct = default)
    {
        var currentUserId = _currentUser.UserId ?? Guid.Empty;
        var hasManageAll = _currentUser.HasPermission(Permissions.LessonPlans.ManageAll);

        var l = await _context.LessonPlans.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (l == null)
            return Result.NotFound<LessonPlanDetailDto>("Không tìm thấy giáo án");

        if (!LessonPlanRules.CanModify(l.AuthorUserId, currentUserId, hasManageAll))
            return Result.Forbidden<LessonPlanDetailDto>("Bạn chỉ có quyền sửa giáo án của chính mình trừ khi có quyền quản lý toàn bộ");

        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, "Tiêu đề giáo án không được để trống");

        if (string.IsNullOrWhiteSpace(request.ContentHtml))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, "Nội dung giáo án không được để trống");

        var visibility = string.IsNullOrWhiteSpace(request.Visibility) ? LessonPlanRules.VisibilityClass : request.Visibility.Trim();
        if (!LessonPlanRules.IsValidVisibility(visibility))
            return Result.BadRequest<LessonPlanDetailDto>(ErrorCodes.ValidationFailed, $"Phạm vi hiển thị '{visibility}' không hợp lệ");

        if (request.ClassRoomId.HasValue)
        {
            var canAccess = await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId.Value, ct);
            if (!canAccess)
                return Result.Forbidden<LessonPlanDetailDto>("Bạn không có quyền chuyển giáo án sang lớp học này");
        }

        // Optimistic concurrency check
        if (request.RowVersion != null && l.RowVersion != null && !request.RowVersion.SequenceEqual(l.RowVersion))
        {
            return Result.Failure<LessonPlanDetailDto>(409, ErrorCodes.ConflictVersion, "Giáo án đã được người khác chỉnh sửa. Vui lòng tải lại trang.");
        }

        // XSS sanitization
        var sanitizedHtml = _htmlSanitizer.Sanitize(request.ContentHtml.Trim());

        l.Title = request.Title.Trim();
        l.ContentHtml = sanitizedHtml;
        l.ClassRoomId = request.ClassRoomId;
        l.Tags = request.Tags?.Trim();
        l.Visibility = visibility;
        l.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync(ct);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Result.Failure<LessonPlanDetailDto>(409, ErrorCodes.ConflictVersion, "Giáo án đã được người khác chỉnh sửa đồng thời. Vui lòng thử lại.");
        }

        return await GetLessonPlanByIdAsync(l.Id, ct);
    }

    public async Task<Result<bool>> DeleteLessonPlanAsync(Guid id, CancellationToken ct = default)
    {
        var currentUserId = _currentUser.UserId ?? Guid.Empty;
        var hasManageAll = _currentUser.HasPermission(Permissions.LessonPlans.ManageAll);

        var l = await _context.LessonPlans.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (l == null)
            return Result.NotFound<bool>("Không tìm thấy giáo án");

        if (!LessonPlanRules.CanModify(l.AuthorUserId, currentUserId, hasManageAll))
            return Result.Forbidden<bool>("Bạn chỉ có thể xóa giáo án của chính mình");

        l.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok(true);
    }
}
