namespace GiaoLy.Application.Common.Interfaces;

public interface ICurrentUser
{
    Guid? UserId { get; }
    string? UserName { get; }
    string? FullName { get; }
    Guid? RoleId { get; }
    string? RoleCode { get; }
    string? ScopeType { get; } // All, Branch, Classroom, Guardian
    int? BranchId { get; }
    Guid? SecurityStamp { get; }
    bool IsAuthenticated { get; }
    bool MustChangePassword { get; }
    IReadOnlySet<string> Permissions { get; }
    bool HasPermission(string permission);
    bool IsInRole(string roleCode) => string.Equals(RoleCode, roleCode, StringComparison.OrdinalIgnoreCase);
}
