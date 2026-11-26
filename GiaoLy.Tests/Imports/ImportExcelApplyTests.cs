using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Infrastructure.Services.Imports;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace GiaoLy.Tests.Imports;

/// <summary>
/// Bước "Xác nhận lưu" của trang nhập Excel, dùng đúng tệp mẫu mà bộ e2e dùng
/// (`docs/fixtures/nhap-doan-sinh-co-loi.xlsx`: 4 dòng lỗi, 1 dòng hợp lệ).
///
/// Chạy trên database trong bộ nhớ nên không ghi vào database dev và không để lại
/// đợt nhập đã áp dụng — áp dụng tệp thật một lần là FileSha256 của tệp bị chốt
/// vĩnh viễn (mọi lần upload sau trả 409, xem test cuối).
/// </summary>
public class ImportExcelApplyTests
{
    private const string TepMau = "Fixtures/nhap-doan-sinh-co-loi.xlsx";
    private const string TenTep = "nhap-doan-sinh-co-loi.xlsx";

    private static AppDbContext NewDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"import-{Guid.NewGuid()}")
            // Áp dụng chạy trong transaction; InMemory không hỗ trợ nên bỏ cảnh báo.
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        return new AppDbContext(options);
    }

    private static ImportExportService NewService(AppDbContext db) =>
        new(db, new NguoiDungGia(), new PhamViGia(), NullLogger<ImportExportService>.Instance);

    private static Stream OpenTepMau() =>
        File.OpenRead(Path.Combine(AppContext.BaseDirectory, TepMau));

    [Fact]
    public async Task Apply_TaoDungMotDoanSinhTuDongHopLe()
    {
        await using var db = NewDb();
        var service = NewService(db);

        await using var tep = OpenTepMau();
        var xemTruoc = await service.UploadAndValidateStudentsAsync(tep, TenTep);
        Assert.True(xemTruoc.IsSuccess);
        Assert.Equal(5, xemTruoc.Value!.TotalRows);
        Assert.Equal(1, xemTruoc.Value.ValidRows);
        Assert.Equal(4, xemTruoc.Value.ErrorRows);

        var ketQua = await service.ApplyImportJobAsync(xemTruoc.Value.Id);

        Assert.True(ketQua.IsSuccess);
        Assert.Equal(1, ketQua.Value!.InsertedCount);
        Assert.Equal(0, ketQua.Value.UpdatedCount);

        var doanSinh = await db.Students.SingleAsync();
        Assert.Equal("Excel Hợp Lệ Mẫu", doanSinh.FullName);
        Assert.StartsWith("TN", doanSinh.Code);
        Assert.Null(doanSinh.DeletedAt);

        var dotNhap = await db.ImportJobs.SingleAsync();
        Assert.Equal(ImportJob.StatusApplied, dotNhap.Status);
        Assert.NotNull(dotNhap.AppliedAt);

        // Dòng hợp lệ không khai cấp lớp và không có số điện thoại phụ huynh,
        // nên áp dụng chỉ tạo hồ sơ đoàn sinh.
        Assert.Empty(db.Enrollments);
        Assert.Empty(db.Guardians);
    }

    [Fact]
    public async Task Apply_LanHai_TraConflictVaKhongTaoTrung()
    {
        await using var db = NewDb();
        var service = NewService(db);

        await using var tep = OpenTepMau();
        var xemTruoc = await service.UploadAndValidateStudentsAsync(tep, TenTep);
        await service.ApplyImportJobAsync(xemTruoc.Value!.Id);

        var lanHai = await service.ApplyImportJobAsync(xemTruoc.Value.Id);

        Assert.False(lanHai.IsSuccess);
        Assert.Equal(409, lanHai.StatusCode);
        Assert.Equal(1, await db.Students.CountAsync());
    }

    [Fact]
    public async Task Upload_LaiTepDaApDung_BiChanDeKhongNhapTrung()
    {
        await using var db = NewDb();
        var service = NewService(db);

        await using var tep = OpenTepMau();
        var xemTruoc = await service.UploadAndValidateStudentsAsync(tep, TenTep);
        await service.ApplyImportJobAsync(xemTruoc.Value!.Id);

        // Chốt an toàn theo FileSha256 dùng chung toàn hệ thống: đây cũng là lý do
        // bộ e2e không bấm "Xác nhận lưu" với tệp fixture thật.
        await using var tepLanHai = OpenTepMau();
        var trung = await service.UploadAndValidateStudentsAsync(tepLanHai, TenTep);

        Assert.False(trung.IsSuccess);
        Assert.Equal(409, trung.StatusCode);
    }

    private sealed class NguoiDungGia : ICurrentUser
    {
        public Guid? UserId { get; } = Guid.NewGuid();
        public string? UserName => "test";
        public string? FullName => "Người dùng test";
        public Guid? RoleId => null;
        public string? RoleCode => "Admin";
        public string? ScopeType => "All";
        public int? BranchId => null;
        public Guid? SecurityStamp => null;
        public bool IsAuthenticated => true;
        public bool MustChangePassword => false;
        public IReadOnlySet<string> Permissions => new HashSet<string>();
        public bool HasPermission(string permission) => true;
    }

    private sealed class PhamViGia : IScopeContext
    {
        public IQueryable<ClassRoom> ClassRooms(IQueryable<ClassRoom> query) => query;
        public IQueryable<Student> Students(IQueryable<Student> query) => query;
        public IQueryable<Enrollment> Enrollments(IQueryable<Enrollment> query) => query;
        public Task<bool> CanAccessClassRoomAsync(Guid classRoomId, CancellationToken ct = default) => Task.FromResult(true);
        public Task<bool> CanAccessStudentAsync(Guid studentId, CancellationToken ct = default) => Task.FromResult(true);
    }
}
