using System;
using System.Linq;
using System.Threading.Tasks;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Infrastructure.Services.Platform;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace GiaoLy.Tests.Platform;

/// <summary>
/// Dữ liệu nạp từ ETL cũ lưu FullNameNormalized = UPPER(FullName) (còn dấu) nên
/// tìm kiếm theo tên không khớp. Việc chuẩn hoá phải đưa cột về đúng hàm của hệ thống
/// và chạy lại nhiều lần không đổi kết quả.
/// </summary>
public class StudentNameNormalizationTests
{
    private static AppDbContext NewDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"normalize-{Guid.NewGuid()}")
            .Options;
        return new AppDbContext(options);
    }

    private static Student LegacyStudent(string code, string fullName, string legacyNormalized)
    {
        var student = new Student
        {
            Code = code,
            FullName = fullName,
            BirthDate = new DateTime(2015, 5, 20)
        };

        // Ghi đè giá trị "bẩn" mà ETL cũ để lại.
        student.FullNameNormalized = legacyNormalized;
        return student;
    }

    [Fact]
    public async Task NormalizeStudentNames_SuaDuLieuCuVaChayLaiKhongDoiKetQua()
    {
        await using var db = NewDb();
        db.Students.AddRange(
            LegacyStudent("TN260001", "Bùi Thị Hương", "BÙI THỊ HƯƠNG"),
            LegacyStudent("TN260002", "Đỗ Văn Đức", "ĐỖ VĂN ĐỨC"),
            new Student
            {
                Code = "TN260003",
                FullName = "Nguyễn Văn An", // setter đã chuẩn hoá đúng
                BirthDate = new DateTime(2014, 1, 1)
            });
        await db.SaveChangesAsync();

        var service = new DataMigrationService(db, NullLogger<DataMigrationService>.Instance);

        var first = await service.NormalizeStudentNamesAsync();

        Assert.True(first.IsSuccess);
        Assert.Equal(3, first.Value!.Scanned);
        Assert.Equal(2, first.Value.Updated);

        var names = db.Students.OrderBy(s => s.Code).Select(s => s.FullNameNormalized).ToList();
        Assert.Equal(new[] { "bui thi huong", "do van duc", "nguyen van an" }, names);

        var second = await service.NormalizeStudentNamesAsync();

        Assert.True(second.IsSuccess);
        Assert.Equal(0, second.Value!.Updated);
    }

    [Fact]
    public async Task NormalizeStudentNames_ChuanHoaCaHoSoDaXoaMem()
    {
        await using var db = NewDb();
        var deleted = LegacyStudent("TN260009", "Lê Thị Mai", "LÊ THỊ MAI");
        deleted.DeletedAt = DateTime.UtcNow;
        db.Students.Add(deleted);
        await db.SaveChangesAsync();

        var service = new DataMigrationService(db, NullLogger<DataMigrationService>.Instance);

        var result = await service.NormalizeStudentNamesAsync();

        Assert.True(result.IsSuccess);
        Assert.Equal(1, result.Value!.Updated);
        Assert.Equal("le thi mai", db.Students.IgnoreQueryFilters().Single().FullNameNormalized);
    }
}
