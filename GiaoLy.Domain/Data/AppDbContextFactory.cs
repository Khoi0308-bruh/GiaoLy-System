using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GiaoLy.Domain.Data;

/// <summary>
/// Factory dùng cho EF Core design-time (`dotnet ef migrations ...`).
/// Nhờ lớp này, EF không cần dựng host của API — tránh việc validator cấu hình
/// (Jwt:Key, connection string...) chặn các lệnh migration.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Server=.;Database=GiaoLyDB_DesignTime;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new AppDbContext(options);
    }
}
