# Migration cũ (tiền V3) — chỉ để tham chiếu

Thư mục này chứa **22 migration Entity Framework Core** của giai đoạn trước khi tái lập baseline
(G2-7, 14/11/2026), cùng các file `.Designer.cs` và `AppDbContextModelSnapshot.cs` tương ứng.

## Vì sao không dùng nữa

`__EFMigrationsHistory` của DB dev `GiaoLyDB_Vision2` có đủ 22 dòng, nhưng schema thật **thiếu**
142 cột (23 bảng) và 19 bảng so với model — tức lịch sử migration đã bị đánh dấu lên một schema cũ
hơn. Vì vậy chuỗi này không thể dùng để tiến hoá DB: `dotnet ef migrations add` sinh ra 146
`DropColumn` (mất `Grades.GPA`, `Grades.ClassRoomId`, `Grades.AttendanceRate`, `Families.LeaderId`…)
và 38 lệnh `CreateTable/DropTable`.

## Hiện trạng

- Baseline hiện hành: `GiaoLy.Domain/Migrations/20261114124734_InitialCreateV3.cs`
  (46 `CreateTable`, 0 `DropColumn`) sinh trực tiếp từ model.
- Dữ liệu thật được chuyển bằng `database/G2-7_copy_from_legacy.sql`.
- DB cũ được giữ nguyên dưới tên `GiaoLyDB_Vision2_Legacy_20261114`.

## Khôi phục tạm chuỗi cũ (chỉ khi cần điều tra)

```bash
mv database/legacy-migrations/*.cs GiaoLy.Domain/Migrations/   # ghi đè snapshot hiện tại!
dotnet ef migrations list --project GiaoLy.Domain
```

Sau khi điều tra xong phải trả lại baseline mới (`InitialCreateV3`); **không** commit trạng thái
khôi phục này.
