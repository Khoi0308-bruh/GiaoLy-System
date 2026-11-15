using System;
using System.Collections.Generic;
using System.Linq;

namespace GiaoLy.Domain.Rules;

public static class LessonPlanRules
{
    public const string VisibilityPrivate = "Private";
    public const string VisibilityClass = "Class";
    public const string VisibilityBranch = "Branch";
    public const string VisibilityAll = "All";

    public static readonly string[] AllowedVisibilities =
    [
        VisibilityPrivate,
        VisibilityClass,
        VisibilityBranch,
        VisibilityAll
    ];

    public static bool IsValidVisibility(string visibility)
    {
        return AllowedVisibilities.Contains(visibility, StringComparer.OrdinalIgnoreCase);
    }

    public static bool CanModify(Guid authorUserId, Guid currentUserId, bool hasManageAll)
    {
        if (authorUserId == currentUserId) return true;
        return hasManageAll;
    }

    public static bool CanView(
        string visibility,
        Guid authorUserId,
        Guid currentUserId,
        Guid? planClassRoomId,
        IEnumerable<Guid> userAssignedClassRoomIds,
        int? planBranchId,
        IEnumerable<int> userAssignedBranchIds,
        bool isParishWideAdmin)
    {
        if (isParishWideAdmin) return true;
        if (authorUserId == currentUserId) return true;

        return visibility switch
        {
            VisibilityAll => true,
            VisibilityBranch => planBranchId.HasValue && userAssignedBranchIds.Contains(planBranchId.Value),
            VisibilityClass => planClassRoomId.HasValue && userAssignedClassRoomIds.Contains(planClassRoomId.Value),
            VisibilityPrivate => false,
            _ => false
        };
    }
}
