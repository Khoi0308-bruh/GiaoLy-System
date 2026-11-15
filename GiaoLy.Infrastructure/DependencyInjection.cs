using GiaoLy.Application.Announcements.Contracts;
using GiaoLy.Application.Audit.Contracts;
using GiaoLy.Application.Banners.Contracts;
using GiaoLy.Application.Bouquets.Contracts;
using GiaoLy.Application.Camps.Contracts;
using GiaoLy.Application.Certificates.Contracts;
using GiaoLy.Application.Common.Interfaces;
using GiaoLy.Application.Documents.Contracts;
using GiaoLy.Application.Duty.Contracts;
using GiaoLy.Application.Enrollments.Contracts;
using GiaoLy.Application.Grades.Contracts;
using GiaoLy.Application.Identity.Contracts;
using GiaoLy.Application.Imports.Contracts;
using GiaoLy.Application.Leaders.Contracts;
using GiaoLy.Application.LessonPlans.Contracts;
using GiaoLy.Application.Liturgical.Contracts;
using GiaoLy.Application.News.Contracts;
using GiaoLy.Application.Organization.Contracts;
using GiaoLy.Application.Platform.Contracts;
using GiaoLy.Application.Portal.Contracts;
using GiaoLy.Application.Promotion.Contracts;
using GiaoLy.Application.Reports.Contracts;
using GiaoLy.Application.Sacraments.Contracts;
using GiaoLy.Application.Stats.Contracts;
using GiaoLy.Application.Students.Contracts;
using GiaoLy.Domain.Data;
using GiaoLy.Infrastructure.Persistence.Interceptors;
using GiaoLy.Infrastructure.Security;
using GiaoLy.Infrastructure.Services.Announcements;
using GiaoLy.Infrastructure.Services.Audit;
using GiaoLy.Infrastructure.Services.Banners;
using GiaoLy.Infrastructure.Services.Bouquets;
using GiaoLy.Infrastructure.Services.Camps;
using GiaoLy.Infrastructure.Services.Certificates;
using GiaoLy.Infrastructure.Services.Documents;
using GiaoLy.Infrastructure.Services.Duty;
using GiaoLy.Infrastructure.Services.Enrollments;
using GiaoLy.Infrastructure.Services.Grades;
using GiaoLy.Infrastructure.Services.Identity;
using GiaoLy.Infrastructure.Services.Imports;
using GiaoLy.Infrastructure.Services.Leaders;
using GiaoLy.Infrastructure.Services.LessonPlans;
using GiaoLy.Infrastructure.Services.Liturgical;
using GiaoLy.Infrastructure.Services.News;
using GiaoLy.Infrastructure.Services.Organization;
using GiaoLy.Infrastructure.Services.Platform;
using GiaoLy.Infrastructure.Services.Portal;
using GiaoLy.Infrastructure.Services.Promotion;
using GiaoLy.Infrastructure.Services.Reports;
using GiaoLy.Infrastructure.Services.Sacraments;
using GiaoLy.Infrastructure.Services.Stats;
using GiaoLy.Infrastructure.Services.Students;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GiaoLy.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        // Security & Scopes
        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IScopeContext, ScopeContext>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPermissionProvider, PermissionProvider>();
        // Singleton: AuditInterceptor chỉ dùng IHttpContextAccessor nên an toàn với DbContext pool
        // và cũng giúp `dotnet ef` (design-time) resolve được DbContext.
        services.AddSingleton<AuditInterceptor>();

        // Identity Application Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IGuardianLinkService, GuardianLinkService>();

        // Organization Application Services
        services.AddScoped<IBranchService, BranchService>();
        services.AddScoped<IClassLevelService, ClassLevelService>();
        services.AddScoped<IAcademicYearService, AcademicYearService>();
        services.AddScoped<IClassRoomService, ClassRoomService>();
        services.AddScoped<IFamilyService, FamilyService>();

        // Students Application Services
        services.AddScoped<IStudentService, StudentService>();

        // Imports & Exports Application Services
        services.AddScoped<IImportExportService, ImportExportService>();

        // Sacraments Application Services
        services.AddScoped<ISacramentService, SacramentService>();

        // Enrollments & Grades Application Services
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IGradeService, GradeService>();

        // Promotion Application Services
        services.AddScoped<IPromotionService, PromotionService>();

        // Certificates Application Services
        services.AddScoped<ICertificateService, CertificateService>();

        // Activity (Hoạt động) Application Services - Package P9
        services.AddScoped<ICampService, CampService>();
        services.AddScoped<IDutyService, DutyService>();
        services.AddScoped<ILessonPlanService, LessonPlanService>();
        services.AddScoped<IBouquetService, BouquetService>();

        // Public Content & Announcements Application Services - Package P10
        services.AddMemoryCache();
        services.AddHttpClient();
        services.AddScoped<IAnnouncementService, AnnouncementService>();
        services.AddScoped<IBannerService, BannerService>();
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<ILeaderService, LeaderService>();
        services.AddScoped<INewsService, NewsService>();
        services.AddScoped<ILiturgicalService, LiturgicalService>();
        services.AddScoped<IPublicStatsService, PublicStatsService>();

        // Reports & Platform Services - Package P11
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IAuditLogService, AuditLogService>();
        services.AddScoped<ISystemSettingService, SystemSettingService>();
        services.AddScoped<IBackgroundJobService, BackgroundJobService>();

        // Parent Portal Application Services - Package P12
        services.AddScoped<IParentPortalService, ParentPortalService>();

        // Data Migration & Transition Services - Package P13
        services.AddScoped<IDataMigrationService, DataMigrationService>();

        // DbContext with AuditInterceptor
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContextPool<AppDbContext>((serviceProvider, options) =>
        {
            var auditInterceptor = serviceProvider.GetRequiredService<AuditInterceptor>();
            options.UseSqlServer(connectionString)
                   .AddInterceptors(auditInterceptor);
        }, poolSize: 128);

        return services;
    }
}
