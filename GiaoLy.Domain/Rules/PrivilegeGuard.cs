namespace GiaoLy.Domain.Rules;

public static class PrivilegeGuard
{
    private static readonly HashSet<string> ReservedRoleCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "1", "2", "3", "4", "admin", "systemadmin", "superadmin"
    };

    public const string SystemAdminRoleCode = "SystemAdmin";

    /// <summary>
    /// Kiểm tra người dùng có phải Quản trị viên hệ thống (toàn quyền) không.
    /// </summary>
    public static bool IsSystemAdmin(string? roleCode)
        => string.Equals(roleCode, SystemAdminRoleCode, StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// Quy tắc 1: Chỉ gán được vai trò mà mọi quyền của nó nằm trong quyền của người gán (trừ SystemAdmin).
    /// </summary>
    public static bool CanAssignRole(
        string? assignerRoleCode,
        IEnumerable<string> assignerPermissions,
        IEnumerable<string> targetRolePermissions)
    {
        if (IsSystemAdmin(assignerRoleCode)) return true;

        var assignerPermSet = new HashSet<string>(assignerPermissions, StringComparer.OrdinalIgnoreCase);
        return targetRolePermissions.All(assignerPermSet.Contains);
    }

    /// <summary>
    /// Quy tắc 2: Chỉ cấp được cho vai trò những quyền mà chính mình có (trừ SystemAdmin).
    /// </summary>
    public static bool CanGrantPermissions(
        string? granterRoleCode,
        IEnumerable<string> granterPermissions,
        IEnumerable<string> requestedPermissions)
    {
        if (IsSystemAdmin(granterRoleCode)) return true;

        var granterPermSet = new HashSet<string>(granterPermissions, StringComparer.OrdinalIgnoreCase);
        return requestedPermissions.All(granterPermSet.Contains);
    }

    /// <summary>
    /// Quy tắc 3: Không tự sửa vai trò của chính mình; không sửa tài khoản có vai trò cao hơn mình.
    /// </summary>
    public static bool CanModifyUser(
        Guid operatorUserId,
        string? operatorRoleCode,
        Guid targetUserId,
        string? targetUserRoleCode)
    {
        // Không tự sửa vai trò của chính mình
        if (operatorUserId == targetUserId) return false;

        // SystemAdmin được sửa người khác
        if (IsSystemAdmin(operatorRoleCode)) return true;

        // Người không phải SystemAdmin không được sửa tài khoản SystemAdmin
        if (IsSystemAdmin(targetUserRoleCode)) return false;

        return true;
    }

    /// <summary>
    /// Quy tắc 4: Vai trò hệ thống không được xóa hoặc đổi mã; vai trò tự tạo không được dùng mã dành riêng.
    /// </summary>
    public static bool IsReservedRoleCode(string code)
    {
        if (string.IsNullOrWhiteSpace(code)) return true;
        return ReservedRoleCodes.Contains(code.Trim());
    }

    /// <summary>
    /// Quy tắc 5: Phải còn ít nhất một quản trị viên đang hoạt động; không hạ, khóa hay xóa quản trị viên cuối.
    /// </summary>
    public static bool CanDeactivateOrDemote(string? targetRoleCode, int currentActiveAdminCount)
    {
        if (IsSystemAdmin(targetRoleCode))
        {
            return currentActiveAdminCount > 1;
        }

        return true;
    }

    /// <summary>
    /// Chính sách mật khẩu: tối thiểu 10 ký tự, không chứa tên đăng nhập, không chỉ toàn số, không lặp một ký tự.
    /// </summary>
    public static (bool IsValid, string? ErrorMessage) ValidatePasswordPolicy(string password, string username, int minLength = 10)
    {
        if (string.IsNullOrWhiteSpace(password) || password.Length < minLength)
        {
            return (false, $"Mật khẩu phải có độ dài tối thiểu {minLength} ký tự.");
        }

        if (!string.IsNullOrWhiteSpace(username) && password.Contains(username, StringComparison.OrdinalIgnoreCase))
        {
            return (false, "Mật khẩu không được chứa tên đăng nhập.");
        }

        if (password.All(char.IsDigit))
        {
            return (false, "Mật khẩu không được chỉ chứa toàn chữ số.");
        }

        if (password.Distinct().Count() <= 1)
        {
            return (false, "Mật khẩu không được chỉ chứa một ký tự lặp lại.");
        }

        return (true, null);
    }
}
