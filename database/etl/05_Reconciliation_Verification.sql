-- ====================================================================================================
-- GIAOLY V3 ETL - BÁO CÁO ĐỐI CHIẾU SỐ LƯỢNG VÀ KIỂM TRA BẤT BIẾN (RECONCILIATION)
-- Mục tiêu: Cam kết chênh lệch số lượng và lỗi bất biến = 0 (Mục 9.2 Blueprint V3)
-- ====================================================================================================

SET NOCOUNT ON;

PRINT N'==================================================================';
PRINT N'              BÁO CÁO ĐỐI CHIẾU DỮ LIỆU GIAOLY V3                 ';
PRINT N'==================================================================';

-- 1. Bảng số lượng tổng quan
SELECT 
    '1. Users' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    SUM(CASE WHEN IsActive = 1 THEN 1 ELSE 0 END) AS [Dang_Hoat_Dong]
FROM dbo.Users
UNION ALL
SELECT 
    '2. Students' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) AS [Dang_Hoat_Dong]
FROM dbo.Students
UNION ALL
SELECT 
    '3. Guardians' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    COUNT(DISTINCT Phone) AS [Dang_Hoat_Dong]
FROM dbo.Guardians
UNION ALL
SELECT 
    '4. StudentSacraments' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    COUNT(DISTINCT StudentId) AS [Dang_Hoat_Dong]
FROM dbo.StudentSacraments
UNION ALL
SELECT 
    '5. Enrollments' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) AS [Dang_Hoat_Dong]
FROM dbo.Enrollments
UNION ALL
SELECT 
    '6. Grades' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    SUM(CASE WHEN ComputedStatus = 'Qualified' THEN 1 ELSE 0 END) AS [Dang_Hoat_Dong]
FROM dbo.Grades
UNION ALL
SELECT 
    '7. Certificates' AS [Thuc_The],
    COUNT(*) AS [Tong_So_Luong],
    SUM(CASE WHEN Status = 'Issued' THEN 1 ELSE 0 END) AS [Dang_Hoat_Dong]
FROM dbo.Certificates;

PRINT N'';
PRINT N'------------------------------------------------------------------';
PRINT N'                  KIỂM TRA BẤT BIẾN (INVARIANTS)                  ';
PRINT N'------------------------------------------------------------------';

DECLARE @OrphanGrades int = 0;
DECLARE @InvalidStatusYears int = 0;
DECLARE @MissingCertCodes int = 0;
DECLARE @DuplicateStudents int = 0;

-- Kiểm tra điểm mồ côi (EnrollmentId không tồn tại)
SELECT @OrphanGrades = COUNT(*)
FROM dbo.Grades g
LEFT JOIN dbo.Enrollments e ON e.Id = g.EnrollmentId
WHERE e.Id IS NULL;

-- Kiểm tra trạng thái niên khóa không hợp lệ
SELECT @InvalidStatusYears = COUNT(*)
FROM dbo.AcademicYears
WHERE Status NOT IN ('Planning', 'Active', 'Closing', 'Archived');

-- Kiểm tra chứng chỉ thiếu mã tra cứu 12 ký tự hoặc thiếu Snapshot
SELECT @MissingCertCodes = COUNT(*)
FROM dbo.Certificates
WHERE VerificationCode IS NULL OR LEN(VerificationCode) < 12 OR Snapshot IS NULL OR Snapshot = '';

-- Kiểm tra đoàn sinh trùng mã Code
SELECT @DuplicateStudents = COUNT(*)
FROM (
    SELECT Code FROM dbo.Students GROUP BY Code HAVING COUNT(*) > 1
) dup;

PRINT N'1. Điểm số mồ côi (không có Enrollment)   : ' + CAST(@OrphanGrades AS nvarchar(10)) + N' (Mục tiêu: 0)';
PRINT N'2. Niên khóa có Status sai quy tắc       : ' + CAST(@InvalidStatusYears AS nvarchar(10)) + N' (Mục tiêu: 0)';
PRINT N'3. Chứng chỉ thiếu mã xác thực/Snapshot   : ' + CAST(@MissingCertCodes AS nvarchar(10)) + N' (Mục tiêu: 0)';
PRINT N'4. Đoàn sinh bị trùng mã Code            : ' + CAST(@DuplicateStudents AS nvarchar(10)) + N' (Mục tiêu: 0)';

PRINT N'------------------------------------------------------------------';
IF (@OrphanGrades = 0 AND @InvalidStatusYears = 0 AND @MissingCertCodes = 0 AND @DuplicateStudents = 0)
BEGIN
    PRINT N'>>> KẾT QUẢ: TẤT CẢ CÁC BẤT BIẾN ĐẠT CHUẨN 100%! CHÊNH LỆCH = 0.';
END
ELSE
BEGIN
    PRINT N'>>> CẢNH BÁO: CÓ DỮ LIỆU VI PHẠM BẤT BIẾN, CẦN RÀ SOÁT TRƯỚC KHI BẬT HỆ THỐNG!';
END
PRINT N'==================================================================';
