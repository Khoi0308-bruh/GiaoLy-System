using GiaoLy.Domain.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace GiaoLy.API.Authorization;

/// <summary>
/// Xử lý yêu cầu phân quyền "IsClassTeacher" — ABAC (Attribute-Based Access Control).
///
/// Luồng xử lý tự động:
///   1. Lấy userId từ JWT Token (ClaimTypes.NameIdentifier)
///   2. Lấy classRoomId từ URL route parameter
///   3. Tra cứu ClassRoom trong DB
///   4. So sánh ClassRoom.LeaderId == userId
///   5. Nếu khớp → Cho phép. Nếu không → 403 Forbidden tự động.
///
/// Admin (Role "1") luôn được bypass — không cần kiểm tra.
/// Controller giữ được sự trong sáng — không chứa bất kỳ code check quyền nào.
/// </summary>
public class IsClassTeacherHandler : AuthorizationHandler<IsClassTeacherRequirement>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsClassTeacherHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        IsClassTeacherRequirement requirement)
    {
        // Admin (Role "1") được toàn quyền, bypass mọi kiểm tra ABAC
        if (context.User.IsInRole("1"))
        {
            context.Succeed(requirement);
            return;
        }

        // Secretary (Role "2") cũng được phép sửa điểm bất kỳ lớp nào
        if (context.User.IsInRole("2"))
        {
            context.Succeed(requirement);
            return;
        }

        // Lấy userId từ JWT Token Claim
        var userIdStr = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return; // Không có Id hợp lệ → Từ chối

        // Lấy classRoomId từ route parameter của request
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null) return;

        // Hỗ trợ cả 2 tên route param: "classRoomId" và "id"
        string? classRoomIdStr = null;
        if (httpContext.Request.RouteValues.TryGetValue("classRoomId", out var val1))
            classRoomIdStr = val1?.ToString();
        else if (httpContext.Request.RouteValues.TryGetValue("id", out var val2))
            classRoomIdStr = val2?.ToString();

        if (!Guid.TryParse(classRoomIdStr, out var classRoomId)) return;

        // Tra cứu trong DB: User có phải LeaderId của lớp này không?
        var classRoom = await _context.ClassRooms.FindAsync(classRoomId);
        if (classRoom == null) return;

        if (classRoom.LeaderId.HasValue && classRoom.LeaderId.Value == userId)
            context.Succeed(requirement);

        // Nếu không match → context.Fail() không được gọi explicitly,
        // ASP.NET Core sẽ tự động trả về 403 Forbidden.
    }
}
