namespace GiaoLy.Infrastructure.Services.Imports;

public static class StudentExcelColumns
{
    public const string Code = "Mã đoàn sinh";
    public const string HolyName = "Tên thánh";
    public const string FullName = "Họ và tên";
    public const string BirthDate = "Ngày sinh (dd/MM/yyyy)";
    public const string Gender = "Giới tính (Nam/Nữ)";
    public const string Area = "Giáo họ";
    public const string Address = "Địa chỉ";
    public const string ClassLevelCode = "Mã cấp lớp";
    public const string Section = "Phân lớp";
    public const string GuardianName = "Tên phụ huynh";
    public const string GuardianRelationship = "Quan hệ";
    public const string GuardianPhone = "SĐT phụ huynh";
    public const string BloodType = "Nhóm máu";
    public const string Allergies = "Dị ứng";
    public const string BaptismDate = "Ngày Rửa tội (dd/MM/yyyy)";
    public const string BaptismPlace = "Nơi Rửa tội";
    public const string CommunionDate = "Ngày Rước lễ (dd/MM/yyyy)";
    public const string ConfirmationDate = "Ngày Thêm sức (dd/MM/yyyy)";
    public const string Notes = "Ghi chú";

    public static readonly string[] Headers =
    [
        Code,
        HolyName,
        FullName,
        BirthDate,
        Gender,
        Area,
        Address,
        ClassLevelCode,
        Section,
        GuardianName,
        GuardianRelationship,
        GuardianPhone,
        BloodType,
        Allergies,
        BaptismDate,
        BaptismPlace,
        CommunionDate,
        ConfirmationDate,
        Notes
    ];

    public static string SanitizeForExport(string? text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;

        // Prevent CSV / Excel Formula Injection
        char first = text[0];
        if (first == '=' || first == '+' || first == '-' || first == '@' || first == '\t' || first == '\r')
        {
            return "'" + text;
        }

        return text;
    }
}
