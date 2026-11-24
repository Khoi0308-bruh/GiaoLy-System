using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

public class PhoneNormalizerTests
{
    [Theory]
    [InlineData("+84 912 345 678", "0912345678")]
    [InlineData("84912345678", "0912345678")]
    [InlineData("0912-345-678", "0912345678")]
    [InlineData("912345678", "0912345678")]
    [InlineData(" 0912 345 678 ", "0912345678")]
    [InlineData("", "")]
    [InlineData(null, "")]
    public void Normalize_DuaVeDinhDangNoiDia(string? input, string expected)
    {
        Assert.Equal(expected, PhoneNormalizer.Normalize(input));
    }

    [Theory]
    [InlineData("0912345678", true)]
    [InlineData("+84 987 654 321", true)]
    [InlineData("0112345678", false)]
    [InlineData("091234567", false)]
    [InlineData("abc", false)]
    public void IsValidVietnamPhone_ChiNhanDauSoDiDong(string? input, bool expected)
    {
        Assert.Equal(expected, PhoneNormalizer.IsValidVietnamPhone(input));
    }
}
