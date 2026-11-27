using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

public class StudentBirthDateRulesTests
{
    private static readonly DateOnly Today = new(2026, 11, 24);

    [Fact]
    public void NgaySinhMacDinh_BiTuChoi()
    {
        // DateOnly default = 01/01/0001: giá trị mà model binder điền khi client bỏ trống.
        var error = StudentBirthDateRules.GetError(default, Today);

        Assert.NotNull(error);
        Assert.False(StudentBirthDateRules.IsValid(default, Today));
    }

    [Theory]
    [InlineData(1, 1, 1)]
    [InlineData(1899, 12, 31)]
    public void NgaySinhQuaCu_BiTuChoi(int year, int month, int day)
    {
        var error = StudentBirthDateRules.GetError(new DateOnly(year, month, day), Today);

        Assert.NotNull(error);
        Assert.Contains("không hợp lệ", error);
    }

    [Fact]
    public void MocDuoi_DungNgay1900_01_01_DuocChapNhan()
    {
        var birthDate = new DateOnly(1900, 1, 1);

        Assert.Null(StudentBirthDateRules.GetError(birthDate, Today));
        Assert.True(StudentBirthDateRules.IsValid(birthDate, Today));
    }

    [Fact]
    public void NgaySinhTrongQuaKhu_HopLe()
    {
        Assert.Null(StudentBirthDateRules.GetError(new DateOnly(2015, 5, 20), Today));
    }

    [Fact]
    public void NgaySinhHomNay_HopLe()
    {
        Assert.Null(StudentBirthDateRules.GetError(Today, Today));
    }

    [Fact]
    public void NgaySinhTuongLai_BiTuChoi()
    {
        var error = StudentBirthDateRules.GetError(Today.AddDays(1), Today);

        Assert.NotNull(error);
        Assert.Contains("tương lai", error);
    }
}
