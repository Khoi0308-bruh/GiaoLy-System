-- ====================================================================================================
-- GIAOLY V3 - G2-7: SAO CHÉP DỮ LIỆU TỪ DATABASE CŨ SANG SCHEMA MỚI
-- Nguồn : GiaoLyDB_Vision2 (schema tiền V3)
-- Đích  : GiaoLyDB_V3Migrated (schema sinh từ model hiện tại)
-- Chạy  : sqlcmd -S . -E -d GiaoLyDB_V3Migrated -i database/G2-7_copy_from_legacy.sql
-- Yêu cầu: đã backup GiaoLyDB_Vision2 (database/backup/GiaoLyDB_Vision2_20261114.bak)
-- ====================================================================================================

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

PRINT N'>> Tạm ngưng kiểm tra khoá ngoại trên DB đích...';
EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';

-- ── 0. Branches ───────────────────────────────────────────────────────────────────────────
-- Danh mục ngành là dữ liệu gốc, seeder hiện chưa tạo; thiếu nó thì FK_Students_Branches sẽ chặn.
IF NOT EXISTS (SELECT 1 FROM dbo.Branches)
BEGIN
    SET IDENTITY_INSERT dbo.Branches ON;
    INSERT INTO dbo.Branches (Id, Code, Name, MinAge, MaxAge, SortOrder, IsActive, CreatedAt)
    VALUES (1, 'AU',    N'Ấu Nhi',    6,  9,  1, 1, SYSUTCDATETIME()),
           (2, 'THIEU', N'Thiếu Nhi', 10, 12, 2, 1, SYSUTCDATETIME()),
           (3, 'NGHIA', N'Nghĩa Sĩ',  13, 15, 3, 1, SYSUTCDATETIME()),
           (4, 'HIEP',  N'Hiệp Sĩ',   16, 18, 4, 1, SYSUTCDATETIME());
    SET IDENTITY_INSERT dbo.Branches OFF;
END

-- ── 1. Roles ───────────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Roles (Id, Code, Name, Description, IsSystem, ScopeType, CreatedAt, UpdatedAt)
SELECT r.Id, r.Code, r.Name, NULLIF(r.Description, ''), 1,
       CASE r.Code
           WHEN 'DivisionLeader' THEN 'Branch'
           WHEN 'Catechist' THEN 'Classroom'
           WHEN 'Guardian' THEN 'Guardian'
           ELSE 'All'
       END,
       SYSUTCDATETIME(), NULL
FROM GiaoLyDB_Vision2.dbo.Roles r;

-- ── 2. Permissions ────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Permissions (Id, Code, Name, Module, Description, CreatedAt, UpdatedAt)
SELECT p.Id, p.Code, p.Name, p.Module, NULL, SYSUTCDATETIME(), NULL
FROM GiaoLyDB_Vision2.dbo.Permissions p;

-- ── 3. RolePermissions ────────────────────────────────────────────────────────────────────
INSERT INTO dbo.RolePermissions (RoleId, PermissionId)
SELECT rp.RoleId, rp.PermissionId
FROM GiaoLyDB_Vision2.dbo.RolePermissions rp;

-- ── 4. Users ──────────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Users
    (Id, Username, PasswordHash, FullName, ChristianName, Email, PhoneNumber, DateOfBirth, Address, Bio,
     AvatarPath, Role, RoleId, BranchId, IsActive, MustChangePassword, FailedLoginCount, SecurityStamp, CreatedAt, UpdatedAt)
SELECT u.Id, u.Username, u.PasswordHash, u.FullName, NULLIF(u.ChristianName, ''), NULLIF(u.Email, ''),
       NULLIF(u.PhoneNumber, ''), CAST(u.DateOfBirth AS date), NULLIF(u.Address, ''), NULLIF(u.Bio, ''),
       NULLIF(u.AvatarPath, ''),
       COALESCE(
           (SELECT r.Code FROM dbo.Roles r WHERE r.Id = u.RoleId),
           CASE u.Role
               WHEN '1' THEN 'SystemAdmin'
               WHEN 'Admin' THEN 'SystemAdmin'
               WHEN '2' THEN 'SecretaryTreasurer'
               WHEN 'Secretary' THEN 'SecretaryTreasurer'
               WHEN '3' THEN 'DivisionLeader'
               WHEN 'Moderator' THEN 'DivisionLeader'
               ELSE 'Catechist'
           END),
       COALESCE(
           u.RoleId,
           (SELECT TOP 1 r.Id FROM dbo.Roles r WHERE r.Code =
               CASE u.Role
                   WHEN '1' THEN 'SystemAdmin'
                   WHEN 'Admin' THEN 'SystemAdmin'
                   WHEN '2' THEN 'SecretaryTreasurer'
                   WHEN 'Secretary' THEN 'SecretaryTreasurer'
                   WHEN '3' THEN 'DivisionLeader'
                   WHEN 'Moderator' THEN 'DivisionLeader'
                   ELSE 'Catechist'
               END),
           (SELECT TOP 1 r.Id FROM dbo.Roles r ORDER BY r.Code)),
       NULLIF(u.Branch, 0), 1, 0, 0, NEWID(), u.CreatedAt, NULL
FROM GiaoLyDB_Vision2.dbo.Users u;

-- ── 5. Students ───────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Students
    (Id, Code, HolyName, FullName, FullNameNormalized, BirthDate, Gender, BranchId, Status, Area, Address,
     BloodType, Allergies, FamilyId, PhotoUrl, Notes, CreatedAt, IsActive, Branch, ClassName,
     BaptismDate, BaptismPlace, CommunionDate, CommunionPlace, ConfirmationDate, ConfirmationPlace,
     FatherName, FatherPhone, FatherReligion, FatherJob, MotherName, MotherPhone, MotherReligion, MotherJob,
     ParentName, ParentPhone, BaptismGodparent, BaptismPriest, CommunionPriest, ConfirmationGodparent,
     ConfirmationBishop, HasPhotoConsent)
SELECT s.Id,
       'TN26' + RIGHT('0000' + CAST(ROW_NUMBER() OVER (ORDER BY s.Id) AS varchar(4)), 4),
       s.HolyName, s.FullName, UPPER(LTRIM(RTRIM(s.FullName))),
       s.BirthDate, NULLIF(s.Gender, ''), NULLIF(s.Branch, 0),
       CASE WHEN s.IsActive = 1 THEN 'Active' ELSE 'Paused' END,
       NULLIF(s.Area, ''), NULLIF(s.Address, ''), NULLIF(s.BloodType, ''), NULLIF(s.Allergies, ''),
       s.FamilyId, NULLIF(s.PhotoUrl, ''), NULLIF(s.Notes, ''), SYSUTCDATETIME(),
       s.IsActive, s.Branch, s.ClassName,
       s.BaptismDate, s.BaptismPlace, s.CommunionDate, s.CommunionPlace, s.ConfirmationDate, s.ConfirmationPlace,
       s.FatherName, s.FatherPhone, s.FatherReligion, s.FatherJob,
       s.MotherName, s.MotherPhone, s.MotherReligion, s.MotherJob,
       s.ParentName, s.ParentPhone, s.BaptismGodparent, s.BaptismPriest,
       s.CommunionPriest, s.ConfirmationGodparent, s.ConfirmationBishop, 0
FROM GiaoLyDB_Vision2.dbo.Students s;

-- ── 6. Leaders ────────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Leaders (Id, HolyName, FullName, Position, Level, Term, AvatarPath, Description, BranchId, IsActive, Branch, CreatedAt)
SELECT l.Id, NULLIF(l.HolyName, ''), l.FullName, l.Position, l.Level, l.Term, NULLIF(l.AvatarPath, ''),
       NULLIF(l.Description, ''), NULLIF(l.Branch, 0), l.IsActive, l.Branch, SYSUTCDATETIME()
FROM GiaoLyDB_Vision2.dbo.Leaders l;

-- ── 7. NewsSources ────────────────────────────────────────────────────────────────────────
INSERT INTO dbo.NewsSources (Id, Name, RssUrl, IsActive, CreatedAt)
SELECT n.Id, n.Name, n.RssUrl, n.IsActive, SYSUTCDATETIME()
FROM GiaoLyDB_Vision2.dbo.NewsSources n;

-- ── 8. NewsArticles ───────────────────────────────────────────────────────────────────────
INSERT INTO dbo.NewsArticles
    (Id, SourceId, Title, Link, LinkHash, Summary, ImageUrl, Category, PublishedAt, CrawledAt, IsActive,
     CreatedAt, PublishedDate, CrawledDate)
SELECT a.Id, a.SourceId, LEFT(a.Title, 300) AS Title, LEFT(a.Link, 1000) AS Link,
       CONVERT(varchar(64), HASHBYTES('SHA2_256', a.Link), 2) AS LinkHash,
       LEFT(a.Summary, 1000) AS Summary, LEFT(NULLIF(a.ImageUrl, ''), 1000) AS ImageUrl,
       LEFT(a.Category, 60) AS Category,
       a.PublishedDate, a.CrawledDate, a.IsActive,
       a.CrawledDate, a.PublishedDate, a.CrawledDate
FROM GiaoLyDB_Vision2.dbo.NewsArticles a;

-- ── 9. Announcements ──────────────────────────────────────────────────────────────────────
INSERT INTO dbo.Announcements
    (Id, Title, ContentHtml, AnnouncementType, Audience, BranchId, ClassRoomId, AuthorUserId, PublishedAt, ExpiresAt,
     CreatedAt, Content, Author, CreatedDate, ExpiryDate, IsUrgent, Branch, Type, TargetAudience)
SELECT an.Id, an.Title, an.Content,
       CASE an.Type WHEN 1 THEN 'Urgent' WHEN 2 THEN 'Event' ELSE 'Normal' END,
       CASE an.TargetAudience
           WHEN 1 THEN 'Leaders'
           WHEN 2 THEN 'Branch'
           WHEN 3 THEN 'Class'
           WHEN 4 THEN 'Guardians'
           ELSE 'Public'
       END,
       NULLIF(an.Branch, 0), NULL,
       (SELECT TOP 1 u.Id FROM dbo.Users u ORDER BY u.CreatedAt) AS AuthorUserId,
       an.CreatedDate, an.ExpiryDate, an.CreatedDate,
       an.Content, an.Author, an.CreatedDate, an.ExpiryDate, an.IsUrgent, an.Branch, an.Type, an.TargetAudience
FROM GiaoLyDB_Vision2.dbo.Announcements an;

PRINT N'>> Bật lại kiểm tra khoá ngoại...';
EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';

COMMIT TRANSACTION;

-- ── Đối chiếu số lượng ─────────────────────────────────────────────────────────────────────
PRINT N'>> Đối chiếu số lượng (Legacy | Migrated):';
SELECT 'Branches'       AS Bang, 4 AS Legacy, (SELECT COUNT(*) FROM dbo.Branches) AS Migrated
UNION ALL SELECT 'Roles',          (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Roles),          (SELECT COUNT(*) FROM dbo.Roles)
UNION ALL SELECT 'Permissions',    (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Permissions),    (SELECT COUNT(*) FROM dbo.Permissions)
UNION ALL SELECT 'RolePermissions',(SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.RolePermissions),(SELECT COUNT(*) FROM dbo.RolePermissions)
UNION ALL SELECT 'Users',          (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Users),          (SELECT COUNT(*) FROM dbo.Users)
UNION ALL SELECT 'Students',       (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Students),       (SELECT COUNT(*) FROM dbo.Students)
UNION ALL SELECT 'Leaders',        (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Leaders),        (SELECT COUNT(*) FROM dbo.Leaders)
UNION ALL SELECT 'NewsSources',    (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.NewsSources),    (SELECT COUNT(*) FROM dbo.NewsSources)
UNION ALL SELECT 'NewsArticles',   (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.NewsArticles),   (SELECT COUNT(*) FROM dbo.NewsArticles)
UNION ALL SELECT 'Announcements',  (SELECT COUNT(*) FROM GiaoLyDB_Vision2.dbo.Announcements),  (SELECT COUNT(*) FROM dbo.Announcements);
