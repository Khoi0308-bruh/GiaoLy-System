using GiaoLy.API.Helpers;
using GiaoLy.Domain.Data;
using GiaoLy.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace GiaoLy.API.Services;

public static class DbSeeder
{
    /// <summary>
    /// Gieo dữ liệu mẫu ban đầu. Nhận IConfiguration để đọc mật khẩu
    /// từ Environment Variable thay vì hard-code — an toàn khi deploy lên Render/Railway.
    /// </summary>
    public static void SeedData(AppDbContext context, IConfiguration config)
    {
        context.Database.EnsureCreated();

        // Đọc mật khẩu mặc định từ config (set ENV App__DefaultPassword trên Render/Railway)
        // Fallback về chuỗi 123456789 nếu không tìm thấy trong config
        var defaultPassword = config["App:DefaultPassword"] ?? "123456789";
        var defaultPasswordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword);

        // 1. Seed historical articles / announcements from old Google Sites if the table is empty
        if (!context.Announcements.Any())
        {
            var announcements = new[]
            {
                new Announcement
                {
                    Id = Guid.NewGuid(),
                    Title = "Lược sử Sứ đoàn Thiếu Nhi Thánh Thể Giáo Xứ",
                    Content = @"<p><img src='https://images.unsplash.com/photo-1548625361-ec8464dd2dc9?w=800&q=80' alt='Church' class='rounded-xl shadow-lg mb-4 w-full object-cover h-64'></p>
                                <p>Sứ đoàn Thiếu Nhi Thánh Thể được thành lập từ năm 1996 với bổn mạng là Thánh Têrêsa Hài Đồng Giêsu. Trải qua hơn 30 năm phát triển, từ một nhóm nhỏ ban đầu với 50 em đoàn sinh, đến nay Sứ đoàn đã quy tụ hơn 500 đoàn sinh sinh hoạt thường xuyên ở 4 ngành: Ấu, Thiếu, Nghĩa, Hiệp.</p>
                                <blockquote><p>""Cứ để trẻ em đến với Thầy, đừng ngăn cấm chúng, vì Nước Thiên Chúa là của những ai giống như chúng.""</p></blockquote>
                                <p>Tôn chỉ hoạt động luôn lấy Lời Chúa làm nền tảng và Bí Tích Thánh Thể làm trung tâm đời sống tôn giáo của người Huynh trưởng cũng như Đoàn sinh.</p>",
                    Author = "Cha Tuyên Úy",
                    Branch = 0, // Chung
                    IsUrgent = false,
                    CreatedDate = DateTimeHelper.GetVnNow().AddDays(-15),
                    Type = AnnouncementType.Normal,
                    TargetAudience = TargetAudience.All
                },
                new Announcement
                {
                    Id = Guid.NewGuid(),
                    Title = "Thông báo: Ngày hội Mục vụ Mùa Hè 2026 - Kết nối yêu thương",
                    Content = @"<p>Ban Điều Hành Sứ đoàn trân trọng kính mời toàn thể các em đoàn sinh và quý phụ huynh tham gia ngày hội mục vụ hè với chủ đề <strong>'Kết nối yêu thương - Phụng sự Chúa Kitô'</strong>.</p>
                                <ul>
                                  <li><strong>Thời gian:</strong> Chúa Nhật, ngày 14 tháng 6 năm 2026 (Trọn ngày).</li>
                                  <li><strong>Địa điểm:</strong> Khuôn viên nhà xứ và hội trường lớn.</li>
                                  <li><strong>Hoạt động chính:</strong> Hội chợ đức tin, trò chơi vận động liên hoàn, thi cắm trại và văn nghệ bế mạc Mùa Hè.</li>
                                </ul>
                                <p>Rất mong sự đồng hành của quý phụ huynh để ngày hội diễn ra thành công tốt đẹp.</p>",
                    Author = "Ban Điều Hành",
                    Branch = 0,
                    IsUrgent = false,
                    CreatedDate = DateTimeHelper.GetVnNow().AddDays(-5),
                    Type = AnnouncementType.Event,
                    TargetAudience = TargetAudience.All
                },
                new Announcement
                {
                    Id = Guid.NewGuid(),
                    Title = "Khai giảng khóa Giáo lý Niên khóa Mới 2026-2027",
                    Content = @"<p><img src='https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80' alt='Education' class='rounded-xl shadow-lg mb-4 w-full object-cover h-64'></p>
                                <p>Sứ đoàn Thiếu Nhi Thánh Thể xin thông báo lịch tựu trường và khai giảng lớp Giáo lý mới như sau:</p>
                                <p><strong>Lịch Tập trung:</strong> Chúa Nhật ngày 06/09/2026 sau Thánh lễ Thiếu Nhi (Lúc 07h00 sáng). Các em sẽ nhận lớp, phân chia Catechists chủ nhiệm và nhận phòng học.</p>
                                <p>Kính đề nghị các em mặc đồng phục nghiêm chỉnh khi đến tham dự.</p>",
                    Author = "Văn Phòng Giáo Xứ",
                    Branch = 0,
                    IsUrgent = true, // Tin khẩn
                    CreatedDate = DateTimeHelper.GetVnNow().AddDays(-1),
                    Type = AnnouncementType.Urgent,
                    TargetAudience = TargetAudience.All
                },
                new Announcement
                {
                    Id = Guid.NewGuid(),
                    Title = "Phương pháp Giáo dục Thiếu Nhi của Phong trào TNTT",
                    Content = @"<p>Phong trào Thiếu Nhi Thánh Thể Việt Nam sử dụng các phương pháp giáo dục tự nhiên và siêu nhiên để huấn luyện các em trở thành những công dân tốt và những Kitô hữu hoàn hảo:</p>
                                <ul>
                                  <li><strong>Phương pháp siêu nhiên:</strong> Lời Chúa (Chầu Thánh Thể, Suy niệm Tin Mừng) và Thánh Thể (Sống ngày Thánh Thể).</li>
                                  <li><strong>Phương pháp tự nhiên:</strong> Sinh hoạt hàng đội, vui ca diễn, học tập qua các trò chơi kỹ năng và dã ngoại mục vụ.</li>
                                </ul>",
                    Author = "Trưởng Ban Nghiên Huấn",
                    Branch = 0,
                    IsUrgent = false,
                    CreatedDate = DateTimeHelper.GetVnNow().AddDays(-20),
                    Type = AnnouncementType.Normal,
                    TargetAudience = TargetAudience.All
                }
            };

            context.Announcements.AddRange(announcements);
            context.SaveChanges();
        }

        // 2. Seed basic sample leaders if the table is empty (to guarantee organization chart data exists)
        if (!context.Leaders.Any())
        {
            var leaders = new[]
            {
                new Leader
                {
                    Id = Guid.NewGuid(),
                    HolyName = "Giuse",
                    FullName = "Nguyễn Văn Tuyên",
                    Position = "Linh Mục Tuyên Úy",
                    Level = 1,
                    Term = "2023-2026",
                    Branch = 0,
                    Description = "Mến Chúa và Phục Vụ Tha Nhân trong vui tươi.",
                    IsActive = true,
                    AvatarPath = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80"
                },
                new Leader
                {
                    Id = Guid.NewGuid(),
                    HolyName = "Phêrô",
                    FullName = "Trần Thanh Bình",
                    Position = "Xứ Đoàn Trưởng",
                    Level = 2,
                    Term = "2023-2026",
                    Branch = 0,
                    Description = "Hy sinh, phục vụ Chúa Kitô trong mọi người.",
                    IsActive = true,
                    AvatarPath = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                },
                new Leader
                {
                    Id = Guid.NewGuid(),
                    HolyName = "Têrêsa",
                    FullName = "Phạm Thị Thảo",
                    Position = "Xứ Đoàn Phó Nghiên Huấn",
                    Level = 2,
                    Term = "2023-2026",
                    Branch = 0,
                    Description = "Học với Giêsu, sống như Giêsu.",
                    IsActive = true,
                    AvatarPath = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
                },
                new Leader
                {
                    Id = Guid.NewGuid(),
                    HolyName = "Maria",
                    FullName = "Nguyễn Mai Anh",
                    Position = "Thư Ký Sứ Đoàn",
                    Level = 2,
                    Term = "2023-2026",
                    Branch = 0,
                    Description = "Chu toàn trách nhiệm âm thầm vì tình yêu.",
                    IsActive = true,
                    AvatarPath = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                },
                new Leader
                {
                    Id = Guid.NewGuid(),
                    HolyName = "Gioan",
                    FullName = "Lê Hoàng Long",
                    Position = "Trưởng Ngành Nghĩa Sĩ",
                    Level = 3,
                    Term = "2023-2026",
                    Branch = 3,
                    Description = "Chinh phục thử thách, giữ vững đức tin.",
                    IsActive = true,
                    AvatarPath = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
                }
            };

            context.Leaders.AddRange(leaders);
            context.SaveChanges();
        }

        // 2.5 Seed News Sources
        if (!context.NewsSources.Any())
        {
            var sources = new[]
            {
                new NewsSource { Id = Guid.NewGuid(), Name = "VaticanNewsVI", RssUrl = "https://www.vaticannews.va/vi.rss.xml", IsActive = true },
                new NewsSource { Id = Guid.NewGuid(), Name = "VaticanNewsEN", RssUrl = "https://www.vaticannews.va/en.rss.xml", IsActive = true },
                new NewsSource { Id = Guid.NewGuid(), Name = "CNA", RssUrl = "https://www.catholicnewsagency.com/feed", IsActive = true },
                new NewsSource { Id = Guid.NewGuid(), Name = "OSVNews", RssUrl = "https://www.osvnews.com/feed/", IsActive = true },
                new NewsSource { Id = Guid.NewGuid(), Name = "CathWR", RssUrl = "https://www.catholicworldreport.com/feed/", IsActive = true }
            };
            context.NewsSources.AddRange(sources);
            context.SaveChanges();
        }

        // 3. Seed RBAC Data (Roles & Permissions)
        var sysAdminRoleId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var execBoardRoleId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        var divLeaderRoleId = Guid.Parse("00000000-0000-0000-0000-000000000003");
        var catechistRoleId = Guid.Parse("00000000-0000-0000-0000-000000000004");
        var secTreasRoleId = Guid.Parse("00000000-0000-0000-0000-000000000005");
        
        if (!context.Roles.Any())
        {
            var roles = new[]
            {
                new Role { Id = sysAdminRoleId, Name = "SystemAdmin", Code = "SystemAdmin", Description = "Quản trị hệ thống / Cha Xứ" },
                new Role { Id = execBoardRoleId, Name = "ExecutiveBoard", Code = "ExecutiveBoard", Description = "Ban Điều Hành / Xứ Đoàn" },
                new Role { Id = divLeaderRoleId, Name = "DivisionLeader", Code = "DivisionLeader", Description = "Phân Đoàn Trưởng / Ngành Trưởng" },
                new Role { Id = catechistRoleId, Name = "Catechist", Code = "Catechist", Description = "Giáo Lý Viên / Huynh Trưởng" },
                new Role { Id = secTreasRoleId, Name = "SecretaryTreasurer", Code = "SecretaryTreasurer", Description = "Thư Ký / Thủ Quỹ" }
            };
            context.Roles.AddRange(roles);
            context.SaveChanges();
        }

        var pList = new[]
        {
            new Permission { Code = "users.view", Name = "Xem DS người dùng", Module = "Users" },
            new Permission { Code = "users.create", Name = "Thêm người dùng", Module = "Users" },
            new Permission { Code = "users.update", Name = "Sửa người dùng", Module = "Users" },
            new Permission { Code = "users.delete", Name = "Xóa người dùng", Module = "Users" },
            
            new Permission { Code = "roles.view", Name = "Xem vai trò", Module = "Roles" },
            new Permission { Code = "roles.create", Name = "Thêm vai trò", Module = "Roles" },
            new Permission { Code = "roles.update", Name = "Sửa vai trò", Module = "Roles" },
            new Permission { Code = "roles.delete", Name = "Xóa vai trò", Module = "Roles" },
            new Permission { Code = "roles.assign", Name = "Gán quyền", Module = "Roles" },
            
            new Permission { Code = "students.view", Name = "Xem DS Đoàn sinh", Module = "Students" },
            new Permission { Code = "students.create", Name = "Thêm Đoàn sinh", Module = "Students" },
            new Permission { Code = "students.update", Name = "Sửa Đoàn sinh", Module = "Students" },
            new Permission { Code = "students.delete", Name = "Xóa Đoàn sinh", Module = "Students" },
            new Permission { Code = "students.import", Name = "Import Đoàn sinh", Module = "Students" },
            new Permission { Code = "students.export", Name = "Export Đoàn sinh", Module = "Students" },
            
            new Permission { Code = "academic.view", Name = "Xem Niên khóa", Module = "Academic" },
            new Permission { Code = "academic.create", Name = "Thêm Niên khóa", Module = "Academic" },
            new Permission { Code = "academic.update", Name = "Sửa Niên khóa", Module = "Academic" },
            new Permission { Code = "academic.delete", Name = "Xóa Niên khóa", Module = "Academic" },
            
            new Permission { Code = "grades.view", Name = "Xem Điểm số", Module = "Grades" },
            new Permission { Code = "grades.update", Name = "Nhập/Sửa Điểm số", Module = "Grades" },
            
            new Permission { Code = "certificates.view", Name = "Xem Chứng chỉ", Module = "Certificates" },
            new Permission { Code = "certificates.issue", Name = "Cấp Chứng chỉ", Module = "Certificates" },
            
            new Permission { Code = "leaders.view", Name = "Xem Ban Trưởng", Module = "Leaders" },
            new Permission { Code = "leaders.create", Name = "Thêm Ban Trưởng", Module = "Leaders" },
            new Permission { Code = "leaders.update", Name = "Sửa Ban Trưởng", Module = "Leaders" },
            new Permission { Code = "leaders.delete", Name = "Xóa Ban Trưởng", Module = "Leaders" },
            
            new Permission { Code = "announcements.view", Name = "Xem Thông báo", Module = "Announcements" },
            new Permission { Code = "announcements.create", Name = "Thêm Thông báo", Module = "Announcements" },
            new Permission { Code = "announcements.update", Name = "Sửa Thông báo", Module = "Announcements" },
            new Permission { Code = "announcements.delete", Name = "Xóa Thông báo", Module = "Announcements" },
            
            new Permission { Code = "documents.view", Name = "Xem Tài liệu", Module = "Documents" },
            new Permission { Code = "documents.create", Name = "Thêm Tài liệu", Module = "Documents" },
            new Permission { Code = "documents.update", Name = "Sửa Tài liệu", Module = "Documents" },
            new Permission { Code = "documents.delete", Name = "Xóa Tài liệu", Module = "Documents" },
            
            new Permission { Code = "liturgical.view", Name = "Xem Lịch Phụng vụ", Module = "Liturgical" },
            new Permission { Code = "liturgical.update", Name = "Cập nhật Lịch Phụng vụ", Module = "Liturgical" },
            
            new Permission { Code = "news.view", Name = "Xem Tin tức", Module = "News" },
            new Permission { Code = "news.create", Name = "Thêm Tin tức", Module = "News" },
            new Permission { Code = "news.update", Name = "Sửa Tin tức", Module = "News" },
            new Permission { Code = "news.delete", Name = "Xóa Tin tức", Module = "News" },
            
            new Permission { Code = "reports.view", Name = "Xem Báo cáo", Module = "Reports" },
            new Permission { Code = "reports.export", Name = "Xuất Báo cáo", Module = "Reports" }
        };

        var existingCodes = context.Permissions.Select(p => p.Code).ToList();
        
        // Cleanup old .manage permissions
        var obsoletePerms = context.Permissions.Where(p => p.Code.EndsWith(".manage")).ToList();
        if (obsoletePerms.Any())
        {
            var obsoleteIds = obsoletePerms.Select(p => p.Id).ToList();
            var obsoleteRolePerms = context.RolePermissions.Where(rp => obsoleteIds.Contains(rp.PermissionId)).ToList();
            context.RolePermissions.RemoveRange(obsoleteRolePerms);
            context.Permissions.RemoveRange(obsoletePerms);
            context.SaveChanges();
            existingCodes = context.Permissions.Select(p => p.Code).ToList();
        }

        var newPerms = pList.Where(p => !existingCodes.Contains(p.Code)).ToList();
        
        if (newPerms.Any())
        {
            context.Permissions.AddRange(newPerms);
            context.SaveChanges();

            // Admin có mọi quyền
            var allPerms = context.Permissions.ToList();
            var existingAdminPermIds = context.RolePermissions
                .Where(rp => rp.RoleId == sysAdminRoleId)
                .Select(rp => rp.PermissionId)
                .ToList();

            foreach (var p in allPerms)
            {
                if (!existingAdminPermIds.Contains(p.Id))
                {
                    context.RolePermissions.Add(new RolePermission { RoleId = sysAdminRoleId, PermissionId = p.Id });
                }
            }
            context.SaveChanges();
        }

        // 4. Seed basic accounts if missing
        bool changed = false;
        if (!context.Users.Any(u => u.Username == "admin"))
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456789"), // Forced to 123456789
                FullName = "Quản trị viên",
                Role = "SystemAdmin",
                RoleId = sysAdminRoleId,
                CreatedAt = DateTimeHelper.GetVnNow()
            };
            context.Users.Add(adminUser);
            changed = true;
        }
        else 
        {
            // Forcefully reset admin password to 123456789 for recovery
            var adminUser = context.Users.First(u => u.Username == "admin");
            adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456789");
            changed = true;
        }

        if (!context.Users.Any(u => u.Username == "thuky"))
        {
            var secretaryUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "thuky",
                PasswordHash = defaultPasswordHash, // Đọc từ ENV App__DefaultPassword
                FullName = "Thư Ký Sứ Đoàn",
                Role = "SecretaryTreasurer",
                RoleId = secTreasRoleId,
                CreatedAt = DateTimeHelper.GetVnNow()
            };
            context.Users.Add(secretaryUser);
            changed = true;
        }

        if (!context.Users.Any(u => u.Username == "truongnganh"))
        {
            var modUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "truongnganh",
                PasswordHash = defaultPasswordHash, // Đọc từ ENV App__DefaultPassword
                FullName = "Trưởng Ngành Nghĩa Sĩ",
                Role = "DivisionLeader",
                RoleId = divLeaderRoleId,
                Branch = 3, // Nghĩa Sĩ
                CreatedAt = DateTimeHelper.GetVnNow()
            };
            context.Users.Add(modUser);
            changed = true;
        }

        if (changed)
        {
            context.SaveChanges();
        }
    }
}
