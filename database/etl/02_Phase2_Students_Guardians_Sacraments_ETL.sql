-- ====================================================================================================
-- GIAOLY V3 ETL - ĐỢT 2: ĐOÀN SINH, PHỤ HUYNH VÀ BÍ TÍCH
-- Kịch bản chuyển đổi: Tách Guardians, StudentGuardians, StudentSacraments, tính FullNameNormalized
-- ====================================================================================================

SET NOCOUNT ON;
BEGIN TRANSACTION;

PRINT N'>> Bắt đầu Đợt 2: Đoàn sinh, Phụ huynh và Bí tích...';

-- 2.1 Chuẩn hóa FullNameNormalized cho toàn bộ đoàn sinh
PRINT N'2.1 Chuẩn hóa FullNameNormalized...';
-- SQL không bỏ được dấu tiếng Việt nên bước này chỉ là giá trị tạm.
-- Sau khi chạy ETL, gọi endpoint chuẩn hoá của ứng dụng để tính lại bằng đúng hàm của hệ thống:
--   POST /api/v1/system/maintenance/normalize-student-names
UPDATE dbo.Students
SET FullNameNormalized = UPPER(RTRIM(LTRIM(FullName)))
WHERE FullNameNormalized IS NULL OR FullNameNormalized = '';

-- 2.2 Tách thông tin Cha sang Guardians & StudentGuardians
PRINT N'2.2 Tách thông tin Cha sang Guardians...';
-- Thêm Cha vào bảng Guardians (chống trùng SĐT nếu đã có)
INSERT INTO dbo.Guardians (FullName, Phone, Relationship, CreatedAt)
SELECT DISTINCT 
    RTRIM(LTRIM(s.FatherName)) AS FullName,
    NULLIF(RTRIM(LTRIM(s.FatherPhone)), '') AS Phone,
    N'Cha' AS Relationship,
    SYSUTCDATETIME()
FROM dbo.Students s
WHERE NULLIF(RTRIM(LTRIM(s.FatherName)), '') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Guardians g 
      WHERE g.FullName = RTRIM(LTRIM(s.FatherName))
        AND (g.Phone = NULLIF(RTRIM(LTRIM(s.FatherPhone)), '') OR (g.Phone IS NULL AND s.FatherPhone IS NULL))
  );

-- Tạo liên kết StudentGuardians cho Cha
INSERT INTO dbo.StudentGuardians (StudentId, GuardianId, Relationship, IsPrimaryContact, CanPickUp, CreatedAt)
SELECT 
    s.Id AS StudentId,
    g.Id AS GuardianId,
    N'Cha' AS Relationship,
    1 AS IsPrimaryContact,
    1 AS CanPickUp,
    SYSUTCDATETIME()
FROM dbo.Students s
JOIN dbo.Guardians g ON g.FullName = RTRIM(LTRIM(s.FatherName))
WHERE NULLIF(RTRIM(LTRIM(s.FatherName)), '') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM dbo.StudentGuardians sg 
      WHERE sg.StudentId = s.Id AND sg.GuardianId = g.Id
  );

-- 2.3 Tách thông tin Mẹ sang Guardians & StudentGuardians
PRINT N'2.3 Tách thông tin Mẹ sang Guardians...';
-- Thêm Mẹ vào bảng Guardians
INSERT INTO dbo.Guardians (FullName, Phone, Relationship, CreatedAt)
SELECT DISTINCT 
    RTRIM(LTRIM(s.MotherName)) AS FullName,
    NULLIF(RTRIM(LTRIM(s.MotherPhone)), '') AS Phone,
    N'Mẹ' AS Relationship,
    SYSUTCDATETIME()
FROM dbo.Students s
WHERE NULLIF(RTRIM(LTRIM(s.MotherName)), '') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Guardians g 
      WHERE g.FullName = RTRIM(LTRIM(s.MotherName))
        AND (g.Phone = NULLIF(RTRIM(LTRIM(s.MotherPhone)), '') OR (g.Phone IS NULL AND s.MotherPhone IS NULL))
  );

-- Tạo liên kết StudentGuardians cho Mẹ
INSERT INTO dbo.StudentGuardians (StudentId, GuardianId, Relationship, IsPrimaryContact, CanPickUp, CreatedAt)
SELECT 
    s.Id AS StudentId,
    g.Id AS GuardianId,
    N'Mẹ' AS Relationship,
    CASE WHEN s.FatherName IS NULL OR s.FatherName = '' THEN 1 ELSE 0 END AS IsPrimaryContact,
    1 AS CanPickUp,
    SYSUTCDATETIME()
FROM dbo.Students s
JOIN dbo.Guardians g ON g.FullName = RTRIM(LTRIM(s.MotherName))
WHERE NULLIF(RTRIM(LTRIM(s.MotherName)), '') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM dbo.StudentGuardians sg 
      WHERE sg.StudentId = s.Id AND sg.GuardianId = g.Id
  );

-- 2.4 Trích xuất Bí tích cũ sang StudentSacraments
PRINT N'2.4 Chuyển đổi Bí tích sang StudentSacraments...';
-- Nếu có bảng SacramentRecords hoặc các cột bí tích cũ trên Students
IF OBJECT_ID('dbo.SacramentRecords', 'U') IS NOT NULL
BEGIN
    INSERT INTO dbo.StudentSacraments (StudentId, SacramentType, ReceivedOn, Place, Minister, Sponsor, BookNumber, Note, CreatedAt)
    SELECT 
        sr.StudentId,
        CASE 
            WHEN sr.SacramentType LIKE '%Rua%' OR sr.SacramentType LIKE '%Baptism%' THEN 'Baptism'
            WHEN sr.SacramentType LIKE '%Ruoc%' OR sr.SacramentType LIKE '%Communion%' THEN 'FirstCommunion'
            WHEN sr.SacramentType LIKE '%Them%' OR sr.SacramentType LIKE '%Confirmation%' THEN 'Confirmation'
            ELSE sr.SacramentType
        END AS SacramentType,
        TRY_CAST(sr.ReceivedDate AS date),
        sr.Church,
        sr.Priest,
        sr.Godparent,
        sr.RegistryBook,
        sr.Remarks,
        SYSUTCDATETIME()
    FROM dbo.SacramentRecords sr
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.StudentSacraments ss
        WHERE ss.StudentId = sr.StudentId 
          AND ss.SacramentType = sr.SacramentType
    );
END

-- 2.5 Chuẩn hóa trạng thái đoàn sinh
PRINT N'2.5 Chuẩn hóa trạng thái đoàn sinh...';
UPDATE dbo.Students
SET Status = CASE 
    WHEN Status IN (N'Đang học', '1', 'Active') THEN 'Active'
    WHEN Status IN (N'Nghỉ học', '2', 'DropOut') THEN 'DropOut'
    WHEN Status IN (N'Chuyển xứ', '3', 'Transferred') THEN 'Transferred'
    ELSE 'Active'
END
WHERE Status NOT IN ('Active', 'Suspended', 'DropOut', 'Transferred', 'Archived');

PRINT N'>> Đợt 2 hoàn tất thành công!';
COMMIT TRANSACTION;
