using System;
using System.Linq;
using System.Threading.Tasks;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Infrastructure.Services.Liturgical;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GiaoLy.Tests.Liturgical;

/// <summary>
/// Lịch phụng vụ tự tính: mọi ngày trong tháng đều phải có dữ liệu, kể cả khi
/// bảng LiturgicalEvents trống (trước đây API chỉ trả các ngày đã ghi đè).
/// </summary>
public class LiturgicalCalendarTests
{
    private static AppDbContext NewDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"liturgical-{Guid.NewGuid()}")
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetCalendar_TraDuMoiNgayTrongThang()
    {
        await using var db = NewDb();
        var service = new LiturgicalService(db);

        var result = await service.GetCalendarAsync(2026, 2);

        Assert.True(result.IsSuccess);
        Assert.Equal(28, result.Value!.Count);
        Assert.Equal(new DateOnly(2026, 2, 1), result.Value[0].EventDate);
        Assert.Equal(new DateOnly(2026, 2, 28), result.Value[^1].EventDate);
    }

    [Fact]
    public async Task GetCalendar_TinhDungMuaChayVaLoiLe()
    {
        await using var db = NewDb();
        var service = new LiturgicalService(db);

        var result = await service.GetCalendarAsync(2026, 3);
        var days = result.Value!;

        // Lễ Tro 2026: 18/02 (Easter 05/04 trừ 46 ngày) nên tháng 3 nằm trong Mùa Chay.
        var giuaThang = days.Single(d => d.EventDate == new DateOnly(2026, 3, 10));
        Assert.Equal("Purple", giuaThang.Color);

        var leLa = days.Single(d => d.EventDate == new DateOnly(2026, 3, 29));
        Assert.Equal("Chúa Nhật Lễ Lá", leLa.Title);
        Assert.Equal("Red", leLa.Color);
        Assert.Equal("Lễ trọng", leLa.Level);

        var thanhGiuse = days.Single(d => d.EventDate == new DateOnly(2026, 3, 19));
        Assert.Contains("Thánh Giuse", thanhGiuse.Title);
        Assert.Equal("White", thanhGiuse.Color);
    }

    [Fact]
    public async Task GetCalendar_ChuaNhatThuBaMuaVongMacAoHong()
    {
        await using var db = NewDb();
        var service = new LiturgicalService(db);

        var days = (await service.GetCalendarAsync(2026, 12)).Value!;

        Assert.Equal(31, days.Count);

        var chuNhatBa = days.Single(d => d.EventDate == new DateOnly(2026, 12, 13));
        Assert.Contains("Chúa Nhật III", chuNhatBa.Title);
        Assert.Contains("Mùa Vọng", chuNhatBa.Title);
        Assert.Equal("Rose", chuNhatBa.Color);

        var voNhiem = days.Single(d => d.EventDate == new DateOnly(2026, 12, 8));
        Assert.Equal("Đức Mẹ Vô Nhiễm Nguyên Tội", voNhiem.Title);

        var giangSinh = days.Single(d => d.EventDate == new DateOnly(2026, 12, 25));
        Assert.Equal("Chúa Giáng Sinh", giangSinh.Title);
        Assert.Equal("White", giangSinh.Color);
        Assert.Equal("Lễ trọng", giangSinh.Level);
    }

    [Fact]
    public async Task GetByDate_TinhNgayKhongCoTrongCsdl()
    {
        await using var db = NewDb();
        var service = new LiturgicalService(db);

        var result = await service.GetByDateAsync(new DateOnly(2026, 4, 5));

        Assert.True(result.IsSuccess);
        Assert.Equal("Chúa Nhật Phục Sinh", result.Value!.Title);
        Assert.Equal("White", result.Value.Color);
    }

    [Fact]
    public async Task GetCalendar_UuTienBanGhiGhiDeCuaGiaoXu()
    {
        await using var db = NewDb();
        db.LiturgicalEvents.Add(new LiturgicalEvent
        {
            EventDate = new DateOnly(2026, 12, 13),
            Title = "Lễ Bổn Mạng Giáo Xứ",
            Color = "White",
            Level = "Lễ trọng",
            IsOverride = true
        });
        await db.SaveChangesAsync();

        var service = new LiturgicalService(db);
        var days = (await service.GetCalendarAsync(2026, 12)).Value!;

        var ngay13 = days.Single(d => d.EventDate == new DateOnly(2026, 12, 13));
        Assert.Equal("Lễ Bổn Mạng Giáo Xứ", ngay13.Title);
        Assert.True(ngay13.IsOverride);
    }

    [Fact]
    public async Task GetCalendar_TuChoiThangKhongHopLe()
    {
        await using var db = NewDb();
        var service = new LiturgicalService(db);

        var result = await service.GetCalendarAsync(2026, 13);

        Assert.False(result.IsSuccess);
        Assert.Equal(400, result.StatusCode);
    }
}
