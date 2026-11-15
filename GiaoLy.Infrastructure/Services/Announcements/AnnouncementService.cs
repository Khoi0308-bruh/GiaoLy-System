using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Ganss.Xss;
using GiaoLy.Application.Announcements.Contracts;
using GiaoLy.Application.Announcements.Dtos;
using GiaoLy.Application.Common.Errors;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Common.Results;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Infrastructure.Services.Announcements;

public class AnnouncementService : IAnnouncementService
{
    private readonly AppDbContext _context;
    private readonly ICurrentUser _currentUser;
    private readonly IScopeContext _scopeContext;
    private readonly HtmlSanitizer _htmlSanitizer;

    public AnnouncementService(
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

    public async Task<Result<List<AnnouncementDto>>> GetPublicAnnouncementsAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        var list = await _context.Announcements
            .AsNoTracking()
            .Include(a => a.BranchEntity)
            .Include(a => a.ClassRoom)
            .Include(a => a.AuthorUser)
            .Where(a => a.Audience == ContentRules.AudiencePublic &&
                        a.PublishedAt <= now &&
                        (a.ExpiresAt == null || a.ExpiresAt > now))
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<List<AnnouncementDto>>> GetMyAnnouncementsAsync(int? branchId, Guid? classRoomId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var query = _context.Announcements
            .AsNoTracking()
            .Include(a => a.BranchEntity)
            .Include(a => a.ClassRoom)
            .Include(a => a.AuthorUser)
            .Where(a => a.PublishedAt <= now && (a.ExpiresAt == null || a.ExpiresAt > now))
            .AsQueryable();

        if (IsParishWide)
        {
            if (branchId.HasValue)
                query = query.Where(a => a.BranchId == branchId.Value || a.Audience == ContentRules.AudiencePublic);
            if (classRoomId.HasValue)
                query = query.Where(a => a.ClassRoomId == classRoomId.Value || a.Audience == ContentRules.AudiencePublic);
        }
        else if (_currentUser.ScopeType == "Branch" && _currentUser.BranchId.HasValue)
        {
            var userBranchId = _currentUser.BranchId.Value;
            query = query.Where(a =>
                a.Audience == ContentRules.AudiencePublic ||
                a.Audience == ContentRules.AudienceLeaders ||
                (a.Audience == ContentRules.AudienceBranch && a.BranchId == userBranchId));
        }
        else if (_currentUser.ScopeType == "Classroom")
        {
            var userClasses = await _scopeContext.ClassRooms(_context.ClassRooms).Select(c => c.Id).ToListAsync(ct);
            query = query.Where(a =>
                a.Audience == ContentRules.AudiencePublic ||
                a.Audience == ContentRules.AudienceLeaders ||
                (a.Audience == ContentRules.AudienceClass && a.ClassRoomId.HasValue && userClasses.Contains(a.ClassRoomId.Value)));
        }
        else if (_currentUser.ScopeType == "Guardian")
        {
            query = query.Where(a => a.Audience == ContentRules.AudiencePublic || a.Audience == ContentRules.AudienceGuardians);
        }

        var list = await query
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync(ct);

        return Result.Ok(list.Select(MapToDto).ToList());
    }

    public async Task<Result<AnnouncementDto>> GetAnnouncementByIdAsync(Guid id, CancellationToken ct = default)
    {
        var a = await _context.Announcements
            .AsNoTracking()
            .Include(x => x.BranchEntity)
            .Include(x => x.ClassRoom)
            .Include(x => x.AuthorUser)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

        if (a == null)
            return Result.NotFound<AnnouncementDto>("Không tìm thấy thông báo");

        return Result.Ok(MapToDto(a));
    }

    public async Task<Result<AnnouncementDto>> CreateAnnouncementAsync(CreateAnnouncementRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, "Tiêu đề thông báo không được để trống");

        if (string.IsNullOrWhiteSpace(request.ContentHtml))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, "Nội dung thông báo không được để trống");

        if (!ContentRules.ValidateAudienceTarget(request.Audience, request.BranchId, request.ClassRoomId, out var audienceError))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, audienceError!);

        // Scope check for author
        if (!IsParishWide)
        {
            if (request.Audience == ContentRules.AudienceBranch && request.BranchId != _currentUser.BranchId)
                return Result.Forbidden<AnnouncementDto>("Bạn chỉ có thể đăng thông báo cho ngành bạn phụ trách");

            if (request.Audience == ContentRules.AudienceClass && request.ClassRoomId.HasValue)
            {
                var canAccess = await _scopeContext.CanAccessClassRoomAsync(request.ClassRoomId.Value, ct);
                if (!canAccess)
                    return Result.Forbidden<AnnouncementDto>("Bạn chỉ có thể đăng thông báo cho lớp học bạn phụ trách");
            }
        }

        var sanitizedHtml = _htmlSanitizer.Sanitize(request.ContentHtml.Trim());
        var currentUserId = _currentUser.UserId ?? Guid.Empty;

        var announcement = new Announcement
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            ContentHtml = sanitizedHtml,
            AnnouncementType = string.IsNullOrWhiteSpace(request.AnnouncementType) ? "Normal" : request.AnnouncementType.Trim(),
            Audience = request.Audience.Trim(),
            BranchId = request.BranchId,
            ClassRoomId = request.ClassRoomId,
            AuthorUserId = currentUserId,
            PublishedAt = DateTime.UtcNow,
            ExpiresAt = request.ExpiresAt,
            CreatedAt = DateTime.UtcNow
        };

        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync(ct);

        return await GetAnnouncementByIdAsync(announcement.Id, ct);
    }

    public async Task<Result<AnnouncementDto>> UpdateAnnouncementAsync(Guid id, UpdateAnnouncementRequest request, CancellationToken ct = default)
    {
        var a = await _context.Announcements.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (a == null)
            return Result.NotFound<AnnouncementDto>("Không tìm thấy thông báo");

        var currentUserId = _currentUser.UserId ?? Guid.Empty;
        if (!IsParishWide && a.AuthorUserId != currentUserId)
            return Result.Forbidden<AnnouncementDto>("Bạn chỉ có quyền sửa thông báo do chính mình tạo");

        if (string.IsNullOrWhiteSpace(request.Title))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, "Tiêu đề thông báo không được để trống");

        if (string.IsNullOrWhiteSpace(request.ContentHtml))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, "Nội dung thông báo không được để trống");

        if (!ContentRules.ValidateAudienceTarget(request.Audience, request.BranchId, request.ClassRoomId, out var audienceError))
            return Result.BadRequest<AnnouncementDto>(ErrorCodes.ValidationFailed, audienceError!);

        var sanitizedHtml = _htmlSanitizer.Sanitize(request.ContentHtml.Trim());

        a.Title = request.Title.Trim();
        a.ContentHtml = sanitizedHtml;
        a.AnnouncementType = request.AnnouncementType.Trim();
        a.Audience = request.Audience.Trim();
        a.BranchId = request.BranchId;
        a.ClassRoomId = request.ClassRoomId;
        a.ExpiresAt = request.ExpiresAt;
        a.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetAnnouncementByIdAsync(a.Id, ct);
    }

    public async Task<Result<bool>> DeleteAnnouncementAsync(Guid id, CancellationToken ct = default)
    {
        var a = await _context.Announcements.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (a == null)
            return Result.NotFound<bool>("Không tìm thấy thông báo");

        var currentUserId = _currentUser.UserId ?? Guid.Empty;
        if (!IsParishWide && a.AuthorUserId != currentUserId)
            return Result.Forbidden<bool>("Bạn chỉ có quyền xóa thông báo do chính mình tạo");

        a.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);

        return Result.Ok(true);
    }

    private static AnnouncementDto MapToDto(Announcement a) => new()
    {
        Id = a.Id,
        Title = a.Title,
        ContentHtml = a.ContentHtml,
        AnnouncementType = a.AnnouncementType,
        Audience = a.Audience,
        BranchId = a.BranchId,
        BranchName = a.BranchEntity?.Name,
        ClassRoomId = a.ClassRoomId,
        ClassRoomName = a.ClassRoom?.ClassName,
        AuthorUserId = a.AuthorUserId,
        AuthorFullName = a.AuthorUser?.FullName ?? string.Empty,
        PublishedAt = a.PublishedAt,
        ExpiresAt = a.ExpiresAt,
        CreatedAt = a.CreatedAt
    };
}
