using GiaoLy.API.Helpers;
using GiaoLy.Domain.Constants;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using GiaoLy.Domain.Rules;
using Microsoft.EntityFrameworkCore;

namespace GiaoLy.API.Services;

public static class DbSeeder
{
    public static void SeedData(AppDbContext context, IConfiguration config, IHostEnvironment env)
    {
        // Áp dụng migration thay vì EnsureCreated(): EnsureCreated bỏ qua toàn bộ 22 migration
        // và để lại schema không có __EFMigrationsHistory, khiến DB trôi khỏi mã nguồn.
        context.Database.Migrate();

        SeedBranches(context);
        SeedAcademicYear(context);
        SeedNewsSources(context);
        SeedLeaders(context);
        SeedSystemSettings(context);
        SeedRolesAndPermissions(context);
        CleanupLegacyRoles(context);
        SeedInitialUsers(context, config, env);
        // Phải đứng sau SeedInitialUsers: Announcements.AuthorUserId là FK NOT NULL tới Users.
        SeedAnnouncements(context);
    }

    /// <summary>
    /// Niên khóa đang hoạt động là dữ liệu gốc: dashboard, chọn lớp khi đăng thông báo,
    /// giáo án, trực lớp đều gọi <c>GET /academic-years/active</c>. Một database mới tinh
    /// không có niên khóa nào nên các màn hình đó rơi vào trạng thái trống ngay từ lần
    /// đăng nhập đầu tiên.
    ///
    /// Chỉ tạo khi bảng hoàn toàn trống: không bao giờ ghi đè hay tự bật một niên khóa
    /// đã có trong dữ liệu thật. Niên khóa mới được tạo thẳng ở trạng thái 'Active'
    /// (bỏ qua quy tắc CanActivate yêu cầu phải có sẵn lớp học) vì đây là bản ghi mồi
    /// để hệ thống sử dụng được ngay sau khi cài đặt.
    /// </summary>
    private static void SeedAcademicYear(AppDbContext context)
    {
        if (context.AcademicYears.Any()) return;

        var now = DateTime.UtcNow;
        // Năm học bắt đầu từ tháng 9: từ tháng 8 trở đi tính niên khóa mới.
        var startYear = now.Month >= 8 ? now.Year : now.Year - 1;

        context.AcademicYears.Add(new AcademicYear
        {
            Name = $"{startYear}–{startYear + 1}",
            StartDate = new DateOnly(startYear, 9, 1),
            EndDate = new DateOnly(startYear + 1, 6, 30),
            Status = AcademicYearStateMachine.StatusActive,
            ActivatedAt = now,
            CreatedAt = now
        });
        context.SaveChanges();
    }

    /// <summary>
    /// Danh mục ngành (Branches) là dữ liệu gốc: <c>Students.BranchId</c> có khoá ngoại tới bảng này,
    /// nên một database mới tinh không thể tạo đoàn sinh nếu thiếu bốn ngành dưới đây.
    /// Thứ tự chèn quyết định Id 1..4, giữ đúng quy ước cũ (Branch = 0 nghĩa là toàn sứ đoàn).
    /// </summary>
    private static void SeedBranches(AppDbContext context)
    {
        var defaults = new (string Code, string Name, byte MinAge, byte MaxAge)[]
        {
            ("AU", "Ấu Nhi", 6, 9),
            ("THIEU", "Thiếu Nhi", 10, 12),
            ("NGHIA", "Nghĩa Sĩ", 13, 15),
            ("HIEP", "Hiệp Sĩ", 16, 18)
        };

        var existingCodes = context.Branches.Select(b => b.Code).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var sortOrder = context.Branches.Any() ? context.Branches.Max(b => b.SortOrder) : 0;
        var changed = false;

        foreach (var (code, name, minAge, maxAge) in defaults)
        {
            if (existingCodes.Contains(code)) continue;

            sortOrder++;
            context.Branches.Add(new Branch
            {
                Code = code,
                Name = name,
                MinAge = minAge,
                MaxAge = maxAge,
                SortOrder = sortOrder,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
            changed = true;
        }

        if (changed)
        {
            context.SaveChanges();
        }
    }

    /// <summary>
    /// Bốn vai trò cũ (Code "1".."4", IsSystem = false) là tàn dư trước V3 và nằm song song với
    /// 6 vai trò hệ thống. Chuyển người dùng sang vai trò hệ thống tương ứng rồi xoá để chỉ còn
    /// một hệ vai trò duy nhất.
    /// </summary>
    private static void CleanupLegacyRoles(AppDbContext context)
    {
        var legacyToSystem = new Dictionary<string, string>
        {
            ["1"] = "SystemAdmin",
            ["2"] = "SecretaryTreasurer",
            ["3"] = "DivisionLeader",
            ["4"] = "Catechist"
        };

        // Nhận diện theo Code ("1".."4") chứ không dựa vào IsSystem: dữ liệu copy từ DB cũ
        // có thể đã đánh dấu IsSystem = 1 cho các vai trò này.
        var legacyCodes = legacyToSystem.Keys.ToArray();
        var legacyRoles = context.Roles
            .Include(r => r.RolePermissions)
            .Where(r => legacyCodes.Contains(r.Code))
            .ToList();

        if (legacyRoles.Count == 0) return;

        var systemRoles = context.Roles
            .Where(r => r.IsSystem)
            .ToDictionary(r => r.Code, r => r.Id, StringComparer.OrdinalIgnoreCase);

        foreach (var legacy in legacyRoles)
        {
            if (!legacyToSystem.TryGetValue(legacy.Code, out var targetCode)) continue;
            if (!systemRoles.TryGetValue(targetCode, out var targetRoleId)) continue;

            foreach (var user in context.Users.Where(u => u.RoleId == legacy.Id).ToList())
            {
                user.RoleId = targetRoleId;
            }

            context.RolePermissions.RemoveRange(legacy.RolePermissions);
            context.Roles.Remove(legacy);
        }

        context.SaveChanges();

        // Users.Role là thuộc tính tương thích (getter đọc từ navigation), nên EF không ghi lại
        // giá trị "1".."4" khi chỉ đổi RoleId. Đồng bộ cột thực bằng SQL để dữ liệu không còn mã cũ.
        context.Database.ExecuteSqlRaw(
            "UPDATE u SET u.Role = r.Code FROM dbo.Users u JOIN dbo.Roles r ON r.Id = u.RoleId WHERE u.Role <> r.Code");
    }

    private static void SeedRolesAndPermissions(AppDbContext context)
    {
        // 1. Seed / Sync Permissions (86 permissions)
        var allPermissions = new (string Code, string Name, string Module)[]
        {
            // Users
            ("users.view", "Xem danh sách người dùng", "Users"),
            ("users.create", "Thêm người dùng", "Users"),
            ("users.update", "Sửa người dùng", "Users"),
            ("users.delete", "Vô hiệu hóa người dùng", "Users"),
            ("users.assign-role", "Gán vai trò cho người dùng", "Users"),
            ("users.reset-password", "Đặt lại mật khẩu người khác", "Users"),

            // Roles
            ("roles.view", "Xem vai trò và danh mục quyền", "Roles"),
            ("roles.create", "Thêm vai trò", "Roles"),
            ("roles.update", "Sửa vai trò", "Roles"),
            ("roles.delete", "Xóa vai trò", "Roles"),
            ("roles.assign", "Gán quyền cho vai trò", "Roles"),

            // Students
            ("guardians.link", "Liên kết tài khoản phụ huynh với đoàn sinh", "Students"),
            ("students.view", "Xem danh sách và hồ sơ cơ bản", "Students"),
            ("students.create", "Thêm đoàn sinh", "Students"),
            ("students.update", "Sửa hồ sơ đoàn sinh", "Students"),
            ("students.delete", "Xóa mềm đoàn sinh", "Students"),
            ("students.restore", "Khôi phục đoàn sinh", "Students"),
            ("students.change-status", "Đổi trạng thái đoàn sinh", "Students"),
            ("students.view-contact", "Xem SĐT phụ huynh và địa chỉ", "Students"),
            ("students.view-health", "Xem nhóm máu, dị ứng, ghi chú sức khỏe", "Students"),
            ("students.notes.write", "Viết ghi chú về đoàn sinh", "Students"),
            ("students.import", "Nhập đoàn sinh từ Excel", "Students"),
            ("students.export", "Xuất danh sách đoàn sinh", "Students"),

            // Academic
            ("org.manage", "Quản lý ngành và cấp lớp", "Academic"),
            ("academic.view", "Xem niên khóa và lớp", "Academic"),
            ("academic.create", "Thêm niên khóa, lớp", "Academic"),
            ("academic.update", "Sửa niên khóa, lớp", "Academic"),
            ("academic.delete", "Xóa niên khóa, lớp", "Academic"),
            ("academic.lifecycle", "Kích hoạt, chốt, lưu trữ, mở lại niên khóa", "Academic"),
            ("classrooms.assign-teachers", "Phân công giáo lý viên cho lớp", "Academic"),
            ("families.manage", "Quản lý gia đình thiếu nhi", "Academic"),

            // Enrollments
            ("enrollments.view", "Xem ghi danh", "Enrollments"),
            ("enrollments.manage", "Xếp lớp, chuyển lớp, rút lớp", "Enrollments"),

            // Promotion
            ("promotion.view", "Xem đợt xét lên lớp", "Promotion"),
            ("promotion.create", "Tạo đợt xét lên lớp", "Promotion"),
            ("promotion.decide", "Duyệt hoặc từ chối đề xuất lên lớp", "Promotion"),
            ("promotion.apply", "Áp dụng đợt lên lớp", "Promotion"),

            // Grades
            ("grades.view", "Xem điểm", "Grades"),
            ("grades.update", "Nhập và sửa điểm", "Grades"),
            ("grades.unlock", "Mở khóa sổ điểm một lớp", "Grades"),
            ("grades.export", "Xuất bảng điểm", "Grades"),

            // Sacraments
            ("sacraments.view", "Xem bí tích", "Sacraments"),
            ("sacraments.update", "Cập nhật bí tích và tiến độ chuẩn bị", "Sacraments"),
            ("sacraments.manage-requirements", "Quản lý yêu cầu chuẩn bị bí tích", "Sacraments"),

            // Certificates
            ("certificates.view", "Xem chứng chỉ", "Certificates"),
            ("certificates.issue", "Cấp chứng chỉ", "Certificates"),
            ("certificates.revoke", "Thu hồi chứng chỉ", "Certificates"),

            // Camps
            ("camps.view", "Xem sự kiện", "Camps"),
            ("camps.manage", "Quản lý sự kiện", "Camps"),
            ("camps.register", "Đăng ký đoàn sinh vào sự kiện", "Camps"),
            ("camps.collect", "Thu phí sự kiện", "Camps"),

            // Duty
            ("duty.view", "Xem phân công trực", "Duty"),
            ("duty.manage", "Quản lý phân công trực", "Duty"),

            // LessonPlans
            ("lessonplans.view", "Xem giáo án", "LessonPlans"),
            ("lessonplans.manage", "Quản lý giáo án của mình", "LessonPlans"),
            ("lessonplans.manage-all", "Quản lý mọi giáo án trong phạm vi", "LessonPlans"),

            // Bouquets
            ("bouquets.view", "Xem hoa thiêng", "Bouquets"),
            ("bouquets.give", "Ghi hoa thiêng", "Bouquets"),
            ("bouquets.manage", "Đảo hoa thiêng", "Bouquets"),

            // Announcements
            ("announcements.view", "Xem thông báo", "Announcements"),
            ("announcements.create", "Đăng thông báo", "Announcements"),
            ("announcements.update", "Sửa thông báo", "Announcements"),
            ("announcements.delete", "Xóa thông báo", "Announcements"),

            // Documents
            ("documents.view", "Xem tài liệu nội bộ", "Documents"),
            ("documents.create", "Tải tài liệu lên", "Documents"),
            ("documents.update", "Sửa tài liệu", "Documents"),
            ("documents.delete", "Xóa tài liệu", "Documents"),

            // Leaders
            ("leaders.view", "Xem ban huynh trưởng", "Leaders"),
            ("leaders.create", "Thêm huynh trưởng", "Leaders"),
            ("leaders.update", "Sửa huynh trưởng", "Leaders"),
            ("leaders.delete", "Xóa huynh trưởng", "Leaders"),

            // Content & News
            ("banners.manage", "Quản lý banner", "Content"),
            ("news.view", "Xem tin tức quản trị", "News"),
            ("news.create", "Thêm nguồn tin", "News"),
            ("news.update", "Sửa nguồn tin, ẩn bài", "News"),
            ("news.delete", "Xóa nguồn tin", "News"),

            // Liturgical
            ("liturgical.view", "Xem lịch phụng vụ quản trị", "Liturgical"),
            ("liturgical.update", "Cập nhật lịch phụng vụ", "Liturgical"),

            // Reports
            ("reports.view", "Xem báo cáo", "Reports"),
            ("reports.export", "Xuất báo cáo", "Reports"),

            // Portal
            ("portal.children.view", "Cổng phụ huynh: xem con của mình", "Portal"),

            // Platform
            ("audit.view", "Xem nhật ký kiểm toán", "Platform"),
            ("settings.view", "Xem cấu hình nghiệp vụ", "Platform"),
            ("settings.manage", "Sửa cấu hình nghiệp vụ", "Platform"),
            ("jobs.view", "Xem tác vụ nền", "Platform"),
            ("jobs.run", "Chạy tác vụ nền", "Platform")
        };

        var existingPerms = context.Permissions.ToDictionary(p => p.Code, StringComparer.OrdinalIgnoreCase);
        bool permChanged = false;

        foreach (var (code, name, module) in allPermissions)
        {
            if (!existingPerms.ContainsKey(code))
            {
                var p = new Permission
                {
                    Code = code,
                    Name = name,
                    Module = module,
                    CreatedAt = DateTime.UtcNow
                };
                context.Permissions.Add(p);
                existingPerms[code] = p;
                permChanged = true;
            }
        }

        if (permChanged)
        {
            context.SaveChanges();
        }

        // 2. Seed / Sync 6 System Roles
        var systemRoles = new (string Code, string Name, string Description, string ScopeType, string[] PermCodes)[]
        {
            ("SystemAdmin", "Quản trị hệ thống", "Toàn quyền, kể cả vai trò, cấu hình, tác vụ nền", "All",
             allPermissions.Select(p => p.Code).ToArray()),

            ("ExecutiveBoard", "Ban điều hành", "Toàn quyền nghiệp vụ, không sửa vai trò, cấu hình, tác vụ nền", "All",
             new[] {
                 "users.view", "users.create", "users.update", "users.delete", "users.assign-role", "users.reset-password", "roles.view", "guardians.link", "students.view", "students.create", "students.update", "students.delete", "students.restore", "students.change-status", "students.view-contact", "students.view-health", "students.notes.write", "students.import", "students.export", "org.manage", "academic.view", "academic.create", "academic.update", "academic.delete", "academic.lifecycle", "classrooms.assign-teachers", "families.manage", "enrollments.view", "enrollments.manage", "promotion.view", "promotion.create", "promotion.decide", "promotion.apply", "grades.view", "grades.update", "grades.unlock", "grades.export", "sacraments.view", "sacraments.update", "sacraments.manage-requirements", "certificates.view", "certificates.issue", "certificates.revoke", "camps.view", "camps.manage", "camps.register", "camps.collect", "duty.view", "duty.manage", "lessonplans.view", "lessonplans.manage", "lessonplans.manage-all", "bouquets.view", "bouquets.give", "bouquets.manage", "announcements.view", "announcements.create", "announcements.update", "announcements.delete", "documents.view", "documents.create", "documents.update", "documents.delete", "leaders.view", "leaders.create", "leaders.update", "leaders.delete", "banners.manage", "news.view", "news.create", "news.update", "news.delete", "liturgical.view", "liturgical.update", "reports.view", "reports.export", "audit.view", "settings.view", "jobs.view"
             }),

            ("SecretaryTreasurer", "Thư ký và thủ quỹ", "Hồ sơ, ghi danh, chứng chỉ, thu phí, thông báo", "All",
             new[] {
                 "students.view", "students.create", "students.update", "students.restore", "students.change-status", "students.view-contact", "students.view-health", "students.notes.write", "students.import", "students.export", "guardians.link", "academic.view", "families.manage", "enrollments.view", "enrollments.manage", "promotion.view", "promotion.create", "promotion.decide", "grades.view", "grades.export", "sacraments.view", "sacraments.update", "sacraments.manage-requirements", "certificates.view", "certificates.issue", "certificates.revoke", "camps.view", "camps.manage", "camps.register", "camps.collect", "duty.view", "lessonplans.view", "bouquets.view", "announcements.view", "announcements.create", "announcements.update", "announcements.delete", "documents.view", "documents.create", "documents.update", "documents.delete", "leaders.view", "news.view", "liturgical.view", "reports.view", "reports.export"
             }),

            ("DivisionLeader", "Trưởng ngành", "Quản lý các lớp thuộc ngành mình", "Branch",
             new[] {
                 "students.view", "students.create", "students.update", "students.change-status", "students.view-contact", "students.view-health", "students.notes.write", "academic.view", "classrooms.assign-teachers", "families.manage", "enrollments.view", "enrollments.manage", "promotion.view", "promotion.decide", "grades.view", "grades.update", "grades.export", "sacraments.view", "sacraments.update", "certificates.view", "camps.view", "camps.manage", "camps.register", "duty.view", "duty.manage", "lessonplans.view", "lessonplans.manage", "lessonplans.manage-all", "bouquets.view", "bouquets.give", "bouquets.manage", "announcements.view", "announcements.create", "announcements.update", "documents.view", "documents.create", "leaders.view", "news.view", "liturgical.view", "reports.view"
             }),

            ("Catechist", "Giáo lý viên", "Quản lý lớp mình phụ trách", "Classroom",
             new[] {
                 "students.view", "students.view-contact", "students.view-health", "students.notes.write", "academic.view", "enrollments.view", "grades.view", "grades.update", "sacraments.view", "sacraments.update", "certificates.view", "camps.view", "camps.register", "duty.view", "lessonplans.view", "lessonplans.manage", "bouquets.view", "bouquets.give", "announcements.view", "documents.view", "leaders.view", "news.view", "liturgical.view", "reports.view"
             }),

            ("Guardian", "Phụ huynh", "Chỉ xem con của mình qua cổng phụ huynh", "Guardian",
             new[] {
                 "portal.children.view"
             })
        };

        var existingRoles = context.Roles.Include(r => r.RolePermissions).ToDictionary(r => r.Code, StringComparer.OrdinalIgnoreCase);

        foreach (var (code, name, desc, scope, permCodes) in systemRoles)
        {
            if (!existingRoles.TryGetValue(code, out var role))
            {
                role = new Role
                {
                    Code = code,
                    Name = name,
                    Description = desc,
                    ScopeType = scope,
                    IsSystem = true,
                    CreatedAt = DateTime.UtcNow
                };
                context.Roles.Add(role);
                existingRoles[code] = role;
            }
            else
            {
                role.IsSystem = true;
                role.ScopeType = scope;
            }

            // Sync role permissions if empty or new
            var currentPermIds = role.RolePermissions.Select(rp => rp.PermissionId).ToHashSet();
            foreach (var pCode in permCodes)
            {
                if (existingPerms.TryGetValue(pCode, out var perm) && !currentPermIds.Contains(perm.Id))
                {
                    role.RolePermissions.Add(new RolePermission { Role = role, Permission = perm });
                }
            }
        }

        context.SaveChanges();
    }

    private static void SeedInitialUsers(AppDbContext context, IConfiguration config, IHostEnvironment env)
    {
        var adminRole = context.Roles.FirstOrDefault(r => r.Code == "SystemAdmin");
        if (adminRole == null) return;

        // VULNERABILITY S1 FIX: Only seed admin if no SystemAdmin exists. NEVER overwrite existing passwords!
        // Kiểm tra thêm theo username để tránh lỗi trùng IX_Users_Username khi dữ liệu cũ
        // có tài khoản 'admin' nhưng RoleId chưa được gán đúng vai trò hệ thống.
        var hasAdmin = context.Users.Any(u =>
            u.IsActive && (u.RoleId == adminRole.Id || u.Username == "admin"));
        if (!hasAdmin)
        {
            // Không dùng mật khẩu hard-code: thiếu cấu hình hợp lệ thì dừng khởi động (fail-closed),
            // để không bao giờ tạo ra tài khoản quản trị với mật khẩu ai cũng biết.
            var initialPassword = FirstUsableSecret(
                config["Admin:InitialPassword"],
                config["App:DefaultPassword"]);

            if (initialPassword == null)
            {
                throw new InvalidOperationException(
                    "LỖI CẤU HÌNH: Chưa có tài khoản quản trị và không tìm thấy mật khẩu khởi tạo hợp lệ. " +
                    "Hãy đặt biến môi trường 'Admin__InitialPassword' (hoặc 'App__DefaultPassword' khi chạy Development) " +
                    "với giá trị thật, không phải placeholder.");
            }

            var adminUser = new User
            {
                Username = "admin",
                FullName = "Quản trị viên hệ thống",
                ChristianName = "Giuse",
                RoleId = adminRole.Id,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(initialPassword, 12),
                MustChangePassword = true,
                IsActive = true,
                SecurityStamp = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            context.SaveChanges();
        }

        // Tài khoản mẫu: CHỈ tạo ở môi trường Development, không bao giờ ở Production.
        if (!env.IsDevelopment()) return;

        var samplePassword = FirstUsableSecret(config["App:DefaultPassword"]);
        if (samplePassword == null) return;

        var secRole = context.Roles.FirstOrDefault(r => r.Code == "SecretaryTreasurer");
        if (secRole != null && !context.Users.Any(u => u.Username == "thuky"))
        {
            var defaultPassword = samplePassword;
            context.Users.Add(new User
            {
                Username = "thuky",
                FullName = "Thư Ký Sứ Đoàn",
                ChristianName = "Maria",
                RoleId = secRole.Id,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword, 12),
                MustChangePassword = false,
                IsActive = true,
                SecurityStamp = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
        }

        var divRole = context.Roles.FirstOrDefault(r => r.Code == "DivisionLeader");
        if (divRole != null && !context.Users.Any(u => u.Username == "truongnganh"))
        {
            var defaultPassword = samplePassword;
            context.Users.Add(new User
            {
                Username = "truongnganh",
                FullName = "Trưởng Ngành Nghĩa Sĩ",
                ChristianName = "Gioan",
                RoleId = divRole.Id,
                BranchId = 3, // Nghĩa Sĩ
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword, 12),
                MustChangePassword = false,
                IsActive = true,
                SecurityStamp = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
        }
    }

    /// <summary>
    /// Trả về giá trị bí mật đầu tiên dùng được: không rỗng và không phải placeholder.
    /// Dùng để chặn các giá trị như "PLACEHOLDER_SET_IN_ENVIRONMENT..." lọt vào Production.
    /// </summary>
    private static string? FirstUsableSecret(params string?[] candidates)
    {
        foreach (var value in candidates)
        {
            if (string.IsNullOrWhiteSpace(value)) continue;

            var trimmed = value.Trim();
            if (trimmed.StartsWith("PLACEHOLDER", StringComparison.OrdinalIgnoreCase)) continue;
            if (trimmed.StartsWith("REPLACE_WITH", StringComparison.OrdinalIgnoreCase)) continue;

            return trimmed;
        }

        return null;
    }

    private static void SeedAnnouncements(AppDbContext context)
    {
        if (context.Announcements.Any()) return;

        // AuthorUserId là khoá ngoại bắt buộc — lấy tài khoản sớm nhất làm người đăng mặc định.
        var authorId = context.Users
            .OrderBy(u => u.CreatedAt)
            .Select(u => u.Id)
            .FirstOrDefault();

        if (authorId == Guid.Empty) return;

        context.Announcements.AddRange(
            new Announcement
            {
                Title = "Lược sử Sứ đoàn Thiếu Nhi Thánh Thể Giáo Xứ",
                Content = @"<p>Sứ đoàn Thiếu Nhi Thánh Thể quy tụ hơn 500 đoàn sinh sinh hoạt thường xuyên ở 4 ngành: Ấu, Thiếu, Nghĩa, Hiệp.</p>",
                AuthorUserId = authorId,
                Author = "Cha Tuyên Úy",
                Branch = 0,
                IsUrgent = false,
                CreatedDate = DateTime.UtcNow.AddDays(-15),
                Type = AnnouncementType.Normal,
                TargetAudience = TargetAudience.All
            },
            new Announcement
            {
                Title = "Khai giảng khóa Giáo lý Niên khóa Mới",
                Content = @"<p>Sứ đoàn Thiếu Nhi Thánh Thể xin thông báo lịch tựu trường và khai giảng lớp Giáo lý mới.</p>",
                AuthorUserId = authorId,
                Author = "Văn Phòng Giáo Xứ",
                Branch = 0,
                IsUrgent = true,
                CreatedDate = DateTime.UtcNow.AddDays(-1),
                Type = AnnouncementType.Urgent,
                TargetAudience = TargetAudience.All
            }
        );
        context.SaveChanges();
    }

    private static void SeedNewsSources(AppDbContext context)
    {
        if (context.NewsSources.Any()) return;

        context.NewsSources.AddRange(
            new NewsSource { Name = "VaticanNewsVI", RssUrl = "https://www.vaticannews.va/vi.rss.xml", IsActive = true },
            new NewsSource { Name = "VaticanNewsEN", RssUrl = "https://www.vaticannews.va/en.rss.xml", IsActive = true }
        );
        context.SaveChanges();
    }

    private static void SeedLeaders(AppDbContext context)
    {
        if (context.Leaders.Any()) return;

        context.Leaders.AddRange(
            new Leader
            {
                HolyName = "Giuse",
                FullName = "Nguyễn Văn An",
                Position = "Xứ Đoàn Trưởng",
                Level = 3,
                Term = "2024-2027",
                Branch = 0,
                Description = "Phụng sự Chúa và các em thiếu nhi với tinh thần hy sinh.",
                IsActive = true,
                AvatarPath = ""
            }
        );
        context.SaveChanges();
    }

    private static void SeedSystemSettings(AppDbContext context)
    {
        var existingKeys = context.SystemSettings.Select(s => s.Key).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var toAdd = new List<SystemSetting>();

        foreach (var (key, (defaultValue, description)) in GiaoLy.Domain.Rules.SystemSettingsRules.DefaultSettings)
        {
            if (!existingKeys.Contains(key))
            {
                toAdd.Add(new SystemSetting
                {
                    Key = key,
                    Value = defaultValue,
                    Description = description,
                    UpdatedAt = DateTime.UtcNow
                });
            }
        }

        if (toAdd.Any())
        {
            context.SystemSettings.AddRange(toAdd);
            context.SaveChanges();
        }
    }
}
