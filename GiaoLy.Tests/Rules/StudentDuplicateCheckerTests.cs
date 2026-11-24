using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

public class StudentDuplicateCheckerTests
{
    private static readonly Guid ExistingId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly DateOnly Birth = new(2015, 5, 20);

    private static DuplicateCheckResult Check(
        string candidateName,
        DateOnly candidateBirth,
        string[] candidatePhones,
        string existingName = "bui thi huong",
        DateOnly? existingBirth = null,
        string[]? existingPhones = null)
        => StudentDuplicateChecker.Check(
            candidateName,
            candidateBirth,
            candidatePhones,
            existingName,
            existingBirth ?? Birth,
            existingPhones ?? ["0912345678"],
            ExistingId,
            "TN260001",
            "Bùi Thị Hương");

    [Fact]
    public void TrungTuyetDoi_KhiCungTenCungNgaySinhCungPhuHuynh()
    {
        var result = Check("bui thi huong", Birth, ["0912345678"]);

        Assert.Equal(DuplicateLevel.Exact, result.Level);
        Assert.Equal(ExistingId, result.ExistingStudentId);
        Assert.Contains("TN260001", result.Message);
    }

    [Fact]
    public void NghiVanCao_KhiCungNgaySinhVaTenLechMotKyTu()
    {
        var result = Check("bui thi huonh", Birth, [], existingPhones: []);

        Assert.Equal(DuplicateLevel.Probable, result.Level);
    }

    [Fact]
    public void CoTheTrung_KhiCungTenVaCungSoDienThoaiNhungKhacNgaySinh()
    {
        var result = Check("bui thi huong", new DateOnly(2016, 5, 20), ["0912345678"]);

        Assert.Equal(DuplicateLevel.Possible, result.Level);
    }

    [Fact]
    public void KhongTrung_KhiKhacTenKhacNgaySinhKhacPhuHuynh()
    {
        var result = Check("tran van an", new DateOnly(2014, 1, 1), ["0987654321"]);

        Assert.Equal(DuplicateLevel.None, result.Level);
        Assert.Null(result.ExistingStudentId);
    }

    [Theory]
    [InlineData("huong", "huong", 0)]
    [InlineData("huong", "huonh", 1)]
    [InlineData("", "abc", 3)]
    [InlineData("abc", "", 3)]
    [InlineData("kitten", "sitting", 3)]
    public void Levenshtein_TinhDungKhoangCach(string a, string b, int expected)
    {
        Assert.Equal(expected, StudentDuplicateChecker.CalculateLevenshteinDistance(a, b));
    }
}
