using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.Domain.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<Announcement> Announcements { get; set; } = null!;
    public DbSet<Document> Documents { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
    public DbSet<GuardianLink> GuardianLinks { get; set; } = null!;
    public DbSet<Branch> Branches { get; set; } = null!;
    public DbSet<ClassLevel> ClassLevels { get; set; } = null!;
    public DbSet<AcademicYear> AcademicYears { get; set; } = null!;
    public DbSet<ClassRoom> ClassRooms { get; set; } = null!;
    public DbSet<ClassRoomTeacher> ClassRoomTeachers { get; set; } = null!;
    public DbSet<Family> Families { get; set; } = null!;
    public DbSet<Enrollment> Enrollments { get; set; } = null!;
    public DbSet<Grade> Grades { get; set; } = null!;
    public DbSet<Certificate> Certificates { get; set; } = null!;
    public DbSet<DraftAction> DraftActions { get; set; } = null!;
    public DbSet<NewsSource> NewsSources { get; set; } = null!;
    public DbSet<NewsArticle> NewsArticles { get; set; } = null!;
    public DbSet<StudentScore> StudentScores { get; set; } = null!;
    public DbSet<Banner> Banners { get; set; } = null!;
    public DbSet<SpiritualBouquet> SpiritualBouquets { get; set; } = null!;
    public DbSet<SacramentRequirement> SacramentRequirements { get; set; } = null!;
    public DbSet<SacramentRecord> SacramentRecords { get; set; } = null!;
    public DbSet<LessonPlan> LessonPlans { get; set; } = null!;
    public DbSet<DutyAssignment> DutyAssignments { get; set; } = null!;
    public DbSet<CampEvent> CampEvents { get; set; } = null!;
    public DbSet<CampRegistration> CampRegistrations { get; set; } = null!;
    public DbSet<CampPayment> CampPayments { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<Leader> Leaders { get; set; } = null!;
    public DbSet<LiturgicalEvent> LiturgicalEvents { get; set; } = null!;
    public DbSet<Guardian> Guardians { get; set; } = null!;
    public DbSet<StudentGuardian> StudentGuardians { get; set; } = null!;
    public DbSet<StudentNote> StudentNotes { get; set; } = null!;
    public DbSet<StudentStatusChange> StudentStatusChanges { get; set; } = null!;
    public DbSet<ImportJob> ImportJobs { get; set; } = null!;
    public DbSet<StudentSacrament> StudentSacraments { get; set; } = null!;
    public DbSet<StudentRequirementProgress> StudentRequirementProgresses { get; set; } = null!;
    public DbSet<GradeUnlock> GradeUnlocks { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;
    public DbSet<BackgroundJobRun> BackgroundJobRuns { get; set; } = null!;
    public DbSet<PromotionBatch> PromotionBatches { get; set; } = null!;
    public DbSet<PromotionDraft> PromotionDrafts { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Students
        modelBuilder.Entity<Student>(b =>
        {
            b.HasIndex(s => s.Code).IsUnique();
            b.HasIndex(s => s.FullNameNormalized);
            b.HasIndex(s => s.BirthDate);
            b.Property(s => s.Code).IsRequired().HasMaxLength(20);
            b.Property(s => s.FullName).IsRequired().HasMaxLength(120);
            b.Property(s => s.FullNameNormalized).IsRequired().HasMaxLength(120);
            b.Property(s => s.Status).IsRequired().HasMaxLength(12);
            b.Property(s => s.Gender).HasMaxLength(10);
            b.Property(s => s.Area).HasMaxLength(100);
            b.Property(s => s.Address).HasMaxLength(300);
            b.Property(s => s.BloodType).HasMaxLength(10);
            b.Property(s => s.Allergies).HasMaxLength(500);
            b.Property(s => s.HealthNotes).HasMaxLength(500);
            b.Property(s => s.PhotoUrl).HasMaxLength(500);
            b.Property(s => s.Notes).HasMaxLength(1000);
            b.Property(s => s.RowVersion).IsRowVersion();

            b.HasOne(s => s.BranchEntity)
             .WithMany()
             .HasForeignKey(s => s.BranchId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(s => s.Family)
             .WithMany(f => f.Students)
             .HasForeignKey(s => s.FamilyId)
             .OnDelete(DeleteBehavior.SetNull);

            b.HasQueryFilter(s => s.DeletedAt == null);
        });

        // Guardians
        modelBuilder.Entity<Guardian>(b =>
        {
            b.HasIndex(g => g.Phone);
            b.Property(g => g.FullName).IsRequired().HasMaxLength(120);
            b.Property(g => g.Phone).IsRequired().HasMaxLength(20);
            b.Property(g => g.Occupation).HasMaxLength(100);
            b.Property(g => g.Religion).HasMaxLength(60);
            b.Property(g => g.Email).HasMaxLength(120);
        });

        // StudentGuardians
        modelBuilder.Entity<StudentGuardian>(b =>
        {
            b.HasKey(sg => new { sg.StudentId, sg.GuardianId });
            b.Property(sg => sg.Relationship).IsRequired().HasMaxLength(30);

            b.HasOne(sg => sg.Student)
             .WithMany(s => s.Guardians)
             .HasForeignKey(sg => sg.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(sg => sg.Guardian)
             .WithMany(g => g.StudentGuardians)
             .HasForeignKey(sg => sg.GuardianId)
             .OnDelete(DeleteBehavior.Restrict);

            // Filtered index: at most 1 primary guardian per student
            b.HasIndex(sg => sg.StudentId)
             .HasFilter("[IsPrimary] = 1")
             .IsUnique();
        });

        // StudentNotes
        modelBuilder.Entity<StudentNote>(b =>
        {
            b.Property(sn => sn.Content).IsRequired().HasMaxLength(2000);

            b.HasOne(sn => sn.Student)
             .WithMany(s => s.StudentNotes)
             .HasForeignKey(sn => sn.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(sn => sn.Author)
             .WithMany()
             .HasForeignKey(sn => sn.AuthorId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(sn => new { sn.StudentId, sn.CreatedAt });
            b.HasQueryFilter(sn => sn.DeletedAt == null);
        });

        // StudentStatusChanges
        modelBuilder.Entity<StudentStatusChange>(b =>
        {
            b.Property(sc => sc.NewStatus).IsRequired().HasMaxLength(12);
            b.Property(sc => sc.OldStatus).HasMaxLength(12);
            b.Property(sc => sc.Reason).IsRequired().HasMaxLength(500);

            b.HasOne(sc => sc.Student)
             .WithMany(s => s.StatusChanges)
             .HasForeignKey(sc => sc.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(sc => sc.Changer)
             .WithMany()
             .HasForeignKey(sc => sc.ChangedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(sc => new { sc.StudentId, sc.ChangedAt });
        });

        // Roles
        modelBuilder.Entity<Role>(b =>
        {
            b.HasIndex(r => r.Code).IsUnique();
            b.Property(r => r.Code).IsRequired().HasMaxLength(50);
            b.Property(r => r.Name).IsRequired().HasMaxLength(100);
            b.Property(r => r.ScopeType).IsRequired().HasMaxLength(12);
            b.Property(r => r.RowVersion).IsRowVersion();
        });

        // Permissions
        modelBuilder.Entity<Permission>(b =>
        {
            b.HasIndex(p => p.Code).IsUnique();
            b.Property(p => p.Code).IsRequired().HasMaxLength(80);
            b.Property(p => p.Name).IsRequired().HasMaxLength(150);
            b.Property(p => p.Module).IsRequired().HasMaxLength(50);
        });

        // RolePermission
        modelBuilder.Entity<RolePermission>(b =>
        {
            b.HasKey(rp => new { rp.RoleId, rp.PermissionId });
            b.HasOne(rp => rp.Role)
             .WithMany(r => r.RolePermissions)
             .HasForeignKey(rp => rp.RoleId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(rp => rp.Permission)
             .WithMany(p => p.RolePermissions)
             .HasForeignKey(rp => rp.PermissionId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Users
        modelBuilder.Entity<User>(b =>
        {
            b.HasIndex(u => u.Username).IsUnique();
            b.Property(u => u.Username).IsRequired().HasMaxLength(50);
            b.Property(u => u.PasswordHash).IsRequired().HasMaxLength(100);
            b.Property(u => u.FullName).IsRequired().HasMaxLength(120);
            b.Property(u => u.SecurityStamp).IsRequired();
            b.Property(u => u.RowVersion).IsRowVersion();

            b.HasOne(u => u.RoleEntity)
             .WithMany(r => r.Users)
             .HasForeignKey(u => u.RoleId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasQueryFilter(u => u.DeletedAt == null);
        });

        // RefreshTokens
        modelBuilder.Entity<RefreshToken>(b =>
        {
            b.HasIndex(rt => rt.TokenHash).IsUnique();
            b.Property(rt => rt.TokenHash).IsRequired().HasMaxLength(100);
            b.HasOne(rt => rt.User)
             .WithMany(u => u.RefreshTokens)
             .HasForeignKey(rt => rt.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // GuardianLinks
        modelBuilder.Entity<GuardianLink>(b =>
        {
            b.HasIndex(gl => new { gl.UserId, gl.StudentId }).IsUnique();
            b.Property(gl => gl.Relationship).IsRequired().HasMaxLength(30);

            b.HasOne(gl => gl.User)
             .WithMany(u => u.GuardianLinks)
             .HasForeignKey(gl => gl.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(gl => gl.Student)
             .WithMany()
             .HasForeignKey(gl => gl.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(gl => gl.Verifier)
             .WithMany()
             .HasForeignKey(gl => gl.VerifiedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Branches
        modelBuilder.Entity<Branch>(b =>
        {
            b.HasIndex(br => br.Code).IsUnique();
            b.Property(br => br.Code).IsRequired().HasMaxLength(20);
            b.Property(br => br.Name).IsRequired().HasMaxLength(60);
        });

        // ClassLevels
        modelBuilder.Entity<ClassLevel>(b =>
        {
            b.HasIndex(cl => cl.Code).IsUnique();
            b.HasIndex(cl => cl.LevelKey).IsUnique();
            b.Property(cl => cl.Code).IsRequired().HasMaxLength(20);
            b.Property(cl => cl.Name).IsRequired().HasMaxLength(60);

            b.HasOne(cl => cl.Branch)
             .WithMany(br => br.ClassLevels)
             .HasForeignKey(cl => cl.BranchId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(cl => cl.NextLevel)
             .WithMany()
             .HasForeignKey(cl => cl.NextLevelId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // AcademicYears
        modelBuilder.Entity<AcademicYear>(b =>
        {
            b.Property(ay => ay.Name).IsRequired().HasMaxLength(100);
            b.Property(ay => ay.Status).IsRequired().HasMaxLength(12);
            b.Property(ay => ay.RowVersion).IsRowVersion();

            // Filtered index: only 1 Active academic year
            b.HasIndex(ay => ay.Status)
             .HasFilter("[Status] = 'Active'")
             .IsUnique();
        });

        // ClassRooms
        modelBuilder.Entity<ClassRoom>(b =>
        {
            b.Property(cr => cr.Section).IsRequired().HasMaxLength(10);
            b.Property(cr => cr.RoomName).HasMaxLength(60);
            b.Property(cr => cr.RowVersion).IsRowVersion();

            b.HasOne(cr => cr.AcademicYear)
             .WithMany(ay => ay.ClassRooms)
             .HasForeignKey(cr => cr.AcademicYearId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(cr => cr.ClassLevel)
             .WithMany(cl => cl.ClassRooms)
             .HasForeignKey(cr => cr.ClassLevelId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasQueryFilter(cr => cr.DeletedAt == null);

            // Filtered index: unique section per class level in an academic year
            b.HasIndex(cr => new { cr.AcademicYearId, cr.ClassLevelId, cr.Section })
             .HasFilter("[DeletedAt] IS NULL")
             .IsUnique();
        });

        // ClassRoomTeachers
        modelBuilder.Entity<ClassRoomTeacher>(b =>
        {
            b.HasKey(crt => new { crt.ClassRoomId, crt.UserId });

            b.HasOne(crt => crt.ClassRoom)
             .WithMany(cr => cr.Teachers)
             .HasForeignKey(crt => crt.ClassRoomId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(crt => crt.User)
             .WithMany()
             .HasForeignKey(crt => crt.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            // Filtered index: only 1 Lead teacher per class
            b.HasIndex(crt => crt.ClassRoomId)
             .HasFilter("[IsLead] = 1")
             .IsUnique();
        });

        // Families
        modelBuilder.Entity<Family>(b =>
        {
            b.Property(f => f.Name).IsRequired().HasMaxLength(100);
            b.Property(f => f.PatronSaint).HasMaxLength(60);
            b.Property(f => f.Description).HasMaxLength(300);

            b.HasOne(f => f.ClassRoom)
             .WithMany(cr => cr.Families)
             .HasForeignKey(f => f.ClassRoomId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasQueryFilter(f => f.DeletedAt == null);
        });

        // Enrollments
        modelBuilder.Entity<Enrollment>(b =>
        {
            b.Property(e => e.Status).IsRequired().HasMaxLength(12);
            b.Property(e => e.Note).HasMaxLength(500);

            b.HasOne(e => e.Student)
             .WithMany(s => s.Enrollments)
             .HasForeignKey(e => e.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(e => e.ClassRoom)
             .WithMany(c => c.Enrollments)
             .HasForeignKey(e => e.ClassRoomId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(e => e.AcademicYear)
             .WithMany()
             .HasForeignKey(e => e.AcademicYearId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(e => new { e.StudentId, e.AcademicYearId })
             .HasFilter("[Status] = 'Active'")
             .IsUnique();

            b.HasIndex(e => new { e.ClassRoomId, e.Status });
            b.HasIndex(e => e.StudentId);
            b.Property(e => e.RowVersion).IsRowVersion();

            b.HasOne(e => e.Grade)
             .WithOne(g => g.Enrollment)
             .HasForeignKey<Grade>(g => g.EnrollmentId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Grades
        modelBuilder.Entity<Grade>(b =>
        {
            b.ToTable("Grades");
            b.HasKey(g => g.Id);
            b.Property(g => g.Oral).HasPrecision(4, 2);
            b.Property(g => g.SmallTest).HasPrecision(4, 2);
            b.Property(g => g.BigTest).HasPrecision(4, 2);
            b.Property(g => g.FinalExam).HasPrecision(4, 2);
            b.Property(g => g.ComputedGpa).HasPrecision(3, 1);
            b.Property(g => g.ComputedStatus).HasMaxLength(12);
            b.Property(g => g.Remarks).HasMaxLength(500);
            b.Property(g => g.RowVersion).IsRowVersion();

            b.HasIndex(g => g.EnrollmentId).IsUnique();
        });

        // GradeUnlocks
        modelBuilder.Entity<GradeUnlock>(b =>
        {
            b.ToTable("GradeUnlocks");
            b.HasKey(u => u.Id);
            b.Property(u => u.Reason).IsRequired().HasMaxLength(300);

            b.HasIndex(u => new { u.ClassRoomId, u.ExpiresAt });

            b.HasOne(u => u.ClassRoom)
             .WithMany()
             .HasForeignKey(u => u.ClassRoomId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(u => u.User)
             .WithMany()
             .HasForeignKey(u => u.UnlockedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // SystemSettings
        modelBuilder.Entity<SystemSetting>(b =>
        {
            b.ToTable("SystemSettings");
            b.HasKey(s => s.Key);
            b.Property(s => s.Key).HasMaxLength(100);
            b.Property(s => s.Value).IsRequired().HasMaxLength(2000);
            b.Property(s => s.Description).HasMaxLength(300);
        });

        // BackgroundJobRuns
        modelBuilder.Entity<BackgroundJobRun>(b =>
        {
            b.ToTable("BackgroundJobRuns");
            b.HasKey(j => j.Id);
            b.Property(j => j.JobName).IsRequired().HasMaxLength(60);
            b.Property(j => j.StartedAt).IsRequired();
            b.Property(j => j.Status).IsRequired().HasMaxLength(12);
            b.Property(j => j.Message).HasMaxLength(1000);
            b.Property(j => j.LockedBy).HasMaxLength(100);
            b.HasIndex(j => j.JobName);
            b.HasIndex(j => j.StartedAt);
        });

        // PromotionBatches
        modelBuilder.Entity<PromotionBatch>(b =>
        {
            b.ToTable("PromotionBatches");
            b.HasKey(pb => pb.Id);
            b.Property(pb => pb.Status).IsRequired().HasMaxLength(12);
            b.Property(pb => pb.RowVersion).IsRowVersion();

            b.HasIndex(pb => new { pb.SourceYearId, pb.TargetYearId })
             .HasFilter("[Status] <> 'Applied' AND [Status] <> 'Cancelled'")
             .IsUnique();

            b.HasOne(pb => pb.SourceYear)
             .WithMany()
             .HasForeignKey(pb => pb.SourceYearId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pb => pb.TargetYear)
             .WithMany()
             .HasForeignKey(pb => pb.TargetYearId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pb => pb.Creator)
             .WithMany()
             .HasForeignKey(pb => pb.CreatedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pb => pb.Applier)
             .WithMany()
             .HasForeignKey(pb => pb.AppliedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasMany(pb => pb.Drafts)
             .WithOne(d => d.Batch)
             .HasForeignKey(d => d.BatchId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // PromotionDrafts
        modelBuilder.Entity<PromotionDraft>(b =>
        {
            b.ToTable("PromotionDrafts");
            b.HasKey(pd => pd.Id);
            b.Property(pd => pd.Outcome).IsRequired().HasMaxLength(12);
            b.Property(pd => pd.Status).IsRequired().HasMaxLength(12);
            b.Property(pd => pd.Reason).HasMaxLength(500);
            b.Property(pd => pd.RowVersion).IsRowVersion();

            b.HasIndex(pd => new { pd.BatchId, pd.StudentId }).IsUnique();

            b.HasOne(pd => pd.Student)
             .WithMany()
             .HasForeignKey(pd => pd.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pd => pd.FromEnrollment)
             .WithMany()
             .HasForeignKey(pd => pd.FromEnrollmentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pd => pd.SuggestedClassRoom)
             .WithMany()
             .HasForeignKey(pd => pd.SuggestedClassRoomId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pd => pd.Decider)
             .WithMany()
             .HasForeignKey(pd => pd.DecidedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(pd => pd.AppliedEnrollment)
             .WithMany()
             .HasForeignKey(pd => pd.AppliedEnrollmentId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Certificates
        modelBuilder.Entity<Certificate>(b =>
        {
            b.ToTable("Certificates");
            b.HasKey(c => c.Id);
            b.Property(c => c.CertificateType).IsRequired().HasMaxLength(20);
            b.Property(c => c.VerificationCode).IsRequired().HasMaxLength(24);
            b.Property(c => c.Snapshot).IsRequired();
            b.Property(c => c.SignedBy).HasMaxLength(120);
            b.Property(c => c.Status).IsRequired().HasMaxLength(10);
            b.Property(c => c.RevokeReason).HasMaxLength(300);
            b.Property(c => c.PdfSha256).HasMaxLength(64);
            b.Property(c => c.RowVersion).IsRowVersion();

            b.HasIndex(c => c.VerificationCode).IsUnique();

            b.HasIndex(c => new { c.StudentId, c.CertificateType })
             .HasFilter("[Status] = 'Issued'")
             .IsUnique();

            b.HasOne(c => c.Student)
             .WithMany()
             .HasForeignKey(c => c.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(c => c.StudentSacrament)
             .WithMany()
             .HasForeignKey(c => c.StudentSacramentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(c => c.Issuer)
             .WithMany()
             .HasForeignKey(c => c.IssuedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(c => c.Revoker)
             .WithMany()
             .HasForeignKey(c => c.RevokedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // AuditLog Configuration
        modelBuilder.Entity<AuditLog>(b =>
        {
            b.ToTable("AuditLogs");
            b.HasKey(a => a.Id);
            b.Property(a => a.OccurredAt).IsRequired();
            b.Property(a => a.Action).IsRequired().HasMaxLength(60);
            b.Property(a => a.EntityType).IsRequired().HasMaxLength(60);
            b.Property(a => a.EntityId).HasMaxLength(64);
            b.Property(a => a.UserName).HasMaxLength(50);
            b.Property(a => a.IpAddress).HasMaxLength(45);
            b.Property(a => a.UserAgent).HasMaxLength(300);
            b.Property(a => a.CorrelationId).HasMaxLength(64);
            b.HasIndex(a => new { a.EntityType, a.EntityId });
            b.HasIndex(a => a.OccurredAt);
        });

        // ImportJobs
        modelBuilder.Entity<ImportJob>(b =>
        {
            b.Property(j => j.ImportType).IsRequired().HasMaxLength(30);
            b.Property(j => j.FileName).IsRequired().HasMaxLength(260);
            b.Property(j => j.FileSha256).IsRequired().HasMaxLength(64);
            b.Property(j => j.Status).IsRequired().HasMaxLength(12);

            b.HasOne(j => j.Uploader)
             .WithMany()
             .HasForeignKey(j => j.UploadedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(j => j.FileSha256);
            b.HasIndex(j => new { j.UploadedBy, j.CreatedAt });
        });

        // StudentSacraments
        modelBuilder.Entity<StudentSacrament>(b =>
        {
            b.Property(ss => ss.SacramentType).IsRequired().HasMaxLength(20);
            b.Property(ss => ss.Place).HasMaxLength(200);
            b.Property(ss => ss.Minister).HasMaxLength(120);
            b.Property(ss => ss.Sponsor).HasMaxLength(120);
            b.Property(ss => ss.BookNumber).HasMaxLength(60);
            b.Property(ss => ss.Note).HasMaxLength(500);
            b.Property(ss => ss.RowVersion).IsRowVersion();

            b.HasOne(ss => ss.Student)
             .WithMany(s => s.Sacraments)
             .HasForeignKey(ss => ss.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(ss => ss.Verifier)
             .WithMany()
             .HasForeignKey(ss => ss.VerifiedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(ss => new { ss.StudentId, ss.SacramentType }).IsUnique();
        });

        // SacramentRequirements
        modelBuilder.Entity<SacramentRequirement>(b =>
        {
            b.Property(sr => sr.SacramentType).IsRequired().HasMaxLength(20);
            b.Property(sr => sr.Name).IsRequired().HasMaxLength(200);
            b.Property(sr => sr.Description).HasMaxLength(500);
        });

        // StudentRequirementProgress
        modelBuilder.Entity<StudentRequirementProgress>(b =>
        {
            b.Property(srp => srp.Note).HasMaxLength(500);

            b.HasOne(srp => srp.Student)
             .WithMany(s => s.RequirementProgresses)
             .HasForeignKey(srp => srp.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(srp => srp.Requirement)
             .WithMany(sr => sr.Progresses)
             .HasForeignKey(srp => srp.RequirementId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(srp => srp.Evaluator)
             .WithMany()
             .HasForeignKey(srp => srp.EvaluatorUserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(srp => new { srp.StudentId, srp.RequirementId }).IsUnique();
        });

        // CampEvents
        modelBuilder.Entity<CampEvent>(b =>
        {
            b.ToTable("CampEvents");
            b.HasKey(e => e.Id);
            b.Property(e => e.Name).IsRequired().HasMaxLength(200);
            b.Property(e => e.Location).IsRequired().HasMaxLength(300);
            b.Property(e => e.Fee).HasColumnType("decimal(12,0)");
            b.Property(e => e.Description).HasMaxLength(2000);
            b.HasQueryFilter(e => e.DeletedAt == null);

            b.HasOne(e => e.Branch)
             .WithMany()
             .HasForeignKey(e => e.BranchId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(e => e.AcademicYear)
             .WithMany()
             .HasForeignKey(e => e.AcademicYearId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // CampRegistrations
        modelBuilder.Entity<CampRegistration>(b =>
        {
            b.ToTable("CampRegistrations");
            b.HasKey(r => r.Id);
            b.Property(r => r.TeamNumber).HasMaxLength(20);
            b.Property(r => r.Note).HasMaxLength(500);
            b.Property(r => r.Status).IsRequired().HasMaxLength(12);

            b.HasOne(r => r.CampEvent)
             .WithMany(e => e.Registrations)
             .HasForeignKey(r => r.CampEventId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(r => r.Student)
             .WithMany()
             .HasForeignKey(r => r.StudentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(r => r.RegisteredByUser)
             .WithMany()
             .HasForeignKey(r => r.RegisteredBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(r => new { r.CampEventId, r.StudentId })
             .IsUnique()
             .HasDatabaseName("UQ_CampRegistrations_EventStudent");
        });

        // CampPayments
        modelBuilder.Entity<CampPayment>(b =>
        {
            b.ToTable("CampPayments");
            b.HasKey(p => p.Id);
            b.Property(p => p.Amount).HasColumnType("decimal(12,0)");
            b.Property(p => p.ReceiptNumber).HasMaxLength(40);
            b.Property(p => p.Note).HasMaxLength(300);

            b.HasOne(p => p.Registration)
             .WithMany(r => r.Payments)
             .HasForeignKey(p => p.RegistrationId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(p => p.ReceivedByUser)
             .WithMany()
             .HasForeignKey(p => p.ReceivedBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(p => p.ReversesPayment)
             .WithMany()
             .HasForeignKey(p => p.ReversesPaymentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(p => p.ReceiptNumber)
             .IsUnique()
             .HasFilter("[ReceiptNumber] IS NOT NULL")
             .HasDatabaseName("UX_CampPayments_Receipt");

            b.HasIndex(p => p.RegistrationId)
             .HasDatabaseName("IX_CampPayments_Registration");
        });

        // DutyAssignments
        modelBuilder.Entity<DutyAssignment>(b =>
        {
            b.ToTable("DutyAssignments");
            b.HasKey(d => d.Id);
            b.Property(d => d.RoleName).IsRequired().HasMaxLength(60);
            b.Property(d => d.Note).HasMaxLength(300);

            b.HasOne(d => d.User)
             .WithMany()
             .HasForeignKey(d => d.UserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(d => d.ClassRoom)
             .WithMany()
             .HasForeignKey(d => d.ClassRoomId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(d => new { d.UserId, d.ClassRoomId, d.DutyDate, d.RoleName })
             .IsUnique()
             .HasDatabaseName("UQ_DutyAssignments_Slot");

            b.HasIndex(d => d.DutyDate)
             .HasDatabaseName("IX_DutyAssignments_Date");
        });

        // LessonPlans
        modelBuilder.Entity<LessonPlan>(b =>
        {
            b.ToTable("LessonPlans");
            b.HasKey(l => l.Id);
            b.Property(l => l.Title).IsRequired().HasMaxLength(200);
            b.Property(l => l.Tags).HasMaxLength(300);
            b.Property(l => l.Visibility).IsRequired().HasMaxLength(10);
            b.Property(l => l.RowVersion).IsRowVersion();
            b.HasQueryFilter(l => l.DeletedAt == null);

            b.HasOne(l => l.AuthorUser)
             .WithMany()
             .HasForeignKey(l => l.AuthorUserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(l => l.ClassRoom)
             .WithMany()
             .HasForeignKey(l => l.ClassRoomId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // SpiritualBouquets
        modelBuilder.Entity<SpiritualBouquet>(b =>
        {
            b.ToTable("SpiritualBouquets");
            b.HasKey(b => b.Id);
            b.Property(b => b.BouquetType).IsRequired().HasMaxLength(40);
            b.Property(b => b.Note).HasMaxLength(300);

            b.HasOne(b => b.Enrollment)
             .WithMany()
             .HasForeignKey(b => b.EnrollmentId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(b => b.GivenByUser)
             .WithMany()
             .HasForeignKey(b => b.GivenBy)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(b => b.ReversesBouquet)
             .WithMany()
             .HasForeignKey(b => b.ReversesBouquetId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(b => new { b.EnrollmentId, b.BouquetDate })
             .HasDatabaseName("IX_SpiritualBouquets_Enrollment");
        });

        // Announcements
        modelBuilder.Entity<Announcement>(b =>
        {
            b.ToTable("Announcements");
            b.HasKey(a => a.Id);
            b.Property(a => a.Title).IsRequired().HasMaxLength(200);
            b.Property(a => a.ContentHtml).IsRequired();
            b.Property(a => a.AnnouncementType).IsRequired().HasMaxLength(10);
            b.Property(a => a.Audience).IsRequired().HasMaxLength(12);
            b.HasQueryFilter(a => a.DeletedAt == null);

            b.HasOne(a => a.BranchEntity)
             .WithMany()
             .HasForeignKey(a => a.BranchId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(a => a.ClassRoom)
             .WithMany()
             .HasForeignKey(a => a.ClassRoomId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(a => a.AuthorUser)
             .WithMany()
             .HasForeignKey(a => a.AuthorUserId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(a => new { a.Audience, a.PublishedAt })
             .HasDatabaseName("IX_Announcements_Published");
        });

        // Banners
        modelBuilder.Entity<Banner>(b =>
        {
            b.ToTable("Banners");
            b.HasKey(bn => bn.Id);
            b.Property(bn => bn.Title).IsRequired().HasMaxLength(200);
            b.Property(bn => bn.ImageUrl).IsRequired().HasMaxLength(500);
            b.Property(bn => bn.LinkUrl).HasMaxLength(500);
            b.HasQueryFilter(bn => bn.DeletedAt == null);
        });

        // Documents
        modelBuilder.Entity<Document>(b =>
        {
            b.ToTable("Documents");
            b.HasKey(d => d.Id);
            b.Property(d => d.FileName).IsRequired().HasMaxLength(260);
            b.Property(d => d.StoredFileName).IsRequired().HasMaxLength(100);
            b.Property(d => d.Category).IsRequired().HasMaxLength(60);
            b.Property(d => d.AccessLevel).IsRequired().HasMaxLength(10);
            b.Property(d => d.Tags).HasMaxLength(300);
            b.Property(d => d.ContentType).IsRequired().HasMaxLength(100);
            b.Property(d => d.Sha256).IsRequired().HasMaxLength(64);
            b.HasQueryFilter(d => d.DeletedAt == null);

            b.HasOne(d => d.BranchEntity)
             .WithMany()
             .HasForeignKey(d => d.BranchId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(d => d.AcademicYear)
             .WithMany()
             .HasForeignKey(d => d.AcademicYearId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(d => d.UploadedByUser)
             .WithMany()
             .HasForeignKey(d => d.UploadedBy)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Leaders
        modelBuilder.Entity<Leader>(b =>
        {
            b.ToTable("Leaders");
            b.HasKey(l => l.Id);
            b.Property(l => l.HolyName).HasMaxLength(60);
            b.Property(l => l.FullName).IsRequired().HasMaxLength(120);
            b.Property(l => l.Position).IsRequired().HasMaxLength(120);
            b.Property(l => l.Term).IsRequired().HasMaxLength(30);
            b.Property(l => l.AvatarPath).HasMaxLength(300);
            b.Property(l => l.Description).HasMaxLength(1000);
            b.HasQueryFilter(l => l.DeletedAt == null);

            b.HasOne(l => l.BranchEntity)
             .WithMany()
             .HasForeignKey(l => l.BranchId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // NewsSources
        modelBuilder.Entity<NewsSource>(b =>
        {
            b.ToTable("NewsSources");
            b.HasKey(s => s.Id);
            b.Property(s => s.Name).IsRequired().HasMaxLength(100);
            b.Property(s => s.RssUrl).IsRequired().HasMaxLength(500);

            b.HasIndex(s => s.RssUrl)
             .IsUnique()
             .HasDatabaseName("UQ_NewsSources_Rss");
        });

        // NewsArticles
        modelBuilder.Entity<NewsArticle>(b =>
        {
            b.ToTable("NewsArticles");
            b.HasKey(a => a.Id);
            b.Property(a => a.Title).IsRequired().HasMaxLength(300);
            b.Property(a => a.Link).IsRequired().HasMaxLength(1000);
            b.Property(a => a.LinkHash).IsRequired().HasMaxLength(64);
            b.Property(a => a.Summary).IsRequired().HasMaxLength(1000);
            b.Property(a => a.ImageUrl).HasMaxLength(1000);
            b.Property(a => a.Category).IsRequired().HasMaxLength(60);

            b.HasOne(a => a.Source)
             .WithMany(s => s.NewsArticles)
             .HasForeignKey(a => a.SourceId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(a => a.LinkHash)
             .IsUnique()
             .HasDatabaseName("UQ_NewsArticles_LinkHash");

            b.HasIndex(a => new { a.IsActive, a.PublishedAt })
             .HasDatabaseName("IX_NewsArticles_Published");
        });

        // LiturgicalEvents
        modelBuilder.Entity<LiturgicalEvent>(b =>
        {
            b.ToTable("LiturgicalEvents");
            b.HasKey(e => e.Id);
            b.Property(e => e.Title).IsRequired().HasMaxLength(300);
            b.Property(e => e.Color).IsRequired().HasMaxLength(20);
            b.Property(e => e.Level).IsRequired().HasMaxLength(40);
            b.Property(e => e.Description).HasMaxLength(2000);
            b.Property(e => e.WordOfGodReference).HasMaxLength(200);

            b.HasIndex(e => new { e.EventDate, e.IsOverride })
             .IsUnique()
             .HasDatabaseName("UQ_LiturgicalEvents_DateOverride");
        });
    }
}
