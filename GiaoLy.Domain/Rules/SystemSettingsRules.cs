using System;
using System.Collections.Generic;
using System.Globalization;

namespace GiaoLy.Domain.Rules;

public static class SystemSettingsRules
{
    public static class SettingKeys
    {
        public const string PromotionMinGpa = "Promotion.MinGpa";
        public const string PromotionMinAttendancePercent = "Promotion.MinAttendancePercent";
        public const string PromotionRequireAttendance = "Promotion.RequireAttendance";
        public const string PromotionRequireFinalExam = "Promotion.RequireFinalExam";
        public const string GradesUnlockHours = "Grades.UnlockHours";
        public const string BouquetMaxPointsPerEntry = "Bouquet.MaxPointsPerEntry";
        public const string SecurityPasswordMinLength = "Security.PasswordMinLength";
        public const string SecurityLockoutThreshold = "Security.LockoutThreshold";
        public const string SecurityLockoutMinutes = "Security.LockoutMinutes";
        public const string SecurityAccessTokenMinutes = "Security.AccessTokenMinutes";
        public const string SecurityRefreshTokenDays = "Security.RefreshTokenDays";
        public const string StudentsDuplicateBlockLevel = "Students.DuplicateBlockLevel";
        public const string ImportMaxRows = "Import.MaxRows";
        public const string UploadMaxDocumentMB = "Upload.MaxDocumentMB";
        public const string UploadMaxImageMB = "Upload.MaxImageMB";
    }

    public static readonly Dictionary<string, (string DefaultValue, string Description)> DefaultSettings = new(StringComparer.OrdinalIgnoreCase)
    {
        [SettingKeys.PromotionMinGpa] = ("5.0", "Điểm trung bình tối thiểu để lên lớp"),
        [SettingKeys.PromotionMinAttendancePercent] = ("80", "Chuyên cần tối thiểu (%)"),
        [SettingKeys.PromotionRequireAttendance] = ("true", "Có xét chuyên cần khi lên lớp"),
        [SettingKeys.PromotionRequireFinalExam] = ("true", "Bắt buộc có điểm thi kết khóa"),
        [SettingKeys.GradesUnlockHours] = ("72", "Thời hạn mặc định của một lần mở khóa sổ điểm (giờ)"),
        [SettingKeys.BouquetMaxPointsPerEntry] = ("10", "Hoa thiêng tối đa mỗi lần ghi (admin không giới hạn)"),
        [SettingKeys.SecurityPasswordMinLength] = ("10", "Độ dài mật khẩu tối thiểu"),
        [SettingKeys.SecurityLockoutThreshold] = ("5", "Số lần đăng nhập sai trước khi khóa tạm"),
        [SettingKeys.SecurityLockoutMinutes] = ("15", "Thời gian khóa tạm (phút)"),
        [SettingKeys.SecurityAccessTokenMinutes] = ("20", "Thời hạn access token (phút)"),
        [SettingKeys.SecurityRefreshTokenDays] = ("7", "Thời hạn refresh token (ngày)"),
        [SettingKeys.StudentsDuplicateBlockLevel] = ("Exact", "Mức trùng bị chặn: Exact, Probable"),
        [SettingKeys.ImportMaxRows] = ("2000", "Số dòng tối đa mỗi lần nhập"),
        [SettingKeys.UploadMaxDocumentMB] = ("20", "Dung lượng tối đa tài liệu (MB)"),
        [SettingKeys.UploadMaxImageMB] = ("2", "Dung lượng tối đa ảnh (MB)")
    };

    public static (bool IsValid, string? ErrorMessage) ValidateSettingValue(string key, string value)
    {
        if (string.IsNullOrWhiteSpace(key))
            return (false, "Khóa cấu hình không được để trống.");

        if (value == null)
            return (false, "Giá trị cấu hình không được null.");

        switch (key)
        {
            case SettingKeys.PromotionMinGpa:
                if (!double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var gpa) || gpa < 0.0 || gpa > 10.0)
                    return (false, "Điểm trung bình tối thiểu (Promotion.MinGpa) phải là số thực từ 0.0 đến 10.0.");
                break;

            case SettingKeys.PromotionMinAttendancePercent:
                if (!int.TryParse(value, out var att) || att < 0 || att > 100)
                    return (false, "Phần trăm chuyên cần (Promotion.MinAttendancePercent) phải là số nguyên từ 0 đến 100.");
                break;

            case SettingKeys.PromotionRequireAttendance:
            case SettingKeys.PromotionRequireFinalExam:
                if (!bool.TryParse(value, out _))
                    return (false, $"Giá trị của '{key}' phải là 'true' hoặc 'false'.");
                break;

            case SettingKeys.GradesUnlockHours:
                if (!int.TryParse(value, out var unlockHours) || unlockHours < 1 || unlockHours > 720)
                    return (false, "Thời hạn mở khóa (Grades.UnlockHours) phải là số nguyên từ 1 đến 720 giờ (tối đa 30 ngày).");
                break;

            case SettingKeys.BouquetMaxPointsPerEntry:
                if (!int.TryParse(value, out var bouquetPts) || bouquetPts < 1 || bouquetPts > 1000)
                    return (false, "Hoa thiêng tối đa (Bouquet.MaxPointsPerEntry) phải từ 1 đến 1000.");
                break;

            case SettingKeys.SecurityPasswordMinLength:
                if (!int.TryParse(value, out var passLen) || passLen < 8 || passLen > 128)
                    return (false, "Độ dài mật khẩu tối thiểu phải từ 8 đến 128 ký tự.");
                break;

            case SettingKeys.SecurityLockoutThreshold:
                if (!int.TryParse(value, out var lockoutThresh) || lockoutThresh < 1 || lockoutThresh > 20)
                    return (false, "Ngưỡng khóa tài khoản phải từ 1 đến 20 lần.");
                break;

            case SettingKeys.SecurityLockoutMinutes:
                if (!int.TryParse(value, out var lockoutMin) || lockoutMin < 1 || lockoutMin > 1440)
                    return (false, "Thời gian khóa tạm phải từ 1 đến 1440 phút (24 giờ).");
                break;

            case SettingKeys.SecurityAccessTokenMinutes:
                if (!int.TryParse(value, out var tokenMin) || tokenMin < 1 || tokenMin > 1440)
                    return (false, "Thời hạn access token phải từ 1 đến 1440 phút.");
                break;

            case SettingKeys.SecurityRefreshTokenDays:
                if (!int.TryParse(value, out var refreshDays) || refreshDays < 1 || refreshDays > 365)
                    return (false, "Thời hạn refresh token phải từ 1 đến 365 ngày.");
                break;

            case SettingKeys.StudentsDuplicateBlockLevel:
                if (!string.Equals(value, "Exact", StringComparison.OrdinalIgnoreCase) &&
                    !string.Equals(value, "Probable", StringComparison.OrdinalIgnoreCase))
                    return (false, "Mức chặn trùng (Students.DuplicateBlockLevel) phải là 'Exact' hoặc 'Probable'.");
                break;

            case SettingKeys.ImportMaxRows:
                if (!int.TryParse(value, out var importRows) || importRows < 100 || importRows > 10000)
                    return (false, "Số dòng nhập tối đa phải từ 100 đến 10000.");
                break;

            case SettingKeys.UploadMaxDocumentMB:
                if (!int.TryParse(value, out var docMb) || docMb < 1 || docMb > 100)
                    return (false, "Dung lượng tối đa tài liệu (Upload.MaxDocumentMB) phải từ 1 đến 100 MB.");
                break;

            case SettingKeys.UploadMaxImageMB:
                if (!int.TryParse(value, out var imgMb) || imgMb < 1 || imgMb > 20)
                    return (false, "Dung lượng tối đa ảnh (Upload.MaxImageMB) phải từ 1 đến 20 MB.");
                break;
        }

        return (true, null);
    }
}
