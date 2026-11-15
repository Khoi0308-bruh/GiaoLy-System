-- ====================================================================================================
-- GIAOLY V3 ETL - KẾ HOẠCH HOÀN NGUYÊN (ROLLBACK PLAN)
-- Sử dụng trong trường hợp khẩn cấp khi chạy đợt chuyển đổi gặp lỗi nghiêm trọng
-- ====================================================================================================

SET NOCOUNT ON;
PRINT N'>> BẮT ĐẦU QUY TRÌNH HOÀN NGUYÊN KHẨN CẤP (EMERGENCY ROLLBACK)...';

-- PHƯƠNG ÁN 1: Nếu có Database Snapshot (Khuyến nghị cao nhất trước khi chạy ETL)
-- RESTORE DATABASE GiaoLyDB_Vision2 FROM DATABASE_SNAPSHOT = 'GiaoLyDB_Snapshot_Before_ETL';

-- PHƯƠNG ÁN 2: Rollback từng phần dữ liệu đã nạp vào các bảng mới V3
BEGIN TRANSACTION;

-- Xóa các bản nháp lên lớp mới tạo từ ETL
DELETE FROM dbo.PromotionDrafts WHERE Reason = N'Legacy Migration' OR Reason LIKE '%Chuyển đổi%';
DELETE FROM dbo.PromotionBatches WHERE Summary LIKE '%Legacy%';

-- Khôi phục cờ trạng thái cũ của Niên khóa nếu cần
UPDATE dbo.AcademicYears
SET Status = 'Active'
WHERE Status = 'Closing' AND EndDate >= CAST(GETDATE() AS date);

PRINT N'>> Đã hoàn tất các bước hoàn nguyên cơ bản.';
COMMIT TRANSACTION;
PRINT N'>> Hệ thống đã sẵn sàng để thử nghiệm lại ETL sau khi sửa lỗi dữ liệu.';
