using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using GiaoLy.Infrastructure.Services.Organization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace GiaoLy.Tests.Organization;

/// <summary>
/// Xoá lớp học chỉ bị chặn khi lớp còn ghi danh Active của đoàn sinh còn hồ sơ. Mọi
/// trạng thái khác (rút lớp, chuyển lớp, tốt nghiệp, lên lớp, ở lại lớp) là lịch sử,
/// và ghi danh của đoàn sinh đã xoá mềm cũng không giữ lớp lại — trước đây mọi dòng
/// ghi danh đều chặn nên lớp cũ không bao giờ xoá được.
/// </summary>
public class ClassRoomDeleteTests
{
    private static AppDbContext NewDb() =>
        new(new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"classroom-{Guid.NewGuid()}")
            .Options);

    private static ClassRoomService NewService(AppDbContext db) =>
        new(db, new PhamViGia(), NullLogger<ClassRoomService>.Instance);

    private static ClassRoom SeedLop(AppDbContext db)
    {
        var lop = new ClassRoom { Section = "E2E", RoomName = "P.E2E" };
        db.ClassRooms.Add(lop);
        db.SaveChanges();
        return lop;
    }

    private static Student SeedDoanSinh(AppDbContext db, DateTime? xoaLuc = null)
    {
        var hocSinh = new Student { Code = "TN269999", FullName = "Đoàn sinh test", DeletedAt = xoaLuc };
        db.Students.Add(hocSinh);
        db.SaveChanges();
        return hocSinh;
    }

    private static void SeedGhiDanh(AppDbContext db, ClassRoom lop, string trangThai, Student? hocSinh = null)
    {
        hocSinh ??= SeedDoanSinh(db);
        db.Enrollments.Add(new Enrollment
        {
            ClassRoomId = lop.Id,
            AcademicYearId = lop.AcademicYearId,
            StudentId = hocSinh.Id,
            Status = trangThai,
            StartDate = new DateOnly(2026, 9, 1)
        });
        db.SaveChanges();
    }

    // AppDbContext lọc sẵn bản ghi đã xoá mềm, nên phải bỏ filter mới thấy dòng vừa xoá.
    private static Task<ClassRoom> DocLaiLop(AppDbContext db, Guid id) =>
        db.ClassRooms.IgnoreQueryFilters().SingleAsync(c => c.Id == id);

    [Fact]
    public async Task Xoa_KhiConGhiDanhDangHoc_ThiBiChan()
    {
        await using var db = NewDb();
        var lop = SeedLop(db);
        SeedGhiDanh(db, lop, EnrollmentRules.Statuses.Active);

        var ketQua = await NewService(db).DeleteClassRoomAsync(lop.Id);

        Assert.False(ketQua.IsSuccess);
        Assert.Equal(400, ketQua.StatusCode);
        Assert.Null((await DocLaiLop(db, lop.Id)).DeletedAt);
    }

    [Theory]
    [InlineData(EnrollmentRules.Statuses.Promoted)]
    [InlineData(EnrollmentRules.Statuses.Repeated)]
    [InlineData(EnrollmentRules.Statuses.DropOut)]
    [InlineData(EnrollmentRules.Statuses.Transferred)]
    [InlineData(EnrollmentRules.Statuses.Graduated)]
    public async Task Xoa_KhiGhiDanhChiConLaLichSu_ThiXoaMemDuoc(string trangThai)
    {
        await using var db = NewDb();
        var lop = SeedLop(db);
        SeedGhiDanh(db, lop, trangThai);

        var ketQua = await NewService(db).DeleteClassRoomAsync(lop.Id);

        Assert.True(ketQua.IsSuccess);
        Assert.NotNull((await DocLaiLop(db, lop.Id)).DeletedAt);
    }

    [Fact]
    public async Task Xoa_KhiGhiDanhActiveCuaDoanSinhDaXoa_ThiXoaMemDuoc()
    {
        await using var db = NewDb();
        var lop = SeedLop(db);
        // Đoàn sinh đã xoá mềm nhưng ghi danh còn Active: không còn ai theo học trong lớp.
        SeedGhiDanh(db, lop, EnrollmentRules.Statuses.Active, SeedDoanSinh(db, DateTime.UtcNow));

        var ketQua = await NewService(db).DeleteClassRoomAsync(lop.Id);

        Assert.True(ketQua.IsSuccess);
        Assert.NotNull((await DocLaiLop(db, lop.Id)).DeletedAt);
    }

    [Fact]
    public async Task Xoa_LopKhongCoGhiDanh_ThiXoaMemDuoc()
    {
        await using var db = NewDb();
        var lop = SeedLop(db);

        Assert.True((await NewService(db).DeleteClassRoomAsync(lop.Id)).IsSuccess);
        Assert.NotNull((await DocLaiLop(db, lop.Id)).DeletedAt);
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
