namespace GiaoLy.Domain.Rules;

public static class StudentStateMachine
{
    public const string StatusActive = "Active";
    public const string StatusPaused = "Paused";
    public const string StatusLeft = "Left";
    public const string StatusGraduated = "Graduated";

    public static readonly HashSet<string> AllStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        StatusActive, StatusPaused, StatusLeft, StatusGraduated
    };

    public static bool CanChangeStatus(
        string currentStatus,
        string targetStatus,
        string? reason,
        bool isSystemAdmin,
        out string? errorMessage)
    {
        if (!AllStatuses.Contains(targetStatus))
        {
            errorMessage = $"Trạng thái đích '{targetStatus}' không hợp lệ.";
            return false;
        }

        if (string.Equals(currentStatus, targetStatus, StringComparison.OrdinalIgnoreCase))
        {
            errorMessage = $"Đoàn sinh hiện đã ở trạng thái '{currentStatus}'.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(reason))
        {
            errorMessage = "Bắt buộc phải cung cấp lý do khi chuyển đổi trạng thái đoàn sinh.";
            return false;
        }

        // Active -> Paused
        if (currentStatus == StatusActive && targetStatus == StatusPaused)
        {
            errorMessage = null;
            return true;
        }

        // (Active or Paused) -> Left
        if ((currentStatus == StatusActive || currentStatus == StatusPaused) && targetStatus == StatusLeft)
        {
            errorMessage = null;
            return true;
        }

        // Left -> Active
        if (currentStatus == StatusLeft && targetStatus == StatusActive)
        {
            errorMessage = null;
            return true;
        }

        // Paused -> Active
        if (currentStatus == StatusPaused && targetStatus == StatusActive)
        {
            errorMessage = null;
            return true;
        }

        // Status -> Graduated (Only SystemAdmin or Promotion batch)
        if (targetStatus == StatusGraduated)
        {
            if (!isSystemAdmin)
            {
                errorMessage = "Trạng thái 'Graduated' (Đã tốt nghiệp) chỉ được gán thông qua đợt xét lên lớp cấp cuối hoặc bởi Quản trị viên hệ thống.";
                return false;
            }
            errorMessage = null;
            return true;
        }

        if (currentStatus == StatusGraduated)
        {
            if (!isSystemAdmin)
            {
                errorMessage = "Đoàn sinh đã tốt nghiệp chỉ có thể được mở lại bởi Quản trị viên hệ thống.";
                return false;
            }
            errorMessage = null;
            return true;
        }

        errorMessage = null;
        return true;
    }
}
