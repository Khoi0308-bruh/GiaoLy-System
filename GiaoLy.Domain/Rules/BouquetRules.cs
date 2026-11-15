using System;

namespace GiaoLy.Domain.Rules;

public static class BouquetRules
{
    public const int DefaultMaxPointsPerEntry = 10;

    public static bool ValidatePoints(int points)
    {
        return points != 0 && points >= -100 && points <= 100;
    }

    public static bool ValidatePointsThreshold(int points, bool isAdmin, int maxPointsPerEntry = DefaultMaxPointsPerEntry)
    {
        if (isAdmin) return true;
        return Math.Abs(points) <= maxPointsPerEntry;
    }

    public static bool ValidateReversal(int originalPoints, int reversePoints)
    {
        if (originalPoints == 0) return false;
        // Reversal row must be opposite sign of original
        if (originalPoints > 0 && reversePoints >= 0) return false;
        if (originalPoints < 0 && reversePoints <= 0) return false;

        return Math.Abs(reversePoints) <= Math.Abs(originalPoints);
    }
}
