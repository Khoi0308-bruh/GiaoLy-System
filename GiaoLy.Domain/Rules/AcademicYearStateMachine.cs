using GiaoLy.Domain.Entities;

namespace GiaoLy.Domain.Rules;

public static class AcademicYearStateMachine
{
    public const string StatusPlanned = "Planned";
    public const string StatusActive = "Active";
    public const string StatusClosing = "Closing";
    public const string StatusArchived = "Archived";

    public static readonly HashSet<string> AllStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        StatusPlanned, StatusActive, StatusClosing, StatusArchived
    };

    public static bool CanActivate(AcademicYear year, bool hasOtherActiveYear, int classRoomCount, out string? errorMessage)
    {
        if (year.Status != StatusPlanned)
        {
            errorMessage = $"Chỉ có thể kích hoạt niên khóa đang ở trạng thái '{StatusPlanned}'. Trạng thái hiện tại: '{year.Status}'.";
            return false;
        }

        if (hasOtherActiveYear)
        {
            errorMessage = "Đang có một niên khóa khác đang hoạt động. Vui lòng chốt niên khóa hiện tại trước khi kích hoạt niên khóa mới.";
            return false;
        }

        if (classRoomCount == 0)
        {
            errorMessage = "Niên khóa phải có ít nhất một lớp học trước khi kích hoạt.";
            return false;
        }

        errorMessage = null;
        return true;
    }

    public static bool CanClose(AcademicYear year, out string? errorMessage)
    {
        if (year.Status != StatusActive)
        {
            errorMessage = $"Chỉ có thể chốt niên khóa đang hoạt động ('{StatusActive}'). Trạng thái hiện tại: '{year.Status}'.";
            return false;
        }

        errorMessage = null;
        return true;
    }

    public static bool CanArchive(AcademicYear year, bool hasOpenPromotionBatches, out string? errorMessage)
    {
        if (year.Status != StatusClosing)
        {
            errorMessage = $"Chỉ có thể lưu trữ niên khóa đang ở trạng thái '{StatusClosing}'. Trạng thái hiện tại: '{year.Status}'.";
            return false;
        }

        if (hasOpenPromotionBatches)
        {
            errorMessage = "Còn đợt xét lên lớp chưa hoàn tất (đang ở trạng thái Nháp hoặc Đang duyệt). Vui lòng hoàn tất hoặc hủy đợt xét trước khi lưu trữ.";
            return false;
        }

        errorMessage = null;
        return true;
    }

    public static bool CanReopen(AcademicYear year, string? reason, bool hasOtherActiveYear, out string? errorMessage)
    {
        if (year.Status != StatusClosing)
        {
            errorMessage = $"Chỉ có thể mở lại niên khóa đang ở trạng thái '{StatusClosing}'.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(reason))
        {
            errorMessage = "Bắt buộc phải cung cấp lý do khi mở lại niên khóa.";
            return false;
        }

        if (hasOtherActiveYear)
        {
            errorMessage = "Đang có một niên khóa khác đang hoạt động. Không thể mở lại niên khóa này.";
            return false;
        }

        errorMessage = null;
        return true;
    }

    public static bool CanDelete(AcademicYear year, int classRoomCount, out string? errorMessage)
    {
        if (year.Status != StatusPlanned)
        {
            errorMessage = "Chỉ có thể xóa niên khóa chưa kích hoạt (trạng thái 'Planned').";
            return false;
        }

        if (classRoomCount > 0)
        {
            errorMessage = "Không thể xóa niên khóa đã được tạo lớp học. Vui lòng xóa các lớp học trước.";
            return false;
        }

        errorMessage = null;
        return true;
    }
}
