using GiaoLy.Domain.Entities; // Dòng này sẽ hết báo đỏ sau khi sửa Bước 1
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Domain.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<LiturgicalEvent> LiturgicalEvents { get; set; } = null!;
    public DbSet<Leader> Leaders { get; set; }
    public DbSet<AcademicYear> AcademicYears { get; set; }
    public DbSet<ClassRoom> ClassRooms { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Certificate> Certificates { get; set; }
    public DbSet<DraftAction> DraftActions { get; set; }
    public DbSet<NewsSource> NewsSources { get; set; }
    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<StudentScore> StudentScores { get; set; }
    public DbSet<Banner> Banners { get; set; }
    
    // Family Model
    public DbSet<Family> Families { get; set; }
    
    // Các bảng mới bổ sung cho tính năng GLV
    public DbSet<SpiritualBouquet> SpiritualBouquets { get; set; }
    public DbSet<SacramentRequirement> SacramentRequirements { get; set; }
    public DbSet<SacramentRecord> SacramentRecords { get; set; }
    public DbSet<LessonPlan> LessonPlans { get; set; }
    public DbSet<DutyAssignment> DutyAssignments { get; set; }
    public DbSet<CampEvent> CampEvents { get; set; }
    public DbSet<CampRegistration> CampRegistrations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>().Property(s => s.FullName).IsRequired().HasMaxLength(200);

        // RBAC Relationships
        modelBuilder.Entity<RolePermission>()
            .HasKey(rp => new { rp.RoleId, rp.PermissionId });

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId);

        modelBuilder.Entity<User>()
            .HasOne(u => u.RoleEntity)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);
    }
}