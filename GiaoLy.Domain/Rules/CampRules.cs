using System;
using System.Collections.Generic;
using System.Linq;

namespace GiaoLy.Domain.Rules;

public static class CampRules
{
    public const string StatusRegistered = "Registered";
    public const string StatusCancelled = "Cancelled";

    public static bool ValidateDates(DateOnly startDate, DateOnly endDate)
    {
        return endDate >= startDate;
    }

    public static bool ValidateFee(decimal fee)
    {
        return fee >= 0;
    }

    public static bool ValidatePaymentAmount(decimal amount)
    {
        return amount != 0;
    }

    public static (decimal TotalPaid, decimal Remaining, bool IsOverpaid, bool IsSettled) CalculateBalance(
        decimal fee,
        IEnumerable<decimal> payments)
    {
        var total = payments.Sum();
        var remaining = fee - total;
        return (
            TotalPaid: total,
            Remaining: remaining,
            IsOverpaid: total > fee,
            IsSettled: total == fee
        );
    }

    public static bool ValidateReversal(decimal originalAmount, decimal priorReversalsTotal, decimal refundAmount)
    {
        if (originalAmount <= 0) return false;
        if (refundAmount >= 0) return false; // Reversal row must be negative

        var refundMagnitude = Math.Abs(refundAmount);
        var priorReversalsMagnitude = Math.Abs(priorReversalsTotal);

        return (priorReversalsMagnitude + refundMagnitude) <= originalAmount;
    }
}
