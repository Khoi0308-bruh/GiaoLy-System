-- ====================================================================================================
-- GIAOLY V3 ETL - ĐỢT 4: HOẠT ĐỘNG, NỘI DUNG VÀ DỌN DẸP THU HẸP
-- Kịch bản chuyển đổi: CampPayments, Documents, Announcements và thu hẹp lược đồ
-- ====================================================================================================

SET NOCOUNT ON;
BEGIN TRANSACTION;

PRINT N'>> Bắt đầu Đợt 4: Hoạt động, Nội dung và Thu hẹp...';

-- 4.1 Chuẩn hóa Announcements theo đối tượng (Audience)
PRINT N'4.1 Chuẩn hóa Announcements...';
UPDATE dbo.Announcements
SET Audience = CASE 
    WHEN Audience IN (N'Tất cả', 'All', '0') THEN 'Public'
    WHEN Audience IN (N'Huynh trưởng', 'LeadersOnly', '1') THEN 'Leaders'
    WHEN Audience IN (N'Phụ huynh', 'Parents', 'Guardians') THEN 'Guardians'
    ELSE 'Public'
END
WHERE Audience IS NULL OR Audience = '' OR Audience NOT IN ('Public', 'Leaders', 'Branch', 'Class', 'Guardians');

UPDATE dbo.Announcements
SET AnnouncementType = CASE
    WHEN AnnouncementType IN (N'Khẩn', 'Urgent', '1') THEN 'Urgent'
    WHEN AnnouncementType IN (N'Sự kiện', 'Event', '2') THEN 'Event'
    ELSE 'Normal'
END
WHERE AnnouncementType IS NULL OR AnnouncementType = '' OR AnnouncementType NOT IN ('Normal', 'Urgent', 'Event');

-- 4.2 Chuẩn hóa Documents (Kho tệp bảo mật)
PRINT N'4.2 Chuẩn hóa Documents...';
UPDATE dbo.Documents
SET AccessLevel = CASE
    WHEN AccessLevel IN ('Public', '1', N'Công khai') THEN 'Public'
    ELSE 'Internal'
END
WHERE AccessLevel IS NULL OR AccessLevel = '' OR AccessLevel NOT IN ('Public', 'Internal');

UPDATE dbo.Documents
SET StoredFileName = CONCAT(CAST(Id AS nvarchar(36)), '.', RIGHT(FileName, CHARINDEX('.', REVERSE(FileName)) - 1))
WHERE StoredFileName IS NULL OR StoredFileName = '';

-- 4.3 Chuẩn hóa CampRegistrations & CampPayments
PRINT N'4.3 Chuẩn hóa CampRegistrations & Sổ cái CampPayments...';
-- Tự động sinh sổ cái thu phí nếu Registration đã thanh toán mà chưa có CampPayment
INSERT INTO dbo.CampPayments (RegistrationId, ReceiptNumber, Amount, PaidAt, PaymentMethod, ReceivedBy, Note, CreatedAt)
SELECT 
    cr.Id AS RegistrationId,
    CONCAT('REC-', FORMAT(SYSUTCDATETIME(), 'yyyyMMdd'), '-', UPPER(SUBSTRING(REPLACE(CAST(cr.Id AS nvarchar(36)), '-', ''), 1, 6))) AS ReceiptNumber,
    ce.Fee AS Amount,
    SYSUTCDATETIME() AS PaidAt,
    N'Tiền mặt' AS PaymentMethod,
    ce.CreatedBy AS ReceivedBy,
    N'Chuyển đổi từ dữ liệu ghi danh sa mạc cũ' AS Note,
    SYSUTCDATETIME() AS CreatedAt
FROM dbo.CampRegistrations cr
JOIN dbo.CampEvents ce ON ce.Id = cr.CampEventId
WHERE cr.IsPaid = 1
  AND NOT EXISTS (
      SELECT 1 FROM dbo.CampPayments cp WHERE cp.RegistrationId = cr.Id
  );

PRINT N'>> Đợt 4 hoàn tất thành công!';
COMMIT TRANSACTION;
