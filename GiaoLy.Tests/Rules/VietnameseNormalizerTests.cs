using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

public class VietnameseNormalizerTests
{
    [Theory]
    [InlineData("Bùi Thị Hương", "bui thi huong")]
    [InlineData("Đỗ Văn Đức", "do van duc")]
    [InlineData("  Nguyễn   Văn   An  ", "nguyen van an")]
    [InlineData("PHẠM THỊ LAN", "pham thi lan")]
    [InlineData("", "")]
    public void NormalizeName_BoDauVaThuongHoa(string input, string expected)
    {
        Assert.Equal(expected, VietnameseNormalizer.NormalizeName(input));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("   ")]
    public void NormalizeName_TraVeRongVoiDuLieuTrong(string? input)
    {
        Assert.Equal(string.Empty, VietnameseNormalizer.NormalizeName(input));
    }

    [Fact]
    public void RemoveDiacritics_GiuNguyenChuKhongDau()
    {
        Assert.Equal("Nguyen Van An", VietnameseNormalizer.RemoveDiacritics("Nguyễn Văn An"));
        Assert.Equal("duc", VietnameseNormalizer.RemoveDiacritics("đức"));
    }

    [Fact]
    public void CleanDisplay_ChiGonKhoangTrang_GiuNguyenDau()
    {
        Assert.Equal("Bùi  Thị Hương".Replace("  ", " "), VietnameseNormalizer.CleanDisplay("  Bùi   Thị Hương "));
    }
}
