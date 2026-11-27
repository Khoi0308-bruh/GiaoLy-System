using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using GiaoLy.Infrastructure.Services.Students;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace GiaoLy.Tests.Students;

/// <summary>
/// Xoá mềm đoàn sinh phải rút luôn ghi danh đang học của họ. Nếu để lại, ghi danh đó
/// thành mồ côi: đoàn sinh không còn trong danh sách nên không ai rút lớp được qua API,
/// còn lớp thì bị giữ lại vĩnh viễn (đúng lỗi làm mỗi lượt e2e để lại một lớp).
/// </summary>
public class StudentDeleteTests
{
    private static AppDbContext NewDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"student-{Guid.NewGuid()}")
            .Options);

    private static StudentService NewService(AppDbContext db) =>
        new(db, new NguoiDungGia(), new PhamViGia(), NullLogger<StudentService>.Instance, new MoiTruongGia());

    private static Student SeedDoanSinh(AppDbContext db, string code = "TN269001")
    {
        var hocSinh = new Student { Code = code, FullName = "Đoàn sinh test" };
        db.Students.Add(hocSinh);
        db.SaveChanges();
        return hocSinh;
    }

    private static Enrollment SeedGhiDanh(AppDbContext db, Student hocSinh, string trangThai, string? ghiChu = null)
    {
        var ghiDanh = new Enrollment
        {
            StudentId = hocSinh.Id,
            ClassRoomId = Guid.NewGuid(),
            AcademicYearId = Guid.NewGuid(),
            Status = trangThai,
            StartDate = new DateOnly(2026, 9, 1),
            Note = ghiChu
        };
        db.Enrollments.Add(ghiDanh);
        db.SaveChanges();
        return ghiDanh;
    }

    [Fact]
    public async Task Xoa_RutLuonGhiDanhDangHoc()
    {
        await using var db = NewDb();
        var hocSinh = SeedDoanSinh(db);
        var ghiDanh = SeedGhiDanh(db, hocSinh, EnrollmentRules.Statuses.Active, "Ghi chú cũ");

        Assert.True((await NewService(db).DeleteStudentAsync(hocSinh.Id)).IsSuccess);

        var sauKhiXoa = await db.Enrollments.AsNoTracking().SingleAsync(e => e.Id == ghiDanh.Id);
        Assert.Equal(EnrollmentRules.Statuses.DropOut, sauKhiXoa.Status);
        Assert.NotNull(sauKhiXoa.EndDate);
        Assert.Contains("Rút khỏi lớp: hồ sơ đoàn sinh bị xoá", sauKhiXoa.Note);
        // Ghi chú cũ của ghi danh không bị ghi đè.
        Assert.StartsWith("Ghi chú cũ", sauKhiXoa.Note);

        // Đoàn sinh vẫn là xoá mềm, không xoá cứng.
        Assert.NotNull((await db.Students.IgnoreQueryFilters().SingleAsync(s => s.Id == hocSinh.Id)).DeletedAt);
    }

    [Theory]
    [InlineData(EnrollmentRules.Statuses.Promoted)]
    [InlineData(EnrollmentRules.Statuses.DropOut)]
    [InlineData(EnrollmentRules.Statuses.Transferred)]
    [InlineData(EnrollmentRules.Statuses.Graduated)]
    public async Task Xoa_KhongDongDenGhiDanhLichSu(string trangThai)
    {
        await using var db = NewDb();
        var hocSinh = SeedDoanSinh(db);
        var ghiDanh = SeedGhiDanh(db, hocSinh, trangThai);

        Assert.True((await NewService(db).DeleteStudentAsync(hocSinh.Id)).IsSuccess);

        var sauKhiXoa = await db.Enrollments.AsNoTracking().SingleAsync(e => e.Id == ghiDanh.Id);
        Assert.Equal(trangThai, sauKhiXoa.Status);
    }

    [Fact]
    public async Task Xoa_KhongDongDenGhiDanhCuaDoanSinhKhac()
    {
        await using var db = NewDb();
        var biXoa = SeedDoanSinh(db, "TN269002");
        var conLai = SeedDoanSinh(db, "TN269003");
        var cuaNguoiKhac = SeedGhiDanh(db, conLai, EnrollmentRules.Statuses.Active);

        Assert.True((await NewService(db).DeleteStudentAsync(biXoa.Id)).IsSuccess);

        var sauKhiXoa = await db.Enrollments.AsNoTracking().SingleAsync(e => e.Id == cuaNguoiKhac.Id);
        Assert.Equal(EnrollmentRules.Statuses.Active, sauKhiXoa.Status);
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

    private sealed class MoiTruongGia : IWebHostEnvironment
    {
        public string ApplicationName { get; set; } = "GiaoLy.Tests";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public string EnvironmentName { get; set; } = "Test";
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string WebRootPath { get; set; } = AppContext.BaseDirectory;
    }
}
