using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GiaoLy.Domain.Rules;

public static class ContentRules
{
    public const string AudiencePublic = "Public";
    public const string AudienceLeaders = "Leaders";
    public const string AudienceBranch = "Branch";
    public const string AudienceClass = "Class";
    public const string AudienceGuardians = "Guardians";

    public static readonly string[] AllowedAudiences =
    [
        AudiencePublic,
        AudienceLeaders,
        AudienceBranch,
        AudienceClass,
        AudienceGuardians
    ];

    public const string AccessLevelPublic = "Public";
    public const string AccessLevelInternal = "Internal";

    public static readonly string[] AllowedAccessLevels =
    [
        AccessLevelPublic,
        AccessLevelInternal
    ];

    private static readonly HashSet<string> AllowedDocumentExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip", ".png", ".jpg", ".jpeg", ".webp"
    };

    public const long DefaultMaxDocumentSizeBytes = 20 * 1024 * 1024; // 20 MB
    public const long DefaultMaxImageSizeBytes = 2 * 1024 * 1024; // 2 MB

    public static bool ValidateAudienceTarget(string audience, int? branchId, Guid? classRoomId, out string? errorMessage)
    {
        errorMessage = null;
        if (!AllowedAudiences.Contains(audience, StringComparer.OrdinalIgnoreCase))
        {
            errorMessage = $"Đối tượng thông báo '{audience}' không hợp lệ. Cho phép: Public, Leaders, Branch, Class, Guardians";
            return false;
        }

        if (string.Equals(audience, AudienceBranch, StringComparison.OrdinalIgnoreCase) && !branchId.HasValue)
        {
            errorMessage = "Thông báo theo ngành bắt buộc phải chọn ngành (BranchId)";
            return false;
        }

        if (string.Equals(audience, AudienceClass, StringComparison.OrdinalIgnoreCase) && !classRoomId.HasValue)
        {
            errorMessage = "Thông báo theo lớp bắt buộc phải chọn lớp học (ClassRoomId)";
            return false;
        }

        return true;
    }

    public static bool ValidateDocumentExtension(string fileName)
    {
        var ext = Path.GetExtension(fileName);
        return !string.IsNullOrWhiteSpace(ext) && AllowedDocumentExtensions.Contains(ext);
    }
}
