using GiaoLy.Domain.Data;
using Microsoft.EntityFrameworkCore;

// Công cụ một lần: tạo database tham chiếu từ MODEL hiện tại (EnsureCreated),
// để so sánh với database thật và sinh script bổ sung cột còn thiếu.
// Không dùng cho production; chỉ phục vụ G2-7.

// Chế độ tiện ích: sinh hash BCrypt để đặt lại mật khẩu dev
if (args.Length >= 2 && args[0] == "--hash")
{
    Console.WriteLine(BCrypt.Net.BCrypt.HashPassword(args[1], 12));
    return 0;
}

var connectionString = args.Length > 0
    ? args[0]
    : "Server=.;Database=GiaoLyDB_ModelRef;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

if (!connectionString.Contains("ModelRef", StringComparison.OrdinalIgnoreCase))
{
    Console.Error.WriteLine("Từ chối chạy: chuỗi kết nối phải trỏ tới database tham chiếu có tên chứa 'ModelRef'.");
    return 2;
}

var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlServer(connectionString)
    .Options;

using var db = new AppDbContext(options);

Console.WriteLine($"Đang xoá (nếu có) và tạo mới database tham chiếu...");
db.Database.EnsureDeleted();
db.Database.EnsureCreated();

var tables = db.Model.GetEntityTypes()
    .Select(e => e.GetTableName())
    .Where(t => t != null)
    .Distinct()
    .Count();

Console.WriteLine($"OK: đã tạo schema tham chiếu với {tables} bảng.");
return 0;
