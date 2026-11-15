-- ====================================================================================================
-- GIAOLY V3 ETL - ĐỢT 1: DANH TÍNH VÀ TỔ CHỨC (IDENTITY & ORGANIZATION)
-- Kịch bản chuyển đổi: Branches, ClassLevels, AcademicYears (Status), ClassRoomTeachers, Users, UTC Time
-- ====================================================================================================

SET NOCOUNT ON;
BEGIN TRANSACTION;

PRINT N'>> Bắt đầu Đợt 1: Danh tính và Tổ chức...';

-- 1.1 Đồng bộ bảng Ngành (Branches)
PRINT N'1.1 Đồng bộ Branches...';
MERGE dbo.Branches AS target
USING (VALUES
    (1, N'Ấu Nhi', N'Khối các em từ 6-9 tuổi'),
    (2, N'Thiếu Nhi', N'Khối các em từ 10-12 tuổi'),
    (3, N'Nghĩa Sĩ', N'Khối các em từ 13-15 tuổi'),
    (4, N'Hiệp Sĩ', N'Khối các em từ 16-18 tuổi')
) AS source (Id, Name, Description)
ON target.Id = source.Id
WHEN MATCHED THEN
    UPDATE SET target.Name = source.Name, target.Description = source.Description
WHEN NOT MATCHED THEN
    INSERT (Id, Name, Description, CreatedAt)
    VALUES (source.Id, source.Name, source.Description, SYSUTCDATETIME());

-- 1.2 Đồng bộ Cấp lớp (ClassLevels) và liên kết NextLevelId
PRINT N'1.2 Đồng bộ ClassLevels...';
IF NOT EXISTS (SELECT 1 FROM dbo.ClassLevels WHERE Code = 'AU_1')
BEGIN
    INSERT INTO dbo.ClassLevels (BranchId, Name, Code, LevelOrder, MinAge, MaxAge, CreatedAt)
    VALUES 
        (1, N'Khai Tâm 1', 'AU_1', 1, 6, 7, SYSUTCDATETIME()),
        (1, N'Khai Tâm 2', 'AU_2', 2, 7, 8, SYSUTCDATETIME()),
        (1, N'Rước Lễ 1', 'AU_3', 3, 8, 9, SYSUTCDATETIME()),
        (1, N'Rước Lễ 2', 'AU_4', 4, 9, 10, SYSUTCDATETIME()),
        (2, N'Thêm Sức 1', 'THIEU_1', 5, 10, 11, SYSUTCDATETIME()),
        (2, N'Thêm Sức 2', 'THIEU_2', 6, 11, 12, SYSUTCDATETIME()),
        (2, N'Thêm Sức 3', 'THIEU_3', 7, 12, 13, SYSUTCDATETIME()),
        (3, N'Bao Đồng 1', 'NGHIA_1', 8, 13, 14, SYSUTCDATETIME()),
        (3, N'Bao Đồng 2', 'NGHIA_2', 9, 14, 15, SYSUTCDATETIME()),
        (3, N'Bao Đồng 3', 'NGHIA_3', 10, 15, 16, SYSUTCDATETIME()),
        (4, N'Vào Đời 1', 'HIEP_1', 11, 16, 17, SYSUTCDATETIME()),
        (4, N'Vào Đời 2', 'HIEP_2', 12, 17, 18, SYSUTCDATETIME());

    -- Cập nhật NextLevelId liên tục theo LevelOrder
    UPDATE c
    SET c.NextLevelId = n.Id
    FROM dbo.ClassLevels c
    JOIN dbo.ClassLevels n ON n.LevelOrder = c.LevelOrder + 1;
END

-- 1.3 Chuyển đổi trạng thái Niên khóa (AcademicYears.Status)
PRINT N'1.3 Chuẩn hóa AcademicYears.Status...';
-- Nếu Status rỗng hoặc chưa khớp, chuyển từ 3 cờ cũ:
-- IsActive=1 -> 'Active'
-- IsLocked=1 -> 'Closing'
-- IsArchived=1 -> 'Archived'
-- Chưa bắt đầu -> 'Planning'
UPDATE dbo.AcademicYears
SET Status = CASE
    WHEN IsArchived = 1 THEN 'Archived'
    WHEN IsLocked = 1 THEN 'Closing'
    WHEN IsActive = 1 THEN 'Active'
    ELSE 'Planning'
END
WHERE Status IS NULL OR Status = '' OR Status NOT IN ('Planning', 'Active', 'Closing', 'Archived');

-- 1.4 Chuyển đổi chủ nhiệm đơn lẻ sang ClassRoomTeachers
PRINT N'1.4 Chuyển đổi ClassRoomTeachers...';
-- Nếu trong ClassRooms có LeaderId hoặc TeacherUserId cũ, chuyển vào ClassRoomTeachers với IsLead = 1
IF COL_LENGTH('dbo.ClassRooms', 'LeaderId') IS NOT NULL
BEGIN
    INSERT INTO dbo.ClassRoomTeachers (ClassRoomId, UserId, IsLead, AssignedAt)
    SELECT c.Id, c.LeaderId, 1, SYSUTCDATETIME()
    FROM dbo.ClassRooms c
    WHERE c.LeaderId IS NOT NULL
      AND EXISTS (SELECT 1 FROM dbo.Users u WHERE u.Id = c.LeaderId)
      AND NOT EXISTS (SELECT 1 FROM dbo.ClassRoomTeachers t WHERE t.ClassRoomId = c.Id AND t.UserId = c.LeaderId);
END

-- 1.5 Quy đổi thời điểm sang UTC (Trừ 7 giờ cho các cột datetime cũ)
PRINT N'1.5 Quy đổi thời gian sang chuẩn UTC...';
-- Ghi chú: Chỉ áp dụng khi hệ thống cũ lưu theo giờ VN
UPDATE dbo.Users
SET CreatedAt = DATEADD(HOUR, -7, CreatedAt)
WHERE CreatedAt > SYSUTCDATETIME(); -- Dấu hiệu ngày lưu trong tương lai do UTC+7

PRINT N'>> Đợt 1 hoàn tất thành công!';
COMMIT TRANSACTION;
