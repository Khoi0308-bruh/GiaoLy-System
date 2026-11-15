-- ====================================================================================================
-- GIAOLY V3 ETL - ĐỢT 3: GHI DANH, ĐIỂM SỐ, LÊN LỚP VÀ CHỨNG CHỈ
-- Kịch bản chuyển đổi: Enrollments, Grades, LegacyStudentScores, PromotionBatches, Certificates
-- ====================================================================================================

SET NOCOUNT ON;
BEGIN TRANSACTION;

PRINT N'>> Bắt đầu Đợt 3: Ghi danh, Điểm số, Lên lớp và Chứng chỉ...';

-- 3.1 Chuyển đổi và tạo Enrollments cho các lớp hiện tại
PRINT N'3.1 Tạo Enrollments từ quan hệ học sinh - lớp học...';
-- Nếu hệ thống cũ có bảng Enrollments hoặc liên kết Student - ClassRoom
IF OBJECT_ID('dbo.Enrollments', 'U') IS NOT NULL
BEGIN
    -- Đảm bảo mọi Enrollment đều có AcademicYearId hợp lệ từ ClassRoom
    UPDATE e
    SET e.AcademicYearId = c.AcademicYearId
    FROM dbo.Enrollments e
    JOIN dbo.ClassRooms c ON c.Id = e.ClassRoomId
    WHERE e.AcademicYearId IS NULL OR e.AcademicYearId = '00000000-0000-0000-0000-000000000000';
END

-- 3.2 Chuyển đổi điểm số sang bảng Grades chuẩn V3
PRINT N'3.2 Chuyển đổi bảng điểm sang Grades...';
-- Kiểm tra bảng StudentScores cũ nếu có
IF OBJECT_ID('dbo.StudentScores', 'U') IS NOT NULL
BEGIN
    INSERT INTO dbo.Grades (
        EnrollmentId,
        Oral,
        SmallTest,
        BigTest,
        FinalExam,
        TotalSessions,
        Absences,
        ComputedGpa,
        ComputedStatus,
        CreatedAt
    )
    SELECT 
        e.Id AS EnrollmentId,
        -- Điểm 0 ở cả 4 cột coi là chưa nhập (NULL) theo Mục 9.3
        CASE WHEN ss.Semester1Score = 0 AND ss.Semester2Score = 0 AND ss.FinalExamScore = 0 AND ss.ConductScore = 0 THEN NULL ELSE ss.Semester1Score END AS Oral,
        NULL AS SmallTest,
        CASE WHEN ss.Semester1Score = 0 AND ss.Semester2Score = 0 AND ss.FinalExamScore = 0 AND ss.ConductScore = 0 THEN NULL ELSE ss.Semester2Score END AS BigTest,
        CASE WHEN ss.Semester1Score = 0 AND ss.Semester2Score = 0 AND ss.FinalExamScore = 0 AND ss.ConductScore = 0 THEN NULL ELSE ss.FinalExamScore END AS FinalExam,
        30 AS TotalSessions,
        0 AS Absences,
        ss.AverageScore AS ComputedGpa,
        CASE WHEN ss.AverageScore >= 5.0 THEN 'Qualified' ELSE 'NotQualified' END AS ComputedStatus,
        SYSUTCDATETIME()
    FROM dbo.StudentScores ss
    JOIN dbo.Enrollments e ON e.StudentId = ss.StudentId
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.Grades g WHERE g.EnrollmentId = e.Id
    );

    -- Lưu vết điểm cũ vào LegacyStudentScores để làm kho lưu trữ chỉ đọc
    IF OBJECT_ID('dbo.LegacyStudentScores', 'U') IS NOT NULL
    BEGIN
        INSERT INTO dbo.LegacyStudentScores (StudentId, AcademicYear, ClassName, ScoreDataJson, ImportedAt)
        SELECT 
            ss.StudentId,
            ISNULL(ss.AcademicYear, 'Legacy'),
            ISNULL(ss.ClassName, 'Legacy'),
            (SELECT ss.Semester1Score AS HK1, ss.Semester2Score AS HK2, ss.FinalExamScore AS Final, ss.AverageScore AS GPA FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            SYSUTCDATETIME()
        FROM dbo.StudentScores ss
        WHERE NOT EXISTS (
            SELECT 1 FROM dbo.LegacyStudentScores l WHERE l.StudentId = ss.StudentId AND l.AcademicYear = ss.AcademicYear
        );
    END
END

-- 3.3 Chuyển đổi DraftActions cũ sang PromotionBatches & PromotionDrafts
PRINT N'3.3 Chuyển đổi bản nháp lên lớp sang PromotionBatches & Drafts...';
IF OBJECT_ID('dbo.DraftActions', 'U') IS NOT NULL
BEGIN
    -- Tạo một Batch đại diện cho dữ liệu cũ nếu có DraftActions
    DECLARE @DefaultBatchId uniqueidentifier = NEWID();
    DECLARE @ActiveYearId uniqueidentifier = (SELECT TOP 1 Id FROM dbo.AcademicYears WHERE Status = 'Active');
    DECLARE @TargetYearId uniqueidentifier = (SELECT TOP 1 Id FROM dbo.AcademicYears WHERE Status = 'Planning');

    IF @ActiveYearId IS NOT NULL AND @TargetYearId IS NOT NULL AND EXISTS (SELECT 1 FROM dbo.DraftActions)
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM dbo.PromotionBatches WHERE SourceYearId = @ActiveYearId)
        BEGIN
            INSERT INTO dbo.PromotionBatches (Id, SourceYearId, TargetYearId, Status, CreatedBy, CreatedAt)
            SELECT @DefaultBatchId, @ActiveYearId, @TargetYearId, 'Draft', TOP 1 Id, SYSUTCDATETIME()
            FROM dbo.Users;

            INSERT INTO dbo.PromotionDrafts (BatchId, StudentId, FromEnrollmentId, Outcome, Status, Reason, CreatedAt)
            SELECT 
                @DefaultBatchId,
                da.StudentId,
                e.Id,
                CASE 
                    WHEN da.ActionType LIKE '%Promote%' OR da.ActionType LIKE '%LenLop%' THEN 'Promote'
                    WHEN da.ActionType LIKE '%Repeat%' OR da.ActionType LIKE '%OLai%' THEN 'Repeat'
                    WHEN da.ActionType LIKE '%Graduate%' THEN 'Graduate'
                    ELSE 'Manual'
                END,
                'Pending',
                da.Remarks,
                SYSUTCDATETIME()
            FROM dbo.DraftActions da
            JOIN dbo.Enrollments e ON e.StudentId = da.StudentId AND e.AcademicYearId = @ActiveYearId
            WHERE NOT EXISTS (
                SELECT 1 FROM dbo.PromotionDrafts pd WHERE pd.BatchId = @DefaultBatchId AND pd.StudentId = da.StudentId
            );
        END
    END
END

-- 3.4 Chuẩn hóa Certificates (Snapshot & VerificationCode)
PRINT N'3.4 Chuẩn hóa Certificates...';
-- Với các chứng chỉ cũ chưa có VerificationCode, tự sinh mã ngẫu nhiên chuẩn 12 ký tự
UPDATE c
SET c.VerificationCode = CONCAT('CERT-', UPPER(SUBSTRING(c.CertificateType, 1, 3)), '-', YEAR(c.IssuedAt), '-', UPPER(SUBSTRING(REPLACE(CAST(c.Id AS nvarchar(36)), '-', ''), 1, 12))),
    c.Snapshot = (
        SELECT 
            s.Code AS StudentCode,
            s.FullName,
            s.HolyName,
            c.CertificateType,
            c.IssuedAt
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
    )
FROM dbo.Certificates c
JOIN dbo.Students s ON s.Id = c.StudentId
WHERE c.VerificationCode IS NULL OR c.VerificationCode = '' OR c.Snapshot IS NULL OR c.Snapshot = '';

PRINT N'>> Đợt 3 hoàn tất thành công!';
COMMIT TRANSACTION;
